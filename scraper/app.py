from flask import Flask, render_template, request, jsonify, send_file
import requests
from bs4 import BeautifulSoup
import os
from scraper import BusinessScraper

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape():
    url = request.form.get('url')
    if url:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            text = soup.get_text()
            return text
        else:
            return f"Failed to fetch page: {response.status_code}"
    else:
        return "No URL provided"

@app.route('/search_businesses', methods=['POST'])
def search_businesses():
    location = request.form.get('location', '')
    categories = request.form.get('categories', '').split(',')
    num_pages = int(request.form.get('num_pages', 2))
    source = request.form.get('source', 'local')
    
    if not location or not categories:
        return jsonify({"error": "Location and categories are required"}), 400
    
    scraper = BusinessScraper()
    
    try:
        # Process each category
        for category in categories:
            category = category.strip()
            if category:
                scraper.search_businesses_by_category(location, category, num_pages, source)
        
        # Save results to CSV
        output_file = 'businesses_without_websites.csv'
        scraper.save_results(output_file)
        
        # Prepare results for display
        business_results = []
        for business in scraper.results:
            # Convert each business to a format suitable for display
            business_display = {
                'name': business.get('name', 'N/A'),
                'phone': business.get('phone', 'N/A'),
                'address': business.get('address', 'N/A'),
                'email': business.get('email', 'N/A'),
                'categories': business.get('categories', 'N/A'),
                'source_url': business.get('source_url', '#'),
            }
            
            # Add Instagram handle if available
            if 'instagram' in business:
                business_display['instagram'] = business['instagram']
                
            business_results.append(business_display)
        
        # Return summary and results
        return jsonify({
            "success": True,
            "businesses_found": len(scraper.results),
            "output_file": output_file,
            "results": business_results  # Include the actual results data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/download_results')
def download_results():
    file_path = 'businesses_without_websites.csv'
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return "No results file found. Run a search first.", 404

if __name__ == '__main__':
    # Get port from environment variable or default to 8080
    port = int(os.environ.get('PORT', 8080))
    # Bind to 0.0.0.0 to make accessible outside of localhost
    app.run(host='0.0.0.0', debug=False, port=port)
