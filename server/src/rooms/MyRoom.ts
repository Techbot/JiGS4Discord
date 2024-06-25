import { JWT } from "@colyseus/auth";
import { Room, Client } from "@colyseus/core";
import { Schema, MapSchema, type } from "@colyseus/schema";

export class Vec2 extends Schema {
  @type("number") x: number;
  @type("number") y: number;
}

export interface InputData {
  left: false;
  right: false;
  up: false;
  down: false;
  inputX: number;
  inputY: number;
  tick: number;
  mobClick: string;
}

export class Player extends Schema {
  @type("string") username: string;
  @type("number") heroType: number; // sprite to use (1-12)
  @type(Vec2) position = new Vec2();


}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;



  
  static onAuth(token: string) {
    return JWT.verify(token);
  }





  onCreate (options: any) {
    this.setState(new MyRoomState());

    // this.setPatchRate(1000 / 60);

    this.onMessage("move", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      player.position.x = message.x;
      player.position.y = message.y;
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    const player = new Player();
    player.username = client.auth?.username || "Guest";


    console.log(player.username);



    player.heroType = Math.floor(Math.random() * 12) + 1;
    player.position.x = Math.floor(Math.random() * 100);
    player.position.y = Math.floor(Math.random() * 100);
    this.state.players.set(client.sessionId, player);


    console.log('done');




  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
