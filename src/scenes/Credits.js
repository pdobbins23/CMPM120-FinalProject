class Credits extends Phaser.Scene {
	constructor() {
		super({ key: "Credits" });
	}

	preload() {
		this.load.audio("bg_music", "assets/audio/jazz.mp3");

	}

	create() {

		this.add
			.text(325, 180, "Credits", { fontSize: "32px", fill: "#fff" })
			.setOrigin(0.5);
		this.add
			.text(325, 230, "Developed by Peter Dobbins and Seeya Pillai", {
				fontSize: "24px",
				fill: "#fff",
			})
			.setOrigin(0.5);

		this.add
			.text(325, 430, "Sound effects sourced from JFXR", {
				fontSize: "18px",
				fill: "#fff",
			})
			.setOrigin(0.5);

		this.add
			.text(325, 320, "Press M to return to Menu", {
				fontSize: "20px",
				fill: "#fff",
			})
			.setOrigin(0.5);

		this.input.keyboard.on("keydown-M", () => {
			this.scene.start("menuScene");
		});
	}
}
