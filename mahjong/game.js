class MahjongGame {
    constructor() {
        this.numPlayers = parseInt(localStorage.getItem('mahjongPlayers')) || 4;
        this.currentPlayer = 0;
        this.players = [];
        this.discardedTiles = [];
        this.deadWall = [];
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        // Initialize players
        for (let i = 0; i < this.numPlayers; i++) {
            this.players.push({
                hand: [],
                discarded: [],
                melds: [],
                concealedKongs: [],
                manualOrder: [],
                sortMode: 'manual'
            });
        }

        // Initialize tiles
        this.initializeTiles();
        
        // Deal initial hands
        this.dealInitialHands();
        
        // Update UI
        this.updateUI();
    }

    initializeTiles() {
        // Create all tiles
        const suits = ['筒', '条', '万'];
        const tiles = [];
        
        // Add number tiles (1-9)
        for (let suit of suits) {
            for (let i = 1; i <= 9; i++) {
                for (let j = 0; j < 4; j++) {
                    tiles.push(`${i}${suit}`);
                }
            }
        }

        // Shuffle tiles
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }

        // Set up dead wall (last 14 tiles)
        this.deadWall = tiles.splice(-14);
        
        // Distribute remaining tiles
        this.remainingTiles = tiles;
    }

    dealInitialHands() {
        // Deal 13 tiles to each player
        for (let i = 0; i < 13; i++) {
            for (let player of this.players) {
                const tile = this.remainingTiles.pop();
                player.hand.push(tile);
                player.manualOrder.push(tile);
            }
        }
    }

    setupEventListeners() {
        // Draw tile button
        const drawButton = document.getElementById('draw-tile');
        if (drawButton) {
            drawButton.addEventListener('click', () => this.drawTile());
        }

        // Player hand click events
        document.querySelectorAll('.player-area').forEach((area, index) => {
            const hand = area.querySelector('.hand');
            if (hand) {
                hand.addEventListener('click', (e) => {
                    const tile = e.target.closest('.tile');
                    if (tile && index === this.currentPlayer) {
                        const tileIndex = Array.from(hand.children).indexOf(tile);
                        this.discardTile(index, tileIndex);
                    }
                });
            }
        });

        // Discarded tiles click events
        document.querySelectorAll('.discarded').forEach((area, index) => {
            area.addEventListener('click', (e) => {
                const tile = e.target.closest('.tile');
                if (tile && index === this.currentPlayer) {
                    this.undoDiscard(index);
                }
            });
        });
    }

    drawTile() {
        if (this.remainingTiles.length === 0) {
            this.showNotification("No more tiles!");
            return;
        }

        const player = this.players[this.currentPlayer];
        const tile = this.remainingTiles.pop();
        
        player.hand.push(tile);
        player.manualOrder.push(tile);
        
        this.showNotification(`Player ${this.currentPlayer + 1} drew a tile`);
        this.updateUI();
    }

    discardTile(playerIndex, tileIndex) {
        if (playerIndex !== this.currentPlayer) {
            this.showNotification("It's not your turn!");
            return;
        }

        const player = this.players[playerIndex];
        if (player.hand.length === 0) {
            this.showNotification("You need to draw a tile first!");
            return;
        }

        const tile = player.hand[tileIndex];
        if (!tile) return;

        // Remove from both hand and manual order
        player.hand.splice(tileIndex, 1);
        const manualIndex = player.manualOrder.indexOf(tile);
        if (manualIndex !== -1) {
            player.manualOrder.splice(manualIndex, 1);
        }

        player.discarded.push(tile);
        this.showNotification(`Player ${playerIndex + 1} discarded ${tile}`);
        this.updateUI();
    }

    undoDiscard(playerIndex) {
        if (playerIndex !== this.currentPlayer) {
            this.showNotification("It's not your turn!");
            return;
        }

        const player = this.players[playerIndex];
        if (player.discarded.length === 0) {
            this.showNotification("No tiles to undo!");
            return;
        }

        const tile = player.discarded.pop();
        player.hand.push(tile);
        player.manualOrder.push(tile);
        
        this.showNotification(`Player ${playerIndex + 1} undid discard`);
        this.updateUI();
    }

    updateUI() {
        // Update current player display
        const currentPlayerDisplay = document.getElementById('current-player');
        if (currentPlayerDisplay) {
            currentPlayerDisplay.textContent = `Player ${this.currentPlayer + 1}`;
        }

        // Update remaining tiles display
        const remainingTilesDisplay = document.getElementById('remaining-tiles');
        if (remainingTilesDisplay) {
            remainingTilesDisplay.textContent = this.remainingTiles.length;
        }

        // Update player areas
        document.querySelectorAll('.player-area').forEach((area, index) => {
            if (index >= this.numPlayers) return;

            const player = this.players[index];
            const hand = area.querySelector('.hand');
            const discarded = area.querySelector('.discarded');
            const melds = area.querySelector('.melds');

            // Update hand
            if (hand) {
                hand.innerHTML = '';
                const tilesToShow = index === this.currentPlayer ? player.manualOrder : player.hand;
                tilesToShow.forEach(tile => {
                    const tileElement = document.createElement('div');
                    tileElement.className = 'tile';
                    tileElement.innerHTML = `<div class="tile-content">${tile}</div>`;
                    hand.appendChild(tileElement);
                });
            }

            // Update discarded tiles
            if (discarded) {
                discarded.innerHTML = '';
                player.discarded.forEach(tile => {
                    const tileElement = document.createElement('div');
                    tileElement.className = 'tile';
                    tileElement.innerHTML = `<div class="tile-content">${tile}</div>`;
                    discarded.appendChild(tileElement);
                });
            }

            // Update melds
            if (melds) {
                melds.innerHTML = '';
                player.melds.forEach(meld => {
                    const meldElement = document.createElement('div');
                    meldElement.className = 'meld';
                    meld.forEach(tile => {
                        const tileElement = document.createElement('div');
                        tileElement.className = 'tile';
                        tileElement.innerHTML = `<div class="tile-content">${tile}</div>`;
                        meldElement.appendChild(tileElement);
                    });
                    melds.appendChild(meldElement);
                });
            }

            // Update active state
            area.classList.toggle('active', index === this.currentPlayer);
        });

        // Update draw button state
        const drawButton = document.getElementById('draw-tile');
        if (drawButton) {
            drawButton.disabled = this.remainingTiles.length === 0;
            drawButton.classList.toggle('draw-available', this.remainingTiles.length > 0);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove notification after animation
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MahjongGame();
}); 