/**
 * -------Walls ---------
 */
import Wall from "../entities/wall";
import { useJigsStore } from '../../stores/jigs.ts';

export default class Walls {

    jigs: any;
    walls: any;

    constructor() {
        this.jigs = useJigsStore();
    }

    add(scene) {
        const wallsArray = this.jigs.wallsArray;
        this.walls = scene.physics.add.staticGroup({ allowGravity: false });
        for (var index = 0; index < wallsArray.length; index++) {
            const wall = new Wall(scene, wallsArray[index].x, wallsArray[index].y, wallsArray[index].width, wallsArray[index].height);
            this.walls.add(wall, true);
            scene.physics.add.existing(wall);
        }
    }
}
