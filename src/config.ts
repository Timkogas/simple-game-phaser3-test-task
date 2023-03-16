import mainScene from "./scenes/mainScene";
import menuScene from "./scenes/menuScene";


export const GameConfig: Phaser.Types.Core.GameConfig = {
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