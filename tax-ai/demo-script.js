// Demo page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeDemoNavigation();
    initializeMarketingTabs();
    addInteractiveElements();
});

// Demo section navigation
function initializeDemoNavigation() {
    const demoNavBtns = document.querySelectorAll('.demo-nav-btn');
    const demoSections = document.querySelectorAll('.demo-section');
    
    demoNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetDemo = btn.getAttribute('data-demo');
            
            // Update active button
            demoNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show target section
            demoSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetDemo}-demo`) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Marketing suite tabs
function initializeMarketingTabs() {
    const marketingTabs = document.querySelectorAll('.marketing-tab');
    const marketingPanels = document.querySelectorAll('.marketing-panel');
    
    marketingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.getAttribute('data-tab');
            
            // Update active tab
            marketingTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show target panel
            marketingPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `${targetPanel}-panel`) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

// Add interactive elements
function addInteractiveElements() {
    // Simulate upload functionality
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            uploadBtn.textContent = 'Uploading...';
            setTimeout(() => {
                uploadBtn.textContent = 'Processing...';
                setTimeout(() => {
                    uploadBtn.textContent = 'Analysis Complete';
                    uploadBtn.style.background = '#10b981';
                }, 2000);
            }, 1000);
        });
    }

    // Generate content buttons
    const generateBtns = document.querySelectorAll('.generate-btn, .generate-content-btn, .create-ad-btn');
    generateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const originalText = btn.textContent;
            btn.textContent = 'Generating...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        });
    });

    // Interactive time slots
    const timeSlots = document.querySelectorAll('.time-slot.available');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
        });
    });

    // Professional cards - connect buttons
    const connectBtns = document.querySelectorAll('.professional-actions .btn-primary');
    connectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const originalText = btn.textContent;
            btn.textContent = 'Connecting...';
            setTimeout(() => {
                btn.textContent = 'Connected';
                btn.style.background = '#10b981';
            }, 1500);
        });
    });

    // Logo selection
    const logoOptions = document.querySelectorAll('.logo-option');
    logoOptions.forEach(option => {
        option.addEventListener('click', () => {
            logoOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
        });
    });

    // Sidebar navigation hover effects
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                item.style.background = 'rgba(0, 217, 255, 0.05)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                item.style.background = 'transparent';
            }
        });
    });

    // Add typing animation to chat input
    const chatInput = document.querySelector('.chat-input-demo input');
    if (chatInput) {
        chatInput.addEventListener('focus', () => {
            simulateTyping();
        });
    }
}

// Simulate typing in chat input
function simulateTyping() {
    const chatInput = document.querySelector('.chat-input-demo input');
    const messages = [
        "What are the new tax changes for 2024?",
        "How do I calculate Section 199A deduction?",
        "Explain the TCJA sunset provisions"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    let i = 0;
    
    chatInput.value = '';
    const typing = setInterval(() => {
        if (i < randomMessage.length) {
            chatInput.value += randomMessage.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, 100);
}

// Add smooth scrolling for demo navigation
function smoothScrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe demo sections
    document.querySelectorAll('.demo-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Initialize scroll animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addScrollAnimations, 500);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const activeTabIndex = Array.from(document.querySelectorAll('.demo-nav-btn')).findIndex(btn => btn.classList.contains('active'));
    const totalTabs = document.querySelectorAll('.demo-nav-btn').length;
    
    if (e.key === 'ArrowRight' && activeTabIndex < totalTabs - 1) {
        document.querySelectorAll('.demo-nav-btn')[activeTabIndex + 1].click();
    } else if (e.key === 'ArrowLeft' && activeTabIndex > 0) {
        document.querySelectorAll('.demo-nav-btn')[activeTabIndex - 1].click();
    }
});

// Add calendar date selection
document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.header)');
    calendarDays.forEach(day => {
        day.addEventListener('click', () => {
            calendarDays.forEach(d => d.classList.remove('selected'));
            day.classList.add('selected');
            
            // Update time slots for selected date
            const timeSlotsLabel = document.querySelector('.time-slots label');
            if (timeSlotsLabel) {
                timeSlotsLabel.textContent = `Available Times - March ${day.textContent}`;
            }
        });
    });
});

// Add hover effects for feature cards
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.stat-card, .summary-card, .professional-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 20px 40px rgba(0, 217, 255, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
    });
});

// Add progress animation for stats
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number, .summary-number');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.textContent = finalValue;
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(currentValue);
            }
        }, 30);
    });
}

// Trigger stats animation when overview demo is shown
document.addEventListener('DOMContentLoaded', () => {
    const overviewBtn = document.querySelector('[data-demo="overview"]');
    if (overviewBtn) {
        overviewBtn.addEventListener('click', () => {
            setTimeout(animateStats, 500);
        });
    }
    
    // Also trigger on initial load
    setTimeout(animateStats, 1000);
}); 