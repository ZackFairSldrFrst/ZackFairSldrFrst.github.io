// Global variables
let currentFile = null;

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const analysisSection = document.getElementById('analysisSection');
const loading = document.getElementById('loading');
const analysisResults = document.getElementById('analysisResults');
const analysisContent = document.getElementById('analysisContent');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const fileType = document.getElementById('fileType');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    setupDragAndDrop();
    setupFileInput();
});

function setupDragAndDrop() {
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('click', () => fileInput.click());
}

function setupFileInput() {
    fileInput.addEventListener('change', handleFileSelect);
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFile(file) {
    console.log('Handling file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['pdf', 'docx', 'doc', 'txt'];
    
    console.log('File extension:', fileExtension, 'Allowed extensions:', allowedExtensions);
    console.log('File type:', file.type, 'Allowed types:', allowedTypes);
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        console.log('File type validation failed');
        showError('Please select a valid file type (PDF, DOCX, DOC, or TXT)');
        return;
    }
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        console.log('File size validation failed:', file.size, '>', maxSize);
        showError('File size must be less than 10MB');
        return;
    }
    
    console.log('File validation passed, proceeding with upload');
    currentFile = file;
    displayFileInfo(file);
    uploadAndAnalyze(file);
}

function displayFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileType.textContent = file.name.split('.').pop().toUpperCase();
    
    uploadSection.style.display = 'none';
    analysisSection.style.display = 'block';
    loading.style.display = 'block';
    analysisResults.style.display = 'none';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function uploadAndAnalyze(file) {
    try {
        console.log('Starting upload and analysis for:', file.name);
        
        const formData = new FormData();
        formData.append('document', file);
        
        console.log('Sending request to /api/analyze...');
        
        const response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to analyze document');
        }
        
        const result = await response.json();
        console.log('Analysis result:', result);
        
        // Check if we have the analysis data
        if (result.success && result.analysis) {
            // The analysis text is in result.analysis.analysis
            const analysisText = result.analysis.analysis || result.analysis;
            displayAnalysis(analysisText);
        } else {
            throw new Error('No analysis data received from server');
        }
        
    } catch (error) {
        console.error('Error during upload and analysis:', error);
        showError('Failed to analyze document: ' + error.message);
    }
}

function displayAnalysis(analysis) {
    console.log('Displaying analysis, length:', analysis.length);
    console.log('Analysis preview:', analysis.substring(0, 200) + '...');
    
    loading.style.display = 'none';
    analysisResults.style.display = 'block';
    
    // Convert markdown-style analysis to HTML with proper formatting
    const formattedAnalysis = formatAnalysisText(analysis);
    console.log('Formatted analysis length:', formattedAnalysis.length);
    
    analysisContent.innerHTML = formattedAnalysis;
    
    // Scroll to results
    analysisResults.scrollIntoView({ behavior: 'smooth' });
    
    console.log('Analysis display completed');
}

function formatAnalysisText(text) {
    // Convert markdown headers to HTML
    let formatted = text
        .replace(/^## (.*$)/gim, '<h3>$1</h3>')
        .replace(/^### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^#### (.*$)/gim, '<h5>$1</h5>');
    
    // Convert lists
    formatted = formatted
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/^\* (.*$)/gim, '<li>$1</li>');
    
    // Wrap consecutive list items in ul tags
    formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // Convert line breaks to paragraphs
    formatted = formatted
        .split('\n\n')
        .map(paragraph => {
            if (paragraph.trim() === '') return '';
            if (paragraph.startsWith('<h') || paragraph.startsWith('<ul>')) {
                return paragraph;
            }
            return `<p>${paragraph.trim()}</p>`;
        })
        .join('');
    
    // Highlight important keywords
    formatted = formatted
        .replace(/\b(missing|error|warning|critical|incomplete|required)\b/gi, '<strong>$1</strong>')
        .replace(/\b(complete|valid|correct|approved)\b/gi, '<span style="color: #28a745;">$1</span>');
    
    // Add special styling for warnings and errors
    formatted = formatted
        .replace(/\*\*WARNING\*\*: (.*?)(?=\n|$)/gi, '<div class="warning"><strong>WARNING:</strong> $1</div>')
        .replace(/\*\*ERROR\*\*: (.*?)(?=\n|$)/gi, '<div class="error"><strong>ERROR:</strong> $1</div>')
        .replace(/\*\*SUCCESS\*\*: (.*?)(?=\n|$)/gi, '<div class="success"><strong>SUCCESS:</strong> $1</div>');
    
    return formatted;
}

function showError(message) {
    loading.style.display = 'none';
    analysisResults.style.display = 'block';
    analysisContent.innerHTML = `
        <div class="error">
            <h3>Error</h3>
            <p>${message}</p>
            <button onclick="resetAnalysis()" class="upload-btn" style="margin-top: 15px;">
                Try Again
            </button>
        </div>
    `;
}

function resetAnalysis() {
    // Reset file input
    fileInput.value = '';
    currentFile = null;
    
    // Reset UI
    uploadSection.style.display = 'block';
    analysisSection.style.display = 'none';
    loading.style.display = 'none';
    analysisResults.style.display = 'none';
    
    // Clear content
    analysisContent.innerHTML = '';
    fileName.textContent = '';
    fileSize.textContent = '';
    fileType.textContent = '';
    
    // Remove drag-over styling
    uploadArea.classList.remove('dragover');
}

// Add some utility functions for better UX
function showLoadingMessage(message) {
    const loadingText = loading.querySelector('p');
    if (loadingText) {
        loadingText.textContent = message;
    }
}

// Add progress indication for large files
function updateProgress(percent) {
    const loadingNote = loading.querySelector('.loading-note');
    if (loadingNote) {
        loadingNote.textContent = `Processing... ${percent}%`;
    }
} 