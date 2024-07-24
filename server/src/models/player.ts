import {drupalGet, drupalPost, drupalPatch} from "../services/drupal";

async function getPlayer(uuid: string) {
  const result = await drupalGet(`/user/user/${uuid}`);
  if(result.data) {
    return result.data;
  }
  return null;
}

async function getPlayerProfile(uuid: string) {
  const result = await drupalGet(`/profile/player/?filter[uid.id][value]=${uuid}`);
  if(result.data && result.data[0]) {
    return result.data[0];
  }
  return null;
}

async function getDiscordPlayer(playerId: string) {
  const result = await drupalGet(`/user/user/?filter[field_discord_id]=${playerId}`);
  if(result.data && result.data[0]) {
    return result.data[0];
  }
  return null;
}

async function getOrCreateDiscordUser(user: any) {
  const playerCheck = await getDiscordPlayer(user.id);
  if (playerCheck) {
    return playerCheck;
  } else {
    const player = await createPlayer(user);
    if(player.data) {
      return player.data;
    }
    return null;
  }
}

async function createPlayer(player: { id: string; username: string; }) {
  // Hardcoded role uuid is just a fallback
  let roleuuid = "72d6b608-4620-461c-ad1e-6bc74a055d0c";
  const role = await drupalGet('/user_role/user_role?filter[label]=player');
  if(role.data && role.data[0]) {
    roleuuid = role.data[0].id;
  }
  const newPlayer = await drupalPost('/user/user', {
    "data": {
      "type": "user--user",
      "attributes": {
        "name": player.username,
        "status": "1",
        "field_discord_id": {
          "value": player.id
        }
      },
      "relationships": {
        "roles": {
          "data": {
            "type": "user_role--user_role",
            "id": roleuuid
          }
        }
      }
    }
  });
  if(newPlayer.data) {
    try {
      await createPlayerProfile(newPlayer.data.id);
      return newPlayer;
    } catch (e) {
      console.error('Failed to create player profile', e);
    }
  }
}

async function createPlayerProfile(uuid: string) {
  console.log("creating player profile");
  const profile = await drupalPost('/profile/player', {
    "data": {
      "type": "profile--player",
      "relationships": {
        "uid": {
          "data": {
            "type": "user--user",
            "id": uuid
          }
        }
      }
    }
  });
}

// @TODO still not working
async function updateMap(uuid: string, map: string) {
  return await drupalPatch('/profile/player/' + uuid, {
    "data": {
      "type": "profile--player",
      "id": uuid,
      "relationships": {
        "field_map_grid": {
          "data": {
            "type": "node--map_grid",
            "id": map // uuid
          }
        }
      }
    }
  });
}

// @TODO still not working or complete
async function updatePlayerStats(uuid: string, stat: string | undefined, value: string, replace: any) {
  const statField = `field_${stat}`;
  const statVal = 0; // Placeholder, replace with actual stat value
  const data: any = {
    "type": "profile--player",
    "id": uuid,
    "attributes": {}
  };
  data.attributes[statField] = { "value": (replace) ? value : statVal + value };
  return await drupalPatch('/profile/player/' + uuid, {
    data
  });
}

async function updatePlayerSwitch(uuid:string) {
  // @TODO placeholder, not sure what this is supposed to do
  // Called from switchCollider.ts
}

module.exports = {
  getPlayer,
  getPlayerProfile,
  getDiscordPlayer,
  updateMap,
  updatePlayerStats,
  updatePlayerSwitch,
  getOrCreateDiscordUser
}
