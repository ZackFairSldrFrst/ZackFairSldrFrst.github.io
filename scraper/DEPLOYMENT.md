# Deployment Guide

This guide explains how to deploy the Business Contact Scraper web application to various hosting platforms.

## Prerequisites

- A GitHub account (for deploying to platforms that support GitHub integration)
- The application code pushed to a GitHub repository
- For some platforms: A credit card for verification (even for free tiers)

## Option 1: Deploying to Render (Recommended for Beginners)

Render provides a simple way to host web applications with a generous free tier.

1. Create an account at [render.com](https://render.com/)
2. Go to Dashboard and click "New" -> "Web Service"
3. Connect your GitHub repository
4. Configure your service:
   - Name: `business-scraper` (or any name you prefer)
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
5. Choose a free or paid plan based on your needs
6. Click "Create Web Service"

Your app will be available at `https://your-service-name.onrender.com` once deployed.

## Option 2: Deploying to Heroku

Heroku offers a popular platform for Python applications.

1. Create an account at [heroku.com](https://heroku.com/)
2. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Login to Heroku CLI: `heroku login`
4. Navigate to your project directory and run:
   ```
   heroku create your-app-name
   git push heroku main
   ```
5. Open your app: `heroku open`

## Option 3: Deploying to PythonAnywhere

PythonAnywhere is great for Python web applications with an easy setup process.

1. Create an account at [pythonanywhere.com](https://www.pythonanywhere.com/)
2. Go to the Dashboard and open a Bash console
3. Clone your repository:
   ```
   git clone https://github.com/yourusername/your-repo-name.git
   ```
4. Set up a virtual environment:
   ```
   cd your-repo-name
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
5. Go to the Web tab, create a new web app, select "Flask" and configure your app:
   - Path to the Flask app: `/home/yourusername/your-repo-name/app.py`
   - Working directory: `/home/yourusername/your-repo-name`
   - Virtual environment: `/home/yourusername/your-repo-name/venv`
6. Update the WSGI configuration file as needed

## Option 4: Deploying to AWS

For more advanced users, AWS offers powerful deployment options.

1. Create an account at [aws.amazon.com](https://aws.amazon.com/)
2. Use AWS Elastic Beanstalk:
   - Install EB CLI: `pip install awsebcli`
   - Initialize EB: `eb init -p python-3.8 business-scraper`
   - Create the environment: `eb create business-scraper-env`
   - Deploy your app: `eb deploy`

## Important Notes

- Make sure your `requirements.txt` is up-to-date before deploying
- The application is configured to read the port from environment variables
- Web scraping operations may be subject to IP-based rate limiting on certain platforms
- For production use, consider adding proper authentication and rate limiting

## Troubleshooting

- If your app fails to start, check the logs on your hosting platform
- For scraping issues, consider using proxies or switching to a proper API
- If you see a memory error, you may need to upgrade to a paid tier with more resources 