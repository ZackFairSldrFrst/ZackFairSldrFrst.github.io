import requests
from bs4 import BeautifulSoup
import re
import csv
import time
from random import randint, choice
import os
import json

class BusinessScraper:
    def __init__(self, use_proxy=False):
        # Rotate between common user agents
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        ]
        
        self.headers = {
            'User-Agent': choice(self.user_agents),
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'DNT': '1'
        }
        
        self.use_proxy = use_proxy
        self.proxies = None
        if use_proxy:
            # You would need to add your own proxy service here
            self.proxies = {
                'http': 'http://your-proxy-url:port',
                'https': 'http://your-proxy-url:port'
            }
        
        self.results = []
        self.max_results = 100  # Increased from default 10
        
    def search_businesses_by_category(self, location, category, num_pages=3, source="local"):
        """
        Search for businesses in a specific location and category
        
        Args:
            location: Location to search in
            category: Business category
            num_pages: Number of pages to scrape
            source: Source to use ("yelp", "local", "yellowpages", "instagram")
        """
        print(f"Searching for {category} businesses in {location} using {source} source")
        
        if source.lower() == "yelp":
            self._search_yelp(location, category, num_pages)
        elif source.lower() == "yellowpages":
            self._search_yellowpages(location, category, num_pages)
        elif source.lower() == "instagram":
            self._search_instagram(location, category, num_pages)
        else:
            # Default to searching local business directories
            self._search_local_businesses(location, category, num_pages)
            
        # Trim results to max limit
        if len(self.results) > self.max_results:
            self.results = self.results[:self.max_results]
            print(f"Results limited to {self.max_results} businesses")
    
    def _search_instagram(self, location, category, num_pages=3):
        """Search Instagram for business hashtags"""
        print(f"Searching Instagram for {category} in {location}")
        
        # Format hashtags from category and location
        category_tag = category.lower().replace(' ', '')
        location_tag = location.lower().replace(' ', '').replace(',', '')
        combined_tag = f"{category_tag}{location_tag}"
        
        # List of hashtags to search
        hashtags = [
            f"{category_tag}",
            f"{location_tag}business",
            f"{category_tag}{location_tag}",
            f"smallbusiness{location_tag}",
            f"{category_tag}business"
        ]
        
        businesses_found = 0
        
        for hashtag in hashtags[:num_pages]:  # Limit to requested number of "pages" (hashtags)
            if businesses_found >= self.max_results:
                break
                
            # Instagram hashtag URL
            url = f"https://www.instagram.com/explore/tags/{hashtag}/"
            print(f"Searching Instagram hashtag: #{hashtag}")
            
            # Set a random User-Agent for each request
            self.headers['User-Agent'] = choice(self.user_agents)
            
            try:
                # Add a delay before request
                delay = randint(5, 10)
                print(f"Waiting {delay} seconds before request...")
                time.sleep(delay)
                
                # Make the request
                response = requests.get(
                    url, 
                    headers=self.headers, 
                    proxies=self.proxies if self.use_proxy else None,
                    timeout=30
                )
                
                if response.status_code == 200:
                    # Generate some sample Instagram business data
                    # Note: Actual Instagram scraping is very complex due to their protection measures
                    # This is a simplified demo that generates plausible data
                    self._generate_instagram_sample_data(location, category, hashtag)
                    businesses_found += 5  # Added 5 sample businesses per hashtag
                    
                    # Sleep to avoid rate limiting
                    time.sleep(randint(3, 8))
                else:
                    print(f"Failed to fetch Instagram hashtag {hashtag}: {response.status_code}")
            except Exception as e:
                print(f"Error searching Instagram hashtag {hashtag}: {str(e)}")
    
    def _generate_instagram_sample_data(self, location, category, hashtag):
        """Generate sample Instagram business data"""
        business_types = ["Local", "Small", "Family Owned", "Artisan", "Boutique"]
        
        for i in range(1, 6):  # Generate 5 businesses per hashtag
            business_type = choice(business_types)
            business_name = f"{business_type} {category.title()} {i} (Instagram)"
            instagram_handle = f"@{category.lower().replace(' ', '')}{location.lower().replace(' ', '').replace(',', '')}{i}"
            
            business_data = {
                'name': business_name,
                'phone': f"(555) 123-{4000+i}",
                'address': f"{200+i} {hashtag.title()} Ave, {location}",
                'email': f"contact@{instagram_handle[1:]}.com",
                'categories': category,
                'source_url': f"https://www.instagram.com/{instagram_handle[1:]}/",
                'instagram': instagram_handle
            }
            
            self.results.append(business_data)
            print(f"Added Instagram business: {business_name} ({instagram_handle})")
    
    def _search_yelp(self, location, category, num_pages=3):
        """Search Yelp for businesses"""
        for page in range(1, num_pages + 1):
            if len(self.results) >= self.max_results:
                break
                
            # Yelp search URL format
            url = f"https://www.yelp.com/search?find_desc={category}&find_loc={location}&start={10 * (page - 1)}"
            print(f"Scraping Yelp page {page}: {url}")
            
            # Set a random User-Agent for each request
            self.headers['User-Agent'] = choice(self.user_agents)
            
            try:
                # Add a longer delay before request
                delay = randint(5, 15)
                print(f"Waiting {delay} seconds before request...")
                time.sleep(delay)
                
                # Make the request
                response = requests.get(
                    url, 
                    headers=self.headers, 
                    proxies=self.proxies if self.use_proxy else None,
                    timeout=30
                )
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    self._parse_yelp_listings(soup)
                    # Sleep to avoid rate limiting
                    time.sleep(randint(8, 15))
                else:
                    print(f"Failed to fetch Yelp page {page}: {response.status_code}")
            except Exception as e:
                print(f"Error scraping Yelp page {page}: {str(e)}")
    
    def _search_yellowpages(self, location, category, num_pages=3):
        """Search YellowPages for businesses in both US and Canada"""
        # List of YellowPages domains to search
        domains = ['yellowpages.com', 'yellowpages.ca']
        
        for domain in domains:
            for page in range(1, num_pages + 1):
                if len(self.results) >= self.max_results:
                    break
                    
                # YellowPages search URL format
                url = f"https://www.{domain}/search?search_terms={category}&geo_location_terms={location}&page={page}"
                print(f"Scraping YellowPages {domain} page {page}: {url}")
                
                # Set a random User-Agent for each request
                self.headers['User-Agent'] = choice(self.user_agents)
                
                try:
                    # Add a longer delay before request
                    delay = randint(5, 10)
                    print(f"Waiting {delay} seconds before request...")
                    time.sleep(delay)
                    
                    # Make the request
                    response = requests.get(
                        url, 
                        headers=self.headers, 
                        proxies=self.proxies if self.use_proxy else None,
                        timeout=30
                    )
                    
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.text, 'html.parser')
                        self._parse_yellowpages_listings(soup, domain)
                        # Sleep to avoid rate limiting
                        time.sleep(randint(5, 10))
                    else:
                        print(f"Failed to fetch YellowPages {domain} page {page}: {response.status_code}")
                except Exception as e:
                    print(f"Error scraping YellowPages {domain} page {page}: {str(e)}")
    
    def _search_local_businesses(self, location, category, num_pages=3):
        """
        Search local business directories that are more friendly to scraping
        This is a fallback method
        """
        print(f"Using local business search for {category} in {location}")
        try:
            # Example: Generate some mock business data for testing
            # In a real application, you would implement actual scraping of local directories
            for i in range(1, min(self.max_results + 1, 21)):  # Generate up to 20 sample results
                business_data = {
                    'name': f"{category.title()} Business {i} in {location}",
                    'phone': f"(555) 555-{1000+i}",
                    'address': f"{100+i} Main St, {location}",
                    'email': f"contact{i}@example-{category.lower()}.com",
                    'categories': category,
                    'source_url': "local_directory"
                }
                
                self.results.append(business_data)
                print(f"Added sample business: {business_data['name']}")
                
            print(f"Found {len(self.results)} sample businesses without websites")
            
        except Exception as e:
            print(f"Error in local business search: {str(e)}")
    
    def _parse_yelp_listings(self, soup):
        """
        Parse business listings from a Yelp search results page
        """
        try:
            # Look for business cards
            business_cards = soup.select('div.businessName__09f24__EYSZE')
            
            if not business_cards:
                business_cards = soup.select('div[class*="businessName"]')
                
            if not business_cards:
                # Alternative selector for different page structure
                business_cards = soup.select('h3[class*="businessName"]')
                
            print(f"Found {len(business_cards)} business cards")
            
            for card in business_cards:
                if len(self.results) >= self.max_results:
                    break
                    
                try:
                    # Try to find the business name and link
                    link_elem = card.find('a')
                    if link_elem:
                        business_name = link_elem.text.strip()
                        business_url = link_elem.get('href')
                        
                        if business_name and business_url and '/biz/' in business_url:
                            # Ensure URL is absolute
                            if not business_url.startswith('http'):
                                business_url = f"https://www.yelp.com{business_url}"
                                
                            print(f"Found business: {business_name} - {business_url}")
                            # Get detailed business information
                            self._get_yelp_business_details(business_url, business_name)
                except Exception as e:
                    print(f"Error parsing business card: {str(e)}")
        except Exception as e:
            print(f"Error parsing business listings: {str(e)}")
    
    def _parse_yellowpages_listings(self, soup, domain):
        """Parse business listings from YellowPages search results"""
        try:
            # YellowPages business listings
            business_listings = soup.select('.search-results .result')
            print(f"Found {len(business_listings)} YellowPages business listings in {domain}")
            
            for listing in business_listings:
                if len(self.results) >= self.max_results:
                    break
                    
                try:
                    # Get business name
                    name_elem = listing.select_one('.business-name')
                    if not name_elem:
                        continue
                    
                    business_name = name_elem.text.strip()
                    
                    # Check if the business has a website
                    website_link = listing.select_one('a.track-visit-website')
                    has_website = website_link is not None
                    
                    if not has_website:
                        # Get business details directly from the listing
                        phone_elem = listing.select_one('.phones.phone.primary')
                        address_elem = listing.select_one('.street-address')
                        
                        phone = phone_elem.text.strip() if phone_elem else "N/A"
                        address = address_elem.text.strip() if address_elem else "N/A"
                        
                        # Get categories
                        categories_elem = listing.select('.categories a')
                        categories = ", ".join([cat.text.strip() for cat in categories_elem]) if categories_elem else "N/A"
                        
                        business_data = {
                            'name': business_name,
                            'phone': phone,
                            'address': address,
                            'email': "N/A",  # YellowPages doesn't typically list emails
                            'categories': categories,
                            'source_url': f"{domain}"
                        }
                        
                        self.results.append(business_data)
                        print(f"Added YellowPages business without website: {business_name}")
                except Exception as e:
                    print(f"Error parsing YellowPages listing: {str(e)}")
        except Exception as e:
            print(f"Error parsing YellowPages listings: {str(e)}")
    
    def _get_yelp_business_details(self, business_url, business_name):
        """
        Get detailed information about a business from the Yelp business page
        """
        if len(self.results) >= self.max_results:
            return
            
        try:
            # Set a random User-Agent for each request
            self.headers['User-Agent'] = choice(self.user_agents)
            
            print(f"Getting details for: {business_name}")
            
            # Add a delay before request
            delay = randint(5, 12)
            print(f"Waiting {delay} seconds before request...")
            time.sleep(delay)
            
            response = requests.get(
                business_url, 
                headers=self.headers, 
                proxies=self.proxies if self.use_proxy else None,
                timeout=30
            )
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Check if business has a website link
                website_link = None
                # Try different possible selectors
                website_elements = soup.select('a[href*="biz_redir"][href*="website"]')
                if website_elements:
                    website_link = website_elements[0].get('href')
                
                # If no website found, collect contact information
                if not website_link:
                    print(f"Business has no website: {business_name}")
                    
                    # Extract phone number
                    phone = self._extract_phone(soup)
                    
                    # Extract address
                    address = self._extract_address(soup)
                    
                    # Extract email - may not be directly available on Yelp
                    email = self._extract_email(soup)
                    
                    # Extract categories/services offered
                    categories = self._extract_categories(soup)
                    
                    business_data = {
                        'name': business_name,
                        'phone': phone,
                        'address': address,
                        'email': email,
                        'categories': categories,
                        'source_url': business_url
                    }
                    
                    self.results.append(business_data)
                    print(f"Added to results: {business_name}")
                else:
                    print(f"Business has a website: {business_name}")
                
                # Sleep to avoid rate limiting
                time.sleep(randint(3, 8))
            else:
                print(f"Failed to fetch business details (status code: {response.status_code}): {business_url}")
        except Exception as e:
            print(f"Error getting business details for {business_name}: {str(e)}")
    
    def _extract_phone(self, soup):
        """Extract phone number from Yelp business page"""
        try:
            # Look for phone in various possible Yelp elements
            phone_elements = soup.select('p[class*="phone"]')
            if phone_elements:
                return phone_elements[0].text.strip()
                
            # Alternative methods
            phone_pattern = re.compile(r'\(\d{3}\)\s\d{3}-\d{4}')
            text = soup.get_text()
            phone_match = phone_pattern.search(text)
            if phone_match:
                return phone_match.group(0)
        except Exception as e:
            print(f"Error extracting phone: {str(e)}")
        return "N/A"
    
    def _extract_address(self, soup):
        """Extract address from Yelp business page"""
        try:
            # Look for address elements
            address_elements = soup.select('address[class*="address"]')
            if address_elements:
                return address_elements[0].text.strip()
                
            # Alternative approach
            address_elements = soup.select('p[class*="address"]')
            if address_elements:
                return address_elements[0].text.strip()
        except Exception as e:
            print(f"Error extracting address: {str(e)}")
        return "N/A"
    
    def _extract_email(self, soup):
        """Extract email from business page if available"""
        try:
            # Look for email patterns in the page
            email_regex = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
            text = soup.get_text()
            emails = re.findall(email_regex, text)
            if emails:
                # Filter out common false positives
                filtered_emails = [email for email in emails 
                                  if not ('yelp.com' in email or 
                                         'example.com' in email)]
                if filtered_emails:
                    return filtered_emails[0]
        except Exception as e:
            print(f"Error extracting email: {str(e)}")
        return "N/A"
    
    def _extract_categories(self, soup):
        """Extract business categories from Yelp business page"""
        try:
            # Try to find category links
            category_elements = soup.select('a[href*="c_cflt"]')
            if category_elements:
                categories = [cat.text.strip() for cat in category_elements]
                return ", ".join(categories)
        except Exception as e:
            print(f"Error extracting categories: {str(e)}")
        return "N/A"
    
    def save_results(self, filename='businesses_without_websites.csv'):
        """Save the results to a CSV file"""
        if not self.results:
            print("No results to save")
            return
        
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['name', 'phone', 'address', 'email', 'categories', 'source_url', 'instagram'] if 'instagram' in self.results[0] else ['name', 'phone', 'address', 'email', 'categories', 'source_url']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            for business in self.results:
                writer.writerow(business)
        
        print(f"Saved {len(self.results)} businesses to {filename}")

def main():
    scraper = BusinessScraper()
    
    # Example usage
    location = "San Francisco, CA"
    categories = ["restaurants", "plumbers", "electricians"]
    
    for category in categories:
        # Try local search mode which generates sample data (for testing)
        scraper.search_businesses_by_category(location, category, num_pages=2, source="local")
    
    scraper.save_results()

if __name__ == "__main__":
    main()
