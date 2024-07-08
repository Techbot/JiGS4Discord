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

export class ZombieState extends Schema {
  @type("number") field_mobs_target_id: number;
  @type("string") field_mob_name_value: string;
  @type("number") field_x_value: number;
  @type("number") field_y_value: number;
  @type("number") health: number;
  @type("string") following: string;
  @type("number") dead: number;
  @type("string") direction: string;
}
export class BossState extends Schema {
  @type("number") field_boss_target_id: number;
  @type("string") entity_id: number;
  @type("string") title: string;
  @type("number") x: number;
  @type("number") y: number;
  @type("number") health: number;
  @type("number") dead: number;
  @type("string") direction: string;
}

export class PlayerMap extends Schema {
  profileId: number;
}
