# JiGS 4 Discord
## A Colyseus and Drupal Backend for an Online Realtime Multiplayer RPG Trading game engine in Discord.

![JiGS](https://raw.githubusercontent.com/Techbot/JiGS/main/images/warningL.png) Ready For Testing ![JiGS](https://raw.githubusercontent.com/Techbot/JiGS/main/images/warningR.png)


![JiGS](https://raw.githubusercontent.com/Techbot/JiGS/main/images/003-grid-001-GPO.png)

[Installation:](https://github.com/Techbot/JiGS-PHP-RPG-engine/wiki/Installation)
<ul>
 <li>ColyseusJs : https://github.com/colyseus/colyseus</li>
 <li>Drupal : https://www.drupal.org/</li>
 <li>PhaserJs : https://phaser.io/</li>
 <li>NodeJs : https://nodejs.org/</li>
 <li>VueJs : https://vuejs.org/</li>
</ul>

## Resources
* https://trello.com/b/l2K2UFWa/map</li>
* https://trello.com/b/3Hdp3Bn5/characters</li>
* https://trello.com/b/JGvVtu0x/objects</li>
* [The Eclectic Meme Conspiracy - A Cut Up Novel](https://docs.google.com/document/d/1eicoImMLMuZXJ4on-QMaoZxIGC_-KHrYWSapbCrg_7c)
* [The Eclectic Meme Conspiracy Online - Game Scripts](https://docs.google.com/document/d/1rdpK02PXfvUjwQLJgLXHzOeSbtBHymMo8Wq35UMY42s/)
* [The Eclectic Meme Conspiracy - Game Information](https://docs.google.com/spreadsheets/d/18frZlc8CwXpQ6V0slhlR1qcUyX5OijrPhJUCGY2S6hw/edit#gid=1469334051)

## Installation

#### Drupal Setup
* Install Drupal (Minimal Install)
* Download required modules (Paragraphs, Flag, Profile, Registration Role, Rest API Auth)

`composer require 'drupal/profile:^1.10' 'drupal/paragraphs:^1.17' 'drupal/flag:^4.0@beta' 'drupal/registration_role:^2.0' 'drupal/rest_api_authentication:^2.0' 'drupal/file_field_replace:^3.0'`

* Helpful Drupal configurations:
  * Administration =>Appearance => Claro => Install and set as default
  * Administration => Extend => Toolbar

* Clone Jigs4Discord into modules/custom/jigs
* Enable the required modules before installing the JiGS module (saves execution time)
  * The JiGS Dependencies module is included for convenience.
* Install the JiGS module
* Install the default content - https://github.com/Techbot/JiGS-demo-content
  * If you followed these instructions, all you need to do is turn on the module.
* Clone assets into /web/assets/ - https://github.com/Techbot/JiGS-demo-assets
* Go to Configuration => JSON:API and accept all operations
* Go to Configuration => API Authentication Configuration
  * Enable Authentication
  * Choose API Key Authentication
  * Generate New API Key
  * You will need to assign the Administrator role to the user you want to use for API access
* For some hosting scenarios, you may need to configure your CORS settings on both Drupal main and the /assets folder.
  * Configure /sites/default/default.services.yml
  * Add an .htaccess to /assets


#### Colyseus Setup
* cd into modules/custom/jigs/server
* `npm install`
* copy src/services/db_SETUP.ts into src/services/db.ts and configure
* Copy example.env to .env and configure
* Add your administrator username and the API key from the previous section

#### Phaser Setup
* cd into modules/custom/jigs/client
* Copy example.env.* to .env.* and configure
* `npm install`

## Testing
Steps to do rapid development and testing without the need to build the client and bundle into Drupal for every code change.

### Local Development
* Add a fake discord_id to your user account in Drupal (i.e. 12345)
* Set your client's .env.development Drupal URLs to /drupal
* In server run `npm run start`
* In client run `npm run start`
* In your browser, open http://localhost:5173/?discord_id=12345
* You should see the game running and the HUD populated with your user information
* Click in and you should be able to run around on the map!

### Discord Testing
* In client run `npm run tunnel`
* In your Discord configuration:
  * URL Mappings: / = tunnel URL
  * OAuth2: Redirects = tunnel URL
* Run your Discord activity and you should be able to run around on the map!

## Production
Steps to bundle the client into Drupal and deploy the servers to a cloud provider.

### Local Setup
* Set your client's .env.production Drupal URLs to blank
  * Optionally point assets URL at a CDN server 
* In client run `NODE_ENV=production && npm run build`
* Copy the css & js paths into modules/custom/jigs/jigs.libraries.yml and increment the version number
* In server run `npm run start`
* In Drupal, go to Administration => Configuration => Development => Performance and clear all caches
* Go to the home page and verify that the game is running

### Tunnel
* If you have necessary ports open (80,2567), you can just run:
  * `cloudflared tunnel --url http://localhost`
  * Server URL will be tunnel:2567
  * Drupal URL will be tunnel (or tunnel:8080 or however you have Apache configured)
* If you need to tunnel to servers individually you can run:
  * In server run `npm run tunnel`
  * For Drupal run `cloudflared tunnel --url http://localhost`
* Note: You might need to configure your webserver to route wildcard hostnames through to your Drupal folder!

### Discord
* In your Discord configuration:
  * OAuth2: Redirects = Server URL 
  * URL Mappings:
    * / = Drupal URL
    * /api = Server URL

## World Setup
* Design the content (Drupal) see  https://www.emc23.com/jigs-drupal-and-content-modelling
* Design relationships between the above content data and the players (mysql queries dropped into a folder triggered by the heartbeats- aka Agenda.js)

## Misc
With the JiGS engine, these two steps (while not trivial) are all thats required by the Games master to create an entirely new gameworld.

Want magic? Create wands, magic stats, magical NPCs, bulidings and Cities in Drupal.

Then create the battles and interactions in Mysql files called subscribers. (The heartbeat of the city is the event). Simply drop these subscribers into a folder and add them to the subscription list.

A few years later... Drop the magic and introduce Psionics (whatever they are), create new content in Drupal and new interactions in Mysql.

Or make a trading game or a dungeon crawler.

<hr>
<h3>Roadmap:</h3>
<h4>March 2023 </h4>

<ul>
<li>Replace phaserjs in backend with Colyseus</li>
<li>connect phaserJs frontend with Colyseus Backend</li>
<li>Add p2 and tilemap loader to backend https://github.com/damian-pastorini/p2js-tiledmap-demo </li>
<li>Add animations for Player Character.</li>
<li>Nodejs authentication via Drupal https://www.passportjs.org/packages/passport-drupal/  may need to be updated (which i will do)</li>
<li>Add collision layer for players and world (local versus authorative server)</li>
</ul>

<h3>April 2023</h4>
<ul>
<li>Add portals to allow character move from Map-Grid to Map-Grid</li>

</ul>

<h3>May 2023</h4>
<ul>
<li>Connect Drupal User with Colyseus player and Phaser player</li>
 <li>Realtime World Objects</li>
</ul>

<h3>June 2023</h4>
<ul>
<li>Add heartbeat for mining subscriber (as a test example)</li>
</ul

<h3>July 2023</h4>
<ul>
<li>Add Universal Character Creater</li>

</ul

<h3>Aug 2023</h4>
<ul>
<li>Add PVE combat</li>
</ul>

<h3>Sept 2023</h4>
<ul>
<li>Mine and Farm world subscribers</li>
</ul>

<h3>Oct 2023</h4>
<ul>
<li>Sound and Audio - OST, sound FX, background music, drones YAHOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO!!!!!</li>
</ul>

<h3>Nov 2023</h4>
<ul>
<li>World Animations</li>
</ul>

<h3>Dec 2023</h4>
<ul>
<li>Dialogue Engine (Drupal)</li>
</ul>

<h3>Jan 2024</h4>
<ul>
<li>NPC Animation</li>
<li>Switches/Flags System</li>
</ul>

<h3>Feb 2024</h4>
<ul>
<li>Switches/Flags System</li>
</ul>

<h3>Mar 2024</h4>
<ul>
<li>Mission System</li>
</ul>

<h3>Apr 2024</h4>
<ul>
<li>Gui</li>
</ul>

<h3>May 2024</h4>
<ul>
<li>Release Version 0.1</li>
<li>Cutscenes - simple dialogue for the moment </li>
<li>Flags for cutscenes viewed</li>
<li>Improve Animator</li>
</ul>

<h3>Jun 2024</h4>
<ul>
<li>Level Bosses</li>
<li>Release Ver 0.2</li>
</ul>

<h3>July Onwards 2024</h4>
<ul>
 <li>Inventory</li>
<li>NPC subscribers aka world simulator</li>
<li>Crafting</li>
<li>Jail and reputation System</li>
<li>Trade</li>
<li>Politics subscribers</li>
<li>Temple Subscribers</li>
<li>PVP</li>
</ul>

<h3>Somebackground on the new architecture:</h3>

A modular Drupal RPG and Trading Game engine - Wk 1 of 4 <https://groups.drupal.org/node/536823>

A modular Drupal RPG and Trading Game engine - Wk 2 of 4 <https://groups.drupal.org/node/536830>

A modular Drupal RPG and Trading Game engine - Wk 3 of 4 <https://groups.drupal.org/node/536835>

A modular Drupal RPG and Trading Game engine - Wk 4 of 4 <https://groups.drupal.org/node/536840>

---------------------------------------------
![JiGS](https://raw.githubusercontent.com/Techbot/JiGS/master/images/007-inventory.png)
<hr>
JiGS (Jigs Interactive Game System) is an open source Online RPG engine built in php using Drupal to create Content and Phaser to present the game.

The universe can be forked by sysadmin/gamesmasters to create unique personal virtual worlds. Completely Open Source.


Featurelist:
<ul>
   <li> Online Browser based Multiplayer RPG.</li>
    <li> Primarily Tile based  Multiple Interfaces.</li>
    <li> No client plugins or downloads required.</li>
    <li> Game server plugin system allows mechanics of game to evolve over time</li>
    <li> 3rd party plugin system(including graphic templates)  allows gamesmasters(sysadmins) to create unique universes.</li>
    <li> Post Peak Oil environment. Oil is rapidly declining. Riots, Tribalism and feudalism on the increase, genetic mutations etc.</li>
    <li> Genetics, alien technology and singularity create new game stats, mechanics and content.</li>
    <li> Soap Opera style monthly content revolving around numerous NPC arcs:  (think Lost tv show ).</li>
    <li> Game Genres: RPG, Trading, Exploration, PvP, Factions and Guild Politics</li>
    <li> Complexity & Economics. Think Eve Online in a low tech 2d, text like environment.</li>
    <li> Open Source</li>
    <li> NPCS and scenarios span modern pop and internet culture.</li>
    <li> Cut n’ Paste, Collage, 50’s -70’s Pulp Art,Dada/Surrealism, Punk and Glitch aesthetic. Monty Python style cutscenes</li>
    <li> Based on the Works of Robert Anton Wilson, William Burroughs, Timothy Leary, Pynchon, James Joyce and Umberto Eco and the worlds of plunderphonics and fanfiction</li>
    <li> Secret Societies, Conspiracies and Guild politics </li>
</ul>

![JiGS](https://raw.githubusercontent.com/Techbot/JiGS/master/images/paragraph_types.png)

<ul>
   <li> Main Gameplay Screens</li>

   <li> Character Creation</li>

   <li> Buildings & Economics</li>

   <li> Guilds, Groups, Crime Families, Gangs, Secret Societies and Factions</li>

   <li> Exploration</li>

   <li> Raiding</li>

   <li> NPCs, Mobs, Hobbits</li>

   <li> Inventory</li>

   <li> Storyline  </li>

   <li> Depreciation, Taxation, Quality Reduction, Depletion and Balance.</li>

   <li> Extending JiGS: create your own universe with 3rd Party plugins and templates</li>
</ul>

<hr>
<h2> Main Gameplay Screen</h2>

![JiGS](https://raw.githubusercontent.com/Techbot/JiGS/main/images/003-grid-001-GPO.png)

<ul>
<li>Stats</li>
<li>Login</li>
<li>Backpack</li>
<li>Weapons</li>
<li>Metals</li>
<li>Batteries</li>
<li>Maps</li>
<li>Factions</li>
<li>Hobbits</li>
<li>Profile</li>
<li>Players</li>
</ul>

![Wavy Lines](https://raw.githubusercontent.com/Techbot/JiGS/master/images/content2.png)

WavyLines is the Universe in action. All people receive numerous ESP messages from the people and world around them. Some messages are esoteric and obscure others are simple messages. Typical Messages would be “John increased one level” “John has converted to buddhism” “ A zombie horde attacks the outer villages.”

Players can enter messages here.

At one point this also collected spam, which had some interesting outcomes. This might be investigated again to re-introduce.

Messenger Module:
This is a direct line between the player and the world. Typical messages would be “You picked up the rock”, “You increased one level”


<h3>Main View Option One</h3>

Uses point and click with pathfinder to move your player to tile(on hold).
Tiles 32 *32 px

Grid: User Defined

<h3>Main View Option Two</h3>

Uses cursor or button presses( see compass button) to move one tile at a time .
Tiles 50 *50px

<h3>Character Creation</h3> [On hold]

In the main views , players see themselves represented by webstyle  avatars as opposed to game style representations. This allows players to upload their own images. The conflict of styles creates part of the cut’paste aesthetic.
Extended Character selection is on hold until third party plugin system is complete to allow for more varied character selection systems.

<h3>Profile Page</h3>

Using Drupal's build in User Entities system.

<h3>Buildings & Economics</h3>

All buildings contain an info module on the top left

All player owned buildings contain a control panel on the top right.
All government building contain a movie poster on the right
Each building type contains a primary module on the bottom.
The control panel allows the player assign workforce to primary, defence and distribution systems.
The control panel allows the player assign energy batteries to buildings system as a whole
The control panels allows the player to prioritise Quantity, quality and cost in terms of energy and credits.
The primary systems allows the player to control the buildings primary system, farming, factory and mining functions. A building can upgrade or increase it’s primary systems depending on skills etc.
for example a farm may have 1- 8 fields each growing different crops.
Or a factory may have 1-8 conveyor belts each building different objects,
Each additional primary system is accessed via tabs and is identical in layout.

<h3>Banks, Terminals, Banks and hacking</h3>
Players and NPCs can hack and be hacked, causing grief, stealing bank account percentages and spreading viruses. There are three global banks each with their own interest rates ,security packages and insurance deals.

<h3>Factories</h3>
Factories require blueprints, energy, workforce(hobbits) & materials to create objects - can be hacked/attacked.
Objects vary in quality time and cost to produce.

<h3>Farms</h3>
Farms require seeds and workforce, energy, to grow food - can be hacked/attacked

<h3>Mines</h3>
Mines require energy workforce to mine oil,minerals( and crystals- on hold). - can be hacked/attacked

<h3>Other Buildings</h3>

    Re-processors - turn object to metals
    scrap-yards sell metals
    Food processors - buy crops
    Blue Print Shops
    Weaponry - Sell Weapons
    Stands - Sell objects
    Bullet Shops - Sell bullets
    Mission Buildings
    Banks - Offer credit , deposits, interest, can be hacked
    Diners - Exchange money for health
    Apartments - Log off safely protecting cash in hand and back pack. Move objects from backpack to apartment inventory - can be hacked/attacked
    WareHouses - Store large quantities of objects or crops

<h3>Skills</h3>

12 Main (levelable) Skills each with 6-12 sub skills

    Farming
    FireArms
    Melee
    Medic
    Politic
    Mining
    Computers
    Engineering
    Reprocessing
    Navigation
    Trade

![Folio](https://raw.githubusercontent.com/Techbot/JiGS/main/images/014-grid-001-obstacles.png)

<h3>Guilds, Groups, Crime Families, Gangs, Secret Societies and Factions</h3>

You are always part of a group, your group is part of one of three factions. Various stats affect faction and group standing (all other names are group synonyms) and vice versa.
Actions within twine stories affect group and faction standings.
You can change groups, but only to a group of the same faction.

<h3>Exploration</h3>

Exploration (via character development) is the primary core loop of the virtual world. New Maps, Scenarios including time travel to familiar places will be added to the system on a monthly basis. ALternate realities, drug induced trips etc will play a part in the exploration narrative.
Maps are creating using the open source Tiled Mapeditor.org. and imported to the systom using json files.
Portals are a heavily used device in both the game mechanics and the overarching metastory.
Portals need to be discovered in the real before they can be accessed via the portal network.
Technically all portal are one way but may exist in pairs.
Many of the portals are discovered via Twine stories.

<h3>Banks and Hacking</h3>

Players and NPCs can hack and be hacked, causing grief, stealing bank account percentages and spreading viruses. There are three global banks each with their own interest rates, security packages and insurance deals.

<h3>NPCs, Mobs, Hobbits(workforce)</h3>

NPCS should be as deeply developed as possible. They should be as indistinguishable from players as possible in terms of fighting acquisitions and political power.
Ai in terms of dialogue is not necessary tho’ can be investigated as a 3rd party plugin.
Mobs include borgs, orcs, goblins, zombies of different classes. Largely indistinguishable from each other
Workforce: 1 is born every minute in realtime. It will align itself to a building owned by a member of one of the 3 factions. Likelihood of a players building being chosen is a result of various stats including building efficiency, hobbit magic etc.
Hobbits have a lifespan as defined by the gamemaster which can be altered via dynamic forces.

<h3>Inventory</h3>

BackPack: Weight and Size are not taken in consideration as yet.

Warehouses: Crops, Mass quantities of objects for sale or transport. (On Hold)

Apartment: cannot be lost, unless AWOL limit has be exceeded (if configured)

<h3>Storylines-Hypertext</h3>

Several arcs spanning the rise of the internet from bbs to global hive minds, across numerous dimensions.
Split into hypertexts which can be accessed via content management system based on faction, stats, player level and external events such as NPC actions.
Javascript animations, cut scenes and minigames breakdown the difference between the game and the narrative.
Depreciation, Rent Taxation, Quality Reduction, Depletion and Balance.
Various cron jobs are set on regular intervals to reduce objects quality and deduct building rent. Failure to pay rent results in removal of acquisition.
Not playing for a period of three months should result in total non effect of player. All buildings should be repossessed, objects decline in quality etc.

<h3>Extending JiGS: creating your own universe</h3>

Install 3rd party plugins that introduce pollution, crime, magic.
Use external data such as weather statistics or open data to create a virtual internet world of things.
Create scripts to give your npcs unique proclivities.
