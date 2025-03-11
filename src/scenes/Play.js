class Play extends Phaser.Scene {
    constructor() {
        super({ key: 'Play' });
    }
// add when player dies go to end screen
    preload() {
        // Player Sprites
        this.load.image('morty-Baby', 'assets/img/morty-baby.png');
        this.load.image('morty-Toddler', 'assets/img/morty-toddler.png');
        this.load.image('morty-Child', 'assets/img/morty-child.png');
        this.load.image('morty-Teen', 'assets/img/morty-teen.png');
        this.load.image('morty-Young Adult', 'assets/img/morty-youngadult.png');
        this.load.image('morty-Adult', 'assets/img/morty-adult.png');
        this.load.image('morty-Senior', 'assets/img/morty-senior.png');

        // Grounds / Backgrounds
        this.load.image('ground', 'assets/img/ground.png');

        // Collectibles
        this.load.image('event', 'assets/img/event.png');

        // SFX
        this.load.audio('morty-hurt', 'assets/sfx/hurt.wav');
        this.load.audio('morty-event', 'assets/sfx/event.wav');
        this.load.audio('music-level', 'assets/sfx/level.wav');
    }

    create() {
        this.backgroundMusic = this.sound.add("music-level", { loop: true, volume: 0.5 });
        this.backgroundMusic.play();

        this.mortyHurt = this.sound.add("morty-hurt");
        this.mortyEvent = this.sound.add("morty-event");

        this.stageIndex = 0;
        this.stages = ['Baby', 'Toddler', 'Child', 'Teen', 'Young Adult', 'Adult', 'Senior'];
        this.stageDurations = [10000, 15000, 17500, 20000, 30000, 60000, 30000];
        this.score = 0;

        this.physics.world.setBounds(0, this.cameras.main.height / 2, 640, 240);
        
        this.ground = this.physics.add.staticGroup();
        this.ground.create(0, 0, 'ground').setOrigin(0, 0);

        this.playerHitboxHeight = 10;
        
        this.player = this.physics.add.sprite(100, 500, 'morty-' + this.stages[this.stageIndex]);
        this.player.setOrigin(0.5, 1).setDepth(1);
        this.player.body.setSize(this.player.width, this.playerHitboxHeight).setOffset(0, this.player.height -this.playerHitboxHeight);
        this.player.setCollideWorldBounds(true);

        this.playerSpeeds = [50, 60, 100, 120, 125, 120, 100];

        this.playerState = {
            speed: 50,
            health: 100,
            injured: false,
            ill: false,
            illTime: 0,
            relationship: null, // { target: object, status: "married"/"girlfriend" }
            hasJob: false,
            emotionalState: 100,
            accomplishment: 0,
        };

        this.add.text(20, 20, 'Stage: ' + this.stages[this.stageIndex], { fontSize: '20px', fill: '#fff' });
        this.scoreText = this.add.text(500, 20, 'Score: 0', { fontSize: '20px', fill: '#fff' });
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.events = this.physics.add.group();

        // this.physics.add.collider(this.player, this.obstacles, this.gameOver, null, this);
        this.physics.add.overlap(this.player, this.events, this.playEvent, null, this);

        this.time.addEvent({ delay: this.stageDurations[this.stageIndex], callback: this.transitionTime, callbackScope: this, loop: false });
        this.time.addEvent({ delay: 1500, callback: this.spawnEvent, callbackScope: this, loop: true });

        // Events (10 for now)
        // 0 - Toy (+emotional state)
        // 1 - Food (+health, +emotional state)
        // 2 - Playdate (+emotional state, RISK illness)
        // 3 - Relationship (RISK +emotional state, SET relationship / -emotional state)
        // 4 - Take Test (CHANCE pass +emotional state, +accomplishment / fail -emotional state)
        // 5 - Car Accident (RANGE -health, -emotional state)
        this.eventMap = [
            (state, evt) => { return { emotionalState: Phaser.Math.Between(5, 10) }; },
            (state, evt) => { return { health: Phaser.Math.Between(2, 8), emotionalState: Phaser.Math.Between(2, 5) }; },
            (state, evt) => { return { emotionalState: Phaser.Math.Between(8, 12), ill: Phaser.Math.Between(0, 100) < 25 }; },
            (state, evt) => {
                if (Phaser.Math.Between(0, 100) < 15) {
                    return {
                        emotionalState: Phaser.Math.Between(10, 20),
                        relationship: { target: evt, status: "date" },
                    };
                } else {
                    return {
                        emotionalState: -Phaser.Math.Between(15, 20),
                    };
                }
            },
            (state, evt) => {
                if (Phaser.Math.Between(0, 100) < 50) {
                    return {
                        emotionalState: Phaser.Math.Between(8, 13),
                        accomplishment: 3,
                    };
                } else {
                    return {
                        emotionalState: -Phaser.Math.Between(10, 13),
                    };
                }
            },
            (state, evt) => { return { health: -Phaser.Math.Between(10, 30), emotionalState: -Phaser.Math.Between(20, 30) }; }
        ];
    }

    update(time, deltaTime) {
        let velocity = new Phaser.Math.Vector2(0, 0);
        
        if (this.cursors.up.isDown) {
            velocity.y -= 1;
        }

        if (this.cursors.down.isDown) {
            velocity.y += 1;
        }

        if (this.cursors.left.isDown) {
            velocity.x -= 1;
        }
        
        if (this.cursors.right.isDown) {
            velocity.x += 1;
        }

        velocity.normalize();

        this.player.setVelocity(velocity.x * this.playerState.speed, velocity.y * this.playerState.speed);
        this.player.setDepth(this.player.y);

        if (this.playerState.ill) {
            this.playerState.illTime -= deltaTime;

            if (Math.floor(this.playerState.illTime) % 500) {
                this.playerState.health -= 1;
            }
            
            if (this.playerState.illTime <= 0) {
                this.playerState.ill = false;
                this.player.setTint(0xFFFFFF);
            }
        }

        if (this.playerState.health <= 0) {
            this.scene.start('Menu');
        }
    }

    transitionTime() {
        this.stageIndex += 1;

        this.player.setTexture('morty-' + this.stages[this.stageIndex]);
        this.player.setOrigin(0.5, 1);
        this.player.body.setOffset(0, this.player.height - this.playerHitboxHeight);

        this.playerState.speed = this.playerSpeeds[this.stageIndex];
        this.playerState.emotionalState -= 25;

        this.time.addEvent({ delay: this.stageDurations[this.stageIndex], callback: this.transitionTime, callbackScope: this, loop: false });
    }

    spawnEvent() {
        let event = this.events.create(800, Phaser.Math.Between(300, 500), 'event');
        event.setOrigin(0.5, 1).setDepth(event.y);
        event.setVelocityX(-200);
        event.body.setSize(event.width, 10).setOffset(0, event.height - 10);

        event.eventType = Phaser.Math.Between(0, 5);

        event.setTint(0x3F0F * (event.eventType + 1));
    }

    playEvent(player, event) {
        console.log(event.eventType);
        let effect = (this.eventMap[event.eventType])(this.playerState, event);

        if (effect.health) {
            this.playerState.health += effect.health;
        }

        if (effect.injured) {
            this.playerState.injured = effect.injured;
        }

        if (effect.ill) {
            this.playerState.ill = effect.ill;
            this.playerState.illTime = Phaser.Math.Between(5000, 15000);
            this.player.setTint(0x00FF00);
        }

        if (effect.relationship) {
            this.playerState.relationship = effect.relationship;
            // event.startFollow(player);
        }

        if (effect.hasJob) {
            this.playerState.hasJob = effect.hasJob;
        }

        if (effect.emotionalState) {
            this.playerState.emotionalState += effect.emotionalState;
        }

        if (effect.accomplishment) {
            this.playerState.accomplishment += effect.accomplishment;
        }

        // if (!effect.relationship)
        event.destroy();
        
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        this.mortyEvent.play();

        console.log(this.playerState);
    }

    gameOver() {
        this.scene.start('GameOver');
    }
}
