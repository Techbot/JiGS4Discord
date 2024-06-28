///////////////////////////////////////////////////////////////////////////////
//
//
//////////////////////////////////////////////////////////////////////////////
import { ZombieState } from "./GameState";
//var Bridge = require('../services/bridge.ts');
var roomModel = require('../models/room.ts');
var playerModel = require('../models/player.ts');
var p2 = require('p2');
export class Mob {
  pause: number;
  constructor() {
    this.pause = 0;
  }

  async load(room, nodeNumber: number, share) {
    roomModel.getMobs(nodeNumber).then((result: any) => {
      result.forEach(mobState => {
        const mobItem = Mob.updateZombieState(room,
          undefined,
          undefined,
          undefined,
          undefined,
          100,
          0,
          undefined,
          mobState,
          undefined,
          undefined
        );
        room.state.mobResult.set(mobState.field_mob_name_value, mobItem);
      });
      return result;
    }).then((newResult: any) => {
      for (let i = 0; i < newResult.length; i++) {
        newResult[i].health = 100;
        var p2Mob = this.make(newResult[i], share);
        p2Mob.destinationX = 0;
        p2Mob.destinationY = 0;
        room.world.addBody(p2Mob);
        room.P2mobBodies.push(p2Mob);
      }
    }).catch(function () {
      console.log('Mob shit');
    });
  }

  make(mob: any, share: any) {
    const circleShape = new p2.Circle({ radius: 10 });
    circleShape.collisionGroup = share.COL_ENEMY;
    circleShape.collisionMask = share.COL_PLAYER | share.COL_GROUND;

    const circleBody = new p2.Body({
      mass: 20,
      position: [mob.field_x_value, mob.field_y_value],
      angle: 0,
      type: p2.Body.DYNAMIC,
      collisionResponse: true,
      velocity: [0, 0],
      angularVelocity: 0
    });
    circleBody.field_mobs_target_id = mob.field_mobs_target_id;
    circleBody.field_mob_name_value = mob.field_mob_name_value
    circleBody.health = mob.health;
    circleBody.isMob = true;
    circleBody.dead = false;
    circleBody.sensor = true;
    circleBody.addShape(circleShape);
    //this.circleBody.onBeginContact.add(this.checkHits(), this);
    // Add the body to the world
    return circleBody
  }

  updateMob(room) {
    if (room.P2mobBodies.length > 0) {
      // Update destination every 2 seconds for one of the mobs
      if (room.pause == 0) {
        room.pause = 1;
        const myPromise = new Promise((resolve, reject) => {
          resolve(Math.ceil(Math.random() * room.P2mobBodies.length - 1));
        });

        myPromise.then((mobNumber) => {
          this.updateMobForce(room.P2mobBodies[mobNumber]);
          room.pause = 0;
        });
      }

      let i = 0;
      //////////////////////////Cycle through Mob bodies
      while (i < room.P2mobBodies.length) {
        room.P2mobBodies[i].setZeroForce();

        /////////////////////// CYCLE THROUGH MOB  State /////////////////////////////
        room.state.mobResult.forEach(mobState => {
          if (mobState.dead != 1) {

            if (room.P2mobBodies[i].field_mob_name_value == mobState.field_mob_name_value) {
              //if  not following someone, do the test
              if (mobState.following == undefined) {
                //if state x,y is out of date
                if (parseInt(mobState.field_x_value) != parseInt(room.P2mobBodies[i].position[0])
                  || parseInt(mobState.field_y_value) != parseInt(room.P2mobBodies[i].position[1])) {
                  this.sendObject(room, mobState, i);
                }

                room.state.players.forEach(player => {
                  //find distance
                  var mobPlayerDist = Math.hypot(player.x - parseInt(room.P2mobBodies[i].position[0]), player.y - parseInt(room.P2mobBodies[i].position[1]));
                  if (mobPlayerDist < 160) {

                    console.log(mobState.field_mob_name_value + ' is following ' + player.p2Player.discordName);

                    // this is to update the mobs follower
                    mobState.following = player.p2Player.discordName;
                  }
                  this.sendObject(room, mobState, i)
                })
              }

              if (mobState.following) {

                //  console.log(mobState.field_mob_name_value + ' is still following ');

                room.state.players.forEach((player: { discordName: any; x: number; y: number; p2Player: { discordName: string; Body: any; }; }) => {
                  if (mobState.dead) {
                    room.P2mobBodies[i].velocity[0] = 0;
                    room.P2mobBodies[i].velocity[1] = 0;
                  }
                  //follow the first player in the array
                  else if (player.p2Player.discordName == mobState.following && !mobState.dead) {

                    console.log(mobState.field_mob_name_value + ' is still following  the' + player.p2Player.discordName);




                    var mobPlayerDist = Math.hypot(player.x - parseInt(room.P2mobBodies[i].position[0]), player.y - parseInt(room.P2mobBodies[i].position[1]));

                    if (mobPlayerDist > 160) {
                      // this is to update the mobs follower
                      mobState.following = undefined;
                      room.P2mobBodies[i].velocity[0] = 0;
                      room.P2mobBodies[i].velocity[1] = 0;
                    }
                    else {
                      this.adjustVelocity(room.P2mobBodies[i], player.p2Player.Body, 20);
                      this.sendObject(room, mobState, i)
                    }
                  }
                })
              };
            }
          }
        });
        i++;
      };
    };
  }

  adjustVelocity(body, body2, amount) {

    console.log("adjusting velocity");

    if (!body.dead) {
      body.velocity[0] = 0;
      if (parseInt(body.position[0]) > body2.position[0]+50) {
        body.velocity[0] = -amount;
        body.velocity[1] = 0;
        body.direction ='Left'
      }
      if (parseInt(body.position[0]) < body2.position[0]-50) {
        body.velocity[0] = amount;
        body.velocity[1] = 0;
        body.direction = 'Right'
      }
      if (parseInt(body.position[1]) > body2.position[1]+50) {
        body.velocity[0] = 0;
        body.velocity[1] = -amount;
        body.direction = 'Up'
      }
       if (parseInt(body.position[1]) < body2.position[1]-50) {
        body.velocity[0] = 0;
        body.velocity[1] = amount;
        body.direction = 'Down'
      }
    }
  }

  mobClicked(room, input, player) {
    if (input.mobClick != '') {
      room.state.mobResult.forEach(element => {


      });

      if (room.state.mobResult[input.mobClick] != undefined) {
        Mob.updateZombieState(room,
          room.state.mobResult[input.mobClick].field_mobs_target_id,
          room.state.mobResult[input.mobClick].field_mob_name_value,
          undefined, // x
          undefined, // y
          undefined,
          undefined,
          undefined,
          room.state.mobResult[input.mobClick],
          undefined,
          undefined
        )
        if (room.state.mobResult[input.mobClick].health > 0) {
          room.state.mobResult[input.mobClick].health -= 20;

          //    console.log(input.mobClick + "with " + self.state.mobResult[input.mobClick].health + "health, was attacked by " + player.playerId);

          if (room.state.mobResult[input.mobClick].health == 0) {
            console.log('zombie dead');
            // if mob is dead update health and dead and following
            const death = 1;
            //self.state.mobResult[input.mobClick].mass = 0;

            let i = 0;
            while (i < room.P2mobBodies.length) {
              if (room.P2mobBodies[i].field_mob_name_value == room.state.mobResult[input.mobClick].field_mob_name_value) {
                console.log('died here');
                room.state.mobResult[input.mobClick].dead = 1;
                room.P2mobBodies[i].dead = true;
                room.P2mobBodies[i].velocity[0] = 0;
                room.P2mobBodies[i].velocity[1] = 0;
                // room.P2mobBodies[i].mass = 0;
                // room.P2mobBodies[i].updateMassProperties();
              }
              i++;
            }

            const mobItem = Mob.updateZombieState(
              room,
              undefined, //target_id
              undefined, // name
              undefined, //x
              undefined, //y
              0, //health
              death, //dead
              undefined,//following
              room.state.mobResult[input.mobClick],
              undefined,
              undefined
            )

            room.state.mobResult.set(room.state.mobResult[input.mobClick], mobItem);
            const promise1 = Promise.resolve(playerModel.updatePlayerStats(player.discordName, 'credits', 10, 0));
            promise1.then(() => {
            });
            return 1;
          }
          if (room.state.mobResult[input.mobClick].health < 0) {
            room.state.mobResult[input.mobClick].health = 0;
          }
          else {
            const promise1 = Promise.resolve(playerModel.updatePlayerStats(player.discordName, 'credits', 1, 0));
            promise1.then(() => {
            });
          }
          return 0;
        }
      }
    }
  };

  async updateMobForce(body) {

    await this.skip(2000);
    // var forceX = (Math.ceil(Math.random() * 50) + 20) * (Math.round(Math.random()) ? 1 : -1);
    //  var forceY = (Math.ceil(Math.random() * 50) + 20) * (Math.round(Math.random()) ? 1 : -1);
    var forceX = (Math.ceil(Math.random() * 50) + 20);
    var forceY = (Math.ceil(Math.random() * 50) + 20);

    if (body.dead != true) {
      body.velocity[0] = forceX;
      body.velocity[1] = forceY;
    }
  }

  skip(val) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('resolved');
      }, val);
    });
  }

  // Sets up a zombie state with the original values, then updates

  static updateZombieState(
    room: { P2mobBodies: { position: string[]; }[]; },
    target_id: number | undefined,
    name: string | undefined,
     x: number | undefined,
     y: number | undefined,
    health: number | undefined,
    dead: number | undefined,
    following: string | undefined,
    mobState: {
      direction: string|undefined; field_mobs_target_id: number; field_mob_name_value: string; field_x_value: number; field_y_value: number; following: string; health: number; dead: number;
},
    i: number | undefined,
    direction:string|undefined,
  ) {
    const mobItem = new ZombieState();
    if (mobState != undefined) {
      mobItem.field_mobs_target_id = mobState.field_mobs_target_id;
      mobItem.field_mob_name_value = mobState.field_mob_name_value;
      mobItem.field_x_value = mobState.field_x_value;
      mobItem.field_y_value = mobState.field_y_value;
      mobItem.health = mobState.health;
      mobItem.dead = mobState.dead;
      mobItem.following = mobState.following;
      mobItem.direction = mobState.direction;
    }
    if (i != undefined) {
      mobItem.field_x_value = parseInt(room.P2mobBodies[i].position[0]);
      mobItem.field_y_value = parseInt(room.P2mobBodies[i].position[1]);
    }
    if (target_id != undefined) { mobItem.field_mobs_target_id = target_id; }
    if (name != undefined) { mobItem.field_mob_name_value = name; }
    if (x != undefined) { mobItem.field_x_value = x; }
    if (y != undefined) { mobItem.field_y_value = y; }
    if (health != undefined) { mobItem.health = health; }
    if (dead != undefined) { mobItem.dead = dead; }
    if (following != undefined) { mobItem.following = following; }
    if (direction != undefined) { mobItem.direction = direction; }


    //worldThing.state.mobResult.set(mobState.field_mob_name_value, mobItem);
    return mobItem;
  }

  sendObject(room, mobState, i) {
     mobState.x = 0;
     mobState.y = 0
    if (parseInt(room.P2mobBodies[i].position[0])) {
      mobState.x = parseInt(room.P2mobBodies[i].position[0]);
    }
    if (parseInt(room.P2mobBodies[i].position[1])) {
      mobState.y = parseInt(room.P2mobBodies[i].position[1]);
    }

    mobState.direction = room.P2mobBodies[i].direction;

    const mobItem = Mob.updateZombieState(
      room,
      mobState.field_mobs_target_id,
      mobState.field_mob_name_value,
      mobState.x,
      mobState.y,
      undefined, //health
      undefined, //dead
      mobState.following,
      mobState,
      i,
      mobState.direction
    )
    room.state.mobResult.set(mobItem.field_mob_name_value, mobItem);
  }
}
