// Name: Seeya Pillai and Peter Dobbins
// Date:

// CODE ARMOR

"use strict";

let config = {
	parent: "myGame",
	type: Phaser.AUTO,
	width: 640,
	height: 480,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		zoom: 1,
	},
	render: {
		pixelArt: true,
	},
	physics: {
		default: "arcade",
		arcade: {
			gravity: { x: 0, y: 0 },
			// debug: true,
		},
	},
	scene: [Menu, Play],
};

let game = new Phaser.Game(config);
