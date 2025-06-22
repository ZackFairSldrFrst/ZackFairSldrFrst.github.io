#!/usr/bin/env python3
"""
TikTok Auto-Reply System
A comprehensive system for automatically responding to TikTok comments
"""

import logging
import time
import random
import schedule
import signal
import sys
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed

from config import Config
from database import DatabaseManager
from tiktok_api import TikTokAPI, TikTokWebScraper
from response_generator import ResponseGenerator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('tiktok_bot.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

class TikTokAutoReplyBot:
    def __init__(self):
        self.db = DatabaseManager()
        self.api = TikTokAPI()
        self.response_generator = ResponseGenerator()
        self.is_running = False
        self.stats = {
            'comments_processed': 0,
            'responses_sent': 0,
            'errors': 0,
            'skipped': 0
        }
        
        # Set up graceful shutdown
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
        
        logging.info("TikTok Auto-Reply Bot initialized")
    
    def _signal_handler(self, signum, frame):
        """Handle shutdown signals gracefully"""
        logging.info("Shutdown signal received. Stopping bot...")
        self.is_running = False
        sys.exit(0)
    
    def start(self):
        """Start the bot with scheduled runs"""
        logging.info("Starting TikTok Auto-Reply Bot")
        self.is_running = True
        
        # Validate API connection first
        if not self.api.validate_api_connection():
            logging.error("API connection validation failed. Please check your credentials.")
            return False
        
        # Schedule the bot to run every 15 minutes
        schedule.every(15).minutes.do(self._run_cycle)
        
        # Schedule daily cleanup
        schedule.every().day.at("02:00").do(self._daily_cleanup)
        
        # Schedule stats logging
        schedule.every().hour.do(self._log_stats)
        
        # Run initial cycle
        self._run_cycle()
        
        # Main loop
        while self.is_running:
            try:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
            except KeyboardInterrupt:
                logging.info("Bot stopped by user")
                break
            except Exception as e:
                logging.error(f"Unexpected error in main loop: {e}")
                time.sleep(300)  # Wait 5 minutes before retrying
        
        logging.info("TikTok Auto-Reply Bot stopped")
        return True
    
    def _run_cycle(self):
        """Run one cycle of comment processing"""
        logging.info("Starting bot cycle")
        cycle_start = datetime.now()
        
        try:
            # Check rate limits
            if not self.db.check_rate_limit(time_window_hours=1):
                logging.warning("Hourly rate limit reached. Skipping cycle.")
                return
            
            if not self.db.check_rate_limit(time_window_hours=24, max_actions=Config.MAX_RESPONSES_PER_DAY):
                logging.warning("Daily rate limit reached. Skipping cycle.")
                return
            
            # Get recent videos
            videos = self.api.get_user_videos(max_count=10)
            
            if not videos:
                logging.warning("No videos found or API error")
                return
            
            logging.info(f"Processing {len(videos)} videos")
            
            # Process videos in parallel
            with ThreadPoolExecutor(max_workers=3) as executor:
                futures = [executor.submit(self._process_video, video) for video in videos]
                
                for future in as_completed(futures):
                    try:
                        future.result()
                    except Exception as e:
                        logging.error(f"Error processing video: {e}")
                        self.stats['errors'] += 1
            
            cycle_duration = (datetime.now() - cycle_start).total_seconds()
            logging.info(f"Cycle completed in {cycle_duration:.2f} seconds")
            
        except Exception as e:
            logging.error(f"Error in bot cycle: {e}")
            self.stats['errors'] += 1
    
    def _process_video(self, video):
        """Process comments for a single video"""
        video_id = video.get('id')
        if not video_id:
            logging.warning("Video has no ID, skipping")
            return
        
        logging.info(f"Processing video: {video_id}")
        
        try:
            # Get comments for this video
            comments, cursor = self.api.get_video_comments(video_id, max_count=50)
            
            if not comments:
                logging.info(f"No comments found for video {video_id}")
                return
            
            # Process each comment
            for comment in comments:
                if not self.is_running:
                    break
                
                self._process_comment(comment, video)
                
                # Add delay between processing comments
                delay = random.randint(Config.RESPONSE_DELAY_MIN, Config.RESPONSE_DELAY_MAX)
                time.sleep(delay)
                
        except Exception as e:
            logging.error(f"Error processing video {video_id}: {e}")
            self.stats['errors'] += 1
    
    def _process_comment(self, comment, video):
        """Process a single comment"""
        comment_id = comment.get('id')
        comment_text = comment.get('text', '')
        video_id = video.get('id')
        
        if not all([comment_id, comment_text, video_id]):
            logging.warning("Comment missing required data, skipping")
            return
        
        self.stats['comments_processed'] += 1
        
        # Check if we've already processed this comment
        if self.db.is_comment_processed(comment_id):
            logging.debug(f"Comment {comment_id} already processed")
            self.stats['skipped'] += 1
            return
        
        # Generate response
        video_context = {
            'title': video.get('title', ''),
            'description': video.get('description', ''),
            'hashtags': video.get('hashtags', [])
        }
        
        response_text = self.response_generator.generate_response(
            comment_text, 
            video_context=video_context
        )
        
        if not response_text:
            logging.info(f"No response generated for comment: {comment_text[:50]}...")
            self.db.add_processed_comment(
                comment_id, video_id, comment_text, 
                "No response generated", "skipped"
            )
            self.stats['skipped'] += 1
            return
        
        # Validate response
        if not self.response_generator.validate_response(response_text):
            logging.warning(f"Generated response failed validation: {response_text}")
            self.stats['skipped'] += 1
            return
        
        # Send response
        success, reply_id = self.api.reply_to_comment(video_id, comment_id, response_text)
        
        if success:
            logging.info(f"Successfully replied to comment {comment_id}: {response_text}")
            self.db.add_processed_comment(
                comment_id, video_id, comment_text, response_text, "auto"
            )
            self.db.add_rate_limit_entry("response")
            self.stats['responses_sent'] += 1
        else:
            logging.error(f"Failed to reply to comment {comment_id}")
            self.db.add_processed_comment(
                comment_id, video_id, comment_text, 
                f"Failed to send: {response_text}", "failed"
            )
            self.stats['errors'] += 1
    
    def _daily_cleanup(self):
        """Perform daily maintenance tasks"""
        logging.info("Starting daily cleanup")
        try:
            self.db.cleanup_old_entries()
            self._reset_daily_stats()
            logging.info("Daily cleanup completed")
        except Exception as e:
            logging.error(f"Error during daily cleanup: {e}")
    
    def _reset_daily_stats(self):
        """Reset daily statistics"""
        self.stats = {
            'comments_processed': 0,
            'responses_sent': 0,
            'errors': 0,
            'skipped': 0
        }
    
    def _log_stats(self):
        """Log current statistics"""
        logging.info(f"Bot Stats - Processed: {self.stats['comments_processed']}, "
                    f"Responses: {self.stats['responses_sent']}, "
                    f"Errors: {self.stats['errors']}, "
                    f"Skipped: {self.stats['skipped']}")
        
        # Log database stats
        db_stats = self.db.get_response_stats(days=1)
        if db_stats:
            logging.info(f"Database Stats: {db_stats}")
    
    def run_once(self):
        """Run the bot once (for testing)"""
        logging.info("Running bot once for testing")
        self.is_running = True
        self._run_cycle()
        self.is_running = False
    
    def get_stats(self):
        """Get current bot statistics"""
        return {
            **self.stats,
            'database_stats': self.db.get_response_stats(days=7),
            'is_running': self.is_running
        }

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='TikTok Auto-Reply Bot')
    parser.add_argument('--once', action='store_true', 
                       help='Run the bot once and exit (for testing)')
    parser.add_argument('--stats', action='store_true',
                       help='Show current statistics and exit')
    parser.add_argument('--debug', action='store_true',
                       help='Enable debug logging')
    
    args = parser.parse_args()
    
    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)
    
    bot = TikTokAutoReplyBot()
    
    if args.stats:
        stats = bot.get_stats()
        print("\n=== TikTok Bot Statistics ===")
        print(f"Comments Processed: {stats['comments_processed']}")
        print(f"Responses Sent: {stats['responses_sent']}")
        print(f"Errors: {stats['errors']}")
        print(f"Skipped: {stats['skipped']}")
        print(f"Bot Running: {stats['is_running']}")
        
        if stats['database_stats']:
            print("\n=== Database Statistics (Last 7 days) ===")
            for stat in stats['database_stats']:
                print(f"Date: {stat[3]}, Type: {stat[2]}, "
                      f"Responses: {stat[0]}, Videos: {stat[1]}")
        return
    
    if args.once:
        bot.run_once()
    else:
        bot.start()

if __name__ == "__main__":
    main() 