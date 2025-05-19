class Tutorial {
    constructor() {
        this.currentStep = 0;
        this.steps = [
            {
                title: "Welcome to Mahjong!",
                content: "Let's learn how to play Hong Kong Mahjong. Click 'Next' to begin.",
                highlight: null
            },
            {
                title: "Game Objective",
                content: "Your goal is to create a winning hand by collecting 4 sets of three tiles (called 'melds') and a pair. Each set can be either a Pung (three of a kind), Kong (four of a kind), or Chow (three consecutive numbers in the same suit).",
                highlight: null
            },
            {
                title: "Basic Gameplay",
                content: "1. Each player starts with 13 tiles\n2. On your turn, you draw a tile and discard one\n3. You can claim other players' discarded tiles to form melds\n4. The first player to complete a valid hand wins!",
                highlight: null
            },
            {
                title: "Types of Melds",
                content: "There are three types of melds you can form:\n\n1. Pung: Three identical tiles\n2. Kong: Four identical tiles\n3. Chow: Three consecutive numbers in the same suit",
                highlight: '.meld-examples'
            },
            {
                title: "Claiming Discarded Tiles",
                content: "When another player discards a tile, you can claim it if:\n\n1. You can form a Pung or Kong (any player can claim)\n2. You can form a Chow (only if the tile was discarded by the player to your left)\n3. You can complete a winning hand (any player can claim)",
                highlight: '.discarded'
            },
            {
                title: "Claim Priority",
                content: "If multiple players can claim the same tile, the priority is:\n\n1. Win (highest priority)\n2. Pung/Kong\n3. Chow (lowest priority)",
                highlight: '.claim-priority'
            },
            {
                title: "Special Rules",
                content: "1. When forming a Kong, you draw a replacement tile from the Dead Wall\n2. If East (the dealer) wins, they stay as East\n3. Otherwise, the dealer position moves counterclockwise",
                highlight: '.special-rules'
            },
            {
                title: "Ready to Play!",
                content: "You now know the basics of Mahjong! Click 'Start Game' to begin playing.",
                highlight: null
            }
        ];
        
        this.setupTutorial();
    }

    setupTutorial() {
        // Create tutorial overlay
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.innerHTML = `
            <div class="tutorial-container">
                <div class="tutorial-content">
                    <h2 class="tutorial-title"></h2>
                    <p class="tutorial-text"></p>
                </div>
                <div class="tutorial-controls">
                    <button class="tutorial-button prev">Previous</button>
                    <button class="tutorial-button next">Next</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Add tutorial styles
        const style = document.createElement('style');
        style.textContent = `
            .tutorial-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .tutorial-container {
                background: white;
                padding: 2rem;
                border-radius: 10px;
                max-width: 600px;
                width: 90%;
                position: relative;
            }

            .tutorial-content {
                margin-bottom: 2rem;
            }

            .tutorial-title {
                color: #2c3e50;
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }

            .tutorial-text {
                color: #34495e;
                line-height: 1.6;
                white-space: pre-line;
            }

            .tutorial-controls {
                display: flex;
                justify-content: space-between;
            }

            .tutorial-button {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 5px;
                background: #3498db;
                color: white;
                cursor: pointer;
                transition: background 0.3s ease;
            }

            .tutorial-button:hover {
                background: #2980b9;
            }

            .tutorial-button:disabled {
                background: #bdc3c7;
                cursor: not-allowed;
            }

            .highlight {
                position: relative;
                z-index: 1001;
            }

            .highlight::after {
                content: '';
                position: absolute;
                top: -5px;
                left: -5px;
                right: -5px;
                bottom: -5px;
                border: 2px solid #e74c3c;
                border-radius: 5px;
                animation: pulse 1.5s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        // Add event listeners
        const prevButton = overlay.querySelector('.prev');
        const nextButton = overlay.querySelector('.next');

        prevButton.addEventListener('click', () => this.previousStep());
        nextButton.addEventListener('click', () => this.nextStep());

        // Show first step
        this.showStep(0);
    }

    showStep(stepIndex) {
        const step = this.steps[stepIndex];
        const overlay = document.querySelector('.tutorial-overlay');
        const title = overlay.querySelector('.tutorial-title');
        const text = overlay.querySelector('.tutorial-text');
        const prevButton = overlay.querySelector('.prev');
        const nextButton = overlay.querySelector('.next');

        // Update content
        title.textContent = step.title;
        text.textContent = step.content;

        // Update button states
        prevButton.disabled = stepIndex === 0;
        nextButton.textContent = stepIndex === this.steps.length - 1 ? 'Start Game' : 'Next';

        // Remove previous highlight
        const previousHighlight = document.querySelector('.highlight');
        if (previousHighlight) {
            previousHighlight.classList.remove('highlight');
        }

        // Add new highlight if specified
        if (step.highlight) {
            const element = document.querySelector(step.highlight);
            if (element) {
                element.classList.add('highlight');
            }
        }

        this.currentStep = stepIndex;
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.endTutorial();
        }
    }

    endTutorial() {
        const overlay = document.querySelector('.tutorial-overlay');
        overlay.remove();
        
        // Start the game
        new MahjongGame();
    }
}

// Add tutorial button to start screen
document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.querySelector('.start-screen');
    if (startScreen) {
        const tutorialButton = document.createElement('button');
        tutorialButton.className = 'start-button tutorial-button';
        tutorialButton.textContent = 'How to Play';
        tutorialButton.addEventListener('click', () => {
            new Tutorial();
        });
        startScreen.appendChild(tutorialButton);
    }
}); 