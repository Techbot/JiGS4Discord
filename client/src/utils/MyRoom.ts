
import { Schema, MapSchema, type } from "@colyseus/schema";

export class Vec2 extends Schema {
  @type("number") x: number;
  @type("number") y: number;
}

export class Player extends Schema {
  @type("string") username: string;
  @type("number") heroType: number; // sprite to use (1-12)
  @type(Vec2) position = new Vec2();

  @type("number") x: number;
  @type("number") y: number;
  @type("number") tick: number;
  @type("number") mouseX: number;
  @type("number") mouseY: number;
  @type("number") health: number;

  inputQueue: InputData[] = [];
  P2: Promise<void>;
  id: string;
  portal: number;
  Body: any;
  playerId: number;
  profileId: number;
  lastX: number;
  lastY: number;
  p2Player: any;

}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

