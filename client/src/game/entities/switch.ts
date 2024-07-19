/**
 * -------Switch ---------
 */
import Phaser from "phaser";
import { useJigsStore } from '../../stores/jigs.ts';
import {jigsGet} from '../../utils/JigsAPI.ts';
export default class Switch extends Phaser.Physics.Arcade.Sprite {
  jigs: any;

  constructor(scene, x: number, y: number, id, switchState, startFrame) {

    super(scene, x, y, null);
    console.log('x' + x);
    console.log('y' + y);
    this.setDepth(7);
    scene.add.sprite(0, 0);
    this.setTexture('switch_' + id);

    if (switchState) {
      this.play('switchAnim_' + id + "On");
    } else {
      this.play('switchAnim_' + id + "Off");
      console.log('yo');
      this.setInteractive({ cursor: 'url(/assets/images/cursors/speak.cur), pointer' });
    }
    this.on('pointerdown', this.onSwitchDown.bind(this, id, scene));
    console.log("id:" + id);
  }

  onSwitchDown(id, scene) {
    console.log('switchAnim_' + id);
    this.play('switchAnim_' + id + 'Off');
    if (id != 1) {
      jigsGet("flickswitch?_wrapper_format=drupal_ajax&id=" + id)
        .then((response) => {
          console.log("why");
          scene.hydrateSwitches(id, response);
          scene.events.emit('Switch', id);
        })
    }
    console.log('switch ' + id + ' flicked');
    this.disableInteractive();
  }
}
