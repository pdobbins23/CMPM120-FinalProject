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

        const playerHitboxHeight = 10;
        
        this.player = this.physics.add.sprite(100, 500, 'morty-' + this.stages[this.stageIndex]);
        this.player.setOrigin(0.5, 1).setDepth(1);
        this.player.body.setSize(this.player.width, playerHitboxHeight).setOffset(0, this.player.height -playerHitboxHeight);
        this.player.setCollideWorldBounds(true);

        this.playerSpeed = 160;

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
        let velocity = {x: 0, y: 0};
        
        if (this.cursors.up.isDown) {
            velocity.y -= this.playerSpeed;
        }

        if (this.cursors.down.isDown) {
            velocity.y += this.playerSpeed;
        }

        if (this.cursors.left.isDown) {
            velocity.x -= this.playerSpeed;
        }
        
        if (this.cursors.right.isDown) {
            velocity.x += this.playerSpeed;
        }

        this.player.setVelocity(velocity.x, velocity.y);
    }

    transitionTime() {
        this.stageIndex += 1;

        this.player.setTexture('morty-' + this.stages[this.stageIndex]);
        this.player.setOrigin(0.5, 1);
        this.player.body.setSize(this.player.width, this.player.height);
    }

    spawnObstacle() {
        let obstacle = this.obstacles.create(800, 550, 'obstacle');
        obstacle.setVelocityX(-200);
    }

    spawnReward() {
        let reward = this.rewards.create(800, Phaser.Math.Between(300, 500), 'reward');
        reward.setVelocityX(-200);
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
