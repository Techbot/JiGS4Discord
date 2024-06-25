////////////////////////////////////////////////////////////////////////////////
//
//
//
////////////////////////////////////////////////////////////////////////////////
//var Bridge = require('../services/bridge.ts');
var playerModel = require('../models/player.ts');

export class portalCollider {

  do(room, bodyA, bodyB) {
    if (bodyA.isPortal) {
        console.log('portal ');
      if (!bodyA.done) {
        //    const missionAccepted = room.state.missionAccepted;
        //    const player = bodyB.client_id;
        //    const playerFlags = bodyB.flags;

        //    if (playerFlags.includes(missionAccepted)) {
        const promise1 = Promise.resolve(playerModel.updateMap(bodyB.discordName, bodyA.destination));
        promise1
          .then(() => { bodyB.portal = bodyA.destination; })// defining .portal triggers the jump for the client
          .then(() => {
            //        console.log(bodyA.destination_x);
            playerModel.updatePlayerStats(bodyB.discordName, 'x', bodyA.destination_x, 1)
          })
          .then(() => {
            //         console.log(bodyA.destination_y);
            playerModel.updatePlayerStats(bodyB.discordName, 'y', bodyA.destination_y, 1)
          });
        bodyA.done = true;
        //   }
      }
    }
  }
}
