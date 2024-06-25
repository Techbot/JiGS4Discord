var mysql = require("mysql2");
import config from '../services/db';

var con = mysql.createPool({
  connectionLimit: 10,
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

function getPlayer_old(player) {
  return new Promise(function (resolve, reject) {
    con.query(
      `SELECT
      users_field_data.name,
      users_field_data.login,
      profile.profile_id,
      profile__field_x.field_x_value,
      profile__field_y.field_y_value,
      profile__field_health.field_health_value,
      profile__field_missions.field_missions_target_id as missions
      FROM users_field_data
      LEFT JOIN profile
      ON  profile.uid                     =  users_field_data.uid
      AND type                            = 'player'
      INNER JOIN profile__field_x
      ON  profile__field_x.entity_id      =  profile.profile_id
      INNER JOIN profile__field_y
      ON  profile__field_y.entity_id      =  profile.profile_id
      INNER JOIN profile__field_health
      ON  profile__field_health.entity_id =  profile.profile_id
      LEFT JOIN profile__field_missions
      ON profile__field_missions.entity_id = profile.profile_id
      WHERE  users_field_data.uid         = ` + player
      ,
      function (err, result) {
        if (err) throw err;
        resolve(result);
      }
    );
  })
}

function getPlayer(player: string) {
  return new Promise(function (resolve, reject) {
    con.query(
      `SELECT
      players.player,
      players.x,
      players.y,
      players.health
      FROM players
      WHERE  players.player         = '` + player + `'`
      ,
      function (err, result) {
        if (err) throw err;
        resolve(result);
      }
    );
  })
}

async function checkNewPlayer(player) {

  console.log('Check New Player id ' + player.id);
  console.log('Check New Player username' + player.username);

  const playerArray = await getAllPlayers();

  console.log(playerArray);

  if (playerArray.indexOf(player.username) >= 0) {

    console.log('player exists ' + player.username);

    return;

  } else {
    console.log('player does not exist ' + player.username);
    savePlayer(player)
  }

}

function getAllPlayers() {

  console.log('retrieving all players');

  return new Promise(function (resolve, reject) {
    con.query(
      `SELECT players.player
      FROM players`
      ,
      function (err, result) {
        const playerArray = new Array;
        if (err) throw err;

        result.forEach((element: any) => {
          playerArray.push(element.player)
        });

        resolve(playerArray);
      }
    );
  })
}


function savePlayer(player: { id: string; username: string; }) {

  console.log('saving player' + player.username);

  con.query(
    `INSERT INTO players (player, mapgrid) VALUES ('` + player.username + `', 1)`,
    function (err, result, fields) {
      if (err) throw err;
      return true;
    }
  );
}



function updateFlag(flag, player, key) {
  return new Promise(function (resolve, reject) {

    var http = require('https');
    var options = {
      host: 'localhost',
      port: 80,
      path: '/updateFlag?_wrapper_format=drupal_ajax&id=' + flag + 'id=' + player + 'key=' + key
    };
    var req = http.get(options, function (response) {
      // handle the response
      var res_data = '';
      response.on('data', function (chunk) {
        res_data += chunk;
      });
      response.on('end', function () {
        console.log(res_data);
      });
    });
    req.on('error', function (err) {
      console.log("Request error: " + err.message);
    });
  })
}

function updateMapOld(id, map) {

  con.query(
    `UPDATE profile__field_map_grid SET field_map_grid_target_id = ` +
    map + ` WHERE profile__field_map_grid.entity_id = ` + id,
    function (err, result, fields) {
      if (err) throw err;
      return true;
    }
  );
}


function updateMap(username: string, map: number) {

  con.query(
    `UPDATE players SET mapgrid = ` +
    map + ` WHERE players.player = '` + username + `'`,
    function (err, result, fields) {
      if (err) throw err;
      return true;
    }
  );
}

function updatePlayerStats(id: string, stat: string | undefined, value: string, replace: any) {

  console.log("id:" + id);
  console.log("stat:" + stat);

  if (stat == undefined) {
    return;
  }

  if (replace) {

    con.query(
      `UPDATE players` +
      ` SET ` + stat + ` = ` + value +
      ` WHERE players.player = '` + id +`'`,
      function (err, result, fields) {
        if (err) throw err;
        return true;
      }
    );

  } else {

    con.query(
      `UPDATE players` +
      ` SET ` + stat + ` = ` + stat + ` + ` + value +
      ` WHERE players.player = ` + id,
      function (err, result, fields) {
        if (err) throw err;
        return true;
      }
    );
  }
}

module.exports = {
  getPlayer,
  updateMap,
  updatePlayerStats,
  updateFlag,
  checkNewPlayer
}
