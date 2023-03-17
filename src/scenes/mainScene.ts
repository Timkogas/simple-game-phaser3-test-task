import { Bomb } from "../entities/Bomb"
import { Bullet } from "../entities/Bullet"
import { Player } from "../entities/Player"

export default class mainScene extends Phaser.Scene {
  private _player: Player
  private _stars: Phaser.Physics.Arcade.Group
  private _bombs: Bomb
  private _platforms: Phaser.Physics.Arcade.StaticGroup
  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private _bullets: Bullet
  private _score: number
  private _scoreText: Phaser.GameObjects.Text

  constructor() {
    super('mainScene')
    this._score = 0;
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

    //  The this._platforms group contains the ground and the 2 ledges we can jump on
    this._platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    this._platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    this._platforms.create(600, 400, 'ground');
    this._platforms.create(50, 250, 'ground');
    this._platforms.create(750, 220, 'ground');

    // The this._player and its settings
    this._player = new Player(this, 100, 450, 'dude')
    this._bullets = new Bullet(this);

    //  Input Events
    this._cursors = this.input.keyboard.createCursorKeys();

    //  Some this._stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    this._stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this._stars.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    this._bombs = new Bomb(this)
    //  The this._score
    this._scoreText = this.add.text(16, 16, 'Счет: 0', { fontSize: '32px', color: '#000' });

    this.input.on('pointerdown', () => {
      this.shotBullet()
    })

    //  Collide the this._player and the this._stars with the this._platforms
    this.physics.add.collider(this._player, this._platforms);
    this.physics.add.collider(this._stars, this._platforms);
    this.physics.add.collider(this._bombs, this._platforms);

    //  Checks to see if the this._player overlaps with any of the this._stars, if he does call the this.collectStar function
    this.physics.add.overlap(this._player, this._stars, this.collectStar, undefined, this);
    this.physics.add.collider(this._player, this._bombs, this.hitBomb, undefined, this);
    this.physics.add.collider(this._platforms, this._bullets, this.destroyBulletByPlatform, undefined, this);
    this.physics.add.collider(this._bombs, this._bullets, this.destroyBombByBullet, undefined, this);

  }


  update() {
    if (this._cursors.left.isDown) {
      this._player.moveLeft()
    }
    else if (this._cursors.right.isDown) {
      this._player.moveRight()
    }
    else {
      this._player.stay()
    }
    if (this._cursors.up.isDown && this._player.body.touching.down) {
      this._player.jump()
    }
  }

  public shotBullet(): void {
    if (this._score > 0) {
      this._score -= 1
      this._scoreText.setText('Счет: ' + this._score);
      const x = this.input.mouse.manager.activePointer.downX
      const y = this.input.mouse.manager.activePointer.downY
      this._bullets.shoot(this._player.x, this._player.y, x, y, 'bullet')
    }
  }

  public destroyBulletByPlatform(platform: Phaser.Physics.Arcade.Sprite, bullet: Phaser.Physics.Arcade.Sprite): void {
    bullet.disableBody(true, true)
  }

  public destroyBombByBullet(bomb: Phaser.Physics.Arcade.Sprite, bullet: Phaser.Physics.Arcade.Sprite): void {
    bomb.disableBody(true, true)
    bullet.disableBody(true, true)
  }

  public collectStar(_player: Phaser.Physics.Arcade.Sprite, star: Phaser.Physics.Arcade.Sprite): void {
    star.disableBody(true, true);

    this._score += 10;
    this._scoreText.setText('Счет: ' + this._score);

    var x = (_player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    this._bombs.createOne(x, 16, 'bomb')

    if (this._stars.countActive(true) === 0) {
      //  A new batch of this._stars to collect
      this._stars.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {

        child.enableBody(true, child.x, 0, true, true);

      });


    }
  }

  public hitBomb(_player: Phaser.Physics.Arcade.Sprite, bomb: Phaser.Physics.Arcade.Sprite): void {
    this.physics.pause();
    this._player.death()
    this._score = 0
    this.scene.start('menuScene');
  }
}