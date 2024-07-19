/**
 * -------Portals ---------
 */
import Phaser from "phaser";

export default class Portal extends Phaser.Physics.Arcade.Sprite {
  pathIndex: number;

  constructor(scene, x, y) {
    super(scene, x, y, 'exit');
    this.pathIndex = 0;
    this.setDepth(6);
  }

}
