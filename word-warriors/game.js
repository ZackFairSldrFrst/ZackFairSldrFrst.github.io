const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let letters = [];
let currentWord = '';
let wordText;
let messageText;

function preload() {
    // No assets to preload for ASCII letters
}

function create() {
    this.add.text(10, 10, 'Collect Letters and Form Words', { fontSize: '20px', fill: '#000' });

    // Create letter text objects
    createLetter(this, 100, 100, 'A');
    createLetter(this, 200, 100, 'B');
    // Add more letters as needed

    // Display current word
    wordText = this.add.text(10, 50, 'Current Word: ', { fontSize: '20px', fill: '#000' });

    // Display action messages
    messageText = this.add.text(10, 80, '', { fontSize: '20px', fill: '#000' });

    // Example of how to use a word to do something (e.g., show a message)
    this.input.keyboard.on('keydown-ENTER', () => {
        useWord();
    });
}

function update() {
    // Game logic goes here
}

function createLetter(scene, x, y, letter) {
    const text = scene.add.text(x, y, letter, {
        fontSize: '32px',
        fill: '#000',
        backgroundColor: '#fff',
        padding: { x: 10, y: 10 }
    }).setInteractive();

    text.on('pointerdown', () => {
        collectLetter(text);
    });

    letters.push(text);
}

function collectLetter(letterText) {
    const letter = letterText.text;
    currentWord += letter;
    wordText.setText('Current Word: ' + currentWord);
    letterText.destroy();  // Remove letter from screen
}

function useWord() {
    // Example action based on the current word
    if (currentWord === 'AB') {
        messageText.setText('You formed the word "AB"! This is just an example action.');
    } else {
        messageText.setText('You formed the word "' + currentWord + '".');
    }
    currentWord = '';  // Reset the current word
    wordText.setText('Current Word: ' + currentWord);
}
