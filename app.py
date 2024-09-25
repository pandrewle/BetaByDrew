from flask import Flask, request, jsonify, Response, stream_with_context, send_file
import requests
from flask_cors import CORS
from website import Website, filter_results_by_similarity
import concurrent.futures
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from flask_migrate import Migrate
from datetime import datetime, timedelta, timezone
from io import BytesIO
from dotenv import load_dotenv
import os
import json

from logging_config import setup_logging

load_dotenv()

app = Flask(__name__)
CORS(app)
url = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_DATABASE_URI'] = url
db = SQLAlchemy(app)
migrate = Migrate(app, db)

setup_logging()


class ProductSearch(db.Model):
    __tablename__ = 'product_search'
    id = db.Column(db.Integer, primary_key=True)
    product = db.Column(db.String(255), unique=True, nullable=False)
    result = db.Column(db.Text, nullable=False)  # Store JSON as text
    discount = db.Column(db.Float, nullable=False)
    last_searched = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<ProductSearch {self.product}>'


with app.app_context():
    db.create_all()


def search_website(websiteName, logo, website_url, product, shared_image_list):
    app.logger.info(f"Starting search on {websiteName} for product: {product}")
    site = Website(websiteName, logo, website_url, shared_image_list)
    try:
        site.Search(product)
        app.logger.info(f"Search completed on {websiteName}")
        return {
            "websiteName": site.websiteName,
            "product": site.productName,
            "logo": site.logo,
            "fullPrice": site.fullPrice,
            "discountedPrice": site.discountedPrice,
            "discount": site.discount,
            "productUrl": site.productUrl,
            "productImages": site.productImages,
            "productSizes": site.sizes
        }
    except Exception as e:
        app.logger.error(f"Error in search_website for {websiteName}: {e}", exc_info=True)
        return {
            "websiteName": websiteName,
            "error": str(e)
        }
    finally:
        site.close()
        app.logger.info(f"Closed site for {websiteName}")


def scrape_and_search(product):
    try:
        app.logger.info(f"Starting scrape_and_search for product: {product}")

        # Step 1: Search the database for cached results
        app.logger.info("Searching database for cached results")
        yield json.dumps({"status": "Searching database for cached results"}) + "\n"

        query = text("""SELECT product, similarity(product, :product) AS sim_score, result, discount, last_searched
                        FROM product_search
                        WHERE similarity(product, :product) > 0.9
                        ORDER BY sim_score DESC
                        LIMIT 1;""")

        result = db.engine.execute(query, {'product': product}).fetchone()

        if result:
            app.logger.info(f"Found cached result for product: {result['product']}")
            cached_product = result['product']  # Local variable
            cached_result_json = result['result']
            cached_last_searched = result['last_searched']

            if cached_last_searched.tzinfo is None:
                cached_last_searched = cached_last_searched.replace(tzinfo=timezone.utc)

            # Check if cached result is still valid
            if datetime.now(timezone.utc) - cached_last_searched <= timedelta(days=1):
                app.logger.info("Using cached result")
                results = json.loads(cached_result_json)
                yield json.dumps({"status": "Using cached result", "results": results}) + "\n"
                return
            else:
                app.logger.info("Cached result expired, performing new search")
                yield json.dumps({"status": "Cached result expired, performing new search"}) + "\n"
                update_existing = True
        else:
            app.logger.info("No cached result found, performing new search")
            yield json.dumps({"status": "No cached result, performing new search"}) + "\n"
            update_existing = False

        # Step 2: Perform new scraping if necessary
        shared_image_list = []
        websites = {
            "Backcountry": {
                "websiteName": "Backcountry",
                "logo": "https://content.backcountry.com/images/brand/bcs_logo.png",
                "url": "https://www.backcountry.com/"
            },
            "Rei": {
                "websiteName": "Rei",
                "logo": "https://download.logo.wine/logo/Recreational_Equipment%2C_Inc./Recreational_Equipment%2C_Inc.-Logo.wine.png",
                "url": "https://www.rei.com/"
            },
            "Public Lands": {
                "websiteName": "Public Lands",
                "logo": "https://www.pghnorthchamber.com/wp-content/uploads/2021/07/Public-Lands-By-DSG.png",
                "url": "https://www.publiclands.com/"
            },
            "Outdoor Gear Exchange": {
                "websiteName": "Outdoor Gear Exchange",
                "logo": "https://blisterreview.com/wp-content/uploads/2018/11/OGE-horiz-thumbnail-1.png",
                "url": "https://www.gearx.com/"
            },
            "Steep and Cheap": {
                "websiteName": "Steep and Cheap",
                "logo": "https://static.rakuten.com/img/store/11019/steepandcheap-logo-fullcolor-11019@4x.png",
                "url": "https://www.steepandcheap.com/"
            },
        }

        app.logger.info("Starting web scraping with ThreadPoolExecutor")
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            future_to_site = {
                executor.submit(
                    search_website,
                    site_info["websiteName"],
                    site_info["logo"],
                    site_info["url"],
                    product,
                    shared_image_list
                ): name for name, site_info in websites.items()
            }

            results = []
            for future in concurrent.futures.as_completed(future_to_site):
                site_name = future_to_site[future]
                try:
                    result = future.result(timeout=15)
                    results.append(result)
                    app.logger.info(f"Completed search for {result['websiteName']}")
                    yield json.dumps({"status": f"Completed search for {result['websiteName']}", "result": result}) + "\n"
                except concurrent.futures.TimeoutError:
                    app.logger.warning(f"Search task timed out for {site_name}")
                    yield json.dumps({"status": f"Search task timed out for {site_name}"}) + "\n"
                except Exception as e:
                    app.logger.error(f"Error during search for {site_name}: {e}", exc_info=True)
                    yield json.dumps({"status": f"Error during search for {site_name}: {e}"}) + "\n"

        # Step 3: Finalize results
        app.logger.info("Finalizing results")
        if not results:
            app.logger.warning("No results found after scraping")
            yield json.dumps({"status": "No results found, returning error"}) + "\n"
            return

        results = filter_results_by_similarity(sorted(
            results,
            key=lambda x: float('inf') if float(x.get('discountedPrice', 0)) == 0 else float(x.get('discountedPrice', 0))
        ))

        discounts = [float(item['discount']) for item in results if item.get('discount')]
        if discounts:
            max_discount = max(discounts)
            app.logger.info(f"Max discount found: {max_discount}")
        else:
            max_discount = None
            app.logger.warning("No valid discounts found in results")

        # Convert results to JSON string for storage
        results_json = json.dumps(results)

        if update_existing:
            app.logger.info("Updating existing cached result in the database")
            ProductSearch.query.filter_by(product=cached_product).update({
                "result": results_json,
                "discount": max_discount,
                "last_searched": datetime.now(timezone.utc)
            })
        else:
            app.logger.info("Adding new product search result to the database")
            new_result = ProductSearch(product=product, result=results_json, discount=max_discount,
                                       last_searched=datetime.now(timezone.utc))
            db.session.add(new_result)

        try:
            db.session.commit()
            app.logger.info("Database commit successful")
        except IntegrityError as e:
            db.session.rollback()
            app.logger.error(f"Database commit failed: {e}", exc_info=True)
            yield json.dumps({"status": f"Database commit failed: {e}"}) + "\n"

        # Final step: Send the complete result
        app.logger.info("Search complete, sending results")
        yield json.dumps({"status": "Search complete", "results": results}) + "\n"

    except BrokenPipeError:
        app.logger.warning("Client disconnected. Scraping terminated early.")
    except Exception as e:
        app.logger.error(f"Unexpected error in scrape_and_search: {e}", exc_info=True)
        yield json.dumps({"status": f"Unexpected error: {e}"}) + "\n"


@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    product = data.get('product')

    if not product:
        return jsonify({"error": "No product specified"}), 400

    try:
        # Stream response to detect disconnection early
        return Response(stream_with_context(scrape_and_search(product)))

    except BrokenPipeError:
        print("Client disconnected")
        return jsonify({"error": "Client disconnected"}), 499
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/proxy-image')
def proxy_image():
    image_url = request.args.get('url')
    if not image_url:
        return {"error": "No URL provided"}, 400

    try:
        response = requests.get(image_url)
        response.raise_for_status()

        # Determine the content type based on the response headers
        content_type = response.headers.get('Content-Type', 'image/jpeg')  # Default to 'image/jpeg'
        return send_file(BytesIO(response.content), mimetype=content_type)
    except requests.RequestException:
        # print(f"Error fetching image: {e}")
        return Response(f"Failed to fetch image. Original URL: {image_url}", content_type='text/plain'), 500


@app.route('/explore', methods=['GET'])
def explore():
    try:
        page = request.args.get('section', 1, type=int)
        limit = request.args.get('limit', 9, type=int)
        offset = (page - 1) * limit
        # Query the database for products with the highest discounts
        discounted_products = (ProductSearch.query.order_by(ProductSearch.discount.desc())
                               .offset(offset).limit(limit).all())

        results = []
        for product in discounted_products:
            product_data = json.loads(product.result)
            # Add only the first item from product_data (which is the highest discount item)
            if product_data:
                results.append(product_data[0])  # Add the first item

        return jsonify(results)

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    app.run(debug=False)
