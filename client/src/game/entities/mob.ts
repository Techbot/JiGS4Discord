/**
 * ------- Mob ---------
 */
import Phaser from "phaser";
import { useJigsStore } from '../../stores/jigs.ts';


export default class Mob extends Phaser.Physics.Arcade.Sprite {
    jigs: any;
    previousDirection: string | undefined;

    constructor(scene, x, y, sprite, name) {
        super(scene, 0, 0, null);


        scene.children.add(this).play('Zombie-Green-walk-default', true);

        //scene.add.sprite(0, 0).play('Zombie-Green-hurt-default',true);
        // this.jigs = useJigsStore();

        console.log('******* setting textures: ' + name);
        console.log('******  x: ' + x);
        console.log('****** y: ' + y);
        //  this.setTexture('mob' + sprite)
        //this.setTexture('Zombie-Green-walk-default');
        //   this.setTexture('npc61993' , 4);
        // this.play('walkDown_mob' + sprite);
        //this.play('Zombie-Green-hurt-default');
        this.setInteractive({ cursor: 'url(/assets/images/cursors/attack.cur), pointer' })
        this.setScale(.85)
        this.on('pointerdown', this.onMobDown.bind(this, name));
        this.loadMob(sprite);
        this.setDepth(5);
        this.previousDirection = undefined;
    }

    updateAnim(direction: string|undefined) {
        if (direction == undefined|| !this.anims.isPlaying || direction ==this.previousDirection ){
            return;
        }
        this.anims.play('Zombie-Green-walk' + direction + '-default',true);
        this.previousDirection = direction;
    }

    onMobDown(name) {
        this.jigs.mobClick = name;
        this.jigs.mobShoot = name;
        this.jigs.playerStats.credits++;
        if (this.jigs.debug) {
            console.log('mob clicked: ' + name);
        }
    }

    loadMob(sprite) {
        console.log('******** mob added' + sprite);
    }
}
