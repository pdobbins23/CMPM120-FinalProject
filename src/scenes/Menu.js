class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload() {
        this.load.audio('menuMusic', 'assets/audio/menu_music.mp3');
    }

    create() {
        this.add.text(400, 200, 'Blips & Chitz: Roy', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 300, 'Press SPACE to Start', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        
        this.sound.add('menuMusic').play({ loop: true });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.sound.stopAll();
            this.scene.start('Play');
        });
    }
}
