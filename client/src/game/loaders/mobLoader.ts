/**
 * -------mobLoader ---------
 */

import { useJigsStore } from '../../stores/jigs.ts';

export default class MobLoader{

  jigs: any;

  constructor() {
    this.jigs = useJigsStore();
  }

 add(scene){
  console.log("******* Adding Mob Spritesheets ******")
      if (this.jigs.mobArray) {
        this.jigs.mobArray.forEach(function loader(Mob) {
              console.log("********************* loading");
          scene.load.spritesheet('Zombie-Green-walk-default', '/assets/images/animator/Zombie-Green/walk-default.png', { frameWidth: 64, frameHeight: 64 });
          scene.load.spritesheet('Zombie-Green-hurt-default', '/assets/images/animator/Zombie-Green/hurt-default.png', { frameWidth: 64, frameHeight: 64 });
        }, this);
      }
    }
}
