// DeepSeek API Configuration
const DEEPSEEK_API_KEY = 'sk-c6a2dd0f53ff4b178134ec63f9eeb6b4';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// DOM Elements
const generateBtn = document.getElementById('generate-btn');
const btnText = document.getElementById('btn-text');
const loadingSpinner = document.getElementById('loading-spinner');
const resultsSection = document.getElementById('results-section');
const generatedMessage = document.getElementById('generated-message');
const regenerateBtn = document.getElementById('regenerate-btn');
const downloadShortcut = document.getElementById('download-shortcut');
const qrCodeDiv = document.getElementById('qr-code');
const occasionSelect = document.getElementById('occasion');
const customPromptGroup = document.getElementById('custom-prompt-group');

// Form data storage
let currentFormData = {};
let currentShortcutUrl = '';

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to current time
    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16);
    document.getElementById('schedule-time').min = minDateTime;
    
    // Show/hide custom prompt field
    occasionSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customPromptGroup.style.display = 'block';
        } else {
            customPromptGroup.style.display = 'none';
        }
    });
    
    generateBtn.addEventListener('click', handleGenerate);
    regenerateBtn.addEventListener('click', regenerateMessage);
    downloadShortcut.addEventListener('click', handleDownloadShortcut);
});

// Generate AI message and iOS shortcut
async function handleGenerate() {
    if (!validateForm()) return;
    
    currentFormData = getFormData();
    
    // Show loading state
    setLoadingState(true);
    
    try {
        const message = await generateAIMessage(currentFormData);
        displayResults(message);
        await generateShortcut(message);
    } catch (error) {
        console.error('Error generating content:', error);
        alert('Sorry, there was an error generating your message. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

// Validate form inputs
function validateForm() {
    const recipient = document.getElementById('recipient').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const occasion = document.getElementById('occasion').value;
    const scheduleTime = document.getElementById('schedule-time').value;
    
    if (!recipient) {
        alert('Please enter the recipient\'s name.');
        return false;
    }
    
    if (!phone) {
        alert('Please enter a phone number.');
        return false;
    }
    
    if (!occasion) {
        alert('Please select an occasion.');
        return false;
    }
    
    if (!scheduleTime) {
        alert('Please select a schedule time.');
        return false;
    }
    
    if (occasion === 'custom') {
        const customPrompt = document.getElementById('custom-prompt').value.trim();
        if (!customPrompt) {
            alert('Please describe your custom message.');
            return false;
        }
    }
    
    return true;
}

// Get form data
function getFormData() {
    return {
        recipient: document.getElementById('recipient').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        occasion: document.getElementById('occasion').value,
        customPrompt: document.getElementById('custom-prompt').value.trim(),
        tone: document.getElementById('tone').value,
        scheduleTime: document.getElementById('schedule-time').value
    };
}

// Generate AI message using DeepSeek API
async function generateAIMessage(formData) {
    const prompt = createPrompt(formData);
    
    const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that creates personalized messages. Always respond with ONLY the message text, no explanations or additional text.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 200,
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// Create prompt for AI
function createPrompt(formData) {
    let prompt = `Create a ${formData.tone} message`;
    
    if (formData.occasion === 'custom') {
        prompt += ` for the following occasion: ${formData.customPrompt}`;
    } else {
        const occasionTexts = {
            'birthday': 'birthday',
            'anniversary': 'anniversary',
            'holiday': 'holiday greeting',
            'reminder': 'friendly reminder',
            'good_morning': 'good morning message',
            'good_night': 'good night message',
            'check_in': 'check-in message'
        };
        prompt += ` for a ${occasionTexts[formData.occasion]}`;
    }
    
    prompt += ` to send to ${formData.recipient}. The message should be warm, personal, and appropriate for texting. Keep it under 160 characters if possible.`;
    
    return prompt;
}

// Display results
function displayResults(message) {
    generatedMessage.textContent = message;
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Generate iOS shortcut
async function generateShortcut(message) {
    const shortcutGenerator = new iOSShortcutGenerator();
    const messageData = {
        recipient: currentFormData.recipient,
        phone: formatPhoneNumber(currentFormData.phone),
        message: message,
        scheduleTime: currentFormData.scheduleTime
    };
    
    // Create downloadable shortcut file
    const shortcutFile = shortcutGenerator.createShortcutFile(messageData);
    currentShortcutUrl = shortcutFile.url;
    
    // Generate shareable URL for iOS
    const shareableURL = shortcutGenerator.generateShareableURL(messageData);
    
    // Generate QR code with the shareable URL
    try {
        await QRCode.toCanvas(qrCodeDiv, shareableURL, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        qrCodeDiv.innerHTML = '<p>QR code generation failed</p>';
    }
    
    // Store both URLs for different download options
    window.shortcutFileUrl = shortcutFile.url;
    window.shortcutFilename = shortcutFile.filename;
    window.shareableURL = shareableURL;
}

// Set loading state
function setLoadingState(loading) {
    if (loading) {
        generateBtn.disabled = true;
        btnText.style.display = 'none';
        loadingSpinner.style.display = 'block';
    } else {
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
    }
}

// Regenerate message
async function regenerateMessage() {
    setLoadingState(true);
    
    try {
        const newMessage = await generateAIMessage(currentFormData);
        generatedMessage.textContent = newMessage;
        await generateShortcut(newMessage);
    } catch (error) {
        console.error('Error regenerating message:', error);
        alert('Sorry, there was an error regenerating your message. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

// Handle shortcut download
function handleDownloadShortcut() {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // On iOS, try to open the shareable URL
        if (window.shareableURL) {
            window.open(window.shareableURL, '_blank');
        }
    } else {
        // On other devices, download the shortcut file
        if (window.shortcutFileUrl && window.shortcutFilename) {
            const link = document.createElement('a');
            link.href = window.shortcutFileUrl;
            link.download = window.shortcutFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show additional instructions
            setTimeout(() => {
                alert('Shortcut file downloaded! Transfer this file to your iPhone and open it to import into the Shortcuts app, or scan the QR code with your iPhone for easier setup.');
            }, 500);
        }
    }
}

// Utility function to format phone number
function formatPhoneNumber(phone) {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Add country code if missing
    if (digits.length === 10) {
        return `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
        return `+${digits}`;
    }
    
    return phone; // Return as-is if format is unclear
} 