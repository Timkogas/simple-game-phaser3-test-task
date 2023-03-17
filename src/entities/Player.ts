
export class Player extends Phaser.Physics.Arcade.Sprite {
  private _scene: Phaser.Scene

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
    super(scene, x, y, texture, frame);
    this._scene = scene
    this.play('thrust');
    this._initPhysics()
    this._initAnimations()
  }

  private _initPhysics(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
  }

  private _initAnimations(): void {
    this._scene.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this._scene.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });
    this._scene.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
  }

  public jump(): void {
    this.setVelocityY(-330);
  }

  public stay(): void {
    this.setVelocityX(0);
    this.anims.play('turn');
  }

  public moveRight(): void {
    this.setVelocityX(160);
    this.anims.play('right', true);
  }

  public moveLeft(): void {
    this.setVelocityX(-160);
    this.anims.play('left', true);
  }

  public death(): void {
    this.setTint(0xff0000);
    this.anims.play('turn');
  }
}
