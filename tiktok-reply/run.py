#!/usr/bin/env python3
"""
TikTok Auto-Reply System Launcher
Easy way to start the system in different modes
"""

import sys
import subprocess
import os
from pathlib import Path

def print_banner():
    print("""
🎵 TikTok Auto-Reply System
===========================
Automated comment responses for your TikTok videos
""")

def check_dependencies():
    """Check if required files exist"""
    required_files = [
        'main.py', 'config.py', 'database.py', 
        'tiktok_api.py', 'response_generator.py'
    ]
    
    missing_files = []
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Missing required files: {', '.join(missing_files)}")
        return False
    
    # Check if .env exists
    if not Path('.env').exists():
        if Path('env_example.txt').exists():
            print("⚠️  No .env file found. Please copy env_example.txt to .env and configure your API keys.")
        else:
            print("⚠️  No .env file found. Please create one with your API keys.")
        return False
    
    return True

def install_dependencies():
    """Install required Python packages"""
    print("📦 Installing dependencies...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      check=True, capture_output=True)
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def run_bot():
    """Run the main bot"""
    print("🤖 Starting TikTok Auto-Reply Bot...")
    try:
        subprocess.run([sys.executable, 'main.py'])
    except KeyboardInterrupt:
        print("\n👋 Bot stopped by user")
    except Exception as e:
        print(f"❌ Error running bot: {e}")

def run_dashboard():
    """Run the web dashboard"""
    print("🌐 Starting Web Dashboard...")
    print("📍 Dashboard will be available at: http://localhost:5000")
    try:
        subprocess.run([sys.executable, 'dashboard.py'])
    except KeyboardInterrupt:
        print("\n👋 Dashboard stopped by user")
    except Exception as e:
        print(f"❌ Error running dashboard: {e}")

def run_test():
    """Run a test cycle"""
    print("🧪 Running test cycle...")
    try:
        subprocess.run([sys.executable, 'main.py', '--once'])
        print("✅ Test completed")
    except Exception as e:
        print(f"❌ Test failed: {e}")

def show_stats():
    """Show bot statistics"""
    print("📊 Fetching statistics...")
    try:
        subprocess.run([sys.executable, 'main.py', '--stats'])
    except Exception as e:
        print(f"❌ Error fetching stats: {e}")

def setup_system():
    """Initial system setup"""
    print("🔧 Setting up TikTok Auto-Reply System...")
    
    # Install dependencies
    if not install_dependencies():
        return False
    
    # Create .env if it doesn't exist
    if not Path('.env').exists():
        if Path('env_example.txt').exists():
            print("📝 Creating .env file from template...")
            import shutil
            shutil.copy('env_example.txt', '.env')
            print("✅ .env file created. Please edit it with your API keys.")
        else:
            print("❌ env_example.txt not found. Cannot create .env file.")
            return False
    
    # Create templates directory
    templates_dir = Path('templates')
    if not templates_dir.exists():
        templates_dir.mkdir()
        print("📁 Created templates directory")
    
    print("✅ Setup completed!")
    print("\n📋 Next steps:")
    print("1. Edit .env file with your TikTok and OpenAI API keys")
    print("2. Run: python run.py --test (to test the system)")
    print("3. Run: python run.py --dashboard (to start with web interface)")
    print("4. Run: python run.py --bot (to start the bot)")
    
    return True

def main():
    """Main menu"""
    print_banner()
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == '--setup':
            setup_system()
            return
        elif command == '--install':
            install_dependencies()
            return
        
        # Check dependencies for other commands
        if not check_dependencies():
            print("\n🔧 Run 'python run.py --setup' to configure the system")
            return
        
        if command == '--bot':
            run_bot()
        elif command == '--dashboard':
            run_dashboard()
        elif command == '--test':
            run_test()
        elif command == '--stats':
            show_stats()
        else:
            print(f"❌ Unknown command: {command}")
            show_help()
    else:
        # Interactive menu
        if not check_dependencies():
            print("🔧 System not configured. Running setup...")
            setup_system()
            return
        
        show_menu()

def show_menu():
    """Show interactive menu"""
    while True:
        print("\n🎯 What would you like to do?")
        print("1. 🤖 Start Bot (continuous operation)")
        print("2. 🌐 Start Dashboard (web interface)")
        print("3. 🧪 Run Test (single cycle)")
        print("4. 📊 Show Statistics")
        print("5. 🔧 Setup/Configuration")
        print("6. ❌ Exit")
        
        try:
            choice = input("\nEnter your choice (1-6): ").strip()
            
            if choice == '1':
                run_bot()
            elif choice == '2':
                run_dashboard()
            elif choice == '3':
                run_test()
            elif choice == '4':
                show_stats()
            elif choice == '5':
                setup_system()
            elif choice == '6':
                print("👋 Goodbye!")
                break
            else:
                print("❌ Invalid choice. Please enter 1-6.")
        
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

def show_help():
    """Show help information"""
    print("""
🎯 TikTok Auto-Reply System Commands:

Setup:
  --setup      Initial system setup and configuration
  --install    Install required dependencies only

Operation:  
  --bot        Start the bot (continuous operation)
  --dashboard  Start web dashboard (http://localhost:5000)
  --test       Run single test cycle
  --stats      Show current statistics

Interactive:
  (no args)    Show interactive menu

Examples:
  python run.py --setup
  python run.py --dashboard
  python run.py --bot
  python run.py --test
""")

if __name__ == "__main__":
    main() 