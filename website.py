from browser import Browser
from browser import NoMatchFoundException
from difflib import SequenceMatcher
import numpy as np

class Website:

    def __init__(self, websiteName, logo, website, shared_image_list):
        self.websiteName = websiteName
        self.productName = ""
        self.logo = logo
        self.fullPrice = 0
        self.discountedPrice = 0
        self.discount = ""
        self.productUrl = ""
        self.sizes = []
        self.productImages = shared_image_list
        self.web = Browser(website)

    def Search(self, product):
        try:
            self.web.Search(product)
            self.productName = self.web.getOfficialName()
            self.web.goToProductPage()
            self.web.getPrice()
            self.fullPrice = self.web.getFullPrice()
            self.discountedPrice = self.web.getDiscountedPrice()
            self.discount = self.web.calculate_discount()
            self.productUrl = self.web.getProductUrl()
            self.sizes = self.web.getProductSizes()
            self.productImages = self.web.getProductImages(self.productImages)
        except NoMatchFoundException:
            print(f"No match found for product '{product}' on {self.websiteName}. Stopping search.")
        except Exception as e:
            print(f"Error occurred while searching on {self.websiteName}: {e}")

    def close(self):
        self.web.driver.quit()

def filter_results_by_similarity(results, threshold=0.7, deviation_threshold=1.25):
    def preprocess_text(text):
        keywords_to_remove = ["Climbing Shoes", "Climbing Shoe", "-"]
        # Remove keywords and phrases from the text
        for keyword in keywords_to_remove:
            text = text.replace(keyword, "")
        # Remove extra spaces after keyword removal
        text = " ".join(text.split())
        return text

    def get_similarity(a, b):
        return SequenceMatcher(None, a.lower(), b.lower()).ratio()

    def average_word_similarity(product_name, other_product_name):
        # Split both product names into words
        words_in_product = product_name.split()
        words_in_other_product = other_product_name.split()

        # Compare each word in the first product against all words in the second product
        similarities = []
        for word in words_in_product:
            # Find the max similarity of the word with any word in the other product
            word_similarities = [get_similarity(word, other_word) for other_word in words_in_other_product]
            max_similarity = max(word_similarities) if word_similarities else 0
            similarities.append(max_similarity)

        # Return the average similarity of the words
        return np.mean(similarities) if similarities else 0

    def average_similarity_for_product(product_name, other_products):
        similarities = [average_word_similarity(product_name, other_name['preprocessed_product']) for other_name in
                        other_products]
        return np.mean(similarities) if similarities else 0
    # Preprocess product names by removing keywords
    preprocessed_results = []
    for result in results:
        product_name = preprocess_text(result['product'])
        preprocessed_results.append({
            **result,
            'preprocessed_product': product_name
        })

    # Compute similarity ratios
    average_similarities = []
    for result in preprocessed_results:
        product_name = result['preprocessed_product']
        avg_similarity = average_similarity_for_product(product_name, preprocessed_results)
        average_similarities.append(avg_similarity)
        # print(f"Product Name: {result['product']}")
        # print(f"Preprocessed Name: {product_name}")
        # print(f"Average Similarity Ratio: {avg_similarity:.2f}\n")

    # Calculate mean and standard deviation of average similarities
    avg_similarity_mean = np.mean(average_similarities)
    # print(avg_similarity_mean)
    avg_similarity_std = np.std(average_similarities)
    # print(avg_similarity_std)
    # print(avg_similarity_mean - deviation_threshold * avg_similarity_std)

    filtered_results = []
    for result, avg_similarity in zip(preprocessed_results, average_similarities):
        if avg_similarity >= avg_similarity_mean - deviation_threshold * avg_similarity_std:
            filtered_results.append({
                "websiteName": result["websiteName"],
                "product": result["product"],
                "logo": result["logo"],
                "fullPrice": result["fullPrice"],
                "discountedPrice": result["discountedPrice"],
                "discount": result["discount"],
                "productUrl": result["productUrl"],
                "productImages": result["productImages"],
                "productSizes": result["productSizes"],
                "similarityRatio": avg_similarity
            })

    return filtered_results

# shared_image_list = []
#
# websites = {
#      "Backcountry": Website("Backcountry", "","https://www.backcountry.com/", shared_image_list),
#      "Rei": Website("Rei", "", "https://www.rei.com/", shared_image_list),
#      "Moosejaw": Website("Moosejaw", "","https://www.moosejaw.com/", shared_image_list),
#     "Outdoor Gear Exchange": Website("Outdoor Gear Exchange", "", "https://www.gearx.com/", shared_image_list),
#     "Steep and Cheap": Website("Steep and Cheap", "","https://www.steepandcheap.com/", shared_image_list)
# }
#
# product_to_search = "instinct vs womens"
# def search_and_filter_results(product_to_search):
#     all_results = []
#     for website_name, website in websites.items():
#         website.Search(product_to_search)
#         # Collect results from each website
#         results = [{
#             "websiteName": website.websiteName,
#             "product": website.productName,
#             "logo": website.logo,
#             "fullPrice": website.fullPrice,
#             "discountedPrice": website.discountedPrice,
#             "discount": website.discount,
#             "productUrl": website.productUrl,
#             "productImages": website.productImages,
#             "productSizes": website.sizes
#         }]
#         all_results.extend(results)
#
#     filtered_results = filter_results_by_similarity(all_results)
#
#     print("Filtered Results based on similarity threshold:")
#     for result in filtered_results:
#         print(result)
#
# # Example call
# search_and_filter_results(product_to_search)
#
# for website_name, website in websites.items():
#     print(f"Searching for '{product_to_search}' on {website_name}...")
#     website.Search(product_to_search)
#     # Optionally print or handle the results
#     print(f"Results from {website_name}:")
#     print(f"Product Name: {website.productName}")
#     print(f"Full Price: ${website.fullPrice}")
#     print(f"Discounted Price: ${website.discountedPrice}")
#     print(f"Discount: {website.discount}")
#     print(f"Product URL: {website.productUrl}")
#     print(f"Product Images: {website.productImages}")
#     print(f"Product Sizes: {website.sizes}")
#     print()
#
# # Close browser sessions
# for website_name, website in websites.items():
#     website.close()

# print(SequenceMatcher(None,"Miura VS Climbing Shoe - Women's","Instinct VS Climbing Shoe - Women's").ratio())