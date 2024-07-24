import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { auth, JWT } from "@colyseus/auth";
//import type { MyRoomState} from './rooms/MyRoom.ts';
//import loaders from './loaders';
//import { createServer } from "http";
import globalEmitter from './loaders/eventEmitter';
import run from "./cron/run"
import { RelayRoom } from "colyseus";
const gameModel = require('./models/game.ts');
const playerModel = require('./models/player.ts');
/**
 * Import your Room files
 */
//import { MyRoom } from "./rooms/MyRoom";


import { GameRoom } from "./Jigs/GameRoom";
import { PreRoom } from "./Jigs/PreRoom";

export default config({

  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */

    /*         gameServer.define('my_room', MyRoom)
                .filterBy(['channelId']); */



    // Expose your relayed room
    gameServer.define("your_relayed_room", PreRoom, {
      maxClients: 4,
      allowReconnectionTime: 120
    });


    const roomNumber = new Map<number, string>([]);

    gameModel.getRooms().then((result: any) => {
      result.forEach((element: any) => {
        console.log(element.nid + " " + element.title + '-' + padding(element.field_tiled_value, 3, 0));
        roomNumber.set(element.nid, element.title + '-' + padding(element.field_tiled_value, 3, 0));
      });
      for (const [nodeNumber, nodeName] of [...roomNumber]) {

        gameServer.define(nodeName, GameRoom, { nodeNumber: nodeNumber, nodeName: nodeName });
      }

    });

  },

  initializeExpress: (app) => {
    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    app.get("/hello_world", (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    //
    // Discord Embedded SDK: Retrieve user token when under Discord/Embed
    //
    app.post('/discord_token', async (req, res) => {
      try {
        //
        // Retrieve access token from Discord API
        //
        const response = await fetch(`https://discord.com/api/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: req.body.code,
          }),
        });

        const { access_token } = await response.json();

        //
        // Retrieve user data from Discord API
        // https://discord.com/developers/docs/resources/user#user-object
        //

        const profile = await (await fetch(`https://discord.com/api/users/@me`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${access_token}`,
          }
        })).json();

        // Load existing Drupal user by discord_id or create a new one if none exists
        const user = await playerModel.getOrCreateDiscordUser(profile);

        res.send({
          access_token, // Discord Access Token
          token: await JWT.sign(user), // Colyseus JWT token
          user // User data
        });

      } catch (e: any) {
        console.log("discord_token error", e);
        res.status(400).send({ error: e.message });
      }
    });

    app.post('/local_token', async (req, res) => {
      if (req.body.playerId) {
        try {
          // Make sure this is a real user
          const user = await playerModel.getDiscordPlayer(req.body.playerId);
          if(user) {
            res.send({ access_token: "mocked", token: await JWT.sign(user), user });
            return;
          }
        } catch (e: any) {
          console.log("local_token error", e);
          res.status(400).send({ error: e.message });
        }
      }
    });

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (process.env.NODE_ENV !== "production") {
      app.use("/", playground);
    }

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use("/colyseus", monitor());

    //
    // See more about the Authentication Module:
    // https://docs.colyseus.io/authentication/
    //
    // app.use(auth.prefix, auth.routes())
    //
  },


  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  }
});



function padding(n: number, p: number, c: any) {
  var pad_char = typeof c !== 'undefined' ? c : '0';
  var pad = new Array(1 + p).join(pad_char);
  return (pad + n).slice(-pad.length);
}
