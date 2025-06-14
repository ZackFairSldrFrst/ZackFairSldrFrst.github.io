// Set the target date (July 2, 2025, 11:45 AM PT)
const targetDate = new Date('2025-07-02T11:45:00-07:00');

const sweetMessages = {
    0: "Today's the day! Can't wait to see you! ✨",
    1: "Just one more day until we meet again... 🌟",
    2: "Two days left! Getting excited! 💫",
    3: "Three days to go... Counting every moment! ⭐",
    4: "Four days until I can see your smile again! 🌠",
    5: "Five days left... Miss your laugh! ✨",
    6: "Six days to go... Getting closer! 🌟",
    7: "A week left... Looking forward to our reunion! 💫",
    8: "Eight days until I can see you again! ⭐",
    9: "Nine days to go... Saving all my hugs! 🌠",
    10: "Double digits! Ten days until we meet! ✨",
    11: "Eleven days left... Counting down every second! 🌟",
    12: "Twelve days to go... Miss your voice! 💫",
    13: "Thirteen days until we're together again! ⭐",
    14: "Two weeks left... Can't wait to see you! 🌠",
    15: "Fifteen days to go... Getting closer! ✨",
    16: "Sixteen days left... Miss your smile! 🌟",
    17: "Seventeen days to go... Counting every moment! 💫",
    18: "Eighteen days until I can see you again! ⭐",
    19: "Nineteen days left... Looking forward to it! 🌠",
    20: "Twenty days to go... Miss our conversations! ✨",
    21: "Three weeks left... Getting excited! 🌟",
    22: "Twenty-two days to go... Miss your laugh! 💫",
    23: "Twenty-three days left... Counting down! ⭐",
    24: "Twenty-four days to go... Miss your voice! 🌠",
    25: "Twenty-five days left... Getting closer! ✨",
    26: "Twenty-six days to go... Miss your smile! 🌟",
    27: "Twenty-seven days left... Counting every second! 💫",
    28: "Four weeks to go... Looking forward to it! ⭐",
    29: "Twenty-nine days left... Miss our talks! 🌠",
    30: "A month to go... Can't wait to see you! ✨",
    default: "Counting down the days until we meet again... ✨"
};

const dailyQuests = [
    "Send Alvin a cute good morning message",
    "Share a photo of your day",
    "Tell Alvin something you're grateful for",
    "Send a voice message",
    "Share a song that reminds you of them"
];

function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;

    if (difference < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        document.getElementById('sweet-message').textContent = "I'm here! Let's make the most of our time together! 💖";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    // Update sweet message based on days remaining
    const message = sweetMessages[days] || sweetMessages.default;
    document.getElementById('sweet-message').textContent = message;
}

function updateStreak(completedQuests) {
    const today = new Date().toDateString();
    const lastCompleted = localStorage.getItem('lastCompletedDate');
    const currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;
    
    // Check if all quests are completed
    const allCompleted = Object.values(completedQuests).every(Boolean);
    
    if (allCompleted) {
        // If this is the first completion today
        if (lastCompleted !== today) {
            // Check if this is a consecutive day
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();
            
            if (lastCompleted === yesterdayStr) {
                // Increment streak
                const newStreak = currentStreak + 1;
                localStorage.setItem('currentStreak', newStreak);
                localStorage.setItem('lastCompletedDate', today);
                document.querySelector('.streak-count').textContent = newStreak;
                
                // Show reward message for streaks of 7 or more days
                const rewardMessage = document.querySelector('.reward-message');
                if (newStreak >= 7) {
                    rewardMessage.classList.add('show');
                } else {
                    rewardMessage.classList.remove('show');
                }
            } else if (!lastCompleted) {
                // First time completing quests
                localStorage.setItem('currentStreak', 1);
                localStorage.setItem('lastCompletedDate', today);
                document.querySelector('.streak-count').textContent = 1;
            } else {
                // Streak broken, reset to 1
                localStorage.setItem('currentStreak', 1);
                localStorage.setItem('lastCompletedDate', today);
                document.querySelector('.streak-count').textContent = 1;
                document.querySelector('.reward-message').classList.remove('show');
            }
        }
    } else {
        // If not all quests are completed, hide reward message
        document.querySelector('.reward-message').classList.remove('show');
    }
}

function updateProgress(completedQuests) {
    const totalQuests = dailyQuests.length;
    const completedCount = Object.values(completedQuests).filter(Boolean).length;
    const progress = (completedCount / totalQuests) * 100;
    
    document.querySelector('.progress-fill').style.width = `${progress}%`;
    document.querySelector('.progress-text').textContent = 
        `Complete your daily quests to reveal today's message! (${completedCount}/${totalQuests})`;

    // Show message when all quests are completed
    const messageContainer = document.querySelector('.message-container');
    if (completedCount === totalQuests) {
        messageContainer.classList.add('show');
        updateStreak(completedQuests);
    } else {
        messageContainer.classList.remove('show');
    }
}

function loadQuests() {
    const questsList = document.getElementById('quests-list');
    const today = new Date().toDateString();
    
    // Get completed quests from localStorage
    let completedQuests = JSON.parse(localStorage.getItem('completedQuests')) || {};
    const lastReset = localStorage.getItem('lastReset');

    // Reset quests if it's a new day
    if (lastReset !== today) {
        completedQuests = {};
        localStorage.setItem('completedQuests', JSON.stringify(completedQuests));
        localStorage.setItem('lastReset', today);
    }

    // Initialize streak display
    const currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;
    document.querySelector('.streak-count').textContent = currentStreak;

    // Create quest elements
    dailyQuests.forEach((quest, index) => {
        const questElement = document.createElement('div');
        questElement.className = 'quest-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `quest-${index}`;
        checkbox.checked = completedQuests[index] || false;
        
        checkbox.addEventListener('change', function() {
            completedQuests[index] = this.checked;
            localStorage.setItem('completedQuests', JSON.stringify(completedQuests));
            updateProgress(completedQuests);
        });

        const label = document.createElement('label');
        label.htmlFor = `quest-${index}`;
        label.textContent = quest;

        questElement.appendChild(checkbox);
        questElement.appendChild(label);
        questsList.appendChild(questElement);
    });

    // Initialize progress
    updateProgress(completedQuests);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
    loadQuests(); // Load quests
}); 