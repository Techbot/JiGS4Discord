/**
 * ------- Messenger ---------
 */
export default class Messenger {
  room: any;
  scene: any;

  initMessages(scene: any) {

    console.log("*************************  Wot Now ??      *************************");
    scene.jigs.room.onMessage("portal", (message: any) => {

      console.log('***** recieved prtal message *****' + message)

      scene.jigs.userMapGrid = message;
      const promise1 = Promise.resolve(scene.jump());

      //  hide(this.localPlayer);
    });

    scene.jigs.room.onMessage("collide", (message) => {
      let i = 0;
      while (i < scene.jigs.mobArray.length) {
        //  scene.MobContainerArray[i].x = scene.jigs.mobArray[i][1];
        //  scene.MobContainerArray[i].y = scene.jigs.mobArray[i][2];
        i++;
      }
    });

     scene.jigs.room.onMessage("dead", (message) => {
      console.log('dead');
      if (scene.jigs.playerState != "dead") {
        scene.currentPlayer.anims.play('hurt_' + scene.jigs.playerStats.sprite_sheet);
      }
      scene.jigs.playerState = "dead";
    });

    scene.jigs.room.onMessage("reward", (message) => {
      scene.jigs.playerStats.credits++;
      //   this.incrementReward();
    });

    scene.jigs.room.onMessage("player hit", (message) => {
      scene.updateState();
    });

    scene.jigs.room.onMessage("struck", (message) => {
      console.log('struck:' + message);
      scene.jigs.playerStats.health = message;
    });

    scene.jigs.room.onMessage("zombie dead", (message) => {
      let i = 0;
      while (i < scene.jigs.mobArray.length) {
        if (scene.jigs.mobArray[i][1] == message) {
          scene.Mobs.SceneMobArray[i].play('hurt_mob' + scene.jigs.mobArray[i][4]);
          //   scene.Mobs.SceneMobArray[i].setPosition(parseInt(scene.jigs.mobArray[i].x), parseInt(scene.jigs.mobArray[i].y));
        }
        i++;
      }
      scene.updateState();
    });

    /*     scene.room.onMessage("remove-reward", (message) => {
          let i = 0;
          while (i < scene.rewardsArray.length) {
            if (scene.rewardsArray[i].ref == message) {
              //  scene.rewardsArray[i].disableBody(true, true);
            }
            i++;
          }
        }); */

    /*     scene.room.onStateChange((state) => {
          //
        }); */

    /*     scene.room.onStateChange.once((state) => {
          // console.log("the room state has been updated:", state);
        }); */

    scene.jigs.room.state.mobResult.onChange((value, key) => {
      console.log('*************** mob result ******' + key)
      console.log('*************** x **********' + value.field_x_value)



      let i = 0;
      while (i < scene.jigs.mobArray.length) {
        if (scene.jigs.mobArray[i][1] == key) {
          scene.jigs.mobArray[i][2] = parseInt(value.field_x_value);
          scene.jigs.mobArray[i][3] = parseInt(value.field_y_value);
          scene.jigs.mobArray[i][6] = parseInt(value.health);
          scene.jigs.mobArray[i][7] = value.direction;
        }
        i++;
      }
    });

    scene.jigs.room.state.bossResult.onChange((value, key) => {

      console.log('****************** boss result ********************' + key)
      let i = 0;
      while (i < scene.jigs.bossesArray.length) {

        console.log('****************** boss key' + value.entity_id)
        console.log('****************** boss 2' + scene.jigs.bossesArray[i].target)

        if (scene.jigs.bossesArray[i].target == key) {

          console.log('****************** boss direction' + value.direction)

          scene.jigs.bossesArray[i].x = parseInt(value.x);
          scene.jigs.bossesArray[i].y = parseInt(value.y);
          scene.jigs.bossesArray[i].health = parseInt(value.health);
          scene.jigs.bossesArray[i].direction = value.direction;
        }
        i++;
      }    });
  }
}
