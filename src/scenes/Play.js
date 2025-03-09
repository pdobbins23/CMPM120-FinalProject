class Play extends Phaser.Scene {
    constructor() {
        super({ key: 'Play' });
    }

    preload() {
        // Player Sprites
        this.load.image('morty-baby', 'assets/img/morty-baby.png');
        this.load.image('morty-toddler', 'assets/img/morty-toddler.png');
        this.load.image('morty-child', 'assets/img/morty-child.png');
        this.load.image('morty-teen', 'assets/img/morty-teen.png');
        this.load.image('morty-youngadult', 'assets/img/morty-youngadult.png');
        this.load.image('morty-adult', 'assets/img/morty-adult.png');
        this.load.image('morty-senior', 'assets/img/morty-senior.png');

        // Grounds / Backgrounds
        this.load.image('ground', 'assets/img/ground.png');

        // Collectibles
        this.load.image('reward', 'assets/img/reward.png');
        this.load.image('obstacle', 'assets/img/obstacle.png');
    }

    create() {
        this.stageIndex = 0;
        this.stages = ['baby', 'toddler', 'child', 'teen', 'youngadult', 'adult', 'senior'];
        this.stageDuration = 30000; // 30 seconds per stage
        this.score = 0;
        
        this.add.text(20, 20, 'Stage: ' + this.stages[this.stageIndex], { fontSize: '20px', fill: '#fff' });
        this.scoreText = this.add.text(600, 20, 'Score: 0', { fontSize: '20px', fill: '#fff' });
        
        this.ground = this.physics.add.staticGroup();
        this.ground.create(400, 580, 'ground').setScale(2).refreshBody();
        
        this.player = this.physics.add.sprite(100, 500, 'morty-' + this.stages[this.stageIndex]);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.ground);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.rewards = this.physics.add.group();
        this.obstacles = this.physics.add.group();

        this.physics.add.collider(this.player, this.obstacles, this.gameOver, null, this);
        this.physics.add.overlap(this.player, this.rewards, this.collectReward, null, this);

        this.time.addEvent({ delay: 1000, callback: this.spawnObstacle, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 1500, callback: this.spawnReward, callbackScope: this, loop: true });
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
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
