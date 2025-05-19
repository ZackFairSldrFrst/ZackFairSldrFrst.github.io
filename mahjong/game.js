class MahjongGame {
    constructor() {
        this.tiles = [];
        this.players = [];
        this.currentPlayer = 0;
        this.activeView = 0;
        this.numPlayers = parseInt(localStorage.getItem('mahjongPlayers')) || 2;
        this.lastDiscardedTile = null; // Track the last discarded tile
        this.lastDiscardedBy = null; // Track who discarded the last tile
        this.sortMode = 'none'; // none, number, suit, type
        this.draggedTile = null;
        this.dragStartIndex = null;
        
        // Initialize players
        for (let i = 0; i < this.numPlayers; i++) {
            this.players.push({
                hand: [],
                discarded: [],
                melds: [] // Track completed melds
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

        // Add click handlers for discarded tiles
        for (let i = 0; i < this.numPlayers; i++) {
            document.querySelector(`.player${i + 1} .discarded`).addEventListener('click', (e) => {
                if (e.target.classList.contains('tile') && this.lastDiscardedTile) {
                    this.tryPickupDiscardedTile(i);
                }
            });
        }

        // Add sort buttons
        const sortControls = document.createElement('div');
        sortControls.className = 'sort-controls';
        sortControls.innerHTML = `
            <button class="control-button sort-button" data-sort="number">Sort by Number</button>
            <button class="control-button sort-button" data-sort="suit">Sort by Suit</button>
            <button class="control-button sort-button" data-sort="type">Sort by Type</button>
        `;
        document.querySelector('.game-controls').appendChild(sortControls);

        // Add sort button event listeners
        document.querySelectorAll('.sort-button').forEach(button => {
            button.addEventListener('click', () => {
                const sortType = button.dataset.sort;
                this.sortHand(sortType);
            });
        });

        // Setup drag and drop for tiles
        for (let i = 0; i < this.numPlayers; i++) {
            const hand = document.querySelector(`.player${i + 1} .hand`);
            
            hand.addEventListener('dragstart', (e) => {
                if (e.target.classList.contains('tile')) {
                    this.draggedTile = e.target;
                    this.dragStartIndex = Array.from(hand.children).indexOf(e.target);
                    e.target.classList.add('dragging');
                }
            });

            hand.addEventListener('dragend', (e) => {
                if (e.target.classList.contains('tile')) {
                    e.target.classList.remove('dragging');
                    this.draggedTile = null;
                    this.dragStartIndex = null;
                }
            });

            hand.addEventListener('dragover', (e) => {
                e.preventDefault();
                const tile = e.target.closest('.tile');
                if (tile && tile !== this.draggedTile) {
                    const rect = tile.getBoundingClientRect();
                    const midPoint = rect.left + rect.width / 2;
                    if (e.clientX < midPoint) {
                        tile.parentNode.insertBefore(this.draggedTile, tile);
                    } else {
                        tile.parentNode.insertBefore(this.draggedTile, tile.nextSibling);
                    }
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

    tryPickupDiscardedTile(playerIndex) {
        if (!this.lastDiscardedTile) {
            this.showNotification('No tile to pick up!');
            return;
        }

        if (playerIndex === this.lastDiscardedBy) {
            this.showNotification('You cannot pick up your own discarded tile!');
            return;
        }

        if (playerIndex !== this.currentPlayer) {
            this.showNotification('Not your turn!');
            return;
        }

        // Check if the tile can form a valid meld or sequence
        const hand = this.players[playerIndex].hand;
        const tile = this.lastDiscardedTile;

        // Check for potential melds (3 or 4 of a kind)
        const sameTiles = hand.filter(t => 
            t.type === tile.type && 
            t.suit === tile.suit && 
            (t.type === 'number' ? t.number === tile.number : t.value === tile.value)
        );

        // Check for potential sequences (only for number tiles)
        let canFormSequence = false;
        if (tile.type === 'number') {
            const sameSuitTiles = hand.filter(t => t.type === 'number' && t.suit === tile.suit);
            const numbers = sameSuitTiles.map(t => t.number);
            numbers.push(tile.number);
            
            // Check for consecutive numbers
            for (let i = 1; i <= 7; i++) {
                if (numbers.includes(i) && numbers.includes(i + 1) && numbers.includes(i + 2)) {
                    canFormSequence = true;
                    break;
                }
            }
        }

        if (sameTiles.length >= 2 || canFormSequence) {
            // Add the tile to player's hand
            hand.push(tile);
            
            // Remove the tile from the discarded area
            const discardedArea = document.querySelector(`.player${this.lastDiscardedBy + 1} .discarded`);
            const lastDiscardedElement = discardedArea.lastElementChild;
            if (lastDiscardedElement) {
                lastDiscardedElement.remove();
            }

            // Clear the last discarded tile
            this.lastDiscardedTile = null;
            this.lastDiscardedBy = null;

            this.updateUI();
            this.showNotification('Tile picked up successfully!');
        } else {
            this.showNotification('Cannot form a valid meld or sequence with this tile!');
        }
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

        // Store the last discarded tile information
        this.lastDiscardedTile = discardedTile;
        this.lastDiscardedBy = player;

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
        tileElement.draggable = true;
        
        // Add specific class based on tile type
        if (tile.type === 'wind') {
            tileElement.classList.add('wind-tile');
            tileElement.dataset.value = tile.value;
        } else if (tile.type === 'dragon') {
            tileElement.classList.add('dragon-tile');
            tileElement.dataset.value = tile.value;
        } else {
            tileElement.classList.add('number-tile');
            tileElement.dataset.suit = tile.suit;
        }

        // Create the tile content
        const tileContent = document.createElement('div');
        tileContent.className = 'tile-content';
        
        if (tile.type === 'number') {
            tileContent.innerHTML = `
                <div class="tile-number">${tile.number}</div>
                <div class="tile-suit">${tile.suit}</div>
            `;
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

    sortHand(sortType) {
        if (this.currentPlayer !== this.activeView) {
            this.showNotification('Not your turn!');
            return;
        }

        const hand = this.players[this.currentPlayer].hand;
        
        switch (sortType) {
            case 'number':
                hand.sort((a, b) => {
                    if (a.type === 'number' && b.type === 'number') {
                        return a.number - b.number;
                    }
                    return 0;
                });
                break;
            
            case 'suit':
                hand.sort((a, b) => {
                    if (a.suit === b.suit) {
                        if (a.type === 'number' && b.type === 'number') {
                            return a.number - b.number;
                        }
                        return 0;
                    }
                    return a.suit.localeCompare(b.suit);
                });
                break;
            
            case 'type':
                hand.sort((a, b) => {
                    if (a.type === b.type) {
                        if (a.type === 'number') {
                            return a.number - b.number;
                        }
                        return a.value.localeCompare(b.value);
                    }
                    const typeOrder = { 'number': 0, 'wind': 1, 'dragon': 2 };
                    return typeOrder[a.type] - typeOrder[b.type];
                });
                break;
        }

        this.updateUI();
        this.showNotification(`Hand sorted by ${sortType}`);
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