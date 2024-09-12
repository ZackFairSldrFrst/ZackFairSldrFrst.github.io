class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.level = 1;
        this.score = 0;
        this.gameOver = false;
    }

    preload() {
        this.load.image('enemy', 'https://phaser.io/images/img.png');
        this.load.image('powerup', 'https://phaser.io/images/img.png');
    }

    create() {
        // Background and UI
        this.add.text(10, 10, 'Collect Letters and Form Words', { fontSize: '20px', fill: '#fff' });

        // Create initial letters, enemies, and power-ups
        this.letters = [];
        this.enemies = [];
        this.powerUps = [];
        this.createLevel();

        // Display current word, score, and level
        this.wordText = this.add.text(10, 50, 'Current Word: ', { fontSize: '20px', fill: '#fff' });
        this.messageText = this.add.text(10, 80, '', { fontSize: '20px', fill: '#fff' });
        this.scoreText = this.add.text(10, 110, 'Score: 0', { fontSize: '20px', fill: '#fff' });
        this.levelText = this.add.text(10, 140, 'Level: 1', { fontSize: '20px', fill: '#fff' });

        // Player setup
        this.player = this.add.rectangle(50, 300, 32, 32, 0x0000ff);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // Input handling
        this.input.keyboard.on('keydown-ENTER', () => {
            if (!this.gameOver) {
                this.useWord();
            }
        });

        // Colliders and Overlaps
        this.physics.add.collider(this.player, this.enemies, this.handleCollision, null, this);
        this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, null, this);
    }

    update() {
        if (this.gameOver) return;

        // Player movement (example with arrow keys)
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT).isDown) {
            this.player.x -= 5;
        }
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT).isDown) {
            this.player.x += 5;
        }
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP).isDown) {
            this.player.y -= 5;
        }
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN).isDown) {
            this.player.y += 5;
        }

        // Update moving enemies
        this.enemies.forEach(enemy => {
            if (enemy.type === 'moving') {
                enemy.x += enemy.speed;
                if (enemy.x > 800 || enemy.x < 0) {
                    enemy.speed *= -1;
                }
            }
        });

        // Check for level up
        if (this.score >= this.level * 100) {
            this.levelUp();
        }
    }

    createLevel() {
        this.createLetters();
        this.createEnemies();
        this.createPowerUps();
    }

    createLetters() {
        // Example letters
        this.createLetter(100, 100, 'A');
        this.createLetter(200, 100, 'B');
        this.createLetter(300, 100, 'C');
    }

    createLetter(x, y, letter) {
        const text = this.add.text(x, y, letter, {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 10, y: 10 }
        }).setInteractive();

        text.on('pointerdown', () => {
            this.collectLetter(text);
        });

        this.letters.push(text);
    }

    createEnemies() {
        this.createEnemy(500, 300, 'stationary');
        this.createEnemy(600, 300, 'moving');
    }

    createEnemy(x, y, type) {
        const enemy = this.add.rectangle(x, y, 32, 32, type === 'moving' ? 0xff0000 : 0x00ff00);
        enemy.type = type;
        enemy.speed = type === 'moving' ? 2 : 0;
        this.physics.add.existing(enemy);
        this.enemies.push(enemy);
    }

    createPowerUps() {
        this.createPowerUp(700, 300);
    }

    createPowerUp(x, y) {
        const powerUp = this.add.image(x, y, 'powerup').setInteractive();
        this.physics.add.existing(powerUp);
        this.powerUps.push(powerUp);
    }

    collectLetter(letterText) {
        const letter = letterText.text;
        this.currentWord += letter;
        this.wordText.setText('Current Word: ' + this.currentWord);
        letterText.destroy();
    }

    collectPowerUp(player, powerUp) {
        powerUp.destroy();
        this.messageText.setText('Power-up collected!');
        // Implement power-up effects here
    }

    useWord() {
        if (this.currentWord === 'ABC') {
            this.messageText.setText('You formed the word "ABC"! Attack successful.');
            this.score += 10;
        } else if (this.currentWord === 'CAB') {
            this.messageText.setText('You formed the word "CAB"! Attack successful.');
            this.score += 20;
        } else {
            this.messageText.setText('You formed the word "' + this.currentWord + '".');
        }
        this.currentWord = '';
        this.wordText.setText('Current Word: ' + this.currentWord);
        this.scoreText.setText('Score: ' + this.score);
    }

    handleCollision(player, enemy) {
        this.messageText.setText('You collided with an enemy!');
        this.gameOver = true;
        this.scene.start('GameOverScene', { score: this.score });
    }

    levelUp() {
        this.level += 1;
        this.messageText.setText('Level Up! Now on Level ' + this.level);
        this.levelText.setText('Level: ' + this.level);
        // Add more enemies or change level layout
        this.createEnemies();
    }
}
