export class Bullet extends Phaser.Physics.Arcade.Group {
  private _scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this._scene = scene
  }

  public shoot(xStart: number, yStart: number, xEnd: number, yEnd: number, texture: string): void {
    const bullet = this.create(xStart, yStart, texture);
    this._scene.physics.moveTo(bullet, xEnd, yEnd, 1000);
  }

}
