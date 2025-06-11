document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('countdown-form');
    const questsContainer = document.getElementById('quests-container');
    const messagesContainer = document.getElementById('messages-container');
    const addQuestButton = document.getElementById('add-quest');
    const addMessageButton = document.getElementById('add-message');

    // Add new quest input
    addQuestButton.addEventListener('click', () => {
        const questInput = document.createElement('div');
        questInput.className = 'quest-input';
        questInput.innerHTML = `
            <input type="text" placeholder="Enter a daily quest" required>
            <button type="button" class="remove-quest">×</button>
        `;
        questsContainer.appendChild(questInput);
        updateRemoveButtons();
    });

    // Add new message input
    addMessageButton.addEventListener('click', () => {
        const messageInput = document.createElement('div');
        messageInput.className = 'message-input';
        messageInput.innerHTML = `
            <input type="text" placeholder="Enter a message for a specific day (e.g., '7: Miss you!')" required>
            <button type="button" class="remove-message">×</button>
        `;
        messagesContainer.appendChild(messageInput);
        updateRemoveButtons();
    });

    // Update remove buttons visibility
    function updateRemoveButtons() {
        const questInputs = document.querySelectorAll('.quest-input');
        const messageInputs = document.querySelectorAll('.message-input');

        questInputs.forEach((input, index) => {
            const removeButton = input.querySelector('.remove-quest');
            removeButton.style.display = index === 0 ? 'none' : 'block';
        });

        messageInputs.forEach((input, index) => {
            const removeButton = input.querySelector('.remove-message');
            removeButton.style.display = index === 0 ? 'none' : 'block';
        });
    }

    // Handle remove buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-quest')) {
            e.target.parentElement.remove();
            updateRemoveButtons();
        } else if (e.target.classList.contains('remove-message')) {
            e.target.parentElement.remove();
            updateRemoveButtons();
        }
    });

    // Generate a unique ID for the countdown
    function generateUniqueId() {
        return 'countdown-' + Math.random().toString(36).substr(2, 9);
    }

    // Create a new countdown page
    function createCountdownPage(config) {
        const uniqueId = generateUniqueId();
        const pageContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Counting Down to See ${config.partnerName}</title>
    <link rel="stylesheet" href="../styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <h1>Counting Down to See ${config.partnerName}</h1>
        <div class="streak-container">
            <i class="fas fa-fire streak-icon"></i>
            <div class="streak-text">Current Streak: <span class="streak-count">0</span> days</div>
        </div>
        <div class="message-container">
            <p id="sweet-message" class="sweet-message">Every moment without you feels like an eternity...</p>
        </div>
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">Complete your daily quests to reveal today's message!</div>
        </div>
        <div class="countdown-container">
            <div class="countdown-item">
                <span id="days">00</span>
                <span class="label">Days</span>
            </div>
            <div class="countdown-item">
                <span id="hours">00</span>
                <span class="label">Hours</span>
            </div>
            <div class="countdown-item">
                <span id="minutes">00</span>
                <span class="label">Minutes</span>
            </div>
            <div class="countdown-item">
                <span id="seconds">00</span>
                <span class="label">Seconds</span>
            </div>
        </div>

        <div class="quests-container">
            <h2>Daily Quests</h2>
            <div id="quests-list">
                <!-- Quests will be populated by JavaScript -->
            </div>
        </div>

        <div class="reward-message">
            ${config.rewardMessage}
        </div>

        <a href="../couple-maxing.html" class="back-button">Create Your Own Countdown</a>
    </div>

    <script>
        // Configuration
        const countdownConfig = ${JSON.stringify(config)};
    </script>
    <script src="../script.js"></script>
</body>
</html>`;

        // Save the page content to localStorage
        localStorage.setItem(`countdown-${uniqueId}`, pageContent);
        
        // Save the configuration to localStorage
        localStorage.setItem(`config-${uniqueId}`, JSON.stringify(config));

        return uniqueId;
    }

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect form data
        const targetDate = document.getElementById('target-date').value;
        const partnerName = document.getElementById('partner-name').value;
        const rewardMessage = document.getElementById('reward-message').value;

        // Collect quests
        const quests = Array.from(document.querySelectorAll('.quest-input input'))
            .map(input => input.value)
            .filter(value => value.trim() !== '');

        // Collect messages
        const messages = Array.from(document.querySelectorAll('.message-input input'))
            .map(input => input.value)
            .filter(value => value.trim() !== '');

        // Create countdown configuration
        const countdownConfig = {
            targetDate,
            partnerName,
            quests,
            messages,
            rewardMessage
        };

        // Create a new countdown page and get its unique ID
        const uniqueId = createCountdownPage(countdownConfig);

        // Show success message with shareable link
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h3>Your countdown has been created! 🎉</h3>
            <p>Share this link with your partner:</p>
            <div class="share-link">
                <input type="text" value="${window.location.origin}/countdown/${uniqueId}.html" readonly>
                <button onclick="navigator.clipboard.writeText('${window.location.origin}/countdown/${uniqueId}.html')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <a href="${uniqueId}.html" class="primary-button">View Your Countdown</a>
        `;
        
        // Replace form with success message
        form.parentElement.replaceWith(successMessage);
    });

    // Initialize remove buttons
    updateRemoveButtons();
}); 