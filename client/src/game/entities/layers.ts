/**
 * ------- Layers ---------
 */
import { useJigsStore } from '../../stores/jigs.ts';

export default class Layers {
    jigs: any;


    constructor() {
       this.jigs = useJigsStore();
    }

    loadLayers(scene: Phaser.Scene) {


console.log('********* load Layers *********')


        var map = scene.make.tilemap({ key: this.jigs.city + "_" + this.jigs.tiled, tileWidth: 32, tileHeight: 32 });

        this.jigs.tilesetArray_1.forEach(function loader(image: any) {
            map.addTilesetImage(image);
        }, this);

        this.jigs.tilesetArray_2.forEach(function loader(image: any) {
            map.addTilesetImage(image);
        }, this);

        this.jigs.tilesetArray_3.forEach(function loader(image: any) {
            map.addTilesetImage(image);
        }, this);

        this.jigs.tilesetArray_4.forEach(function loader(image: any) {
            map.addTilesetImage(image);
        }, this);

        scene.colliderMap = map.createLayer('Tile Layer 1', this.jigs.tilesetArray_1).setDepth(1);
        map.createLayer('Tile Layer 2', this.jigs.tilesetArray_2).setDepth(2).setPipeline('Light2D');
        map.createLayer('Tile Layer 3', this.jigs.tilesetArray_3).setDepth(3).setPipeline('Light2D');
        map.createLayer('Tile Layer 4', this.jigs.tilesetArray_4).setDepth(5).setPipeline('Light2D');
       // scene.animatedTiles.init(map);

    }
}
