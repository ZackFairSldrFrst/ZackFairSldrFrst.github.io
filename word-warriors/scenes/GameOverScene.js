class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.score = data.score;
    }

    create() {
        this.add.text(400, 250, 'Game Over!', { fontSize: '48px', fill: '#ff0000' }).setOrigin(0.5, 0.5);
        this.add.text(400, 350, 'Final Score: ' + this.score, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
        this.add.text(400, 400, 'Press Enter to Restart', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);

        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('MainMenu');
        });
    }
}
