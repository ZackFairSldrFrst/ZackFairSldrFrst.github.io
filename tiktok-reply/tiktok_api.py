import requests
import logging
import time
import json
from config import Config

class TikTokAPI:
    def __init__(self):
        self.access_token = Config.TIKTOK_ACCESS_TOKEN
        self.app_id = Config.TIKTOK_APP_ID
        self.app_secret = Config.TIKTOK_APP_SECRET
        self.base_url = "https://open-api.tiktok.com"
        
        if not self.access_token:
            logging.warning("TikTok access token not found. Please configure your API credentials.")
    
    def get_headers(self):
        """Get headers for TikTok API requests"""
        return {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }
    
    def get_user_videos(self, username=None, cursor=0, max_count=20):
        """
        Get user's videos from TikTok API
        Note: This requires proper TikTok API access and user permissions
        """
        try:
            url = f"{self.base_url}/v2/video/list/"
            
            params = {
                'max_count': max_count,
                'cursor': cursor
            }
            
            response = requests.get(
                url, 
                headers=self.get_headers(), 
                params=params,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('data', {}).get('videos'):
                    return data['data']['videos']
                else:
                    logging.warning("No videos found in API response")
                    return []
            else:
                logging.error(f"Failed to fetch videos: {response.status_code} - {response.text}")
                return []
                
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching videos: {e}")
            return []
        except Exception as e:
            logging.error(f"Unexpected error fetching videos: {e}")
            return []
    
    def get_video_comments(self, video_id, cursor=0, max_count=50):
        """
        Get comments for a specific video
        """
        try:
            url = f"{self.base_url}/v2/video/comment/list/"
            
            params = {
                'video_id': video_id,
                'max_count': max_count,
                'cursor': cursor
            }
            
            response = requests.get(
                url,
                headers=self.get_headers(),
                params=params,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('data', {}).get('comments'):
                    return data['data']['comments'], data['data'].get('cursor', cursor)
                else:
                    logging.info(f"No comments found for video {video_id}")
                    return [], cursor
            else:
                logging.error(f"Failed to fetch comments: {response.status_code} - {response.text}")
                return [], cursor
                
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching comments: {e}")
            return [], cursor
        except Exception as e:
            logging.error(f"Unexpected error fetching comments: {e}")
            return [], cursor
    
    def reply_to_comment(self, video_id, comment_id, reply_text):
        """
        Reply to a specific comment
        """
        try:
            url = f"{self.base_url}/v2/video/comment/reply/"
            
            payload = {
                'video_id': video_id,
                'comment_id': comment_id,
                'text': reply_text[:Config.MAX_RESPONSE_LENGTH]  # Ensure we don't exceed limit
            }
            
            response = requests.post(
                url,
                headers=self.get_headers(),
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('data', {}).get('comment_id'):
                    logging.info(f"Successfully replied to comment {comment_id}")
                    return True, data['data']['comment_id']
                else:
                    logging.error(f"Reply failed: {data}")
                    return False, None
            else:
                logging.error(f"Failed to reply: {response.status_code} - {response.text}")
                return False, None
                
        except requests.exceptions.RequestException as e:
            logging.error(f"Error replying to comment: {e}")
            return False, None
        except Exception as e:
            logging.error(f"Unexpected error replying to comment: {e}")
            return False, None
    
    def get_user_info(self, username=None):
        """
        Get user profile information
        """
        try:
            url = f"{self.base_url}/v2/user/info/"
            
            params = {}
            if username:
                params['username'] = username
            
            response = requests.get(
                url,
                headers=self.get_headers(),
                params=params,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get('data', {}).get('user', {})
            else:
                logging.error(f"Failed to fetch user info: {response.status_code}")
                return {}
                
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching user info: {e}")
            return {}
        except Exception as e:
            logging.error(f"Unexpected error fetching user info: {e}")
            return {}
    
    def validate_api_connection(self):
        """
        Validate that the API connection is working
        """
        try:
            user_info = self.get_user_info()
            if user_info:
                logging.info("TikTok API connection validated successfully")
                return True
            else:
                logging.error("TikTok API connection validation failed")
                return False
        except Exception as e:
            logging.error(f"API validation error: {e}")
            return False

# Alternative web scraping approach (as backup if official API is not available)
class TikTokWebScraper:
    """
    Backup method using web scraping when official API is not available
    Note: This is more fragile and may break with TikTok updates
    """
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        logging.warning("Using web scraping fallback - this method is less reliable")
    
    def get_video_info(self, video_url):
        """
        Extract video information from TikTok video URL
        This is a simplified example - real implementation would be more complex
        """
        try:
            # This is a placeholder - actual implementation would parse TikTok HTML
            # You would need to analyze TikTok's page structure and extract JSON data
            response = self.session.get(video_url, timeout=30)
            if response.status_code == 200:
                # Parse HTML and extract video/comment data
                # This would require BeautifulSoup and careful parsing
                logging.info("Successfully fetched video page")
                return {"status": "success", "data": "placeholder"}
            else:
                logging.error(f"Failed to fetch video page: {response.status_code}")
                return {"status": "error"}
        except Exception as e:
            logging.error(f"Web scraping error: {e}")
            return {"status": "error"} 