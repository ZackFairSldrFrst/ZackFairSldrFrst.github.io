// Get configuration from localStorage
const countdownConfig = JSON.parse(localStorage.getItem('countdownConfig')) || {
    targetDate: '2025-07-02T11:45:00',
    partnerName: 'Alvin',
    quests: [
        'Send a good morning text',
        'Share a photo of your day',
        'Tell them something you appreciate about them',
        'Send a voice message'
    ],
    messages: [
        '7: Every moment without you feels like an eternity...',
        '14: Counting down the days until I can hold your hand again...',
        '21: The distance between us only makes my heart grow fonder...',
        '28: Can\'t wait to create new memories together...',
        '35: You\'re worth every second of this wait...',
        '42: The countdown continues, but my love for you grows stronger...',
        '49: Each day brings us closer to our reunion...',
        '56: Missing your smile more than words can express...',
        '63: The thought of seeing you soon keeps me going...',
        '70: Can\'t wait to make up for lost time...'
    ],
    rewardMessage: '🎉 Amazing streak! Keep it up to unlock a special discount code for The Keg! 🎉'
};

// Update page title and header
document.title = `Counting Down to See ${countdownConfig.partnerName}`;
document.querySelector('h1').textContent = `Counting Down to See ${countdownConfig.partnerName}`;

// Set target date
const targetDate = new Date(countdownConfig.targetDate).getTime();

// Update countdown every second
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    // Update sweet message based on days remaining
    const messageContainer = document.getElementById('sweet-message');
    const matchingMessage = countdownConfig.messages.find(msg => {
        const dayMatch = msg.match(/^(\d+):/);
        return dayMatch && parseInt(dayMatch[1]) === days;
    });

    if (matchingMessage) {
        messageContainer.textContent = matchingMessage.split(': ')[1];
    }
}

// Initialize quests
function loadQuests() {
    const questsList = document.getElementById('quests-list');
    const completedQuests = JSON.parse(localStorage.getItem('completedQuests')) || {};
    const today = new Date().toDateString();

    // Clear existing quests
    questsList.innerHTML = '';

    // Add each quest
    countdownConfig.quests.forEach((quest, index) => {
        const questItem = document.createElement('div');
        questItem.className = 'quest-item';
        questItem.innerHTML = `
            <input type="checkbox" id="quest-${index}" ${completedQuests[today]?.includes(index) ? 'checked' : ''}>
            <label for="quest-${index}">${quest}</label>
        `;

        // Add event listener for checkbox
        const checkbox = questItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            if (!completedQuests[today]) {
                completedQuests[today] = [];
            }

            if (checkbox.checked) {
                completedQuests[today].push(index);
            } else {
                completedQuests[today] = completedQuests[today].filter(i => i !== index);
            }

            localStorage.setItem('completedQuests', JSON.stringify(completedQuests));
            updateProgress();
            updateStreak();
        });

        questsList.appendChild(questItem);
    });

    updateProgress();
    updateStreak();
}

// Update progress bar
function updateProgress() {
    const completedQuests = JSON.parse(localStorage.getItem('completedQuests')) || {};
    const today = new Date().toDateString();
    const todayQuests = completedQuests[today] || [];
    const progress = (todayQuests.length / countdownConfig.quests.length) * 100;

    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const messageContainer = document.querySelector('.message-container');

    progressFill.style.width = `${progress}%`;
    
    if (progress === 100) {
        progressText.textContent = 'All quests completed! Today\'s message is revealed!';
        messageContainer.style.opacity = '1';
    } else {
        progressText.textContent = 'Complete your daily quests to reveal today\'s message!';
        messageContainer.style.opacity = '0';
    }
}

// Update streak
function updateStreak() {
    const completedQuests = JSON.parse(localStorage.getItem('completedQuests')) || {};
    const streak = parseInt(localStorage.getItem('streak')) || 0;
    const today = new Date().toDateString();
    const todayQuests = completedQuests[today] || [];
    const allQuestsCompleted = todayQuests.length === countdownConfig.quests.length;

    const streakCount = document.querySelector('.streak-count');
    const rewardMessage = document.querySelector('.reward-message');

    if (allQuestsCompleted) {
        if (streak === 0) {
            localStorage.setItem('streak', '1');
            streakCount.textContent = '1';
        } else {
            const newStreak = streak + 1;
            localStorage.setItem('streak', newStreak.toString());
            streakCount.textContent = newStreak;

            if (newStreak >= 7) {
                rewardMessage.style.display = 'block';
                rewardMessage.textContent = countdownConfig.rewardMessage;
            }
        }
    } else {
        localStorage.setItem('streak', '0');
        streakCount.textContent = '0';
        rewardMessage.style.display = 'none';
    }
}

// Initialize
loadQuests();
setInterval(updateCountdown, 1000);
updateCountdown(); 