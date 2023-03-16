export default class menuScene extends Phaser.Scene {
  private title: Phaser.GameObjects.Text
  private playButton: Phaser.GameObjects.Text
  private info: Phaser.GameObjects.Text

  constructor() {
    super('menuScene')
  }
  preload() {
    this.load.image('sky', 'assets/sky.png');
  }
  create() {

    this.add.image(400, 300, 'sky');

    this.title = this.add.text(230, 16, 'Уничтожитель бомб', { fontSize: '32px', color: '#000' });
    this.playButton = this.add.text(320, 120, 'Играть', { fontSize: '32px', color: '#000' });
    this.info = this.add.text(220, 470, `Стрелочки - движение`, { fontSize: '32px', color: '#000' });
    this.info = this.add.text(140, 520, `Левая кнопка мыши - стрельба`, { fontSize: '32px', color: '#000' });

    this.playButton.setInteractive();

    this.playButton.on("pointerup", () => {
      this.scene.start('mainScene');
    })
  }
}