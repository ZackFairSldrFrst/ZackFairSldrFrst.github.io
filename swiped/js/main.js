// Track likes for each prompt
const promptLikes = {
    1: false,
    2: false,
    3: false
};

// Handle prompt actions (like, comment, share)
function handlePromptAction(action, promptId) {
    switch(action) {
        case 'like':
            toggleLike(promptId);
            break;
        case 'comment':
            showMatchDialog();
            break;
        case 'share':
            shareProfile();
            break;
    }
}

// Toggle like state and update UI
function toggleLike(promptId) {
    const likeBtn = document.querySelector(`#prompt${promptId} .action-btn.like`);
    promptLikes[promptId] = !promptLikes[promptId];
    
    if (promptLikes[promptId]) {
        likeBtn.style.color = '#ff4b4b';
        likeBtn.classList.add('liked');
        
        // Check if user has liked at least two prompts
        const totalLikes = Object.values(promptLikes).filter(liked => liked).length;
        if (totalLikes >= 2) {
            showMatchDialog();
        }
    } else {
        likeBtn.style.color = '';
        likeBtn.classList.remove('liked');
    }
}

// Match Dialog Functions
function showMatchDialog() {
    const dialog = document.getElementById('matchDialog');
    dialog.style.display = 'flex';
    
    // Reset form if needed
    const form = document.getElementById('matchForm');
    if (form) form.reset();
    
    // Ensure custom activity input is hidden initially
    const customInput = document.getElementById('customActivityInput');
    if (customInput) customInput.classList.remove('show');
    
    // Remove any previously selected options
    document.querySelectorAll('.date-option.selected, .time-option.selected').forEach(el => {
        el.classList.remove('selected');
    });
}

function hideMatchDialog() {
    document.getElementById('matchDialog').style.display = 'none';
}

// Reject Dialog Functions
function handleReject() {
    document.getElementById('rejectDialog').style.display = 'flex';
}

function hideRejectDialog() {
    document.getElementById('rejectDialog').style.display = 'none';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceRecording();
    initializeSelectionButtons();
    initializeAnimations();

    // Ensure all "Let's do it" buttons open the match dialog
    document.querySelectorAll('.action-btn.lets-do-it').forEach(button => {
        button.addEventListener('click', showMatchDialog);
    });

    const humorSlider = document.getElementById('humorScale');
    if (humorSlider) {
        humorSlider.addEventListener('input', (e) => {
            updateScaleValue(e.target.value);
        });
        // Initialize with default value
        updateScaleValue(humorSlider.value);
    }
});

// Initialize selection buttons
function initializeSelectionButtons() {
    // Date options
    document.querySelectorAll('.date-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.date-option').forEach(btn => btn.classList.remove('selected'));
            option.classList.add('selected');
            
            // Handle custom activity input
            const customInput = document.getElementById('customActivityInput');
            if (option.dataset.value === 'custom') {
                customInput.classList.add('show');
                document.getElementById('customActivity').focus();
            } else {
                customInput.classList.remove('show');
            }
        });
    });

    // Time options
    const timeOptions = document.querySelectorAll('.time-option');
    timeOptions.forEach(option => {
        option.addEventListener('click', () => {
            timeOptions.forEach(btn => btn.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
}

// Voice Recording Functions
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

function initializeVoiceRecording() {
    const recordButton = document.getElementById('recordButton');
    const recordingStatus = document.getElementById('recordingStatus');
    const audioPlayback = document.getElementById('audioPlayback');

    recordButton.addEventListener('click', async () => {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                startRecording(stream);
                recordButton.innerHTML = '<i class="fas fa-stop"></i><span>Stop Recording</span>';
                recordButton.classList.add('recording');
                isRecording = true;
            } catch (err) {
                console.error('Error accessing microphone:', err);
                recordingStatus.textContent = 'Error accessing microphone';
            }
        } else {
            stopRecording();
            recordButton.innerHTML = '<i class="fas fa-microphone"></i><span>Record Message</span>';
            recordButton.classList.remove('recording');
            isRecording = false;
        }
    });
}

function startRecording(stream) {
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = document.getElementById('audioPlayback');
        audio.src = audioUrl;
        audio.style.display = 'block';
    });

    mediaRecorder.start();
}

function stopRecording() {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
}

// Form Submission
document.getElementById('matchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const selectedDateOption = document.querySelector('.date-option.selected');
    const datePreference = selectedDateOption?.dataset.value;
    const customActivity = document.getElementById('customActivity').value;
    const availability = document.querySelector('.time-option.selected')?.dataset.value;
    const message = document.getElementById('message').value;

    // Create the message text
    let messageText = `Hey! I saw your profile and I'm interested in going on a date! `;
    messageText += `\n\nI'm free during ${availability} `;
    
    // Handle date preference text
    if (datePreference === 'custom' && customActivity) {
        messageText += `and would love to ${customActivity}. `;
    } else {
        const activities = {
            coffee: 'go for coffee and talk about code',
            food: 'go on a food adventure',
            gaming: 'have a gaming session'
        };
        messageText += `and would love to ${activities[datePreference] || 'meet up'}. `;
    }
    
    if (message) {
        messageText += `\n\nPS: ${message}`;
    }

    // Open default messaging app
    window.location.href = `sms:6043753710?&body=${encodeURIComponent(messageText)}`;
    
    hideMatchDialog();
});

// Initialize animations
function initializeAnimations() {
    const promptCards = document.querySelectorAll('.prompt-card');
    promptCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

// Close dialog when clicking outside
document.getElementById('matchDialog').addEventListener('click', (e) => {
    if (e.target === document.getElementById('matchDialog')) {
        hideMatchDialog();
    }
});

// Share Profile Functions
function shareProfile(platform) {
    const shareUrl = window.location.href;
    const shareText = "Check out this totally unhinged dating profile! 😂";
    
    switch(platform) {
        case 'messages':
            window.location.href = `sms:?&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
            break;
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
            break;
        case 'instagram':
            // Open Instagram app/web with share dialog
            window.open(`instagram://share?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
            break;
        case 'copy':
            navigator.clipboard.writeText(shareUrl)
                .then(() => alert('Link copied to clipboard!'))
                .catch(err => console.error('Error copying link:', err));
            break;
    }
    hideRejectDialog();
}

// Update the hot pot guess function
function checkHotpotGuess(button) {
    const input = button.previousElementSibling;
    const guess = parseFloat(input.value);
    const resultDiv = document.getElementById('guess-result');
    
    if (!guess || guess <= 0) {
        resultDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Come on, at least try to guess! 😅';
        resultDiv.className = 'guess-result show';
        return;
    }

    // Fun response regardless of the guess
    resultDiv.innerHTML = `
        <div class="match-message success">
            <i class="fas fa-heart"></i> OOF not quite but let's go on a date anyway 😉
            <button class="action-btn lets-do-it" onclick="showMatchDialog()">
                <span>Yes, let's do it!</span>
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
    resultDiv.className = 'guess-result show';
}

// Update the humor scale handler
function updateScaleValue(value) {
    const descriptions = [
        "Normal, sane 😊",
        "Mild 😌",
        "Getting there 😏",
        "Promising 😎",
        "Now we're talking 😈",
        "Chaotic good 🤪",
        "Definitely sus 👻",
        "Certified chaotic 🌪️",
        "Pure chaos 💀",
        "Unhinged 🤯"
    ];
    
    const scaleValue = document.querySelector('.scale-value');
    const resultMessage = document.querySelector('.scale-result');
    
    if (scaleValue && resultMessage) {
        // Update the scale value text
        scaleValue.textContent = `${value}/10 - ${descriptions[value-1]}`;
        
        // Show different messages based on score
        if (parseInt(value) >= 5) {
            resultMessage.innerHTML = `
                <div class="match-message success">
                    <i class="fas fa-heart"></i>
                    Yay we're a match! Let's go on a date and be unhinged together! 🎉
                    <button class="action-btn lets-do-it" onclick="showMatchDialog()">
                        <span>Yes, let's do it!</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
        } else {
            resultMessage.innerHTML = `
                <div class="match-message gentle-reject">
                    <i class="fas fa-star"></i>
                    OOF you're above my league and deserve someone better. 
                    Stay pure and wholesome! ✨
                </div>
            `;
        }
        
        resultMessage.classList.add('show');
    }
}

// Close dialogs when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('matchDialog')) {
        hideMatchDialog();
    }
    if (e.target === document.getElementById('rejectDialog')) {
        hideRejectDialog();
    }
}); 