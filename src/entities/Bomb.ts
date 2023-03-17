export class Bomb extends Phaser.Physics.Arcade.Group {
  private _scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this._scene = scene
  }

  public createOne(x: number, y: number, texture: string): void {
    var bomb = this.create(x, y, texture);
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }

}
