class Play extends Phaser.Scene {
    constructor() {
        super({ key: 'Play' });
    }

    preload() {
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('ground', 'assets/sprites/ground.png');
        this.load.image('reward', 'assets/sprites/reward.png');
        this.load.image('obstacle', 'assets/sprites/obstacle.png');
    }

    create() {
        this.stageIndex = 0;
        this.stages = ['Toddler', 'Elementary', 'Teenager', 'Young Adult', 'Adult', 'Senior'];
        this.stageDuration = 30000; // 30 seconds per stage
        this.score = 0;
        
        this.add.text(20, 20, 'Stage: ' + this.stages[this.stageIndex], { fontSize: '20px', fill: '#fff' });
        this.scoreText = this.add.text(600, 20, 'Score: 0', { fontSize: '20px', fill: '#fff' });
        
        this.ground = this.physics.add.staticGroup();
        this.ground.create(400, 580, 'ground').setScale(2).refreshBody();
        
        this.player = this.physics.add.sprite(100, 500, 'player');
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