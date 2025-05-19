class MahjongGame {
    constructor() {
        this.tiles = [];
        this.players = [];
        this.currentPlayer = 0; // East starts
        this.activeView = 0;
        this.numPlayers = 4; // Fixed at 4 players for Hong Kong Mahjong
        this.lastDiscardedTile = null;
        this.lastDiscardedBy = null;
        this.claimingPlayers = []; // Track players claiming the last discarded tile
        this.deadWall = []; // Tiles for Kong replacements
        this.gameState = 'playing'; // playing, ended
        this.roundWind = '東'; // Current round wind (East)
        this.playerWinds = ['東', '南', '西', '北']; // Player winds
        
        // Initialize players
        for (let i = 0; i < this.numPlayers; i++) {
            this.players.push({
                hand: [],
                discarded: [],
                melds: [], // Track exposed melds
                concealedKongs: [], // Track concealed kongs
                wind: this.playerWinds[i],
                hasDrawn: false,
                hasDiscarded: false,
                score: 0
            });
        }

        this.initializeTiles();
        this.setupEventListeners();
        this.updateUI();
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
        
        // Set up dead wall (last 14 tiles)
        this.deadWall = this.tiles.splice(-14);
        
        // Deal initial hands (13 tiles each)
        for (let i = 0; i < 13; i++) {
            for (let player of this.players) {
                player.hand.push(this.tiles.pop());
            }
        }

        // Sort initial hands
        for (let player of this.players) {
            this.sortHand(player.hand);
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
        
        // Add next turn button
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
                    this.tryClaimDiscardedTile(i);
                }
            });
        }
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
        currentPlayer.hasDrawn = true;
        
        this.sortHand(currentPlayer.hand);
        this.updateUI();
        this.animateDrawTile();
    }

    discardTile(index, player) {
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

        const tileToDiscard = currentPlayer.hand[index];
        if (!tileToDiscard) {
            console.error('No tile found at index:', index);
            return;
        }

        // Remove from hand
        currentPlayer.hand.splice(index, 1);
        
        // Add to discarded area with animation
        const discardedArea = document.querySelector(`.player${player + 1} .discarded`);
        const tileElement = this.createTileElement(tileToDiscard);
        tileElement.classList.add('tile-discard');
        discardedArea.appendChild(tileElement);

        // Store the last discarded tile information
        this.lastDiscardedTile = tileToDiscard;
        this.lastDiscardedBy = player;
        currentPlayer.hasDiscarded = true;

        // Check for possible claims from other players
        this.checkForClaims();

        // Remove animation class after animation completes
        setTimeout(() => {
            tileElement.classList.remove('tile-discard');
        }, 500);

        this.updateUI();
        this.showNotification('Tile discarded! Click the discarded tile to undo.');
    }

    checkForClaims() {
        this.claimingPlayers = [];
        
        // Check each player (except the one who discarded) for possible claims
        for (let i = 0; i < this.numPlayers; i++) {
            if (i === this.lastDiscardedBy) continue;
            
            const player = this.players[i];
            const possibleClaims = this.findPossibleClaims(player.hand, this.lastDiscardedTile, i);
            
            if (possibleClaims.length > 0) {
                this.claimingPlayers.push({
                    playerIndex: i,
                    claims: possibleClaims
                });
            }
        }

        // If there are claims, show the claim options
        if (this.claimingPlayers.length > 0) {
            this.showClaimOptions();
        }
    }

    findPossibleClaims(hand, tile, playerIndex) {
        const claims = [];
        const allTiles = [...hand, tile];

        // Check for win (highest priority)
        if (this.checkWinningHand(allTiles)) {
            claims.push({ type: 'win', tiles: [tile] });
        }

        // Check for pung/kong
        const sameTiles = allTiles.filter(t => this.isSameTile(t, tile));
        if (sameTiles.length >= 3) {
            claims.push({ type: 'pung', tiles: sameTiles.slice(0, 3) });
        }
        if (sameTiles.length >= 4) {
            claims.push({ type: 'kong', tiles: sameTiles.slice(0, 4) });
        }

        // Check for chow (only if tile was discarded by player to the left)
        if (tile.type === 'number') {
            const leftPlayerIndex = (this.lastDiscardedBy + 1) % this.numPlayers;
            if (playerIndex === leftPlayerIndex) {
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
                        claims.push({ type: 'chow', tiles: chowTiles });
                    }
                }
            }
        }

        return claims;
    }

    showClaimOptions() {
        const claimOptions = document.createElement('div');
        claimOptions.className = 'claim-options';
        claimOptions.innerHTML = `
            <h3>Possible Claims</h3>
            <div class="claim-list">
                ${this.claimingPlayers.map((player, playerIndex) => `
                    <div class="player-claims">
                        <h4>Player ${player.playerIndex + 1}</h4>
                        ${player.claims.map((claim, claimIndex) => `
                            <button class="claim-option" data-player="${player.playerIndex}" data-claim="${claimIndex}">
                                ${this.formatClaimDisplay(claim)}
                            </button>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;

        document.body.appendChild(claimOptions);

        // Add click handlers for claim options
        claimOptions.querySelectorAll('.claim-option').forEach(button => {
            button.addEventListener('click', () => {
                const playerIndex = parseInt(button.dataset.player);
                const claimIndex = parseInt(button.dataset.claim);
                const claim = this.claimingPlayers[playerIndex].claims[claimIndex];
                this.processClaim(playerIndex, claim);
                claimOptions.remove();
            });
        });
    }

    formatClaimDisplay(claim) {
        switch (claim.type) {
            case 'win':
                return 'Win!';
            case 'pung':
                return `Pung: ${this.tileToString(claim.tiles[0])} × 3`;
            case 'kong':
                return `Kong: ${this.tileToString(claim.tiles[0])} × 4`;
            case 'chow':
                return `Chow: ${claim.tiles.map(t => this.tileToString(t)).join(' ')}`;
            default:
                return 'Unknown Claim';
        }
    }

    processClaim(playerIndex, claim) {
        const player = this.players[playerIndex];
        
        // Remove tiles from hand
        claim.tiles.forEach(tile => {
            const index = player.hand.findIndex(t => this.isSameTile(t, tile));
            if (index !== -1) {
                player.hand.splice(index, 1);
            }
        });

        // Handle different claim types
        switch (claim.type) {
            case 'win':
                this.handleWin(playerIndex);
                break;
            case 'pung':
            case 'kong':
                player.melds.push({
                    type: claim.type,
                    tiles: claim.tiles,
                    concealed: false
                });
                if (claim.type === 'kong') {
                    this.handleKong(playerIndex);
                }
                break;
            case 'chow':
                player.melds.push({
                    type: 'chow',
                    tiles: claim.tiles,
                    concealed: false
                });
                break;
        }

        // Update game state
        this.currentPlayer = playerIndex;
        this.activeView = playerIndex;
        this.lastDiscardedTile = null;
        this.lastDiscardedBy = null;
        this.claimingPlayers = [];

        this.updateUI();
        this.showNotification(`Player ${playerIndex + 1} claimed ${claim.type}!`);
    }

    handleKong(playerIndex) {
        const player = this.players[playerIndex];
        
        // Draw replacement tile from dead wall
        if (this.deadWall.length > 0) {
            const replacementTile = this.deadWall.pop();
            player.hand.push(replacementTile);
            this.sortHand(player.hand);
        }
    }

    handleWin(playerIndex) {
        this.gameState = 'ended';
        const player = this.players[playerIndex];
        const score = this.calculateScore(player.hand);
        player.score += score;
        
        this.showNotification(`Player ${playerIndex + 1} has won! Score: ${score}`);
        
        // Handle East wind special case
        if (playerIndex === 0) { // East player
            // East stays as East
            this.roundWind = '東';
        } else {
            // Rotate winds counterclockwise
            this.playerWinds = [...this.playerWinds.slice(1), this.playerWinds[0]];
            for (let i = 0; i < this.numPlayers; i++) {
                this.players[i].wind = this.playerWinds[i];
            }
        }
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
            const tilesToDisplay = player.hand;
            
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

    sortHand(hand) {
        hand.sort((a, b) => {
            if (a.type === 'number' && b.type === 'number') {
                return a.number - b.number;
            }
            return 0;
        });
        this.updateUI();
        this.showNotification('Hand sorted');
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