class Play extends Phaser.Scene {
	constructor() {
		super("playScene");
	}

	preload() {
		// Player Sprites
		this.load.spritesheet("morty-Baby", "assets/img/morty-baby.png", {
			frameWidth: 48,
		});
		this.load.spritesheet("morty-Full", "assets/img/morty-full.png", {
			frameWidth: 48,
			frameHeight: 144,
		});

		// Backgrounds
		this.load.image("house", "assets/img/house.png");
		this.load.image("school", "assets/img/school.png");
		this.load.image("office", "assets/img/office.png");
		this.load.image("sky", "assets/img/sky.png");

		// Events
		this.load.image("travel", "assets/img/travel.png");
		this.load.image("toy", "assets/img/toy.png");
		this.load.image("taketest", "assets/img/take_test.png");
		this.load.image("study", "assets/img/study.png");
		this.load.image("sports", "assets/img/sports.png");
		this.load.spritesheet("social", "assets/img/social.png", {
			frameWidth: 48,
		});
		this.load.image("sleep", "assets/img/sleep.png");
		this.load.image("retire", "assets/img/retire.png");
		this.load.image("newcar", "assets/img/new_car.png");
		this.load.image("love", "assets/img/love.png");
		this.load.image("junkfood", "assets/img/junk_food.png");
		this.load.image("job", "assets/img/job.png");
		this.load.image("gamble", "assets/img/gamble.png");
		this.load.image("food", "assets/img/food.png");
		this.load.image("doctors", "assets/img/doctors.png");
		this.load.image("buyhouse", "assets/img/buy_house.png");

		// SFX
		this.load.audio("morty-hurt", "assets/sfx/hurt.wav");
		this.load.audio("morty-event", "assets/sfx/event.wav");
		this.load.audio("music-level", "assets/sfx/level.wav");
	}

	create() {
		this.anims.create({
			key: "social-event",
			frameRate: 5,
			repeat: -1,
			frames: this.anims.generateFrameNumbers("social", {
				start: 0,
				end: 3,
			}),
		});
		// Morty Baby Animaions
		this.anims.create({
			key: "Baby-Normal-Walk",
			frameRate: 5,
			repeat: -1,
			frames: this.anims.generateFrameNumbers("morty-Baby", {
				start: 0,
				end: 3,
			}),
		});
		this.anims.create({
			key: "Baby-Sick-Walk",
			frameRate: 5,
			repeat: -1,
			frames: this.anims.generateFrameNumbers("morty-Baby", {
				start: 4,
				end: 7,
			}),
		});

		// Morty Animations
		let animNames = ["Senior", "AdultJob", "Adult", "Teen"];
		let animSubNames = ["Sad-Walk", "Happy-Walk", "Normal-Walk", "Sick-Walk"];

		animNames.forEach((an, i) => {
			animSubNames.forEach((sn, j) => {
				let start = i * 16 + j * 4;
				let end = start + 4 - 1;

				console.log("SPRITE: " + an + "-" + sn + " : " + start + " - " + end);

				this.anims.create({
					key: an + "-" + sn,
					frameRate: 5,
					repeat: -1,
					frames: this.anims.generateFrameNumbers("morty-Full", {
						start,
						end,
					}),
				});
			});
		});

		this.backgroundMusic = this.sound.add("music-level", {
			loop: true,
			volume: 0.5,
		});
		this.backgroundMusic.play();

		this.backgrounds = {
			house: ["Baby", "Senior"],
			school: ["Child", "Teen"],
			office: ["Adult"],
		};

		this.currentBackgroundKey = "house";

		this.currentBackground = this.add
			.tileSprite(
				0,
				0,
				this.cameras.main.width,
				this.cameras.main.height,
				this.currentBackgroundKey,
			)
			.setOrigin(0)
			.setDepth(0);

		this.mortyHurt = this.sound.add("morty-hurt");
		this.mortyEvent = this.sound.add("morty-event");

		this.stageIndex = 0;
		this.stages = ["Baby", "Child", "Teen", "Adult", "Senior"];
		this.stageDurations = [10000, 15000, 17500, 20000, 30000, 60000, 30000];
		// different times for each level to lead to game ending

		this.playerSprites = {
			Baby: "Baby",
			Child: "Teen",
			Teen: "Teen",
			Adult: "Adult",
			AdultJob: "AdultJob",
			Senior: "Senior",
		};

		this.score = 0;

		this.physics.world.setBounds(0, this.cameras.main.height / 2, 640, 240);

		// Backgrounds

		// this.ground = this.add
			// .tileSprite(0, 0, 0, 0, "house", 0)
			// .setOrigin(0)
			// .setDepth(10);
		this.updateBackground();

		this.playerHitboxHeight = 10;

		this.player = this.physics.add.sprite(
			100,
			500,
			"morty-Baby",
		);
		this.player.setOrigin(0.5, 1).setDepth(100);
		this.player.body
			.setSize(this.player.width, this.playerHitboxHeight)
			.setOffset(0, this.player.height - this.playerHitboxHeight);
		this.player.setCollideWorldBounds(true);
		//player design/physics

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
		//states that affect score

		this.stageText = this.add
			.text(20, 20, "Stage: " + this.stages[this.stageIndex], {
				fontSize: "20px",
				fill: "#fff",
			})
			.setDepth(11);

		this.scoreText = this.add
			.text(500, 20, "Score: 0", {
				fontSize: "20px",
				fill: "#fff",
			})
			.setDepth(11);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.events = this.physics.add.group();

		this.physics.add.overlap(
			this.player,
			this.events,
			this.playEvent,
			null,
			this,
		);

		this.time.addEvent({
			delay: this.stageDurations[this.stageIndex],
			callback: this.transitionTime,
			callbackScope: this,
			loop: false,
		});
		this.time.addEvent({
			delay: 1500,
			callback: this.spawnEvent,
			callbackScope: this,
			loop: true,
		});
		this.eventSprites = {
			0: "travel",
			1: "toy",
			2: "taketest",
			3: "study",
			4: "sports",
			5: "social",
			6: "sleep",
			7: "retire",
			8: "newcar",
			9: "love",
			10: "junkfood",
			11: "job",
			12: "gamble",
			13: "food",
			14: "doctors",
			15: "buyhouse",
		};
		this.stageEventMap = {
			Baby: [1, 5, 6, 13],  // Toy, Social, Sleep, Food
			Child: [1, 2, 3, 4, 5, 6, 10, 13],  // Toy, TakeTest, Study, Sports, Social, Sleep, JunkFood, Food
			Teen: [2, 3, 4, 6, 9, 10, 11, 13],  // TakeTest, Study, Sports, Sleep, Love, JunkFood, Food, Job
			Adult: [0, 6, 8, 9, 10, 12, 11, 13, 14, 15],  // Travel, Sleep, NewCar, Love, JunkFood, Gamble, Job, Food, Doctors, BuyHouse
			Senior: [0, 6, 7, 8, 11, 13, 14, 15, 12],  // Travel, Sleep, Retire, NewCar, Food, Doctors, BuyHouse, Gamble
		};
		

		// Events (10 for now)
		this.eventMap = {
			0: (state, evt) => {
				return { emotionalState: Phaser.Math.Between(5, 10) };
			},
			1: (state, evt) => {
				return {
					health: Phaser.Math.Between(2, 8),
					emotionalState: Phaser.Math.Between(2, 5),
				};
			},
			2: (state, evt) => {
				return {
					emotionalState: Phaser.Math.Between(8, 12),
					accomplishment: 2,
				};
			},
			3: (state, evt) => {
				return {
					emotionalState: Phaser.Math.Between(6, 12),
					accomplishment: 1,
				};
			},
			4: (state, evt) => {
				return {
					health: Phaser.Math.Between(4, 10),
					emotionalState: Phaser.Math.Between(5, 10),
				};
			},
			5: (state, evt) => {
				return {
					emotionalState: Phaser.Math.Between(10, 15),
					socialLife: Phaser.Math.Between(5, 10),
				};
			},
			6: (state, evt) => {
				return { health: Phaser.Math.Between(8, 12) };
			},
			7: (state, evt) => {
				return {
					emotionalState: Phaser.Math.Between(15, 20),
					accomplishment: 5,
				};
			},
			8: (state, evt) => {
				return {
					emotionalState: Phaser.Math.Between(5, 10),
					financialState: Phaser.Math.Between(-10, -5),
				};
			},
			9: (state, evt) => {
				return {
					emotionalState: Phaser.Math.Between(10, 20),
					relationship: { target: evt, status: "partner" },
				};
			},
			10: (state, evt) => {
				return { health: Phaser.Math.Between(-5, -10) };
			},
			11: (state, evt) => {
				return {
					accomplishment: Phaser.Math.Between(3, 7),
					financialState: Phaser.Math.Between(10, 20),
				};
			},
			12: (state, evt) => {
				return { financialState: Phaser.Math.Between(-20, 10) };
			},
			13: (state, evt) => {
				return { health: Phaser.Math.Between(5, 15) };
			},
			14: (state, evt) => {
				return { health: Phaser.Math.Between(10, 20) };
			},
			15: (state, evt) => {
				return {
					financialState: Phaser.Math.Between(-30, -10),
					accomplishment: 10,
				};
			},
		};
		this.highScore = localStorage.getItem("highScore") || 0;

		this.highScoreText = this.add
			.text(450, 50, "High Score: " + this.highScore, {
				fontSize: "20px",
				fill: "#fff",
			})
			.setDepth(11);

		this.money = 0;  // Start with zero money
		this.jobDuration = 0;  // Track how long player has had a job
		this.jobText = ""
			
		this.moneyText = this.add.text(20, 50, "Money: $" + this.money, {
			fontSize: "20px",
			fill: "#fff",
		}).setDepth(15);
		this.jobText = this.add.text(20, 80, "Job: " + this.jobText, {
			fontSize: "20px",
			fill: "#fff",
		}).setDepth(15);
			

		this.emitter = this.add
			.particles(0, 0, "particle", {
				frame: [],
				lifespan: 3000,
				speed: { min: 200, max: 250 },
				scale: { start: 0.6, end: 0 },
				gravityY: 0,
				blendMode: "ADD",
				emitting: false,
			})
			.setDepth(11);

		this.player.play("Baby-Normal-Walk");
	}

	update(time, deltaTime) {
		this.currentBackground.tilePositionX += (this.playerState.speed * deltaTime) / 1000;
		
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
		//player movement

		velocity.normalize();

		this.player.setVelocity(
			velocity.x * this.playerState.speed,
			velocity.y * this.playerState.speed,
		);
		this.player.setDepth(100 + this.player.y);

		if (this.playerState.ill) {
			this.playerState.illTime -= deltaTime;

			if (Math.floor(this.playerState.illTime) % 500) {
				this.playerState.health -= 1;
			}

			if (this.playerState.illTime <= 0) {
				this.playerState.ill = false;
				this.player.setTint(0xffffff);
				this.gameOver();
			}
		}

		if (this.playerState.health <= 0) {
			this.scene.start("GameOver");
		}
	}

	currentPlayerSprite() {
		let stage = this.stages[this.stageIndex];
		let baseSprite =
			this.playerSprites[stage] + (this.playerState.hasJob ? "Job" : "");

		if (this.playerState.ill) {
			return baseSprite + "-Sick-Walk";
		} else if (this.stageIndex > 0) {
			if (this.playerState.emotionalState > 75) {
				return baseSprite + "-Happy-Walk";
			} else if (this.playerState.emotionalState > 45) {
				return baseSprite + "-Normal-Walk";
			} else if (this.playerState.emotionalState <= 45) {
				return baseSprite + "-Sad-Walk";
			}
		}

		return baseSprite + "-Normal-Walk";
	}

	transitionTime() {
		this.stageIndex += 1;
		if (this.stageIndex >= this.stages.length) {
			this.gameOver(); 
			return;
		}

		console.log("NEW SPRITE: " + this.currentPlayerSprite());

		this.player.play(this.currentPlayerSprite());
		this.player.setOrigin(0.5, 1);
		this.player.body.setOffset(0, this.player.height - this.playerHitboxHeight);

		this.playerState.speed = this.playerSpeeds[this.stageIndex];
		this.playerState.emotionalState -= 25;

		this.updateBackground();
		this.stageText.setText("Stage: " + this.stages[this.stageIndex]);

		this.time.addEvent({
			delay: this.stageDurations[this.stageIndex],
			callback: this.transitionTime,
			callbackScope: this,
			loop: false,
		});
	}

	updateBackground(deltaTime) {
		let currentStage = this.stages[this.stageIndex];
		for (let bg in this.backgrounds) {
			if (this.backgrounds[bg].includes(currentStage)) {
				if (this.currentBackgroundKey !== bg) {
					this.currentBackgroundKey = bg;
					if (this.currentBackground) {
						this.currentBackground.destroy(); // Remove old background
					}
					this.currentBackground = this.add
						.tileSprite(
							0,
							0,
							this.cameras.main.width,
							this.cameras.main.height,
							bg,
						)
						.setOrigin(0)
						.setDepth(10);
				}
				break;
			}
		}
	}

	spawnEvent() {
		let currentStage = this.stages[this.stageIndex];  // Get current stage
		let allowedEvents = this.stageEventMap[currentStage];  // Get events allowed for this stage
	
		if (!allowedEvents || allowedEvents.length === 0) return;  // Prevent errors if no events exist
	
		let eventTypeIndex = Phaser.Math.RND.pick(allowedEvents);  // Pick a random event from allowed list
		let eventSprite = this.eventSprites[eventTypeIndex];
	
		let event = this.events.create(800, Phaser.Math.Between(300, 500), eventSprite);
		
		if (eventTypeIndex === 5) {  // If social event, play animation
			event.play("social-event");
		}
	
		event.setOrigin(0.5, 1).setDepth(100 + event.y);
		event.setVelocityX(-200);
		event.body.setSize(event.width, 10).setOffset(0, event.height - 10);
	
		event.eventType = eventTypeIndex;
	}
	
	//events randomly coming

	playEvent(player, event) {
		console.log(event.eventType);
		let effect = this.eventMap[event.eventType](this.playerState, event);

		if (effect.health) {
			this.playerState.health += effect.health;
		}

		if (effect.injured) {
			this.playerState.injured = effect.injured;
		}

		if (effect.ill) {
			this.playerState.ill = effect.ill;
			this.playerState.illTime = Phaser.Math.Between(5000, 15000);
			this.player.setTint(0x00ff00);
			this.gameOver();
			//if ill then game over
		}

		if (effect.relationship) {
			this.playerState.relationship = effect.relationship;

			// event.startFollow(player);
		}

		if (effect.hasJob) {
			this.playerState.hasJob = effect.hasJob;
			jobText = "Yes"
			this.jobText.setText("Job: " + this.jobText);
			this.jobDuration += 1;
		}

		if (effect.emotionalState) {
			this.playerState.emotionalState += effect.emotionalState;
		}

		if (effect.accomplishment) {
			this.playerState.accomplishment += effect.accomplishment;
		}
		if (effect.financialState) {
			this.money += effect.financialState;
			this.moneyText.setText("Money: $" + this.money);
		}
		if ((event.eventType === 8 || event.eventType === 15) && this.jobDuration < 3) {
			this.jobText.setText("You need a job to buy this!");
			
			// Clear warning after 2 seconds
			this.time.delayedCall(2000, () => {
				this.jobText.setText("");
			});
	
			return; // Prevents the event from applying
		}

		// if (!effect.relationship)
		this.emitter.setPosition(event.x, event.y);
		this.emitter.explode(10);
		//particles when event is picked up
		event.destroy();

		this.score += 10;
		this.scoreText.setText("Score: " + this.score);

		if (this.score > this.highScore) {
			this.highScore = this.score;
			this.highScoreText.setText("High Score: " + this.highScore);
			localStorage.setItem("highScore", this.highScore);
		}

		this.mortyEvent.play();

		console.log(this.playerState);

		this.player.play(this.currentPlayerSprite());
	}

	gameOver() {
		this.scene.start("GameOver");
	}
}
