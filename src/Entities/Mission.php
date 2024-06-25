<?php

namespace Drupal\jigs\Entities;

class Mission
{
  public $MapGrid;
  public $tiled;
  public $name;
  public $mapWidth;
  public $mapHeight;
  public $portalsArray;
  public $rewardsArray;
  public $npcArray;
  public $mobArray;
  public $userCity;
  public $portals;
  public $tileset;
  public $userId;
  public $player;
  public $playerSwitchesStates;
  public $empty;
  public $AllMissionSwitches;
  public $userMG;
  public $AllMissionDialogue;
  public $AllMissionBosses;

  function __construct($userMG){

    $this->MapGrid =  \Drupal::entityTypeManager()->getStorage('node')->load($userMG);
    $this->userId = $userId;
    $this->$userMG = $userMG;

    //$this->playerSwitchesStates = $this->player->getAllFlickedSwitches();
    $this->AllMissionSwitches = $this->getAllMissionSwitches($userMG);
    $this->AllMissionDialogue = $this->getAllMissionDialogs($userMG);
    $this->AllMissionBosses   = $this->getAllMissionBosses($userMG);

  }


}
