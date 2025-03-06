// Name: Seeya Pillai and Peter Dobbins
// Date:

// CODE ARMOR

'use strict';

let config = {
    parent: 'myGame',
    type: Phaser.AUTO,
    height: 640,
    width: 960,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }
        }
    },
    scene: [ Menu, Play ]
};

let game = new Phaser.Game(config);
