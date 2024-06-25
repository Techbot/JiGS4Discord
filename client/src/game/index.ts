import Phaser from "phaser";

import { SceneSelector } from "./scenes/SceneSelector.js";
import { MainScene } from "./scenes/MainScene.js";
import { HudScene } from "./scenes/HudScene.js";
import { BootScene } from "./scenes/BootScene.js";
import { DeadScene } from "./scenes/DeadScene.js";
import { CutScene } from "./scenes/CutScene.js";

//import { BACKEND_HTTP_URL } from "./backend";

//import {RexUIPlugin} from '../utils/rexuiplugin.min.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    fps: {
        target: 30,
        forceSetTimeOut: true,
        smoothStep: false,
    },
    width: 960,
    height: 640,
    // height: 200,
    backgroundColor: '#000000',
    parent: 'game-container',
    physics: {
        default: "arcade"
    },
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: RexUIPlugin,
            mapping: 'rexUI'
        },
        ]
    },
    dom: {
        createContainer: true
    },
    pixelArt: true,
    scene: [BootScene, SceneSelector, MainScene, DeadScene, HudScene, CutScene],
    // scene: [ MainScene ],
};

const game = new Phaser.Game(config);
