<?php

namespace Drupal\jigs\Entities;

use Drupal\paragraphs\Entity\Paragraph;

class DiscordPlayer
{
    public $name;
    public $userGamesState;
    private $database;
    public $mapgrid;
    public $profileId;
    public $flagging;
    public $missionsArrayOfOne;
    public $x;
    public $y;
    public $health;

    public $energy;

    function __construct($name)
    {
        $this->name = $name;
    }

    public function create()
    {
        $database = \Drupal::database();
        $query = $database->query("SELECT players.x, players.y, players.health, players.mapgrid FROM players  WHERE player='" . $this->name . "'");

        $result = $query->fetchAll()[0];

        //$player['userState']   = $this->userGamesState;
        //$player['credits']     =
        $this->health = (int) $result->health;
        $this->mapgrid = $result->mapgrid;
        $this->x = (int) $result->x;
        $this->y = (int) $result->y;
        $this->energy = 100;
        $this->sprite_sheet = 100;
        $this->sprite_sheet = 100;
        $this->level = 100;
        $this->intelligence = 100;
        $this->strength = 100;
        $this->dexterity = 100;
        $this->endurance = 100;
        $this->charisma = 100;
        $this->psi = 100;
        $this->losses = 100;
        $this->wins = 100;
        $this->xp = 100;
        $this->weapon_left = 100;
        $this->weapon_right = 100;
        // $this->flickedSwitches']['switches']     = $this->getFlickedSwitches('switches');
        /* $player['flickedSwitches']['fires']        = $this->getFlickedSwitches('fires');
        $player['flickedSwitches']['fireBarrels']  = $this->getFlickedSwitches('switches');
        $player['flickedSwitches']['questItems']   = $this->getFlickedSwitches('questItems');
        $player['flickedSwitches']['levers']       = $this->getFlickedSwitches('levers');
        $player['flickedSwitches']['machine']      = $this->getFlickedSwitches('machine'); */
        return $this;
    }

    public function myInventory()
    {
        /** @var \Drupal\Core\Ajax\AjaxResponse $response */
        $Data = $this->user->get('player_profiles')->entity;
        $inventory = [];
        foreach ($Data->field_inventory as $item) {
            $inventory[] = $item->target_id;
        }
        //Cached stuff
        $player = [];
        $database = \Drupal::database();
        foreach ($inventory as $invItem) {
            $query = $database->query("SELECT field_items_target_id FROM paragraph__field_items  WHERE entity_id= " . $invItem);
            foreach ($query as $record) {
                $item = $record->field_items_target_id;
                $query = $database->query("SELECT title FROM node_field_data  WHERE nid= " . $item);
                $name = $query->fetchAll()[0]->title;
                $query = $database->query("SELECT field_location_value 	 FROM  paragraph__field_location WHERE entity_id= " . $invItem);
                $location = $query->fetchAll()[0]->field_location_value;
                $player['items'][] = array('id' => $invItem, 'name' => $name, 'location' => $location);
            }
            $query = $database->query("SELECT field_weapon_target_id FROM paragraph__field_weapon  WHERE entity_id= " . $invItem);
            foreach ($query as $record) {
                $weapon = $record->field_weapon_target_id;
                if ($weapon) {
                    $query = $database->query("SELECT title FROM node_field_data  WHERE nid= " . $weapon);

                    // Add Image to query here.


                    $name = $query->fetchAll()[0]->title;
                    $query = $database->query("SELECT field_location_value 	 FROM  paragraph__field_location WHERE entity_id= " . $invItem);
                    $location = $query->fetchAll()[0]->field_location_value;
                    $player['items'][] = array('id' => $invItem, 'name' => $name, 'location' => $location);
                }
            }
        }
        $responseData['playerInventory'] = $player;
        return $responseData;
    }

    public function addMission($id)
    {
        $profile = $this->user->get('player_profiles')->entity;
        $paragraph = Paragraph::create([
            'type' => 'missions',
            'field_mission' => $id,
            'bundle' => 'missions',
            'parent_field_name' => 'field_missions',
            'parent_type' => 'profile',
            'parent_id' => $profile->profile_id
        ]);
        $paragraph->save();

        $profile->field_missions[] =
            array(
                'target_id' => $paragraph->id(),
                'target_revision_id' => $paragraph->getRevisionId(),
            );
        return $profile->save();
    }

    public function myMissions()
    {
        $playerName = $this->user->get("name")->value;
        $playerId = \Drupal::currentUser()->id();
        //Cached stuff
        //$userGamesState     = $this->user->field_game_state->value;
        $database = \Drupal::database();
        ////////////////////////////////////////////////////////////////////////////////
        $player['missions'] = $this->getAllPlayerMissionIds($playerId);
        foreach ($player['missions'] as $mission) {
            // $mission = $record->field_missions_target_id;
            if ($mission) {
                $result = $database->query("SELECT
                node_field_data.title,
                node__body.body_value
                FROM node_field_data
                LEFT JOIN node__body
                ON node_field_data.nid = node__body.entity_id
                WHERE node_field_data.nid = " . $mission);
                $row = $result->fetchAssoc();
                $player['quests'][] = array(
                    'id' => $mission,
                    'title' => $row['title'],
                    'content' => $row['body_value'],
                );
            }
        }
        $responseData['playerMissions'] = $player;
        return $responseData;
    }

    public function getAllPlayerMissionIds($id)
    {
        $database = \Drupal::database();
        $query = $database->query("SELECT profile__field_missions.field_missions_target_id,
         paragraph__field_mission.field_mission_target_id
        FROM profile__field_missions
        LEFT JOIN  paragraph__field_mission
        ON paragraph__field_mission.entity_id = profile__field_missions.field_missions_target_id
        WHERE profile__field_missions.entity_id= " . $id);
        $result = $query->fetchAll();
        $missionArray = [];
        foreach ($result as $mission) {
            $missionArray[] = $mission->field_mission_target_id;
        }
        return $missionArray;
    }

    public function getCompletedMissions($id)
    {
        $database = \Drupal::database();
        $query = $database->query("
        SELECT paragraph__field_mission.field_mission_target_id
            FROM profile
            LEFT JOIN profile__field_missions_completed
            ON profile.profile_id = profile__field_missions_completed.entity_id
            LEFT JOIN paragraph__field_mission
            ON paragraph__field_mission.entity_id = profile__field_missions_completed.field_missions_completed_target_id
            WHERE profile.type = 'player'
            AND profile.uid = " . $id);
        $result = $query->fetchAll();
        $missionArray = [];
        foreach ($result as $mission) {
            $missionArray[] = $mission->field_mission_target_id;
        }
        return $missionArray;
    }

    public function getAllHandlerMissions($id)
    {
        $database = \Drupal::database();
        $query = $database->query("SELECT field_missions_target_id FROM node__field_missions WHERE entity_id= " . $id);
        $result = $query->fetchAll();
        $missionArray = [];
        foreach ($result[0] as $mission) {
            $missionArray[] = $mission;
        }
        return $missionArray;
    }

    public function myMission($npc)
    {
        $playerName = $this->user->get("name")->value;
        $playerId = \Drupal::currentUser()->id();
        //Cached stuff
        //$userGamesState    = $this->user->field_game_state->value;
        $database = \Drupal::database();
        $responseData = [];
        $responseData['liveMission'] = 0;
        //$handlerObject     =  \Drupal::entityTypeManager()->getStorage('node')->load($npc);
        $playerMissions = $this->getAllPlayerMissionIds($playerId);
        $completedMissions = $this->getCompletedMissions($playerId); // paragraph id
        $handlerMissions = $this->getAllHandlerMissions($npc); // node id

        // Does Player hold current mission from NPC
        foreach ($playerMissions as $mission) {
            if (in_array($mission, $handlerMissions)) {
                $responseData['liveMission'] = 1;
                continue;
            }
        }

        if ($responseData['liveMission'] == 0) {
            // Are there any missions in handler mission not in completed
            foreach ($handlerMissions as $handlerMission) {
                if (!in_array($handlerMission, $completedMissions)) {
                    //new mission available
                    $responseData = $this->getNewMission($handlerMission);
                    continue;
                }
            }
        } else {
            $responseData['playerMission'] = "Come back later";
        }
        return $responseData;
    }

    public function getFlickedSwitches($type)
    {
        $database = \Drupal::database();
        $user = \Drupal::currentUser()->id();
        $query = $database->query("SELECT flagging.entity_id
        FROM flagging
        WHERE flagging.uid = " . $user . " AND flagging.flag_id ='" . $type . "'");
        ////////////////////////////////////////////////////////////////////////
        return $query->fetchAll();
    }

    public function getAllFlickedSwitches()
    {
        $database = \Drupal::database();
        $user = \Drupal::currentUser()->id();
        $query = $database->query("SELECT flagging.entity_id
        FROM flagging
        WHERE flagging.uid = " . $user);
        ////////////////////////////////////////////////////////////////////////
        $result = $query->fetchAll();
        $responseData = [];
        foreach ($result as $element) {
            $responseData[] = $element->entity_id;
        }
        return $responseData;
    }

    public function getNewMission($handlerMission)
    {
        $database = \Drupal::database();
        $query = $database->query('SELECT node_field_data.title,
        node__field_choice_a.field_choice_a_value,
        node__field_handler_dialog.field_handler_dialog_value

        FROM node_field_data
        LEFT JOIN node__field_choice_a
        ON node_field_data.nid = node__field_choice_a.entity_id
        LEFT JOIN node__field_handler_dialog
        ON node__field_handler_dialog.entity_id = node__field_choice_a.entity_id
        WHERE node_field_data.nid = ' . $handlerMission);

        ///////////////////////////////////////////////////////////////////////////////
        $stuff = $query->fetchAll();
        //print_r($stuff);
        $responseData['title'] = $stuff[0]->title;
        $responseData['handler_dialog'] = $stuff[0]->field_handler_dialog_value;
        $responseData['choice'] = $stuff[0]->field_choice_a_value;
        $responseData['value'] = $handlerMission;
        return $responseData;
    }

    public function toStorage($id)
    {
        $database = \Drupal::database();
        $query = $database->query("UPDATE paragraph__field_location SET field_location_value = 'Storage' WHERE entity_id= " . $id);
        $query->execute();
        return $this->myInventory();
    }

    public function toBackpack($id)
    {
        $database = \Drupal::database();
        $query = $database->query("UPDATE paragraph__field_location SET field_location_value = 'Backpack' WHERE entity_id= " . $id);
        $query->execute();
        return $this->myInventory();
    }

    public function flickSwitch($id)
    {
        $switchEntity = \Drupal::entityTypeManager()->getStorage('paragraph')->load($id);
        $flag_service = \Drupal::service('flag');
        $flag = $flag_service->getFlagById('switch'); // replace by flag machine name
        // check if already flagged
        $this->flagging = $flag_service->getFlagging($flag, $switchEntity, $this->user);
        if (!$this->flagging) {
            $flag_service->flag($flag, $switchEntity, $this->user);
            if ($this->MissionCompleteTest($switchEntity)) {
                $this->flagMission($this->missionsArrayOfOne[0]);
                $this->addMissionReward($this->missionsArrayOfOne[0]);
            }
            ;
            return true;
        } else {
            //   $flag_service->unflag($flag, $id, $this->user);
            return false;
        }
        return false;
    }

    public function flagMission($id)
    {
        $missionEntity = \Drupal::entityTypeManager()->getStorage('paragraph')->load($id);
        $flag_service = \Drupal::service('flag');
        $flag = $flag_service->getFlagById('mission'); // replace by flag machine name
        // check if already flagged
        $this->flagging = $flag_service->getFlagging($flag, $missionEntity, $this->user);
        if (!$this->flagging) {
            $flag_service->flag($flag, $missionEntity, $this->user);
            return true;
        } else {
            //   $flag_service->unflag($flag, $id, $this->user);
            return false;
        }
        return false;
    }

    public function MissionCompleteTest($switchEntity)
    {
        $switchesArray = $this->getAllSwitchesOfMissionGivenOneSwitch($switchEntity);
        $flag_service = \Drupal::service('flag');
        $flag = $flag_service->getFlagById('switch');
        foreach ($switchesArray as $switchEntity) {
            $this->flagging = $flag_service->getFlagging($flag, $switchEntity, $this->user);
            if (!$this->flagging) {
                return false;
            }
        }
        return true;
    }

    public function getAllSwitchesOfMissionGivenOneSwitch($switchEntity)
    {
        $database = \Drupal::database();
        $query = $database->query("SELECT node__field_switches.entity_id
        FROM node__field_switches
        WHERE field_switches_target_id = " . $switchEntity);
        ////////////////////////////////////////////////////////////////////////
        $result = $query->fetchAll();
        $this->missionsArrayOfOne = [];
        foreach ($result as $element) {
            $this->missionsArrayOfOne[] = $element->entity_id;
        }

        $query = $database->query("SELECT node__field_switches.field_switches_target_ud
        FROM node__field_switches
        WHERE node_field_switches.entity_id = " . $this->missionsArrayOfOne[0]);
        $result = $query->fetchAll();
        $missions = [];
        foreach ($result as $element) {
            $switches[] = $element->entity_id;
        }
        return $switches;
    }

    public function addMissionReward($switchEntity)
    {


    }

}
