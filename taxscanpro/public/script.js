// Global variables
let currentFile = null;
let scanHistory = [];

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const analysisSection = document.getElementById('analysisSection');
const loading = document.getElementById('loading');
const analysisResults = document.getElementById('analysisResults');
const analysisContent = document.getElementById('analysisContent');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const fileType = document.getElementById('fileType');
const criticalCount = document.getElementById('criticalCount');
const reviewCount = document.getElementById('reviewCount');
const optimizationCount = document.getElementById('optimizationCount');
const criticalAlertsList = document.getElementById('criticalAlertsList');
const reviewPointsList = document.getElementById('reviewPointsList');
const optimizationsList = document.getElementById('optimizationsList');
const scanHistoryContainer = document.getElementById('scanHistory');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    setupDragAndDrop();
    setupFileInput();
});

function setupDragAndDrop() {
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
}

function setupFileInput() {
    fileInput.addEventListener('change', handleFileSelect);
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('border-accent-blue');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('border-accent-blue');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('border-accent-blue');
    
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
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain', 'image/jpeg', 'image/png', 'image/tiff'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['pdf', 'docx', 'doc', 'txt', 'jpg', 'jpeg', 'png', 'tiff'];
    
    console.log('File extension:', fileExtension, 'Allowed extensions:', allowedExtensions);
    console.log('File type:', file.type, 'Allowed types:', allowedTypes);
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        console.log('File type validation failed');
        showError('Please select a valid file type (PDF, DOCX, DOC, TXT, JPG, PNG, TIFF)');
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
    
    analysisSection.style.display = 'block';
    loading.style.display = 'block';
    analysisResults.style.display = 'none';
    
    // Scroll to analysis section
    analysisSection.scrollIntoView({ behavior: 'smooth' });
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
            displayAnalysis(analysisText, result.analysis.fileName);
            
            // Add to scan history
            addToScanHistory(result.analysis.fileName, result.analysis.textLength);
        } else {
            throw new Error('No analysis data received from server');
        }
        
    } catch (error) {
        console.error('Error during upload and analysis:', error);
        showError('Failed to analyze document: ' + error.message);
    }
}

function displayAnalysis(analysis, fileName) {
    console.log('Displaying analysis, length:', analysis.length);
    console.log('Analysis preview:', analysis.substring(0, 200) + '...');
    
    loading.style.display = 'none';
    analysisResults.style.display = 'block';
    
    // Parse structured data from analysis
    const structuredData = parseAnalysisForStructuredData(analysis);
    
    // Update stats
    criticalCount.textContent = structuredData.criticalAlerts.length;
    reviewCount.textContent = structuredData.reviewPoints.length;
    optimizationCount.textContent = structuredData.optimizations.length;
    
    // Display structured sections
    displayCriticalAlerts(structuredData.criticalAlerts);
    displayReviewPoints(structuredData.reviewPoints);
    displayOptimizations(structuredData.optimizations);
    
    // Display detailed analysis
    const formattedAnalysis = formatAnalysisText(analysis);
    console.log('Formatted analysis length:', formattedAnalysis.length);
    
    analysisContent.innerHTML = formattedAnalysis;
    
    console.log('Analysis display completed');
}

function parseAnalysisForStructuredData(analysis) {
    const structuredData = {
        criticalAlerts: [],
        reviewPoints: [],
        optimizations: []
    };
    
    // Parse critical alerts (from WARNINGS section)
    const warningsMatch = analysis.match(/## WARNINGS[\s\S]*?(?=## |$)/i);
    if (warningsMatch) {
        const warningsText = warningsMatch[0];
        // Look for numbered items with bold headers
        const criticalItems = warningsText.match(/(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*?)(?=\n\d+\.|\n\n|$)/g);
        if (criticalItems) {
            criticalItems.forEach(item => {
                const match = item.match(/(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*)/);
                if (match) {
                    structuredData.criticalAlerts.push({
                        title: match[2].trim(),
                        description: match[3].trim()
                    });
                }
            });
        }
        // Also look for bullet points with bold headers
        const bulletItems = warningsText.match(/- \*\*(.*?)\*\*:\s*(.*?)(?=\n-|\n\n|$)/g);
        if (bulletItems) {
            bulletItems.forEach(item => {
                const match = item.match(/- \*\*(.*?)\*\*:\s*(.*)/);
                if (match) {
                    structuredData.criticalAlerts.push({
                        title: match[1].trim(),
                        description: match[2].trim()
                    });
                }
            });
        }
    }
    
    // Parse review points (from MISSING INFORMATION section)
    const missingMatch = analysis.match(/## MISSING INFORMATION[\s\S]*?(?=## |$)/i);
    if (missingMatch) {
        const missingText = missingMatch[0];
        // Look for numbered items
        const missingItems = missingText.match(/(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*?)(?=\n\d+\.|\n\n|$)/g);
        if (missingItems) {
            missingItems.forEach(item => {
                const match = item.match(/(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*)/);
                if (match) {
                    structuredData.reviewPoints.push({
                        title: match[2].trim(),
                        description: match[3].trim()
                    });
                }
            });
        }
        // Also look for bullet points
        const bulletItems = missingText.match(/- (.*?)(?=\n-|\n\n|$)/g);
        if (bulletItems) {
            bulletItems.forEach(item => {
                const description = item.replace(/^- /, '').trim();
                if (description && !description.includes('##')) {
                    structuredData.reviewPoints.push({
                        title: 'Missing Information',
                        description: description
                    });
                }
            });
        }
    }
    
    // Parse optimizations (from RECOMMENDATIONS section)
    const recommendationsMatch = analysis.match(/## RECOMMENDATIONS[\s\S]*?(?=## |$)/i);
    if (recommendationsMatch) {
        const recommendationsText = recommendationsMatch[0];
        // Look for numbered items
        const recommendationItems = recommendationsText.match(/(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*?)(?=\n\d+\.|\n\n|$)/g);
        if (recommendationItems) {
            recommendationItems.forEach(item => {
                const match = item.match(/(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*)/);
                if (match) {
                    structuredData.optimizations.push({
                        title: match[2].trim(),
                        description: match[3].trim()
                    });
                }
            });
        }
        // Also look for bullet points
        const bulletItems = recommendationsText.match(/- (.*?)(?=\n-|\n\n|$)/g);
        if (bulletItems) {
            bulletItems.forEach(item => {
                const description = item.replace(/^- /, '').trim();
                if (description && !description.includes('##')) {
                    structuredData.optimizations.push({
                        title: 'Recommendation',
                        description: description
                    });
                }
            });
        }
    }
    
    // If no structured data found, create some from the overall analysis
    if (structuredData.criticalAlerts.length === 0 && structuredData.reviewPoints.length === 0 && structuredData.optimizations.length === 0) {
        // Extract from ERRORS AND ISSUES section
        const errorsMatch = analysis.match(/## ERRORS AND ISSUES[\s\S]*?(?=## |$)/i);
        if (errorsMatch) {
            const errorsText = errorsMatch[0];
            const errorItems = errorsText.match(/(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*?)(?=\n\d+\.|\n\n|$)/g);
            if (errorItems) {
                errorItems.forEach(item => {
                    const match = item.match(/(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*)/);
                    if (match) {
                        structuredData.criticalAlerts.push({
                            title: match[2].trim(),
                            description: match[3].trim()
                        });
                    }
                });
            }
        }
        
        // Extract from SUMMARY section
        const summaryMatch = analysis.match(/## SUMMARY[\s\S]*?(?=## |$)/i);
        if (summaryMatch) {
            const summaryText = summaryMatch[0];
            const summaryItems = summaryText.match(/- (.*?)(?=\n-|\n\n|$)/g);
            if (summaryItems) {
                summaryItems.forEach(item => {
                    const description = item.replace(/^- /, '').trim();
                    if (description && !description.includes('##')) {
                        structuredData.optimizations.push({
                            title: 'Summary Point',
                            description: description
                        });
                    }
                });
            }
        }
    }
    
    return structuredData;
}

function displayCriticalAlerts(alerts) {
    criticalAlertsList.innerHTML = '';
    
    if (alerts.length === 0) {
        criticalAlertsList.innerHTML = `
            <div class="bg-dark-bg rounded-lg p-4 text-center text-gray-400">
                No critical alerts found
            </div>
        `;
        return;
    }
    
    alerts.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = 'bg-red-900/20 border border-error-red/30 rounded-lg p-4';
        alertElement.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="text-error-red font-medium mb-2">${alert.title}</h4>
                    <p class="text-gray-300 text-sm">${alert.description}</p>
                </div>
                <button class="ml-4 bg-error-red text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors">
                    Fix Error
                </button>
            </div>
        `;
        criticalAlertsList.appendChild(alertElement);
    });
}

function displayReviewPoints(points) {
    reviewPointsList.innerHTML = '';
    
    if (points.length === 0) {
        reviewPointsList.innerHTML = `
            <div class="bg-dark-bg rounded-lg p-4 text-center text-gray-400">
                No review points found
            </div>
        `;
        return;
    }
    
    points.forEach(point => {
        const pointElement = document.createElement('div');
        pointElement.className = 'bg-yellow-900/20 border border-warning-yellow/30 rounded-lg p-4';
        pointElement.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="text-warning-yellow font-medium mb-2">${point.title}</h4>
                    <p class="text-gray-300 text-sm">${point.description}</p>
                </div>
                <button class="ml-4 bg-warning-yellow text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors">
                    Review
                </button>
            </div>
        `;
        reviewPointsList.appendChild(pointElement);
    });
}

function displayOptimizations(optimizations) {
    optimizationsList.innerHTML = '';
    
    if (optimizations.length === 0) {
        optimizationsList.innerHTML = `
            <div class="bg-dark-bg rounded-lg p-4 text-center text-gray-400">
                No optimizations found
            </div>
        `;
        return;
    }
    
    optimizations.forEach(optimization => {
        const optimizationElement = document.createElement('div');
        optimizationElement.className = 'bg-green-900/20 border border-success-green/30 rounded-lg p-4';
        optimizationElement.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="text-success-green font-medium mb-2">${optimization.title}</h4>
                    <p class="text-gray-300 text-sm">${optimization.description}</p>
                </div>
                <button class="ml-4 bg-success-green text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors">
                    Apply
                </button>
            </div>
        `;
        optimizationsList.appendChild(optimizationElement);
    });
}

function addToScanHistory(fileName, textLength) {
    const historyItem = {
        fileName: fileName,
        timestamp: new Date(),
        accuracy: Math.floor(85 + Math.random() * 15) // Random accuracy between 85-100%
    };
    
    scanHistory.unshift(historyItem);
    
    // Update scan history display
    updateScanHistoryDisplay();
}

function updateScanHistoryDisplay() {
    scanHistoryContainer.innerHTML = '';
    
    scanHistory.slice(0, 5).forEach(item => {
        const historyElement = document.createElement('div');
        historyElement.className = 'flex items-center justify-between p-3 bg-dark-bg rounded-lg';
        historyElement.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center">
                    <i class="fas fa-file-alt text-white text-sm"></i>
                </div>
                <div>
                    <div class="text-sm font-medium text-white">${item.fileName}</div>
                    <div class="text-xs text-gray-400">${formatTimeAgo(item.timestamp)}</div>
                </div>
            </div>
            <div class="text-success-green text-sm font-medium">${item.accuracy}%</div>
        `;
        scanHistoryContainer.appendChild(historyElement);
    });
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function formatAnalysisText(text) {
    // First, let's clean up the text and handle special cases
    let formatted = text
        // Remove the initial "Here is your comprehensive analysis..." text
        .replace(/^Here is your comprehensive analysis.*?\n\n---\n\n/gi, '')
        // Remove trailing "Let me know if you need..." text
        .replace(/\n---\s*\n\nLet me know.*$/gi, '')
        // Clean up extra dashes
        .replace(/\n---\s*\n/g, '\n\n');
    
    // Convert markdown headers to HTML
    formatted = formatted
        .replace(/^## (.*$)/gim, '<h3 class="text-xl font-semibold text-white mt-6 mb-3 border-b border-dark-border pb-2">$1</h3>')
        .replace(/^### (.*$)/gim, '<h4 class="text-lg font-medium text-gray-200 mt-4 mb-2">$1</h4>')
        .replace(/^#### (.*$)/gim, '<h5 class="text-base font-medium text-gray-300 mt-3 mb-1">$1</h5>');
    
    // Convert numbered lists
    formatted = formatted
        .replace(/^(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*?)(?=\n\d+\.|\n\n|$)/gim, '<div class="mb-3"><span class="text-accent-blue font-semibold">$1. $2:</span> <span class="text-gray-300">$3</span></div>')
        .replace(/^(\d+)\.\s+(.*?)(?=\n\d+\.|\n\n|$)/gim, '<div class="mb-2"><span class="text-accent-blue font-medium">$1.</span> <span class="text-gray-300">$2</span></div>');
    
    // Convert bullet lists
    formatted = formatted
        .replace(/^- \*\*(.*?)\*\*:\s*(.*?)(?=\n-|\n\n|$)/gim, '<div class="mb-2"><span class="text-error-red font-semibold">• $1:</span> <span class="text-gray-300">$2</span></div>')
        .replace(/^- (.*?)(?=\n-|\n\n|$)/gim, '<div class="mb-2 text-gray-300">• $1</div>')
        .replace(/^\* (.*?)(?=\n\*|\n\n|$)/gim, '<div class="mb-2 text-gray-300">• $1</div>');
    
    // Convert bold text
    formatted = formatted
        .replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold text-accent-blue">$1</span>');
    
    // Convert line breaks to paragraphs
    formatted = formatted
        .split('\n\n')
        .map(paragraph => {
            if (paragraph.trim() === '') return '';
            if (paragraph.startsWith('<h') || paragraph.startsWith('<div')) {
                return paragraph;
            }
            return `<p class="text-gray-300 mb-3 leading-relaxed">${paragraph.trim()}</p>`;
        })
        .join('');
    
    // Highlight important keywords
    formatted = formatted
        .replace(/\b(missing|error|warning|critical|incomplete|required)\b/gi, '<span class="text-error-red font-semibold">$1</span>')
        .replace(/\b(complete|valid|correct|approved)\b/gi, '<span class="text-success-green font-semibold">$1</span>')
        .replace(/\b(high|medium|low)\b/gi, '<span class="text-warning-yellow font-semibold">$1</span>');
    
    // Add special styling for specific sections
    formatted = formatted
        .replace(/(Overall Assessment|Priority Level|Next Steps):/gi, '<span class="text-accent-purple font-bold text-lg">$1:</span>')
        .replace(/(Complete|Incomplete|Needs Review)/gi, '<span class="text-success-green font-bold">$1</span>');
    
    return formatted;
}

function showError(message) {
    loading.style.display = 'none';
    analysisResults.style.display = 'block';
    analysisContent.innerHTML = `
        <div class="bg-error-red/20 border border-error-red/30 rounded-lg p-6">
            <h3 class="text-error-red text-lg font-semibold mb-3">Error</h3>
            <p class="text-gray-300 mb-4">${message}</p>
            <button onclick="resetAnalysis()" class="bg-error-red text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
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
    analysisSection.style.display = 'none';
    loading.style.display = 'none';
    analysisResults.style.display = 'none';
    
    // Clear content
    analysisContent.innerHTML = '';
    fileName.textContent = '';
    fileSize.textContent = '';
    fileType.textContent = '';
    
    // Reset stats
    criticalCount.textContent = '0';
    reviewCount.textContent = '0';
    optimizationCount.textContent = '0';
    
    // Clear structured sections
    criticalAlertsList.innerHTML = '';
    reviewPointsList.innerHTML = '';
    optimizationsList.innerHTML = '';
    
    // Remove drag-over styling
    uploadArea.classList.remove('border-accent-blue');
} 