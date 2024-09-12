// Import scene files if using ES6 modules or include them directly
// Assuming they are included directly in this case

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainMenu, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
