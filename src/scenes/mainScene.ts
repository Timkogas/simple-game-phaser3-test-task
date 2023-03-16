export default class mainScene extends Phaser.Scene {
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  private stars: Phaser.Physics.Arcade.Group
  private bombs: Phaser.Physics.Arcade.Group
  private platforms: Phaser.Physics.Arcade.StaticGroup
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private bullets: Phaser.Physics.Arcade.Group
  private score: number
  private scoreText: Phaser.GameObjects.Text

  constructor() {
    super('mainScene')
    this.score = 0;
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('bullet', 'assets/bullet.png')
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The this.platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    // The this.player and its settings
    this.player = this.physics.add.sprite(100, 450, 'dude');

    //  this.player physics properties. Give the little guy a slight bounce.
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    //  Our this.player animations, turning, walking left and walking right.
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    //  Some this.stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.bullets = this.physics.add.group();


    this.stars.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {

      //  Give each star a slightly different bounce
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    this.input.on('pointerdown', () => {
      this.shotBullet()
    })

    this.bombs = this.physics.add.group();

    //  The this.score
    this.scoreText = this.add.text(16, 16, 'Счет: 0', { fontSize: '32px', color: '#000' });


    //  Collide the this.player and the this.stars with the this.platforms
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    //  Checks to see if the this.player overlaps with any of the this.stars, if he does call the this.collectStar function
    this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);
    this.physics.add.collider(this.platforms, this.bullets, this.destroyBulletByPlatform, undefined, this);
    this.physics.add.collider(this.bombs, this.bullets, this.destroyBombByBullet, undefined, this);

  }


  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play('right', true);
    }
    else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

  }

  shotBullet() {
    if (this.score > 0) {
      this.score -= 1
      this.scoreText.setText('Счет: ' + this.score);
      var bullet = this.bullets.create(this.player.x, this.player.y, 'bullet');
      const x = this.input.mouse.manager.activePointer.downX
      const y = this.input.mouse.manager.activePointer.downY
      this.physics.moveTo(bullet, x, y, 1000);
    }
  }

  destroyBulletByPlatform(platform: Phaser.Physics.Arcade.Sprite, bullet: Phaser.Physics.Arcade.Sprite) {
    bullet.disableBody(true, true)
  }

  destroyBombByBullet(bomb: Phaser.Physics.Arcade.Sprite, bullet: Phaser.Physics.Arcade.Sprite) {
    bomb.disableBody(true, true)
    bullet.disableBody(true, true)
  }

  collectStar(player: Phaser.Physics.Arcade.Sprite, star: Phaser.Physics.Arcade.Sprite) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText('Счет: ' + this.score);

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    var bomb = this.bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;

    if (this.stars.countActive(true) === 0) {
      //  A new batch of this.stars to collect
      this.stars.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {

        child.enableBody(true, child.x, 0, true, true);

      });


    }
  }

  hitBomb(player: Phaser.Physics.Arcade.Sprite, bomb: Phaser.Physics.Arcade.Sprite) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    this.score = 0
    this.scene.start('menuScene');
  }
}