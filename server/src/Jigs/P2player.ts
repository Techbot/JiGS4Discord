///////////////////////////////////////////////////////////////////////////////
//
// https://github.com/damian-pastorini/p2js-tiledmap-demo/blob/master/test-town.html
//
//////////////////////////////////////////////////////////////////////////////
import { InputData, MyRoomState, Player } from "./GameState";

var p2 = require('p2');
//var Bridge = require('../services/bridge.ts');
var playerModel = require('../models/player.ts');

export class P2player {
  Body: any;
  playerUuid: any;

  constructor(uuid:string) {
    this.playerUuid = uuid;
  }
  async load(share: any, player: any) {
    try {
      const profile: any = await playerModel.getPlayerProfile(this.playerUuid);
      player.profileId = profile.attributes.drupal_internal__profile_id;
      player.profileUuid = profile.id;
      this.Body = new p2.Body({
        mass: 1,
        position: [profile.attributes.field_x, profile.attributes.field_y],
        health: profile.attributes.field_health,
        angle: 0,
        type: p2.Body.DYNAMIC,
        collisionResponse: true,
        velocity: [0, 0],
        angularVelocity: 0
      });
      const playerShape = new p2.Box({ width: 32, height: 32 });
      playerShape.collisionGroup = share.COL_PLAYER;
      playerShape.collisionMask = share.COL_ENEMY | share.COL_GROUND;
      this.Body.isPlayer = true;
      // @TODO Figure out how to put this line back
      // this.Body.flags = result[0].flags;
      this.Body.addShape(playerShape);
      player.x = this.Body.position[0];
      player.y = this.Body.position[1];
    } catch(error: any) {
      console.log("P2player Error", error);
    }
  }

  update(input: InputData,
    player: {
      direction: string; lastX: any; lastY: any; Body: { collide: any; position: any[]; }; x: number; y: number; tick: any;
},
    velocity: number) {
    velocity = 76;

    this.Body.velocity[0] = 0;
    this.Body.velocity[1] = 0;

    if (input.inputX !== player.lastX) {
      player.lastX = input.inputX;
    }
    if (input.inputY !== player.lastY) {
      player.lastY = input.inputY;
    }
    if (input.down) {
      if (!this.Body.collide) {
        this.Body.velocity[1] = velocity;
        this.Body.velocity[0] = 0;
        player.direction ="Down"
      }
      else {
        this.Body.position[0] += 32;
      }
    }
    else if (input.up) {
      if (!this.Body.collide) {

        this.Body.velocity[1] = -velocity;
        this.Body.velocity[0] = 0;
        player.direction = "Up"
      }
      else {
        this.Body.position[0] -= 32;
      }
    }
    else if (input.right) {
      if (!this.Body.collide) {
        this.Body.velocity[1] = 0;
        this.Body.velocity[0] = velocity;
        player.direction = "Right"
      }
      else {
        this.Body.position[1] += 32;
      }
    }
    else if (input.left) {
      if (!this.Body.collide) {
        this.Body.velocity[1] = 0;
        this.Body.velocity[0] = -velocity;
        player.direction = "Left"
      }
      else {
        this.Body.position[1] -= 32;
      }
    }
    player.x = this.Body.position[0];
    player.y = this.Body.position[1];
    /*   if (this.last_step_x != player.playerBody.position[0] || this.last_step_y != player.playerBody.position[1]) {
      //  console.log(player.playerBody.position[0], player.playerBody.position[1])
        this.last_step_x = player.playerBody.position[0];
        this.last_step_y = player.playerBody.position[1];
      } */
    player.tick = input.tick;
    return player;
  }
}
