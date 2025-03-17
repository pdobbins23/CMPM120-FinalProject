class GameOver extends Phaser.Scene {
	constructor() {
		super({ key: "GameOver" });
	}

	create() {
		this.add
			.text(325, 200, "Game Over", { fontSize: "32px", fill: "#fff" })
			.setOrigin(0.5);
		// add stats
		this.add
			.text(325, 300, "Press R to Restart or C for Credits", {
				fontSize: "24px",
				fill: "#fff",
			})
			.setOrigin(0.5);

		this.input.keyboard.on("keydown-R", () => {
			this.scene.start("Play");
		});

		this.input.keyboard.on("keydown-C", () => {
			this.scene.start("Credits");
		});
	}
}
