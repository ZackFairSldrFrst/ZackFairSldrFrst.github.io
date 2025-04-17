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
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Initialize components
    initializeVoiceRecording();
    initializeHumorScale();
    initializeSelectionButtons();
    initializeAnimations();
    initializeDialogs();

    // Initialize form events
    document.getElementById('matchForm').addEventListener('submit', handleFormSubmit);
});

// Initialize humor scale
function initializeHumorScale() {
    const humorSlider = document.getElementById('humorScale');
    if (!humorSlider) return;
    
    const scaleContainer = humorSlider.closest('.scale-container');
    const scaleValue = scaleContainer.querySelector('.scale-value');
    
    // Create result message container if it doesn't exist
    let resultMessage = document.querySelector('.scale-result');
    if (!resultMessage) {
        resultMessage = document.createElement('div');
        resultMessage.className = 'scale-result';
        scaleContainer.appendChild(resultMessage);
    }

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
        
        // Update the scale value text
        scaleValue.textContent = `${value}/10 - ${descriptions[value-1]}`;
        
        // Show different messages based on score
        if (parseInt(value) >= 5) {
            resultMessage.innerHTML = `
                <div class="match-message success">
                    <i class="fas fa-heart"></i>
                    Yay! You're unhinged too. 
                    <button class="action-btn lets-do-it" onclick="showMatchDialog()">
                        <span>Let's match!</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
        } else {
            resultMessage.innerHTML = `
                <div class="match-message gentle-reject">
                    <i class="fas fa-star"></i>
                    OOF, you are above my league. Stay pure!
                </div>
            `;
        }
        
        // Ensure the result is visible
        resultMessage.classList.add('show');
        
        // Make the message immediately visible for debugging
        console.log("Slider value updated:", value);
        console.log("Result message:", resultMessage.innerHTML);
    }

    // Add event listener for slider changes
    humorSlider.addEventListener('input', (e) => {
        updateScaleValue(e.target.value);
    });

    // Ensure initial value gets set properly
    setTimeout(() => {
        updateScaleValue(humorSlider.value || 1);
    }, 100);
}

// Initialize dialog related functions
function initializeDialogs() {
    // Ensure all "Let's do it" buttons open the match dialog
    document.querySelectorAll('.action-btn.lets-do-it, button.lets-do-it, .match-message button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showMatchDialog();
        });
    });

    // Add click event for dynamically added buttons
    document.addEventListener('click', function(e) {
        if (e.target && (e.target.classList.contains('lets-do-it') || 
                        (e.target.parentElement && e.target.parentElement.classList.contains('lets-do-it')))) {
            e.preventDefault();
            showMatchDialog();
        }
    });

    // Initialize close handlers for dialogs
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('matchDialog')) {
            hideMatchDialog();
        }
        if (e.target === document.getElementById('rejectDialog')) {
            hideRejectDialog();
        }
    });
}

// Initialize selection buttons with fixed event handlers
function initializeSelectionButtons() {
    console.log("Initializing selection buttons");
    
    // Date options
    const dateOptions = document.querySelectorAll('.date-option');
    dateOptions.forEach(option => {
        option.addEventListener('click', function() {
            console.log("Date option clicked:", this.dataset.value);
            
            // Remove selection from all options
            dateOptions.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Select the clicked option
            this.classList.add('selected');
            
            // Handle custom activity input
            const customInput = document.getElementById('customActivityInput');
            if (this.dataset.value === 'custom') {
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
        option.addEventListener('click', function() {
            console.log("Time option clicked:", this.textContent.trim());
            
            // Remove selection from all time options
            timeOptions.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Select the clicked option
            this.classList.add('selected');
        });
    });
    
    console.log("Button initialization complete");
}

// Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const phone = document.getElementById('phone').value;
    
    // Get date preference
    const selectedDateOption = document.querySelector('.date-option.selected');
    let datePreferenceText = "No preference";
    let dateValue = "flexible";
    
    if (selectedDateOption) {
        datePreferenceText = selectedDateOption.querySelector('span').textContent.trim();
        dateValue = selectedDateOption.dataset.value;
    }
    
    // Get custom activity if selected
    let customActivity = "";
    if (dateValue === 'custom') {
        customActivity = document.getElementById('customActivity').value.trim();
        if (customActivity) {
            datePreferenceText = customActivity;
        }
    }
    
    // Get availability
    const availabilityEl = document.querySelector('.time-option.selected');
    let availabilityText = "Flexible times";
    
    if (availabilityEl) {
        availabilityText = availabilityEl.textContent.trim();
    }
    
    // Get additional message
    const message = document.getElementById('message').value.trim();

    // Create the message text
    let messageText = `Hey! I saw your profile and I'd like to connect!\n\n`;
    messageText += `My number: ${phone}\n\n`;
    messageText += `I'm available during: ${availabilityText}\n\n`;
    
    // Add date preference
    if (dateValue === 'custom' && customActivity) {
        messageText += `I'd love to: ${customActivity}\n\n`;
    } else {
        messageText += `My idea for a date: ${datePreferenceText}\n\n`;
    }
    
    // Add personal message if provided
    if (message) {
        messageText += `Additional note: ${message}\n\n`;
    }
    
    // Add a friendly closing
    messageText += `Hope to hear from you soon! 😊`;
    
    console.log("Message text:", messageText);
    
    // Create and open the SMS link
    const smsLink = `sms:6043753710?&body=${encodeURIComponent(messageText)}`;
    console.log("SMS link:", smsLink);
    
    // Open in new tab to prevent navigation issues
    window.open(smsLink, '_blank');
    
    // Hide dialog
    hideMatchDialog();
    
    return false;
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

// Initialize animations
function initializeAnimations() {
    const promptCards = document.querySelectorAll('.prompt-card');
    promptCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

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