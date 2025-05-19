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
        this.currentSortMode = 'none'; // Track current sort mode
        this.draggedTile = null;
        this.dragStartIndex = null;
        this.gameState = 'playing'; // playing, ended
        this.winningPatterns = {
            // Basic patterns
            PUNG: 'pung', // Three of a kind
            KONG: 'kong', // Four of a kind
            CHOW: 'chow', // Three consecutive numbers in the same suit
            PAIR: 'pair', // Two of a kind
            // Special hands
            PURE_HAND: 'pure_hand', // All tiles from the same suit
            MIXED_TRIPLE_CHOW: 'mixed_triple_chow', // Three identical chows in different suits
            MIXED_SHIFTED_PUNGS: 'mixed_shifted_pungs', // Three pungs with numbers shifted by 1
            ALL_PUNGS: 'all_pungs', // All sets are pungs
            HALF_FLUSH: 'half_flush', // Hand with tiles from only two suits
            MIXED_SHIFTED_CHOWS: 'mixed_shifted_chows', // Three chows with numbers shifted by 1
            ALL_CHOWS: 'all_chows', // All sets are chows
            DRAGON_PUNG: 'dragon_pung', // A pung of dragons
            OUTSIDE_HAND: 'outside_hand', // Hand with only 1s and 9s
            CONCEALED_HAND: 'concealed_hand', // All sets are concealed
            ALL_GREEN: 'all_green', // All tiles are green (bamboo 2,3,4,6,8 and green dragon)
            NINE_GATES: 'nine_gates', // 1112345678999 in one suit
            FOUR_KONGS: 'four_kongs', // Four kongs
            QUAD_PUNGS: 'quad_pungs', // Four pungs
            PURE_STRAIGHT: 'pure_straight', // 123456789 in one suit
            PURE_SHIFTED_PUNGS: 'pure_shifted_pungs', // Three pungs with numbers shifted by 1 in the same suit
            UPPER_TILES: 'upper_tiles', // All tiles are 7,8,9
            MIDDLE_TILES: 'middle_tiles', // All tiles are 4,5,6
            LOWER_TILES: 'lower_tiles', // All tiles are 1,2,3
            PURE_TRIPLE_CHOW: 'pure_triple_chow', // Three identical chows in the same suit
            PURE_SHIFTED_CHOWS: 'pure_shifted_chows', // Three chows with numbers shifted by 1 in the same suit
            ALL_TERMINALS: 'all_terminals', // All tiles are terminals (1,9) or honors
            QUAD_CHOWS: 'quad_chows', // Four chows
            FOUR_PURE_SHIFTED_PUNGS: 'four_pure_shifted_pungs', // Four pungs with numbers shifted by 1 in the same suit
            FOUR_PURE_DOUBLE_CHOWS: 'four_pure_double_chows', // Two pairs of identical chows in the same suit
            LITTLE_FOUR_WINDS: 'little_four_winds', // Three pungs of winds and a pair of the fourth wind
            LITTLE_THREE_DRAGONS: 'little_three_dragons', // Two pungs of dragons and a pair of the third dragon
            ALL_HONORS: 'all_honors', // All tiles are honors (winds and dragons)
            ALL_TERMINALS: 'all_terminals', // All tiles are terminals (1,9) or honors
            BIG_FOUR_WINDS: 'big_four_winds', // Four pungs of winds
            BIG_THREE_DRAGONS: 'big_three_dragons', // Three pungs of dragons
            NINE_GATES: 'nine_gates', // 1112345678999 in one suit
            FOUR_KONGS: 'four_kongs', // Four kongs
            SEVEN_PAIRS: 'seven_pairs', // Seven pairs
            THIRTEEN_ORPHANS: 'thirteen_orphans' // One of each terminal and honor, plus one extra
        };
        
        // Initialize players with manual order tracking
        for (let i = 0; i < this.numPlayers; i++) {
            this.players.push({
                hand: [],
                manualOrder: [], // Track manual order of tiles
                discarded: [],
                melds: [],
                sortMode: 'none',
                hasDrawn: false,
                hasDiscarded: false,
                concealed: true,
                score: 0
            });
        }

        this.initializeTiles();
        this.setupEventListeners();
        this.updateUI();
        this.updateView();
        this.addMeldStyles();
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
        
        // Add next turn button (combines end turn and pass device)
        const nextTurnButton = document.createElement('button');
        nextTurnButton.id = 'next-turn';
        nextTurnButton.className = 'control-button';
        nextTurnButton.textContent = 'Next Turn';
        nextTurnButton.addEventListener('click', () => this.nextTurn());
        document.querySelector('.game-controls').appendChild(nextTurnButton);
        
        // Add done button
        const doneButton = document.createElement('button');
        doneButton.id = 'done-button';
        doneButton.className = 'control-button';
        doneButton.textContent = 'Done';
        doneButton.addEventListener('click', () => this.playerDone());
        document.querySelector('.game-controls').appendChild(doneButton);
        
        // Add click handlers for player hands
        for (let i = 0; i < this.numPlayers; i++) {
            const hand = document.querySelector(`.player${i + 1} .hand`);
            hand.addEventListener('click', (e) => {
                const tile = e.target.closest('.tile');
                if (tile && this.currentPlayer === i && this.activeView === i) {
                    const index = Array.from(hand.children).indexOf(tile);
                    console.log('Discarding tile at index:', index);
                    this.discardTile(index, i);
                }
            });
        }

        // Add click handlers for discarded tiles
        for (let i = 0; i < this.numPlayers; i++) {
            const discardedArea = document.querySelector(`.player${i + 1} .discarded`);
            discardedArea.addEventListener('click', (e) => {
                const tile = e.target.closest('.tile');
                if (!tile) return;

                // If it's the last discarded tile and it's still your turn
                if (this.lastDiscardedTile && this.lastDiscardedBy === i && this.currentPlayer === i) {
                    this.undoDiscard(i);
                } else if (this.lastDiscardedTile) {
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
                    
                    // Set sort mode to manual when dragging
                    this.players[i].sortMode = 'manual';
                }
            });

            hand.addEventListener('dragend', (e) => {
                if (e.target.classList.contains('tile')) {
                    e.target.classList.remove('dragging');
                    
                    // Update manual order after drag
                    const player = this.players[i];
                    player.manualOrder = Array.from(hand.children).map(child => {
                        const index = parseInt(child.dataset.index);
                        return player.hand[index];
                    });
                    
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

    updateView() {
        const drawButton = document.getElementById('draw-tile');
        const nextTurnButton = document.getElementById('next-turn');

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
        nextTurnButton.textContent = 'Next Turn';
    }

    nextTurn() {
        const currentPlayer = this.players[this.currentPlayer];
        
        // If it's the current player's turn and they haven't completed their turn
        if (this.currentPlayer === this.activeView) {
            if (!currentPlayer.hasDrawn || !currentPlayer.hasDiscarded) {
                this.showNotification('You must draw and discard a tile before ending your turn!');
                return;
            }
            
            // Reset flags and switch turns
            currentPlayer.hasDrawn = false;
            currentPlayer.hasDiscarded = false;
            this.currentPlayer = (this.currentPlayer + 1) % this.numPlayers;
        }
        
        // Always update the active view
        this.activeView = (this.activeView + 1) % this.numPlayers;
        
        this.updateUI();
        this.updateView();
        this.showNotification(`Turn passed to Player ${this.currentPlayer + 1}`);
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

        const currentPlayer = this.players[this.currentPlayer];
        if (currentPlayer.hasDrawn) {
            this.showNotification('You have already drawn a tile this turn!');
            return;
        }

        const drawnTile = this.tiles.pop();
        currentPlayer.hand.push(drawnTile);
        
        // Add to manual order if in manual mode
        if (currentPlayer.sortMode === 'manual') {
            currentPlayer.manualOrder.push(drawnTile);
        }
        
        currentPlayer.hasDrawn = true;
        
        // Only sort if not in manual mode
        if (currentPlayer.sortMode !== 'manual') {
            this.sortHand(currentPlayer.sortMode);
        }
        
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

        const hand = this.players[playerIndex].hand;
        const tile = this.lastDiscardedTile;

        // Check for potential melds
        const possibleMelds = this.findPossibleMelds(hand, tile);
        
        if (possibleMelds.length > 0) {
            // Show meld options to player
            this.showMeldOptions(possibleMelds, playerIndex);
        } else {
            this.showNotification('Cannot form a valid meld with this tile!');
        }
    }

    findPossibleMelds(hand, tile) {
        const melds = [];
        const allTiles = [...hand, tile];

        // Check for pungs (three of a kind)
        const sameTiles = allTiles.filter(t => this.isSameTile(t, tile));
        if (sameTiles.length >= 3) {
            melds.push({
                type: 'pung',
                tiles: sameTiles.slice(0, 3)
            });
        }

        // Check for kongs (four of a kind)
        if (sameTiles.length >= 4) {
            melds.push({
                type: 'kong',
                tiles: sameTiles.slice(0, 4)
            });
        }

        // Check for chows (three consecutive numbers in the same suit)
        if (tile.type === 'number') {
            const sameSuitTiles = allTiles.filter(t => 
                t.type === 'number' && t.suit === tile.suit
            );
            
            // Find consecutive numbers
            for (let i = 1; i <= 7; i++) {
                const numbers = [i, i + 1, i + 2];
                const hasConsecutive = numbers.every(n => 
                    sameSuitTiles.some(t => t.number === n)
                );
                
                if (hasConsecutive) {
                    const chowTiles = numbers.map(n => 
                        sameSuitTiles.find(t => t.number === n)
                    );
                    melds.push({
                        type: 'chow',
                        tiles: chowTiles
                    });
                }
            }
        }

        return melds;
    }

    showMeldOptions(melds, playerIndex) {
        const meldOptions = document.createElement('div');
        meldOptions.className = 'meld-options';
        meldOptions.innerHTML = `
            <h3>Possible Melds</h3>
            <div class="meld-list">
                ${melds.map((meld, index) => `
                    <button class="meld-option" data-index="${index}">
                        ${this.formatMeldDisplay(meld)}
                    </button>
                `).join('')}
            </div>
        `;

        document.body.appendChild(meldOptions);

        // Add click handlers for meld options
        meldOptions.querySelectorAll('.meld-option').forEach(button => {
            button.addEventListener('click', () => {
                const meldIndex = parseInt(button.dataset.index);
                this.formMeld(melds[meldIndex], playerIndex);
                meldOptions.remove();
            });
        });
    }

    formatMeldDisplay(meld) {
        switch (meld.type) {
            case 'pung':
                return `Pung: ${this.tileToString(meld.tiles[0])} × 3`;
            case 'kong':
                return `Kong: ${this.tileToString(meld.tiles[0])} × 4`;
            case 'chow':
                return `Chow: ${meld.tiles.map(t => this.tileToString(t)).join(' ')}`;
            default:
                return 'Unknown Meld';
        }
    }

    formMeld(meld, playerIndex) {
        const player = this.players[playerIndex];
        
        // Remove tiles from hand
        meld.tiles.forEach(tile => {
            const index = player.hand.findIndex(t => this.isSameTile(t, tile));
            if (index !== -1) {
                player.hand.splice(index, 1);
            }
        });

        // Add meld to player's melds
        player.melds.push({
            type: meld.type,
            tiles: meld.tiles,
            concealed: false
        });

        // If it's a kong, draw a replacement tile
        if (meld.type === 'kong') {
            if (this.tiles.length > 0) {
                player.hand.push(this.tiles.pop());
            }
        }

        // Update UI
        this.updateUI();
        this.showNotification(`Formed ${meld.type} meld!`);
    }

    discardTile(index, player) {
        console.log('Attempting to discard tile:', { index, player, currentPlayer: this.currentPlayer, activeView: this.activeView });
        
        if (player !== this.activeView) {
            this.showNotification('Not your turn!');
            return;
        }

        const currentPlayer = this.players[player];
        if (!currentPlayer.hasDrawn) {
            this.showNotification('You must draw a tile before discarding!');
            return;
        }

        if (currentPlayer.hasDiscarded) {
            this.showNotification('You have already discarded a tile this turn!');
            return;
        }

        // Get the actual tile to discard based on sort mode
        const tileToDiscard = currentPlayer.sortMode === 'manual' 
            ? currentPlayer.manualOrder[index]
            : currentPlayer.hand[index];

        if (!tileToDiscard) {
            console.error('No tile found at index:', index);
            return;
        }

        console.log('Discarding tile:', tileToDiscard);

        // Remove from hand array
        const handIndex = currentPlayer.hand.indexOf(tileToDiscard);
        if (handIndex !== -1) {
            currentPlayer.hand.splice(handIndex, 1);
        }
        
        // Remove from manual order if in manual mode
        if (currentPlayer.sortMode === 'manual') {
            currentPlayer.manualOrder.splice(index, 1);
        } else {
            // If not in manual mode, update manual order to match hand
            currentPlayer.manualOrder = [...currentPlayer.hand];
        }
        
        // Add to discarded area with animation
        const discardedArea = document.querySelector(`.player${player + 1} .discarded`);
        const tileElement = this.createTileElement(tileToDiscard);
        tileElement.classList.add('tile-discard');
        discardedArea.appendChild(tileElement);

        // Store the last discarded tile information
        this.lastDiscardedTile = tileToDiscard;
        this.lastDiscardedBy = player;
        currentPlayer.hasDiscarded = true;

        // Remove animation class after animation completes
        setTimeout(() => {
            tileElement.classList.remove('tile-discard');
        }, 500);

        this.updateUI();
        this.showNotification('Tile discarded! Click the discarded tile to undo.');
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
            // For number tiles, show the number and suit
            tileContent.innerHTML = `
                <div class="tile-number">${tile.number}</div>
                <div class="tile-suit">${tile.suit}</div>
            `;
        } else if (tile.type === 'wind') {
            // For wind tiles, show the wind symbol
            const windSymbols = {
                '東': '東',
                '南': '南',
                '西': '西',
                '北': '北'
            };
            tileContent.innerHTML = `
                <div class="tile-symbol">${windSymbols[tile.value]}</div>
            `;
        } else if (tile.type === 'dragon') {
            // For dragon tiles, show the dragon symbol
            const dragonSymbols = {
                '中': '中',
                '發': '發',
                '白': '白'
            };
            tileContent.innerHTML = `
                <div class="tile-symbol">${dragonSymbols[tile.value]}</div>
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
        
        // Update button states
        const drawButton = document.getElementById('draw-tile');
        const nextTurnButton = document.getElementById('next-turn');
        const currentPlayer = this.players[this.currentPlayer];
        
        drawButton.disabled = this.currentPlayer !== this.activeView || currentPlayer.hasDrawn;
        nextTurnButton.disabled = this.currentPlayer === this.activeView && (!currentPlayer.hasDrawn || !currentPlayer.hasDiscarded);
        
        // Update all player hands
        for (let i = 0; i < this.numPlayers; i++) {
            const playerHand = document.querySelector(`.player${i + 1} .hand`);
            playerHand.innerHTML = '';
            
            const player = this.players[i];
            const tilesToDisplay = player.sortMode === 'manual' ? player.manualOrder : player.hand;
            
            tilesToDisplay.forEach((tile, index) => {
                const tileElement = this.createTileElement(tile);
                tileElement.dataset.index = index;
                playerHand.appendChild(tileElement);
            });
        }

        // Update melds display
        for (let i = 0; i < this.numPlayers; i++) {
            const playerArea = document.querySelector(`.player${i + 1}`);
            let meldsContainer = playerArea.querySelector('.melds');
            
            if (!meldsContainer) {
                meldsContainer = document.createElement('div');
                meldsContainer.className = 'melds';
                playerArea.insertBefore(meldsContainer, playerArea.querySelector('.discarded'));
            }

            meldsContainer.innerHTML = `
                <h3>Melds</h3>
                <div class="meld-list">
                    ${this.players[i].melds.map(meld => `
                        <div class="meld ${meld.type}">
                            ${meld.tiles.map(tile => this.createTileElement(tile).outerHTML).join('')}
                        </div>
                    `).join('')}
                </div>
            `;
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

        const currentPlayer = this.players[this.currentPlayer];
        const hand = currentPlayer.hand;
        
        // Store the current sort mode
        currentPlayer.sortMode = sortType;
        
        if (sortType === 'manual') {
            // If switching to manual mode, initialize manual order if empty
            if (currentPlayer.manualOrder.length === 0) {
                currentPlayer.manualOrder = [...hand];
            }
            return;
        }
        
        // Clear manual order when switching to other sort modes
        currentPlayer.manualOrder = [];
        
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

    playerDone() {
        if (this.currentPlayer !== this.activeView) {
            this.showNotification('Not your turn!');
            return;
        }

        const currentPlayer = this.players[this.currentPlayer];
        if (!currentPlayer.hasDrawn || !currentPlayer.hasDiscarded) {
            this.showNotification('You must draw and discard a tile before declaring a win!');
            return;
        }

        if (this.checkWinningHand(currentPlayer.hand)) {
            this.gameState = 'ended';
            this.showNotification('Player ' + (this.currentPlayer + 1) + ' has won!');
            // Calculate and display score
            const score = this.calculateScore(currentPlayer.hand);
            this.showNotification(`Score: ${score} points`);
        } else {
            this.showNotification('This is not a winning hand!');
        }
    }

    // Check if a hand is valid (has a winning pattern)
    checkWinningHand(hand) {
        // First check for special hands
        if (this.checkThirteenOrphans(hand)) return true;
        if (this.checkSevenPairs(hand)) return true;
        if (this.checkFourKongs(hand)) return true;
        if (this.checkNineGates(hand)) return true;
        if (this.checkBigThreeDragons(hand)) return true;
        if (this.checkBigFourWinds(hand)) return true;
        if (this.checkAllHonors(hand)) return true;
        if (this.checkAllTerminals(hand)) return true;
        if (this.checkLittleThreeDragons(hand)) return true;
        if (this.checkLittleFourWinds(hand)) return true;
        if (this.checkFourPureDoubleChows(hand)) return true;
        if (this.checkFourPureShiftedPungs(hand)) return true;
        if (this.checkQuadChows(hand)) return true;
        if (this.checkPureTripleChow(hand)) return true;
        if (this.checkPureShiftedChows(hand)) return true;
        if (this.checkPureShiftedPungs(hand)) return true;
        if (this.checkPureStraight(hand)) return true;
        if (this.checkQuadPungs(hand)) return true;
        if (this.checkFourKongs(hand)) return true;
        if (this.checkNineGates(hand)) return true;
        if (this.checkAllGreen(hand)) return true;
        if (this.checkConcealedHand(hand)) return true;
        if (this.checkOutsideHand(hand)) return true;
        if (this.checkDragonPung(hand)) return true;
        if (this.checkAllChows(hand)) return true;
        if (this.checkMixedShiftedChows(hand)) return true;
        if (this.checkHalfFlush(hand)) return true;
        if (this.checkAllPungs(hand)) return true;
        if (this.checkMixedShiftedPungs(hand)) return true;
        if (this.checkMixedTripleChow(hand)) return true;
        if (this.checkPureHand(hand)) return true;

        // If no special hands, check for standard winning hand
        return this.checkStandardWinningHand(hand);
    }

    // Check for standard winning hand (4 sets and 1 pair)
    checkStandardWinningHand(hand) {
        const tiles = [...hand];
        const sets = [];
        let pair = null;

        // Try to find a pair first
        for (let i = 0; i < tiles.length; i++) {
            for (let j = i + 1; j < tiles.length; j++) {
                if (this.isSameTile(tiles[i], tiles[j])) {
                    pair = [tiles[i], tiles[j]];
                    const remainingTiles = tiles.filter((_, index) => index !== i && index !== j);
                    if (this.findSets(remainingTiles, sets)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // Helper function to find sets in remaining tiles
    findSets(tiles, sets) {
        if (tiles.length === 0) return sets.length === 4;
        if (sets.length === 4) return false;

        // Try to find a pung
        for (let i = 0; i < tiles.length - 2; i++) {
            if (this.isSameTile(tiles[i], tiles[i + 1]) && this.isSameTile(tiles[i], tiles[i + 2])) {
                const newSets = [...sets, tiles.slice(i, i + 3)];
                const remainingTiles = tiles.filter((_, index) => index < i || index > i + 2);
                if (this.findSets(remainingTiles, newSets)) return true;
            }
        }

        // Try to find a chow
        for (let i = 0; i < tiles.length - 2; i++) {
            if (this.isConsecutive(tiles[i], tiles[i + 1], tiles[i + 2])) {
                const newSets = [...sets, tiles.slice(i, i + 3)];
                const remainingTiles = tiles.filter((_, index) => index < i || index > i + 2);
                if (this.findSets(remainingTiles, newSets)) return true;
            }
        }

        return false;
    }

    // Helper function to check if three tiles are consecutive
    isConsecutive(tile1, tile2, tile3) {
        if (tile1.type !== 'number' || tile2.type !== 'number' || tile3.type !== 'number') return false;
        if (tile1.suit !== tile2.suit || tile2.suit !== tile3.suit) return false;
        
        const numbers = [tile1.number, tile2.number, tile3.number].sort((a, b) => a - b);
        return numbers[1] === numbers[0] + 1 && numbers[2] === numbers[1] + 1;
    }

    // Helper function to check if two tiles are the same
    isSameTile(tile1, tile2) {
        if (tile1.type !== tile2.type) return false;
        if (tile1.type === 'number') {
            return tile1.suit === tile2.suit && tile1.number === tile2.number;
        } else {
            return tile1.value === tile2.value;
        }
    }

    // Check for special hands
    checkThirteenOrphans(hand) {
        const terminals = ['1筒', '9筒', '1索', '9索', '1萬', '9萬'];
        const honors = ['東', '南', '西', '北', '中', '發', '白'];
        const required = [...terminals, ...honors];
        
        // Check if hand contains all required tiles
        const hasAll = required.every(tile => 
            hand.some(t => this.tileToString(t) === tile)
        );
        
        // Check if there's one extra tile that matches any of the required tiles
        const extra = hand.length === 14 && hand.some(t => 
            required.includes(this.tileToString(t))
        );
        
        return hasAll && extra;
    }

    checkSevenPairs(hand) {
        if (hand.length !== 14) return false;
        
        const pairs = new Set();
        for (let i = 0; i < hand.length; i += 2) {
            if (!this.isSameTile(hand[i], hand[i + 1])) return false;
            pairs.add(this.tileToString(hand[i]));
        }
        
        return pairs.size === 7;
    }

    // Helper function to convert tile to string representation
    tileToString(tile) {
        if (tile.type === 'number') {
            return `${tile.number}${tile.suit}`;
        } else {
            return tile.value;
        }
    }

    // Calculate score based on the winning hand
    calculateScore(hand) {
        let score = 0;
        
        // Basic points for winning
        score += 20;
        
        // Add points for special patterns
        if (this.checkThirteenOrphans(hand)) score += 88;
        if (this.checkSevenPairs(hand)) score += 24;
        if (this.checkFourKongs(hand)) score += 88;
        if (this.checkNineGates(hand)) score += 88;
        if (this.checkBigThreeDragons(hand)) score += 88;
        if (this.checkBigFourWinds(hand)) score += 88;
        if (this.checkAllHonors(hand)) score += 64;
        if (this.checkAllTerminals(hand)) score += 64;
        if (this.checkLittleThreeDragons(hand)) score += 32;
        if (this.checkLittleFourWinds(hand)) score += 32;
        if (this.checkFourPureDoubleChows(hand)) score += 24;
        if (this.checkFourPureShiftedPungs(hand)) score += 32;
        if (this.checkQuadChows(hand)) score += 24;
        if (this.checkPureTripleChow(hand)) score += 24;
        if (this.checkPureShiftedChows(hand)) score += 24;
        if (this.checkPureShiftedPungs(hand)) score += 24;
        if (this.checkPureStraight(hand)) score += 24;
        if (this.checkQuadPungs(hand)) score += 24;
        if (this.checkAllGreen(hand)) score += 88;
        if (this.checkConcealedHand(hand)) score += 10;
        if (this.checkOutsideHand(hand)) score += 10;
        if (this.checkDragonPung(hand)) score += 8;
        if (this.checkAllChows(hand)) score += 8;
        if (this.checkMixedShiftedChows(hand)) score += 8;
        if (this.checkHalfFlush(hand)) score += 12;
        if (this.checkAllPungs(hand)) score += 12;
        if (this.checkMixedShiftedPungs(hand)) score += 12;
        if (this.checkMixedTripleChow(hand)) score += 12;
        if (this.checkPureHand(hand)) score += 24;

        return score;
    }

    checkFourKongs(hand) {
        const kongs = new Set();
        for (let i = 0; i < hand.length - 3; i++) {
            if (this.isSameTile(hand[i], hand[i + 1]) && 
                this.isSameTile(hand[i], hand[i + 2]) && 
                this.isSameTile(hand[i], hand[i + 3])) {
                kongs.add(this.tileToString(hand[i]));
            }
        }
        return kongs.size === 4;
    }

    checkNineGates(hand) {
        // Check if hand has 1112345678999 in one suit
        const suits = ['筒', '索', '萬'];
        for (let suit of suits) {
            const suitTiles = hand.filter(t => t.type === 'number' && t.suit === suit);
            if (suitTiles.length !== 14) continue;

            const numbers = suitTiles.map(t => t.number).sort((a, b) => a - b);
            const required = [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9];
            const extra = numbers.filter(n => !required.includes(n));
            
            if (extra.length === 1 && required.every(n => numbers.includes(n))) {
                return true;
            }
        }
        return false;
    }

    checkBigThreeDragons(hand) {
        const dragons = ['中', '發', '白'];
        return dragons.every(dragon => {
            const count = hand.filter(t => t.type === 'dragon' && t.value === dragon).length;
            return count >= 3;
        });
    }

    checkBigFourWinds(hand) {
        const winds = ['東', '南', '西', '北'];
        return winds.every(wind => {
            const count = hand.filter(t => t.type === 'wind' && t.value === wind).length;
            return count >= 3;
        });
    }

    checkAllHonors(hand) {
        return hand.every(tile => tile.type === 'wind' || tile.type === 'dragon');
    }

    checkAllTerminals(hand) {
        return hand.every(tile => {
            if (tile.type === 'number') {
                return tile.number === 1 || tile.number === 9;
            }
            return tile.type === 'wind' || tile.type === 'dragon';
        });
    }

    checkLittleThreeDragons(hand) {
        const dragons = ['中', '發', '白'];
        let pungCount = 0;
        let pairCount = 0;

        for (let dragon of dragons) {
            const count = hand.filter(t => t.type === 'dragon' && t.value === dragon).length;
            if (count === 3) pungCount++;
            if (count === 2) pairCount++;
        }

        return pungCount === 2 && pairCount === 1;
    }

    checkLittleFourWinds(hand) {
        const winds = ['東', '南', '西', '北'];
        let pungCount = 0;
        let pairCount = 0;

        for (let wind of winds) {
            const count = hand.filter(t => t.type === 'wind' && t.value === wind).length;
            if (count === 3) pungCount++;
            if (count === 2) pairCount++;
        }

        return pungCount === 3 && pairCount === 1;
    }

    checkFourPureDoubleChows(hand) {
        const suits = ['筒', '索', '萬'];
        for (let suit of suits) {
            const suitTiles = hand.filter(t => t.type === 'number' && t.suit === suit);
            if (suitTiles.length < 6) continue;

            const numbers = suitTiles.map(t => t.number).sort((a, b) => a - b);
            // Check for two identical chows
            for (let i = 0; i < numbers.length - 5; i++) {
                if (numbers[i] === numbers[i + 3] && 
                    numbers[i + 1] === numbers[i + 4] && 
                    numbers[i + 2] === numbers[i + 5]) {
                    return true;
                }
            }
        }
        return false;
    }

    checkFourPureShiftedPungs(hand) {
        const suits = ['筒', '索', '萬'];
        for (let suit of suits) {
            const suitTiles = hand.filter(t => t.type === 'number' && t.suit === suit);
            if (suitTiles.length < 12) continue;

            const numbers = suitTiles.map(t => t.number).sort((a, b) => a - b);
            // Check for four pungs with numbers shifted by 1
            let found = 0;
            for (let i = 0; i < numbers.length - 2; i++) {
                if (numbers[i] === numbers[i + 1] && numbers[i] === numbers[i + 2]) {
                    found++;
                    if (found === 4) return true;
                }
            }
        }
        return false;
    }

    checkQuadChows(hand) {
        const suits = ['筒', '索', '萬'];
        let chowCount = 0;

        for (let suit of suits) {
            const suitTiles = hand.filter(t => t.type === 'number' && t.suit === suit);
            if (suitTiles.length < 3) continue;

            const numbers = suitTiles.map(t => t.number).sort((a, b) => a - b);
            for (let i = 0; i < numbers.length - 2; i++) {
                if (numbers[i + 1] === numbers[i] + 1 && numbers[i + 2] === numbers[i] + 2) {
                    chowCount++;
                    if (chowCount === 4) return true;
                }
            }
        }
        return false;
    }

    checkPureTripleChow(hand) {
        const suits = ['筒', '索', '萬'];
        for (let suit of suits) {
            const suitTiles = hand.filter(t => t.type === 'number' && t.suit === suit);
            if (suitTiles.length < 9) continue;

            const numbers = suitTiles.map(t => t.number).sort((a, b) => a - b);
            // Check for three identical chows
            for (let i = 0; i < numbers.length - 8; i++) {
                if (numbers[i] === numbers[i + 3] && numbers[i] === numbers[i + 6] &&
                    numbers[i + 1] === numbers[i + 4] && numbers[i + 1] === numbers[i + 7] &&
                    numbers[i + 2] === numbers[i + 5] && numbers[i + 2] === numbers[i + 8]) {
                    return true;
                }
            }
        }
        return false;
    }

    checkPureShiftedChows(hand) {
        const suits = ['筒', '索', '萬'];
        for (let suit of suits) {
            const suitTiles = hand.filter(t => t.type === 'number' && t.suit === suit);
            if (suitTiles.length < 9) continue;

            const numbers = suitTiles.map(t => t.number).sort((a, b) => a - b);
            // Check for three chows with numbers shifted by 1
            for (let i = 0; i < numbers.length - 8; i++) {
                if (numbers[i + 3] === numbers[i] + 1 && numbers[i + 6] === numbers[i] + 2 &&
                    numbers[i + 4] === numbers[i + 1] + 1 && numbers[i + 7] === numbers[i + 1] + 2 &&
                    numbers[i + 5] === numbers[i + 2] + 1 && numbers[i + 8] === numbers[i + 2] + 2) {
                    return true;
                }
            }
        }
        return false;
    }

    checkPureShiftedPungs(hand) {
        const suits = ['筒', '索', '萬'];
        for (let suit of suits) {
            const suitTiles = hand.filter(t => t.type === 'number' && t.suit === suit);
            if (suitTiles.length < 9) continue;

            const numbers = suitTiles.map(t => t.number).sort((a, b) => a - b);
            // Check for three pungs with numbers shifted by 1
            let found = 0;
            let lastNumber = -1;
            for (let i = 0; i < numbers.length - 2; i++) {
                if (numbers[i] === numbers[i + 1] && numbers[i] === numbers[i + 2]) {
                    if (lastNumber === -1 || numbers[i] === lastNumber + 1) {
                        found++;
                        lastNumber = numbers[i];
                        if (found === 3) return true;
                    }
                }
            }
        }
        return false;
    }

    checkPureStraight(hand) {
        const suits = ['筒', '索', '萬'];
        for (let suit of suits) {
            const suitTiles = hand.filter(t => t.type === 'number' && t.suit === suit);
            if (suitTiles.length < 9) continue;

            const numbers = suitTiles.map(t => t.number).sort((a, b) => a - b);
            // Check for 123456789
            if (numbers.join('') === '123456789') {
                return true;
            }
        }
        return false;
    }

    checkQuadPungs(hand) {
        const pungs = new Set();
        for (let i = 0; i < hand.length - 2; i++) {
            if (this.isSameTile(hand[i], hand[i + 1]) && this.isSameTile(hand[i], hand[i + 2])) {
                pungs.add(this.tileToString(hand[i]));
            }
        }
        return pungs.size === 4;
    }

    checkAllGreen(hand) {
        const greenTiles = ['2索', '3索', '4索', '6索', '8索', '發'];
        return hand.every(tile => greenTiles.includes(this.tileToString(tile)));
    }

    checkConcealedHand(hand) {
        return this.players[this.currentPlayer].concealed;
    }

    checkOutsideHand(hand) {
        return hand.every(tile => {
            if (tile.type === 'number') {
                return tile.number === 1 || tile.number === 9;
            }
            return true;
        });
    }

    checkDragonPung(hand) {
        const dragons = ['中', '發', '白'];
        return dragons.some(dragon => {
            const count = hand.filter(t => t.type === 'dragon' && t.value === dragon).length;
            return count >= 3;
        });
    }

    checkAllChows(hand) {
        const sets = [];
        return this.findSets(hand, sets) && sets.every(set => this.isConsecutive(set[0], set[1], set[2]));
    }

    checkMixedShiftedChows(hand) {
        const suits = ['筒', '索', '萬'];
        let found = 0;
        let lastNumbers = null;

        for (let suit of suits) {
            const suitTiles = hand.filter(t => t.type === 'number' && t.suit === suit);
            if (suitTiles.length < 3) continue;

            const numbers = suitTiles.map(t => t.number).sort((a, b) => a - b);
            for (let i = 0; i < numbers.length - 2; i++) {
                if (numbers[i + 1] === numbers[i] + 1 && numbers[i + 2] === numbers[i] + 2) {
                    const currentNumbers = [numbers[i], numbers[i + 1], numbers[i + 2]];
                    if (lastNumbers === null) {
                        lastNumbers = currentNumbers;
                        found++;
                    } else if (currentNumbers[0] === lastNumbers[0] + 1) {
                        found++;
                        lastNumbers = currentNumbers;
                    }
                    if (found === 3) return true;
                }
            }
        }
        return false;
    }

    checkHalfFlush(hand) {
        const suits = ['筒', '索', '萬'];
        let suitCount = 0;
        for (let suit of suits) {
            if (hand.some(t => t.type === 'number' && t.suit === suit)) {
                suitCount++;
            }
        }
        return suitCount === 2;
    }

    checkAllPungs(hand) {
        const sets = [];
        return this.findSets(hand, sets) && sets.every(set => 
            this.isSameTile(set[0], set[1]) && this.isSameTile(set[1], set[2])
        );
    }

    checkMixedShiftedPungs(hand) {
        const suits = ['筒', '索', '萬'];
        let found = 0;
        let lastNumber = -1;

        for (let suit of suits) {
            const suitTiles = hand.filter(t => t.type === 'number' && t.suit === suit);
            if (suitTiles.length < 3) continue;

            const numbers = suitTiles.map(t => t.number).sort((a, b) => a - b);
            for (let i = 0; i < numbers.length - 2; i++) {
                if (numbers[i] === numbers[i + 1] && numbers[i] === numbers[i + 2]) {
                    if (lastNumber === -1 || numbers[i] === lastNumber + 1) {
                        found++;
                        lastNumber = numbers[i];
                        if (found === 3) return true;
                    }
                }
            }
        }
        return false;
    }

    checkMixedTripleChow(hand) {
        const suits = ['筒', '索', '萬'];
        let found = 0;
        let lastNumbers = null;

        for (let suit of suits) {
            const suitTiles = hand.filter(t => t.type === 'number' && t.suit === suit);
            if (suitTiles.length < 3) continue;

            const numbers = suitTiles.map(t => t.number).sort((a, b) => a - b);
            for (let i = 0; i < numbers.length - 2; i++) {
                if (numbers[i + 1] === numbers[i] + 1 && numbers[i + 2] === numbers[i] + 2) {
                    const currentNumbers = [numbers[i], numbers[i + 1], numbers[i + 2]];
                    if (lastNumbers === null) {
                        lastNumbers = currentNumbers;
                        found++;
                    } else if (currentNumbers[0] === lastNumbers[0]) {
                        found++;
                        lastNumbers = currentNumbers;
                    }
                    if (found === 3) return true;
                }
            }
        }
        return false;
    }

    checkPureHand(hand) {
        const suits = ['筒', '索', '萬'];
        return suits.some(suit => 
            hand.every(tile => tile.type === 'number' && tile.suit === suit)
        );
    }

    // Add CSS for melds
    addMeldStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .meld-options {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
                z-index: 1000;
            }

            .meld-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 10px;
            }

            .meld-option {
                padding: 10px;
                border: none;
                border-radius: 5px;
                background: var(--secondary-color);
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .meld-option:hover {
                background: #2980b9;
                transform: translateY(-2px);
            }

            .melds {
                margin: 20px 0;
            }

            .meld {
                display: flex;
                gap: 5px;
                margin: 10px 0;
                padding: 10px;
                background: rgba(52, 152, 219, 0.1);
                border-radius: 5px;
            }

            .meld.pung {
                background: rgba(46, 204, 113, 0.1);
            }

            .meld.kong {
                background: rgba(155, 89, 182, 0.1);
            }

            .meld.chow {
                background: rgba(241, 196, 15, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    undoDiscard(player) {
        const currentPlayer = this.players[player];
        
        // Can only undo if it's still your turn and you haven't ended it
        if (this.currentPlayer !== player || this.activeView !== player) {
            this.showNotification('You can only undo your last discard during your turn!');
            return;
        }

        if (!this.lastDiscardedTile || this.lastDiscardedBy !== player) {
            this.showNotification('No tile to undo!');
            return;
        }

        // Remove the tile from discarded area
        const discardedArea = document.querySelector(`.player${player + 1} .discarded`);
        const lastTile = discardedArea.lastElementChild;
        if (lastTile) {
            lastTile.remove();
        }

        // Add the tile back to hand
        currentPlayer.hand.push(this.lastDiscardedTile);
        
        // Add back to manual order if in manual mode
        if (currentPlayer.sortMode === 'manual') {
            currentPlayer.manualOrder.push(this.lastDiscardedTile);
        }

        // Reset discard flags
        currentPlayer.hasDiscarded = false;
        this.lastDiscardedTile = null;
        this.lastDiscardedBy = null;

        this.updateUI();
        this.showNotification('Discard undone!');
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