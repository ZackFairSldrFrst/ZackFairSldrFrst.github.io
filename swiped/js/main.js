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
    document.getElementById('matchDialog').style.display = 'flex';
}

function hideMatchDialog() {
    document.getElementById('matchDialog').style.display = 'none';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceRecording();
    initializeSelectionButtons();
    initializeAnimations();
});

// Initialize selection buttons
function initializeSelectionButtons() {
    // Date options
    const dateOptions = document.querySelectorAll('.date-option');
    dateOptions.forEach(option => {
        option.addEventListener('click', () => {
            dateOptions.forEach(btn => btn.classList.remove('selected'));
            option.classList.add('selected');
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
    
    const formData = {
        phone: document.getElementById('phone').value,
        datePreference: document.querySelector('.date-option.selected')?.dataset.value,
        availability: document.querySelector('.time-option.selected')?.dataset.value,
        hasVoiceMessage: document.getElementById('audioPlayback').src ? true : false
    };

    // Here you would typically send this data to your server
    console.log('Form submitted:', formData);
    alert('Thanks for the match! I\'ll be in touch soon! 😊');
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
    const shareText = "Check out this awesome profile! 😎";
    
    switch (platform) {
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
            break;
        case 'telegram':
            window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
            break;
        case 'copy':
            navigator.clipboard.writeText(shareUrl)
                .then(() => alert('Link copied to clipboard!'))
                .catch(err => console.error('Error copying link:', err));
            break;
    }
} 