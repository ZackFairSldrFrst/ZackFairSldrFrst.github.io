class MahjongGame {
    constructor() {
        this.tiles = [];
        this.players = [];
        this.currentPlayer = 0;
        this.activeView = 0;
        this.numPlayers = parseInt(localStorage.getItem('mahjongPlayers')) || 2;
        
        // Initialize players
        for (let i = 0; i < this.numPlayers; i++) {
            this.players.push({
                hand: [],
                discarded: []
            });
        }

        this.initializeTiles();
        this.setupEventListeners();
        this.updateUI();
        this.updateView();
    }

    initializeTiles() {
        // Create all traditional mahjong tiles
        const suits = {
            dots: '筒',    // Circles/Dots
            bamboo: '索',  // Bamboo
            characters: '萬', // Characters
            winds: ['東', '南', '西', '北'], // East, South, West, North
            dragons: ['中', '發', '白'] // Red Dragon, Green Dragon, White Dragon
        };
        
        // Create number tiles (1-9) for dots, bamboo, and characters
        for (let suit of [suits.dots, suits.bamboo, suits.characters]) {
            for (let number = 1; number <= 9; number++) {
                for (let i = 0; i < 4; i++) {
                    this.tiles.push({ 
                        type: 'number',
                        suit, 
                        number,
                        display: `${number}${suit}`
                    });
                }
            }
        }

        // Create wind tiles
        for (let wind of suits.winds) {
            for (let i = 0; i < 4; i++) {
                this.tiles.push({
                    type: 'wind',
                    suit: '風',
                    value: wind,
                    display: wind
                });
            }
        }

        // Create dragon tiles
        for (let dragon of suits.dragons) {
            for (let i = 0; i < 4; i++) {
                this.tiles.push({
                    type: 'dragon',
                    suit: '龍',
                    value: dragon,
                    display: dragon
                });
            }
        }

        // Shuffle the tiles
        this.shuffleTiles();
        
        // Deal initial hands (13 tiles each)
        for (let i = 0; i < 13; i++) {
            for (let player of this.players) {
                player.hand.push(this.tiles.pop());
            }
        }
    }

    shuffleTiles() {
        for (let i = this.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
        }
    }

    setupEventListeners() {
        document.getElementById('draw-tile').addEventListener('click', () => this.drawTile());
        document.getElementById('pass-device').addEventListener('click', () => this.passDevice());
        
        // Add click handlers for player hands
        for (let i = 0; i < this.numPlayers; i++) {
            document.querySelector(`.player${i + 1} .hand`).addEventListener('click', (e) => {
                if (this.currentPlayer === i && e.target.classList.contains('tile')) {
                    this.discardTile(e.target.dataset.index, i);
                }
            });
        }
    }

    passDevice() {
        this.activeView = (this.activeView + 1) % this.numPlayers;
        this.updateView();
        this.showNotification(`Device passed to Player ${this.activeView + 1}`);
    }

    updateView() {
        const drawButton = document.getElementById('draw-tile');
        const passButton = document.getElementById('pass-device');

        // Update visibility of player areas
        for (let i = 0; i < this.numPlayers; i++) {
            const playerArea = document.querySelector(`.player${i + 1}`);
            if (i === this.activeView) {
                playerArea.classList.remove('hidden');
            } else {
                playerArea.classList.add('hidden');
            }
        }

        // Update button states
        drawButton.disabled = this.currentPlayer !== this.activeView;
        passButton.textContent = `Pass Device to Player ${((this.activeView + 1) % this.numPlayers) + 1}`;
    }

    drawTile() {
        if (this.tiles.length === 0) {
            this.showNotification('No more tiles!');
            return;
        }

        if (this.currentPlayer !== this.activeView) {
            this.showNotification('Not your turn!');
            return;
        }

        const drawnTile = this.tiles.pop();
        this.players[this.currentPlayer].hand.push(drawnTile);
        
        this.updateUI();
        this.animateDrawTile();
    }

    discardTile(index, player) {
        if (player !== this.activeView) {
            this.showNotification('Not your turn!');
            return;
        }

        const hand = this.players[player].hand;
        const discardedTile = hand.splice(index, 1)[0];
        
        // Add to discarded area with animation
        const discardedArea = document.querySelector(`.player${player + 1} .discarded`);
        const tileElement = this.createTileElement(discardedTile);
        tileElement.classList.add('tile-discard');
        discardedArea.appendChild(tileElement);

        // Remove animation class after animation completes
        setTimeout(() => {
            tileElement.classList.remove('tile-discard');
        }, 500);

        // Switch turns
        this.currentPlayer = (this.currentPlayer + 1) % this.numPlayers;
        this.updateUI();
        this.showNotification(`Turn passed to Player ${this.currentPlayer + 1}`);
    }

    createTileElement(tile) {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        
        // Add specific class based on tile type
        if (tile.type === 'wind') {
            tileElement.classList.add('wind-tile');
        } else if (tile.type === 'dragon') {
            tileElement.classList.add('dragon-tile');
        } else {
            tileElement.classList.add('number-tile');
        }

        // Create the tile content
        const tileContent = document.createElement('div');
        tileContent.className = 'tile-content';
        
        if (tile.type === 'number') {
            tileContent.innerHTML = `
                <div class="tile-number">${tile.number}</div>
                <div class="tile-suit">${tile.suit}</div>
            `;
            tileElement.dataset.suit = tile.suit;
        } else {
            tileContent.innerHTML = `
                <div class="tile-symbol">${tile.display}</div>
            `;
        }
        
        tileElement.appendChild(tileContent);
        return tileElement;
    }

    updateUI() {
        // Update remaining tiles count with animation
        const remainingTilesElement = document.getElementById('remaining-tiles');
        remainingTilesElement.style.transform = 'scale(1.2)';
        remainingTilesElement.textContent = this.tiles.length;
        setTimeout(() => {
            remainingTilesElement.style.transform = 'scale(1)';
        }, 200);
        
        // Update current player display
        const currentPlayerElement = document.getElementById('current-player');
        currentPlayerElement.textContent = `Player ${this.currentPlayer + 1}`;
        
        // Update all player hands
        for (let i = 0; i < this.numPlayers; i++) {
            const playerHand = document.querySelector(`.player${i + 1} .hand`);
            playerHand.innerHTML = '';
            
            this.players[i].hand.forEach((tile, index) => {
                const tileElement = this.createTileElement(tile);
                tileElement.dataset.index = index;
                playerHand.appendChild(tileElement);
            });
        }
    }

    animateDrawTile() {
        const hand = document.querySelector(`.player${this.currentPlayer + 1} .hand`);
        const lastTile = hand.lastElementChild;
        if (lastTile) {
            lastTile.classList.add('tile-draw');
            setTimeout(() => {
                lastTile.classList.remove('tile-draw');
            }, 500);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remove notification after animation
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-size: 1.1rem;
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
    }

    .notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Start the game when the page loads
window.addEventListener('load', () => {
    // Check if we're coming from the start screen
    if (!localStorage.getItem('mahjongPlayers')) {
        window.location.href = 'start.html';
    } else {
        new MahjongGame();
    }
}); 