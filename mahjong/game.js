class MahjongGame {
    constructor() {
        this.tiles = [];
        this.player1Hand = [];
        this.player2Hand = [];
        this.currentPlayer = 1;
        this.initializeTiles();
        this.setupEventListeners();
        this.updateUI();
    }

    initializeTiles() {
        // Create a standard set of mahjong tiles (simplified version)
        const suits = ['萬', '筒', '索'];
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        
        // Create 4 copies of each tile
        for (let suit of suits) {
            for (let number of numbers) {
                for (let i = 0; i < 4; i++) {
                    this.tiles.push({ suit, number });
                }
            }
        }

        // Shuffle the tiles
        this.shuffleTiles();
        
        // Deal initial hands (13 tiles each)
        for (let i = 0; i < 13; i++) {
            this.player1Hand.push(this.tiles.pop());
            this.player2Hand.push(this.tiles.pop());
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
        
        // Add click handlers for player hands
        document.querySelector('.player1 .hand').addEventListener('click', (e) => {
            if (this.currentPlayer === 1 && e.target.classList.contains('tile')) {
                this.discardTile(e.target.dataset.index, 1);
            }
        });

        document.querySelector('.player2 .hand').addEventListener('click', (e) => {
            if (this.currentPlayer === 2 && e.target.classList.contains('tile')) {
                this.discardTile(e.target.dataset.index, 2);
            }
        });
    }

    drawTile() {
        if (this.tiles.length === 0) {
            alert('No more tiles!');
            return;
        }

        const drawnTile = this.tiles.pop();
        if (this.currentPlayer === 1) {
            this.player1Hand.push(drawnTile);
        } else {
            this.player2Hand.push(drawnTile);
        }
        
        this.updateUI();
    }

    discardTile(index, player) {
        const hand = player === 1 ? this.player1Hand : this.player2Hand;
        const discardedTile = hand.splice(index, 1)[0];
        
        // Add to discarded area
        const discardedArea = document.querySelector(`.player${player} .discarded`);
        const tileElement = this.createTileElement(discardedTile);
        discardedArea.appendChild(tileElement);

        // Switch turns
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.updateUI();
    }

    createTileElement(tile) {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        tileElement.textContent = `${tile.number}${tile.suit}`;
        return tileElement;
    }

    updateUI() {
        // Update remaining tiles count
        document.getElementById('remaining-tiles').textContent = this.tiles.length;
        
        // Update current player display
        document.getElementById('current-player').textContent = `Player ${this.currentPlayer}`;
        
        // Update player hands
        const player1Hand = document.querySelector('.player1 .hand');
        const player2Hand = document.querySelector('.player2 .hand');
        
        player1Hand.innerHTML = '';
        player2Hand.innerHTML = '';
        
        this.player1Hand.forEach((tile, index) => {
            const tileElement = this.createTileElement(tile);
            tileElement.dataset.index = index;
            player1Hand.appendChild(tileElement);
        });
        
        this.player2Hand.forEach((tile, index) => {
            const tileElement = this.createTileElement(tile);
            tileElement.dataset.index = index;
            player2Hand.appendChild(tileElement);
        });
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new MahjongGame();
}); 