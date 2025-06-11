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

        // Save configuration to localStorage
        localStorage.setItem('countdownConfig', JSON.stringify(countdownConfig));

        // Redirect to countdown page
        window.location.href = 'index.html';
    });

    // Initialize remove buttons
    updateRemoveButtons();
}); 