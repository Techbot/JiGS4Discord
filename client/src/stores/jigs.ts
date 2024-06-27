// stores/counter.js
import { defineStore } from "pinia";
import axios from "axios";

export const useJigsStore = defineStore("jigs", {
  state: () => ({
    room: {},

    playerName: "Blank",

    discordName: "Blank",

    playerId: 0,

    profileId: 0,

    debug: 0,

    leave: 0,

    /** @type {{ level: number, health: number, strength: number, stamina: number, losses: number, wins: number, xp: number, credits: number, skill: array, inventory : array , mission: array}[]} */
    playerStats: [],

    health: 0,

    thing : false,

    energy: 0,

    playerSwitches: [],

    missionTitle: "Bob",

    missionHandlerDialog: `The Evil Wizard has stolen the Balls of Loveliness. \n
Without the Balls there can be no loveliness across the land. \n
Will you find my Balls?`,

    missionChoice:
      [
        { text: 'Yes I will find your balls.', value: 582 }, // { text: 'A', value: 10 },
        { text: 'No I am not ready.', value: 0 }, // { text: 'B', value: 20 },
      ],
    missionValue: 0,


    playerStorage: [],

    playerInventory: [],

    listBackpack: [],

    listStorage: [],

    playerQuests: [],

    backpackItem: 0,

    item: 0,

    /** @type {{ text: string, x: number, y: number, sprite: number, isHandler: boolean}[]} */
    npcArray: [],

    /** @type {{ target:number, name: string, x: number, y: number, sprite: number, type: string, health: number, following: string}[]} */
    mobArray: [],

    /** @type {{ target:number, name: string, x: number, y: number, type: string, health: number, field_frame_width_value: number, field_frame_height_value: number,}[]} */
    bossesArray: [],

    /** @type {{ text: string, x: number, y: number, sprite: number}[]} */
    rewardsArray: [],

    /** @type {{ text: string }[]} */
    city: "Blank",

    /** @type {{ text: string }[]} */
    gameState: "GamePhaser",

    /** @type {{ text: string }[]} */
    playerGameState: "GamePhaser",

    /** @type {{ text: string }[]} */
    playerState: "dormant",

    nodeID: 0,

    nodeTitle: "Blank",

    // type will be automatically inferred to number
    userMapGrid: 591,

    mapWidth: 120,

    mapHeight: 120,

    tiled: 0,

    soundtrack: 'blank',

    weapon: 0,

    /** @type {{ text: string }[]} */
    content: "Blank",

    npc: 0,

    /** @type {{ text: string }[]} */
    mobClick: '0',

    /** @type {{ text: string }[]} */
    mobShoot: '0',

    tilesetArray_1: [],
    tilesetArray_2: [],
    tilesetArray_3: [],
    tilesetArray_4: [],
    tilesetArray_5: [],
    portalsArray: [],
    switchesArray: [],
    dialogueArray: [],
    firesArray: [],
    fireBarrelsArray: [],
    leversArray: [],
    machineArray: [],
    crystalArray: [],
    questsArray:[],
    foliosArray: [],
    folioClicked: 0,
    wallsArray: [
      //    { x: 260, y: 440, width: 360, height:  10 },
      //    { x: 440, y: 190, width:  10, height: 480 },
      //   { x: 180, y: 540, width:  10, height: 180 },
      //   { x: 140, y: 680, width:  10, height: 160 },
      //    { x: 100, y: 600, width: 120, height:  10 },
    ],
  }),
  getters: {
    finishedTodos(state) {
      // autocompletion! ✨
      return state.todos.filter((todo) => todo.isFinished);
    },
    unfinishedTodos(state) {
      return state.todos.filter((todo) => !todo.isFinished);
    },
    /**
     * @returns {{ text: string, id: number, isFinished: boolean }[]}
     */
    filteredTodos(state) {
      if (this.filter === "finished") {
        // call other getters with autocompletion ✨
        return this.finishedTodos;
      } else if (this.filter === "unfinished") {
        return this.unfinishedTodos;
      }
      return this.todos;
    },
/*     hydrateState(state) {
      return (incMob) => this.hydrate(incMob);
    } */
  },
  actions: {
    // any amount of arguments, return a promise or not
    myInventory() {
      axios
        .get("/myinventory?_wrapper_format=drupal_ajax")
        .then((response) => {
          this.divideInventory(response);
        });
    },
    divideInventory(response) {
      this.playerInventory = response.data[0].value["playerInventory"].items;
      this.listBackpack = [];
      this.listStorage = [];

      let i = 0;
      while (i < this.playerInventory.length) {
        if (this.playerInventory[i].location == 'Backpack') {
          this.listBackpack.push(this.playerInventory[i]);
        }
        if (this.playerInventory[i].location == 'Storage') {
          this.listStorage.push(this.playerInventory[i]);
        }
        i++;
      }
    },
  /*   hydrate(incMob) {
      axios
        .get("states/mystate?_wrapper_format=drupal_ajax&mapGrid=" + this.userMapGrid + "&discordName=" + this.discordName)
        .then((response) => {
          //this.playerStats = response.data[0].value["player"];
          //this.playerId = parseInt(response.data[0].value["player"]["id"]);
          //this.profileId = parseInt(response.data[0].value["player"]["profileId"]);
          //this.playerName = response.data[0].value["player"]["name"];
          //this.playerSwitches = response.data[0].value["player"]["flickedSwitches"];
          //this.userMapGrid = parseInt(response.data[0].value["player"]["userMG"]);
          this.tiled = parseInt(response.data[0].value["MapGrid"]["tiled"]);
          this.soundtrack = response.data[0].value["MapGrid"]["soundtrack"];
          this.mapWidth = parseInt(response.data[0].value["MapGrid"]["mapWidth"]);
          this.mapHeight = parseInt(response.data[0].value["MapGrid"]["mapHeight"]);
          this.portalsArray = response.data[0].value["MapGrid"]["portalsArray"];
          this.switchesArray = response.data[0].value["MapGrid"]["switchesArray"];
          this.dialogueArray = response.data[0].value["MapGrid"]["dialogueArray"];
          this.fireArray = response.data[0].value["MapGrid"]["fireArray"];
          this.fireBarrelsArray = response.data[0].value["MapGrid"]["fireBarrelsArray"];
          this.leverArray = response.data[0].value["MapGrid"]["leverArray"];
          this.machineArray = response.data[0].value["MapGrid"]["machineArray"];
          this.crystalArray = response.data[0].value["MapGrid"]["crystalArray"];
          this.foliosArray = response.data[0].value["MapGrid"]["foliosArray"];
          this.wallsArray = response.data[0].value["MapGrid"]["wallsArray"];
          this.npcArray = response.data[0].value["MapGrid"]["npcArray"];
          if (incMob) {
            this.mobArray = response.data[0].value["MapGrid"]["mobArray"];
          }
          this.bossesArray = response.data[0].value["MapGrid"]["bossesArray"];
          this.rewardsArray = response.data[0].value["MapGrid"]["rewardsArray"];
          this.nodeTitle = response.data[0].value["MapGrid"]["name"];

          this.tilesetArray_1 = response.data[0].value["MapGrid"]["tileset"]["tilesetArray_1"];
          this.tilesetArray_2 = response.data[0].value["MapGrid"]["tileset"]["tilesetArray_2"];
          this.tilesetArray_3 = response.data[0].value["MapGrid"]["tileset"]["tilesetArray_3"];
          this.tilesetArray_4 = response.data[0].value["MapGrid"]["tileset"]["tilesetArray_4"];

          this.city = response.data[0].value["City"];

          // Regex replaces close/open p with \n new line
          // And replaces all other html tags with null.
          this.debug = parseInt(response.data[0].value["gameConfig"]["Debug"]);
          this.content = response.data[0].value["gameConfig"]["Body"].replaceAll('</p><p>', '\n').replaceAll(/(<([^>]+)>)/ig, '');
        })
    },
    hydratePlayer(incMob) {
      axios
        .get("states/myplayer?_wrapper_format=drupal_ajax&discordName=" + this.discordName)
        .then((response) => {
       //   this.playerStats = response.data[0].value["player"];

          this.health = response.data[0].value["player"]['health'];
          this.energy = response.data[0].value["player"]['energy'];

          //this.playerId = parseInt(response.data[0].value["player"]["id"]);
          //this.profileId = parseInt(response.data[0].value["player"]["profileId"]);
          //this.playerName = response.data[0].value["player"]["name"];
          //this.playerSwitches = response.data[0].value["player"]["flickedSwitches"];
          this.userMapGrid = parseInt(response.data[0].value["player"]["mapgrid"]);
          //this.tiled = parseInt(response.data[0].value["MapGrid"]["tiled"]);
        })
    }, */
  },
});
