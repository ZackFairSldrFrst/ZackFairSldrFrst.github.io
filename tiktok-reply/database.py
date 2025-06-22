import sqlite3
import logging
from datetime import datetime, timedelta
from config import Config

class DatabaseManager:
    def __init__(self):
        self.db_name = Config.DATABASE_NAME
        self.init_database()
    
    def init_database(self):
        """Initialize the database with required tables"""
        try:
            with sqlite3.connect(self.db_name) as conn:
                cursor = conn.cursor()
                
                # Table for processed comments
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS processed_comments (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        comment_id TEXT UNIQUE NOT NULL,
                        video_id TEXT NOT NULL,
                        original_comment TEXT NOT NULL,
                        response_sent TEXT NOT NULL,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                        response_type TEXT DEFAULT 'auto'
                    )
                ''')
                
                # Table for rate limiting
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS rate_limits (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                        action_type TEXT NOT NULL
                    )
                ''')
                
                # Table for user preferences
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS user_preferences (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        setting_name TEXT UNIQUE NOT NULL,
                        setting_value TEXT NOT NULL,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                
                conn.commit()
                logging.info("Database initialized successfully")
                
        except sqlite3.Error as e:
            logging.error(f"Database initialization error: {e}")
    
    def is_comment_processed(self, comment_id):
        """Check if a comment has already been processed"""
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT 1 FROM processed_comments WHERE comment_id = ?", 
                (comment_id,)
            )
            return cursor.fetchone() is not None
    
    def add_processed_comment(self, comment_id, video_id, original_comment, response_sent, response_type='auto'):
        """Add a processed comment to the database"""
        try:
            with sqlite3.connect(self.db_name) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO processed_comments 
                    (comment_id, video_id, original_comment, response_sent, response_type)
                    VALUES (?, ?, ?, ?, ?)
                ''', (comment_id, video_id, original_comment, response_sent, response_type))
                conn.commit()
                logging.info(f"Added processed comment: {comment_id}")
                return True
        except sqlite3.Error as e:
            logging.error(f"Error adding processed comment: {e}")
            return False
    
    def check_rate_limit(self, time_window_hours=1, max_actions=None):
        """Check if we're within rate limits"""
        if max_actions is None:
            max_actions = Config.MAX_RESPONSES_PER_HOUR if time_window_hours == 1 else Config.MAX_RESPONSES_PER_DAY
            
        cutoff_time = datetime.now() - timedelta(hours=time_window_hours)
        
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT COUNT(*) FROM rate_limits 
                WHERE timestamp > ? AND action_type = 'response'
            ''', (cutoff_time,))
            
            count = cursor.fetchone()[0]
            return count < max_actions
    
    def add_rate_limit_entry(self, action_type='response'):
        """Add an entry to track rate limiting"""
        try:
            with sqlite3.connect(self.db_name) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO rate_limits (action_type) VALUES (?)", 
                    (action_type,)
                )
                conn.commit()
        except sqlite3.Error as e:
            logging.error(f"Error adding rate limit entry: {e}")
    
    def get_response_stats(self, days=7):
        """Get statistics on responses sent"""
        cutoff_date = datetime.now() - timedelta(days=days)
        
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT 
                    COUNT(*) as total_responses,
                    COUNT(DISTINCT video_id) as videos_responded,
                    response_type,
                    DATE(timestamp) as date
                FROM processed_comments 
                WHERE timestamp > ?
                GROUP BY response_type, DATE(timestamp)
                ORDER BY date DESC
            ''', (cutoff_date,))
            
            return cursor.fetchall()
    
    def cleanup_old_entries(self, days_to_keep=30):
        """Clean up old database entries to prevent bloat"""
        cutoff_date = datetime.now() - timedelta(days=days_to_keep)
        
        try:
            with sqlite3.connect(self.db_name) as conn:
                cursor = conn.cursor()
                
                # Clean old rate limit entries
                cursor.execute(
                    "DELETE FROM rate_limits WHERE timestamp < ?", 
                    (cutoff_date,)
                )
                
                # Keep processed comments longer for analytics
                old_cutoff = datetime.now() - timedelta(days=days_to_keep * 3)
                cursor.execute(
                    "DELETE FROM processed_comments WHERE timestamp < ?", 
                    (old_cutoff,)
                )
                
                conn.commit()
                logging.info("Database cleanup completed")
                
        except sqlite3.Error as e:
            logging.error(f"Database cleanup error: {e}") 