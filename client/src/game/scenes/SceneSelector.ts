import Phaser from "phaser";
// import WebFont from '../../assets/WebFont'
import { useJigsStore } from '../../stores/jigs.ts';
import { discordSDK } from '../../utils/DiscordSDK.js';
import { colyseusSDK } from '../../utils/Colyseus.js';
import { authenticate, authenticateLocal } from '../../utils/Auth.ts';
import type { MyRoomState } from '../../utils/MyRoom.ts';
import { jigsGet } from '../../utils/JigsAPI.ts';
import Hydrater from '../../utils/Hydrater.js';

const ASSETS_URL = import.meta.env.VITE_ASSETS_URL;

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
        this.load.image('auth', ASSETS_URL + '/assets/images/game-home-authenticating.png');
        this.load.image('enter', ASSETS_URL + '/assets/images/game-home.png');
    }

    async create() {

        this.image = this.add.image(480, 320, 'auth')

        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            color: "#ff0000",
            fontSize: "32px",
            fontFamily: "Neutron Demo"
        };
        // add connection status text
        const connectionStatusText = this.add
            .text(0, 0, "Trying to connect with the server...")
            .setStyle({ color: "#ff0000" })
            .setPadding(4)

        // Check if there's a user id in the query string
        const queryParams = new URLSearchParams(window.location.search);
        const discordId = queryParams.get('discord_id')?.substring(0, 5); // Limit to 5 to quickly avoid SQL injections
        let channelId = "1";

        // If there's a user id, authenticate locally, otherwise authenticate with Discord
        if (discordId) {
            try {
                this.authData = await authenticateLocal(discordId);
                if (!this.authData) {
                    console.error("Failed to authenticate", this.authData.error);
                    return;
                }
                colyseusSDK.auth.token = this.authData.token;
                console.log("*******************   Authenticated       ************", this.authData);
            } catch (e) {
                console.error("**************** Failed to authenticate *********", e);
                return;
            }

        } else {
            try {
                /**
                 * Authenticate with Discord and get Colyseus JWT token
                 */
                this.authData = await authenticate();
                // Assign the token to authenticate with Colyseus (Room's onAuth)
                colyseusSDK.auth.token = this.authData.token;
                if (discordSDK.channelId) {
                    channelId = discordSDK.channelId;
                }
                console.log("*******************   Authenticated       ************", this.authData);
            } catch (e) {
                console.error("**************** Failed to authenticate *********", e);
                return;
            }
        }
        const roomName = "your_relayed_room";
        const options = {
            channelId: channelId,
            playerUuid: this.authData.user.id,
            playerId: this.authData.user.attributes.drupal_internal__uid,
            playerName: this.authData.user.attributes.name
        };
        this.relay = await colyseusSDK.joinOrCreate<MyRoomState>(roomName, options);
        this.relay.state.players.onAdd((player: any, sessionId: string) => {
            this.image = this.add.image(480, 320, 'enter')
                .setInteractive({ cursor: `url(${ASSETS_URL}/assets/images/cursors/speak.cur), pointer` })
                .on("pointerdown", () => {
                    this.game.scene.switch("selector", 'main');
                });
            if (sessionId === this.relay.sessionId) {
                this.jigs.playerId = player.playerId;
                this.jigs.playerUuid = player.playerUuid;
                this.jigs.playerName = player.playerName;
                this.updatePlayer();
            }
        })
        this.relay.state.players.onRemove((player, sessionId) => {
        });
    }

    updatePlayer() {
        jigsGet("/states/myplayer?_wrapper_format=drupal_ajax&uid=" + this.jigs.playerId)
            .then((response) => {
                this.hydrater.hydratePlayer(response);
            })
            .then((response) => {
                this.updateState()
            })
    }

    updateState() {
        console.log("---------- Update State ------------------")
        jigsGet("/states/mystate?_wrapper_format=drupal_ajax&mapGrid=" + this.jigs.userMapGrid)
            .then((response) => {
                console.log("---------- Response Recieved  ------------------")
                this.hydrater.hydrateMap(response, 1);
            })
    }
}
