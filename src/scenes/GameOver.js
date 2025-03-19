class GameOver extends Phaser.Scene {
	constructor() {
		super({ key: "GameOver" });
	}

	preload() {
		this.load.audio("bg_music", "assets/audio/jazz.mp3");

	}

	create() {

		this.add
			.text(325, 200, "Game Over. You Died! Try Again.", { fontSize: "32px", fill: "#fff" })
			.setOrigin(0.5);
		// add stats
		this.add
			.text(325, 300, "Press R to Restart or C for Credits", {
				fontSize: "24px",
				fill: "#fff",
			})
			.setOrigin(0.5);

		this.input.keyboard.on("keydown-R", () => {
			this.scene.start("playScene");
		});

		this.input.keyboard.on("keydown-C", () => {
			this.scene.start("Credits");
		});
	}
}
