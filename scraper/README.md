# Business Contact Scraper

A web application that finds businesses without websites and collects their contact information.

## Features

- Search for businesses by location and category
- Identify businesses that do not have websites
- Collect contact information (phone, address, email)
- Export results to CSV
- Multiple data source options

## Installation

1. Clone the repository
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Local Usage

1. Start the Flask application:

```bash
python app.py
```

2. Open your browser and navigate to: http://127.0.0.1:8080/

3. Enter the location and business categories you want to search for

4. Select a data source:
   - **Local**: Uses sample data for testing (default)
   - **YellowPages**: Attempts to scrape YellowPages
   - **Yelp**: Attempts to scrape Yelp (often blocked by anti-scraping measures)

5. Click "Search Businesses" to start the scraping process

6. Once complete, download the CSV results

## Web Deployment

This application is ready to deploy to various web hosting platforms. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to:

- Render (recommended for beginners)
- Heroku
- PythonAnywhere
- AWS

## Important Notes

- Many business directories use anti-scraping measures that may block automated requests
- The scraper includes a "Local" mode that generates sample data for testing
- The application uses random delays and rotates user agents to help avoid blocks
- For production use, consider using a proxy service (requires configuration)

## Customization

You can modify the scraper to target different websites by updating the selectors in the `scraper.py` file. To add proxy support:

1. Set `use_proxy=True` when initializing the BusinessScraper
2. Update the proxy URLs in the scraper.py file with your proxy service details

## Handling Anti-Scraping Measures

Many business directories employ anti-scraping techniques that may block the scraper. To work around these limitations:

1. Use the "Local" mode for testing
2. Consider using a legitimate API if available (Google Places API, Yelp API, etc.)
3. If using the scraper for production, implement proper rate limiting and consider rotating IP addresses

## Disclaimer

Web scraping may be against the terms of service for some websites. Use this tool responsibly and ensure you have permission to scrape data from the targeted websites. This tool is for educational purposes only.

## License

MIT 