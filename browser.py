import logging
import os
import re
import time
from difflib import get_close_matches
from urllib.parse import urlparse

from selenium import webdriver
from selenium.common.exceptions import (
    NoSuchElementException,
    StaleElementReferenceException,
    TimeoutException,
    ElementNotInteractableException
)
from selenium.webdriver import ActionChains, Proxy
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.proxy import ProxyType
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.ui import WebDriverWait
# from webdriver_manager.chrome import ChromeDriverManager

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)  # Set to DEBUG for more detailed logs

# Create a StreamHandler to output logs to stdout
stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.DEBUG)  # Capture all logs

# Define a logging format
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
stream_handler.setFormatter(formatter)

# Add the handler to the logger
if not logger.hasHandlers():
    logger.addHandler(stream_handler)


class Browser:
    def __init__(self, url):
        logger.info(f"Initializing Browser for URL: {url}")
        self.discount = None
        self.product = ""
        self.prices = []
        try:
            options = webdriver.ChromeOptions()
            options.add_argument('--no-sandbox')
            options.add_argument("--headless")
            options.add_argument('--disable-gpu')
            options.add_argument("--window-size=1920,1080")
            options.add_argument('--ignore-certificate-errors')
            options.add_argument("--start-maximized")
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument("--incognito")
            options.add_argument("--disable-software-rasterizer")
            # options.add_argument("--disable-http2")
            options.page_load_strategy = 'eager'
            options.add_argument("--disable-extensions")
            # options.proxy = Proxy({'proxyType': ProxyType.MANUAL, 'httpProxy': 'http.proxy:1234'})
            options.add_argument("user-agent=some_user_agent")
            options.add_argument("--disable-blink-features=AutomationControlled")
            options.add_experimental_option("excludeSwitches", ["enable-automation"])
            options.add_experimental_option("useAutomationExtension", False)

            # Use environment variables provided by Heroku buildpacks
            chrome_bin_path = os.environ.get("GOOGLE_CHROME_BIN")
            chromedriver_path = os.environ.get("CHROMEDRIVER_PATH")

            options.binary_location = chrome_bin_path
            logger.debug(f"Chrome binary location set to: {chrome_bin_path}")
            logger.debug(f"Chromedriver path set to: {chromedriver_path}")

            service = ChromeService(executable_path=chromedriver_path)
            # logger.debug("Setting up Chrome service with webdriver_manager")

            self.driver = webdriver.Chrome(service=service, options=options)
            logger.debug("Initializing WebDriver with Chrome options")

            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            logger.debug("Executing script to hide webdriver property")

            logger.info(f"Navigating to URL: {url}")
            self.driver.get(url)
            self.wait = WebDriverWait(self.driver, 10)  # Increase explicit wait time
            self.action = ActionChains(self.driver)
            logger.info("Browser initialized successfully")

        except Exception as e:
            logger.error(f"Error initializing Browser: {e}", exc_info=True)
            raise  # Re-raise the exception after logging

    def Search(self, product):
        self.product = product
        max_retries = 3
        for attempt in range(max_retries):
            try:
                self.driver.delete_all_cookies()
                time.sleep(3)
                logger.info("In Search function currently, " + self.driver.current_url)
                body_test = self.wait.until(
                    ec.presence_of_element_located((By.XPATH, '/html/body'))
                )
                logger.info("Body HTML: " + body_test.text)
                search_textbox = self.wait.until(
                    ec.presence_of_element_located((By.XPATH, '//input[contains(@placeholder, "Search")]'))
                )
                # Wait until the element is interactable (visible and enabled)
                self.wait.until(
                    ec.element_to_be_clickable((By.XPATH, '//input[contains(@placeholder, "Search")]'))
                )
                # Now, move to the element and click
                self.action.move_to_element(search_textbox).click().perform()
                # Wait until the textbox is ready to accept input
                self.wait.until(
                    ec.element_to_be_clickable((By.XPATH, '//input[contains(@placeholder, "Search")]'))
                )
                # Send the product name to the search box
                search_textbox.send_keys(self.product + ' climbing')
                # Find and click the search button (or press Enter)
                search_button = self.wait.until(
                    ec.element_to_be_clickable((By.XPATH, '//input[contains(@placeholder, "Search")]'))
                )
                search_button.send_keys(Keys.RETURN)
                break  # Exit loop if successful

            except StaleElementReferenceException:
                if attempt < max_retries - 1:
                    time.sleep(1)  # Wait before retrying
                else:
                    print("Failed after several attempts due to stale element.")
                    raise
            except ElementNotInteractableException:
                if attempt < max_retries - 1:
                    time.sleep(1)  # Wait before retrying
                else:
                    print("Failed after several attempts due to stale element.")
                    raise
            except Exception as e:
                print(f"An error occurred in searching: {e}")
                raise

    @staticmethod
    def is_product_page(url):
        # Parse the URL to extract the path component
        path = urlparse(url).path
        # Define the pattern for product page URLs
        product_keywords = ["product", "item", "sku", "/p/"]
        return any(keyword in path for keyword in product_keywords)

    @staticmethod
    def filter_gender_matches(product, name_map, items):
        # Determine if the original search term specifies gender
        gender_terms_pattern = r"\b(men|mens|women|womens|kids|kid|lv)\b"
        search_term_contains_gender = re.search(gender_terms_pattern, product.lower())

        if search_term_contains_gender:
            specified_gender = search_term_contains_gender.group(0)
            for item in items:
                if specified_gender in item:
                    # print(f"Matched Gendered Product: {item}")  # Diagnostic line
                    return name_map[item]
        else:
            # Check if the link text matches gender or has no gender specified
            for item in items:
                if re.search(r"\b(men|mens|men's)\b", name_map[item].lower()):
                    # print(f"Matched Men's Product: {item}")  # Diagnostic line
                    return name_map[item]
                if not re.search(r"\b(women|womens|women's|w|lv)\b", name_map[item].lower()):
                    # print(f"Matched No Gender Product: {item}")  # Diagnostic line
                    return name_map[item]

        return name_map[items[0]]

    @staticmethod
    def clean_product_string(product):
        # Replace multiple spaces with a single space
        product = re.sub(r'\s+', ' ', product)
        # Replace single spaces with hyphens
        product = product.replace(' ', '-')
        # Replace multiple hyphens with a single hyphen
        product = re.sub(r'-+', '-', product)
        # Optionally, remove special characters
        product = re.sub(r'[\'"]+', '', product)  # Removes apostrophes and quotes

        return product.lower()

    def xPathProductName(self):
        div_xpath_candidates = [
            '//*[contains(@data-id, "productGrid") or contains(@class, "products-grid")]',
            '//*[contains(@id, "search-results") or contains(@class, "search results")]',
            '//*[contains(@aria-label, "Products")]',
            '//*[contains(@data-ui, "product-title") or contains(@id, "product-page-title")]'
        ]

        for div_xpath in div_xpath_candidates:
            try:
                WebDriverWait(self.driver, 1).until(
                    ec.presence_of_all_elements_located((By.XPATH, div_xpath))
                )
                div_elements = self.driver.find_elements(By.XPATH, div_xpath)
                if div_elements:
                    return div_elements
            except TimeoutException:
                continue
            except Exception as e:
                print(f"An error occurred in xPathProductName: {e}")
                raise
        return []  # Return an empty list if no elements are found

    def goToProductPage(self):
        div_elements = self.xPathProductName()
        max_retries = 3  # Number of times to retry in case of failure

        for attempt in range(max_retries):
            try:
                cleaned_product = self.clean_product_string(self.product)
                if self.is_product_page(self.driver.current_url):
                    return

                for div_element in div_elements:
                    # Wait until all links are present
                    WebDriverWait(div_element, 5).until(
                        ec.presence_of_all_elements_located((By.XPATH, '//a[@href]'))
                    )

                    all_links = div_element.find_elements(By.XPATH, '//a[@href]')
                    if not all_links:
                        continue  # Try the next div_element if no links are found

                    hrefs = [link.get_attribute('href') for link in all_links]

                    # Find the best match for the product
                    best_matches = get_close_matches(cleaned_product, hrefs, n=5, cutoff=0.4)

                    if best_matches:
                        text_mapping = {href: href for href in best_matches}
                        best_match_link = self.filter_gender_matches(cleaned_product, text_mapping, best_matches)
                        self.driver.get(best_match_link)
                        break  # Exit loop if successful

                else:
                    raise NoMatchFoundException("No product page found for the user input.")

                break  # Exit loop if successful

            except NoMatchFoundException:
                raise

            except StaleElementReferenceException as e:
                print(f"Stale element reference encountered: {e}")
                if attempt < max_retries - 1:
                    time.sleep(1)  # Wait before retrying
                else:
                    raise  # Raise exception if max retries reached

            except Exception as e:
                print(f"Error in going to product page: {e}")
                raise  # Raise the exception for any other errors

    def getProductUrl(self):
        return self.driver.current_url

    def getPrice(self):
        # XPath to find the parent container of the prices
        div_xpath_candidates = [
            '//*[contains(@id, "price") or contains(@data-id, "price") or contains(@class, "product-price") or '
            'contains(@class, "price-box") or contains(@id,"buy")]'
        ]

        for div_xpath in div_xpath_candidates:
            try:
                parent_div_element = self.driver.find_element(By.XPATH, div_xpath)

                price_text = parent_div_element.text
                # Extract all potential price values
                price_matches = re.findall(r'\$([0-9,]+\.[0-9]*)', price_text)

                for price in price_matches:
                    # Convert the price to float and add to the prices list
                    self.prices.append(float(price.replace(',', '')))

            except NoSuchElementException:
                continue
            except Exception as e:
                print(f"An error occurred in getPrice: {e}")
                continue

        # Return the lowest price found, or 0.00 if no prices were found
        return self.prices

    def getDiscountedPrice(self):
        if self.prices:
            return format(min(self.prices), '.2f')
        else:
            return format(0.00, '.2f')

    def getFullPrice(self):
        if self.prices:
            return format(max(self.prices), '.2f')
        else:
            return format(0.00, '.2f')

    def calculate_discount(self):
        try:
            discount = "0"
            full_price = float(self.getFullPrice())
            discounted_price = float(self.getDiscountedPrice())
            if full_price > 0:
                discount = round((discounted_price / full_price) * 100)
                discount = f"{100 - discount}"
            else:
                print("Full price is zero, cannot calculate discount.")
                self.discount = "0"
            return discount
        except ValueError as e:
            print(f"Error converting price to float: {e}")
        except ZeroDivisionError:
            print("Cannot divide by zero. Full price is zero.")

    def getProductSizes(self):
        div_xpath_candidates = [
            '//*[contains(@data-id, "sizeTile") or contains(@class, "selector-attributes-container") or contains('
            '@class, "size-selector") or contains(@aria-label, "Shoe Size")]',
        ]
        sizes = set()  # Use a set to automatically handle duplicates

        for div_xpath in div_xpath_candidates:
            try:
                # Wait until the elements matching the XPath are present
                WebDriverWait(self.driver, 2).until(
                    ec.presence_of_all_elements_located((By.XPATH, div_xpath))
                )
                div_elements = self.driver.find_elements(By.XPATH, div_xpath)
                for div_element in div_elements:
                    text = div_element.text.strip()
                    if text:
                        # Use regex to find numbers including decimals
                        size_matches = re.findall(r'\b\d+(?:\.\d+)?\b', text)
                        sizes.update(size_matches)  # Add matches to the set
            except TimeoutException:
                continue
            except Exception as e:
                print(f"An error occurred in getProductSizes: {e}")

        # Convert the set to a list and sort it
        sorted_sizes = sorted(map(float, sizes))  # Convert to float for proper numeric sorting
        return sorted_sizes

    def getOfficialName(self):
        text_mapping = {}
        div_elements = self.xPathProductName()
        for div_element in div_elements:
            try:
                text = div_element.text.strip()
                if text:
                    lines = text.split("\n")
                    filtered_lines = [
                        line.strip() for line in lines
                        if len(line.strip()) > 0 and not any(char.isdigit() for char in line) and len(line.split()) > 1
                        # Ensure line has more than one word
                    ]

                    for line in filtered_lines:
                        lowercase_text = line.lower().replace("'", "")
                        if lowercase_text not in text_mapping:
                            text_mapping[lowercase_text] = line
            except Exception as e:
                print(f"An error occurred in getOfficialName: {e}")
                raise

        if not text_mapping:
            return self.product

        self.product.replace("'", "").replace("-", "").replace("  ", " ")
        search_terms = self.product.lower().split()

        # Filter text_mapping keys to include at least one search term
        filtered_keys = [key for key in text_mapping.keys() if any(term in key for term in search_terms)]
        # print(filtered_keys)

        if not filtered_keys:
            return self.product

        # Count the number of matching search terms for each key
        key_match_counts = {key: sum(term in key for term in search_terms) for key in filtered_keys}
        # print(key_match_counts)

        # Sort keys by the number of matching search terms (descending order)
        sorted_keys = sorted(key_match_counts, key=key_match_counts.get, reverse=True)

        self.product = self.filter_gender_matches(self.product, text_mapping, sorted_keys)

        return self.product

    def getProductImages(self, shared_image_list, max_images=5):
        if len(shared_image_list) >= max_images or "gearx.com" in self.driver.current_url:
            if len(shared_image_list) > max_images:
                shared_image_list = shared_image_list[:max_images]
            return shared_image_list

        div_xpath_candidates: list[str] = [
            '//*[contains(@data-id, "detailImage")]//img',
            '//*[@id="apparel-media-image-container"]//img',
            f'//*[contains(@alt, "Product Image") or contains(@class, "product-viewer") '
            f'or contains(@alt, "{self.product}")]',
            '//img[contains(@class, "product-image")]',
            '//img[contains(@class, "gallery-image")]',
            '//img[contains(@*, "media")]'
        ]

        for div_xpath in div_xpath_candidates:
            try:
                WebDriverWait(self.driver, 1).until(
                    ec.presence_of_all_elements_located((By.XPATH, div_xpath))
                )
                src_elements = self.driver.find_elements(By.XPATH, div_xpath)
                for src_element in src_elements:
                    src = src_element.get_attribute("src")
                    if src and src not in shared_image_list:
                        width = src_element.get_attribute("width")
                        height = src_element.get_attribute("height")
                        if width and height:
                            width = int(width)
                            height = int(height)
                            # Filter out images that are too small to be product images
                            if width > 100 and height > 100:
                                shared_image_list.append(src)
                        else:
                            # If width and height are not available, add a fallback check
                            if "product" in src or "large" in src:
                                shared_image_list.append(src)
                    # Stop if we have collected enough images
                    if len(shared_image_list) >= max_images:
                        break
                # If we have found enough images, no need to check further XPATHs
                if len(shared_image_list) >= max_images:
                    break
                break
            except TimeoutException:
                continue
            except Exception as e:
                print(f"Error occurred in getProductImages: {e}")

        # If no images found, use a placeholder
        if not shared_image_list:
            shared_image_list.append('https://static.audison.com/media/2022/10/no-product-image.png')

        return shared_image_list


class NoMatchFoundException(Exception):
    pass
