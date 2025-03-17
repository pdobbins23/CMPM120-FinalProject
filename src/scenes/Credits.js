class Credits extends Phaser.Scene {
	constructor() {
		super({ key: "Credits" });
	}

	create() {
		this.add
			.text(325, 200, "Credits", { fontSize: "32px", fill: "#fff" })
			.setOrigin(0.5);
		this.add
			.text(325, 300, "Developed by Peter Dobbins and Seeya Pillai", {
				fontSize: "24px",
				fill: "#fff",
			})
			.setOrigin(0.5);
		this.add
			.text(325, 400, "Assets sourced from [Source Name]", {
				fontSize: "18px",
				fill: "#fff",
			})
			.setOrigin(0.5);
		this.add
			.text(325, 430, "Sound effects sourced from [Source Name]", {
				fontSize: "18px",
				fill: "#fff",
			})
			.setOrigin(0.5);

		this.add
			.text(325, 400, "Press M to return to Menu", {
				fontSize: "20px",
				fill: "#fff",
			})
			.setOrigin(0.5);

		this.input.keyboard.on("keydown-M", () => {
			this.scene.start("menuScene");
		});
	}
}
