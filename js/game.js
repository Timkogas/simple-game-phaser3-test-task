import mainScene from "./mainScene.js";
import { menuScene } from "./menuScene.js";

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: [menuScene, mainScene]
};

new Phaser.Game(config);
