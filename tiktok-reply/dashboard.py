#!/usr/bin/env python3
"""
TikTok Auto-Reply Bot Dashboard
Web interface for monitoring and controlling the bot
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
from datetime import datetime, timedelta
import logging

from database import DatabaseManager
from config import Config
from main import TikTokAutoReplyBot

app = Flask(__name__)
app.secret_key = 'your-secret-key-here-change-this'

# Initialize components
db = DatabaseManager()
bot = None

@app.route('/')
def dashboard():
    """Main dashboard page"""
    stats = get_dashboard_stats()
    return render_template('dashboard.html', stats=stats)

@app.route('/api/stats')
def api_stats():
    """API endpoint for getting current statistics"""
    stats = get_dashboard_stats()
    return jsonify(stats)

@app.route('/api/start', methods=['POST'])
def api_start_bot():
    """Start the bot"""
    global bot
    try:
        if bot and bot.is_running:
            return jsonify({'success': False, 'message': 'Bot is already running'})
        
        bot = TikTokAutoReplyBot()
        # Start bot in background thread
        import threading
        thread = threading.Thread(target=bot.start, daemon=True)
        thread.start()
        
        return jsonify({'success': True, 'message': 'Bot started successfully'})
    except Exception as e:
        logging.error(f"Error starting bot: {e}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/stop', methods=['POST'])
def api_stop_bot():
    """Stop the bot"""
    global bot
    try:
        if bot:
            bot.is_running = False
            bot = None
        return jsonify({'success': True, 'message': 'Bot stopped successfully'})
    except Exception as e:
        logging.error(f"Error stopping bot: {e}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/test', methods=['POST'])
def api_test_bot():
    """Test the bot with a single run"""
    try:
        test_bot = TikTokAutoReplyBot()
        test_bot.run_once()
        return jsonify({'success': True, 'message': 'Test run completed'})
    except Exception as e:
        logging.error(f"Error during test run: {e}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/comments')
def comments():
    """View recent comments and responses"""
    try:
        with db.db_name and sqlite3.connect(db.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT 
                    comment_id, video_id, original_comment, 
                    response_sent, timestamp, response_type
                FROM processed_comments 
                ORDER BY timestamp DESC 
                LIMIT 100
            ''')
            
            comments_data = cursor.fetchall()
            
        return render_template('comments.html', comments=comments_data)
    except Exception as e:
        logging.error(f"Error fetching comments: {e}")
        return render_template('comments.html', comments=[], error=str(e))

@app.route('/settings', methods=['GET', 'POST'])
def settings():
    """Settings page"""
    if request.method == 'POST':
        # Handle settings update
        try:
            # Update configuration (this would need to be implemented)
            return redirect(url_for('settings'))
        except Exception as e:
            return render_template('settings.html', error=str(e))
    
    # Get current settings
    settings_data = {
        'max_responses_per_hour': Config.MAX_RESPONSES_PER_HOUR,
        'max_responses_per_day': Config.MAX_RESPONSES_PER_DAY,
        'response_delay_min': Config.RESPONSE_DELAY_MIN,
        'response_delay_max': Config.RESPONSE_DELAY_MAX,
        'ai_enabled': bool(Config.OPENAI_API_KEY),
        'response_templates': Config.RESPONSE_TEMPLATES,
        'keyword_responses': Config.KEYWORD_RESPONSES
    }
    
    return render_template('settings.html', settings=settings_data)

def get_dashboard_stats():
    """Get statistics for the dashboard"""
    try:
        # Get basic stats
        stats = {
            'bot_running': bot.is_running if bot else False,
            'total_responses': 0,
            'responses_today': 0,
            'responses_this_hour': 0,
            'recent_activity': []
        }
        
        # Get database stats
        db_stats = db.get_response_stats(days=7)
        if db_stats:
            stats['total_responses'] = sum(stat[0] for stat in db_stats)
            
            today = datetime.now().date()
            stats['responses_today'] = sum(
                stat[0] for stat in db_stats 
                if stat[3] and datetime.strptime(stat[3], '%Y-%m-%d').date() == today
            )
        
        # Get hourly stats
        hourly_stats = db.get_response_stats(days=1)
        if hourly_stats:
            current_hour = datetime.now().replace(minute=0, second=0, microsecond=0)
            stats['responses_this_hour'] = sum(
                stat[0] for stat in hourly_stats 
                if stat[3] and datetime.strptime(stat[3], '%Y-%m-%d') >= current_hour
            )
        
        # Get recent activity
        import sqlite3
        with sqlite3.connect(db.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT original_comment, response_sent, timestamp
                FROM processed_comments 
                WHERE response_type = 'auto'
                ORDER BY timestamp DESC 
                LIMIT 10
            ''')
            
            recent_comments = cursor.fetchall()
            stats['recent_activity'] = [
                {
                    'comment': comment[0][:50] + '...' if len(comment[0]) > 50 else comment[0],
                    'response': comment[1],
                    'timestamp': comment[2]
                }
                for comment in recent_comments
            ]
        
        return stats
        
    except Exception as e:
        logging.error(f"Error getting dashboard stats: {e}")
        return {
            'bot_running': False,
            'total_responses': 0,
            'responses_today': 0,
            'responses_this_hour': 0,
            'recent_activity': [],
            'error': str(e)
        }

# Template for dashboard.html
dashboard_html = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TikTok Auto-Reply Bot Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #ff0050; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2em; font-weight: bold; color: #ff0050; }
        .controls { margin: 20px 0; }
        .btn { padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        .btn-primary { background: #ff0050; color: white; }
        .btn-secondary { background: #6c757d; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        .status { padding: 10px; border-radius: 5px; margin: 10px 0; }
        .status.running { background: #d4edda; color: #155724; }
        .status.stopped { background: #f8d7da; color: #721c24; }
        .activity-list { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .activity-item { padding: 10px; border-bottom: 1px solid #eee; }
        .nav { margin-bottom: 20px; }
        .nav a { padding: 10px 15px; margin-right: 10px; background: white; text-decoration: none; color: #333; border-radius: 5px; }
        .nav a.active { background: #ff0050; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 TikTok Auto-Reply Bot Dashboard</h1>
            <p>Automated comment responses for your TikTok videos</p>
        </div>
        
        <div class="nav">
            <a href="/" class="active">Dashboard</a>
            <a href="/comments">Comments</a>
            <a href="/settings">Settings</a>
        </div>
        
        <div class="status {{ 'running' if stats.bot_running else 'stopped' }}">
            Bot Status: {{ 'Running' if stats.bot_running else 'Stopped' }}
        </div>
        
        <div class="controls">
            <button class="btn btn-success" onclick="startBot()">Start Bot</button>
            <button class="btn btn-danger" onclick="stopBot()">Stop Bot</button>
            <button class="btn btn-secondary" onclick="testBot()">Test Run</button>
            <button class="btn btn-primary" onclick="refreshStats()">Refresh</button>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">{{ stats.total_responses }}</div>
                <div>Total Responses</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ stats.responses_today }}</div>
                <div>Responses Today</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ stats.responses_this_hour }}</div>
                <div>This Hour</div>
            </div>
        </div>
        
        <div class="activity-list">
            <h3>Recent Activity</h3>
            {% for activity in stats.recent_activity %}
            <div class="activity-item">
                <strong>Comment:</strong> {{ activity.comment }}<br>
                <strong>Response:</strong> {{ activity.response }}<br>
                <small>{{ activity.timestamp }}</small>
            </div>
            {% endfor %}
        </div>
    </div>
    
    <script>
        function startBot() {
            fetch('/api/start', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.success) location.reload();
                });
        }
        
        function stopBot() {
            fetch('/api/stop', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.success) location.reload();
                });
        }
        
        function testBot() {
            fetch('/api/test', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                });
        }
        
        function refreshStats() {
            location.reload();
        }
        
        // Auto-refresh every 30 seconds
        setInterval(() => {
            fetch('/api/stats')
                .then(response => response.json())
                .then(data => {
                    // Update stats without full page reload
                    document.querySelector('.stat-number').textContent = data.total_responses;
                });
        }, 30000);
    </script>
</body>
</html>
'''

# Save the template
import os
if not os.path.exists('templates'):
    os.makedirs('templates')

with open('templates/dashboard.html', 'w') as f:
    f.write(dashboard_html)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 