class Menu extends Phaser.Scene {
	constructor() {
		super("menuScene");
	}

	preload() {
		// this.load.audio('menuMusic', 'assets/audio/menu_music.mp3');
	}

	create() {
		this.add
			.text(325, 100, "Blips & Chitz: Roy", { fontSize: "32px", fill: "#fff" })
			.setOrigin(0.5);
		//// add a tuturial?
		this.add
			.text(325, 250, "HOW TO PLAY:", { fontSize: "24px", fill: "#fff" })
			.setOrigin(0.5);
		this.add
			.text(325, 300, "Move: Arrow Keys and Beat High Score", { fontSize: "20px", fill: "#fff" })
			.setOrigin(0.5);

		this.add
			.text(325, 180, "Press SPACE to Start", {
				fontSize: "24px",
				fill: "#fff",
			})
			.setOrigin(0.5);

		// this.sound.add('menuMusic').play({ loop: true });

		this.input.keyboard.on("keydown-SPACE", () => {
			this.sound.stopAll();
			this.scene.start("playScene");
		});
	}
}
