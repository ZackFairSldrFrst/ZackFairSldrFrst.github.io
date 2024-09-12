class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Load any assets for the main menu here
    }

    create() {
        this.add.text(400, 300, 'Word Warriors', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5, 0.5);
        this.add.text(400, 400, 'Press Enter to Start', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
        
        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });
    }
}
