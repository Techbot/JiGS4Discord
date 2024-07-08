import Phaser from "phaser";
// import WebFont from '../../assets/WebFont'
import { useJigsStore } from '../../stores/jigs.ts';
import { discordSDK } from '../../utils/DiscordSDK.js';
import { colyseusSDK } from '../../utils/Colyseus.js';
import { authenticate } from '../../utils/Auth.js';
import { PlayerObject } from '../../objects/PlayerObject.js';
import type { MyRoomState, Player } from '../../utils/MyRoom.ts';
import axios, { AxiosResponse } from "axios";
import Hydrater  from '../../utils/Hydrater.js';

export class SceneSelector extends Phaser.Scene {
    image: Phaser.GameObjects.Image;
    jigs: any;
    room: any;
    authData: any;
    relay: any;
    hydrater: Hydrater;

    constructor() {
        super({ key: "selector" });
        this.jigs = useJigsStore();
        this.hydrater = new Hydrater;

    }

    preload() {
        // update menu background color
        this.cameras.main.setBackgroundColor(0x000000);
        // this.load.addFile(new WebFont(this.load, ['Roboto', 'Neutron Demo']))
        this.load.image('auth', '/assets/images/game-home-authenticating.png');
        this.load.image('enter', '/assets/images/game-home.png');
    }

    async create() {

        this.image = this.add.image(480, 320, 'auth')

        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            color: "#ff0000",
            fontSize: "32px",
            fontFamily: "Neutron Demo"
        };

        try {
            /**
             * Authenticate with Discord and get Colyseus JWT token
             */
            if (this.authData == undefined) {
                this.authData = await authenticate();
            }
            // Assign the token to authenticate with Colyseus (Room's onAuth)
            colyseusSDK.auth.token = this.authData.token;
            console.log("*******************   Authenticated       ************");
        } catch (e) {
            console.error("**************** Failed to authenticate *********", e);
            return;
        }

        // add connection status text
        const connectionStatusText = this.add
            .text(0, 0, "Trying to connect with the server...")
            .setStyle({ color: "#ff0000" })
            .setPadding(4)

        this.relay = await colyseusSDK.joinOrCreate<MyRoomState>("your_relayed_room", {
            channelId: discordSDK.channelId, // join by channel ID
            playerId: 1,
            profileId: 1
        });


        this.relay.state.players.onAdd((player: any,sessionId) => {
            this.image = this.add.image(480, 320, 'enter')
                .setInteractive({ cursor: 'url(/assets/images/cursors/speak.cur), pointer' }).
                on("pointerdown", () => {
                    this.game.scene.switch("selector", 'main');
                });
              console.log('////////////////////////////////' + player.username)
            //////////////////////////////////////////////////////////////////////////


            if (sessionId === this.relay.sessionId) {

            this.jigs.discordName = player.username;
            this.updatePlayer();
            }




        })
        this.relay.state.players.onRemove((player, sessionId) => {
        });
    }

    async updatePlayer() {
        await axios
            .get("states/myplayer?_wrapper_format=drupal_ajax&discordName=" + this.jigs.discordName)
            .then((response) => {
                this.hydrater.hydratePlayer(response);
            })
            .then((response) => {
                this.updateState()
            })
    }

    async updateState() {
        console.log("---------- Update State ------------------")
        await axios
            .get("states/mystate?_wrapper_format=drupal_ajax&mapGrid=" + this.jigs.userMapGrid)
            .then((response) => {
                console.log("---------- Response Recieved  ------------------")
                this.hydrater.hydrateMap(response, 1);
            })
    }
}
