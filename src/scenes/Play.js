class Play extends Phaser.Scene {
    constructor() {
        super({ key: 'Play' });
    }

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
        this.load.image('reward', 'assets/img/reward.png');
        this.load.image('obstacle', 'assets/img/obstacle.png');

        // SFX
        this.load.audio('morty-jump', 'assets/sfx/jump.wav');
    }

    create() {
        this.stageIndex = 0;
        this.stages = ['Baby', 'Toddler', 'Child', 'Teen', 'Young Adult', 'Adult', 'Senior'];
        this.stageDuration = 30000; // 30 seconds per stage
        this.score = 0;
        
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
            relationship: null, // { target: object, status: "married"/"girlfriend" }
            hasJob: false,
            emotionalState: 100,
        };

        this.add.text(20, 20, 'Stage: ' + this.stages[this.stageIndex], { fontSize: '20px', fill: '#fff' });
        this.scoreText = this.add.text(500, 20, 'Score: 0', { fontSize: '20px', fill: '#fff' });
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.rewards = this.physics.add.group();
        this.obstacles = this.physics.add.group();

        this.physics.add.collider(this.player, this.obstacles, this.gameOver, null, this);
        this.physics.add.overlap(this.player, this.rewards, this.collectReward, null, this);

        this.time.addEvent({ delay: this.stageDuration, callback: this.transitionTime, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 1000, callback: this.spawnObstacle, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 1500, callback: this.spawnReward, callbackScope: this, loop: true });
    }

    update() {
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
    }

    transitionTime() {
        this.stageIndex += 1;

        this.player.setTexture('morty-' + this.stages[this.stageIndex]);
        this.player.setOrigin(0.5, 1);
        this.player.body.setOffset(0, this.player.height - this.playerHitboxHeight);

        this.playerState.speed = this.playerSpeeds[this.stageIndex];
        this.playerState.emotionalState -= 25;
    }

    spawnObstacle() {
        let obstacle = this.obstacles.create(800, 550, 'obstacle');
        obstacle.setVelocityX(-200);
    }

    spawnReward() {
        let reward = this.rewards.create(800, Phaser.Math.Between(300, 500), 'reward');
        reward.setOrigin(0.5, 1).setDepth(reward.y);
        reward.setVelocityX(-200);
        reward.body.setSize(reward.width, 10).setOffset(0, reward.height - 10);
    }

    collectReward(player, reward) {
        reward.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    gameOver() {
        this.scene.start('GameOver');
    }
}
