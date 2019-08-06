'use strict';

import FeatureTree from './featureTree.json';
import Time from './Time.js';
import {ActionFactory, ActionList} from './Action.js';
import {FeatureFactory} from './Feature.js';
import {ResourceFactory} from './Resource.js';
import {ExchangeFactory} from './Exchange.js';
import {FnF} from './Fn.js';
import {TriggerFactory, TriggerFactoryFromRes, TriggerList} from './Trigger.js';
import {UpgradeFactory} from './Upgrade.js';
import {Common} from './Common.js';

/**
 * This class contains all game data.
 * @class Game
 * @type {class}
 * @property {Common} common
 * @property {TriggerList} triggers
 * @property {ActionList} actions
 * @property {Map.<string, Feature>} features
 * @property {Map.<string, Resource>} resources
 */
export default class Game {
  constructor() {
    this.featureTree = FeatureTree;
    this.time = new Time(50);
    this.common = new Common();
    this.triggers = new TriggerList();
    this.actions = new ActionList(10);
    this.features = new Map();
    this.resources = new Map();
    this.upgrades = new Map();
    this.dirty = true;
  }
  // Shortcuts
  get f() { return this.features; }
  get r() { return this.resources; }
  get t() { return this.triggers; }
  get u() { return this.upgrades; }

  // Note the use of shortcuts (ex. game.r for game.resources). Refer to ./data/Game.js for details
  buildFromFile() {
    // Create Resources from file
    for (const resourceArr of Object.entries(this.featureTree.resources)) {
      const resource = resourceArr[1];
      this.r.set(resource.name, ResourceFactory(resource.name, resource.isUnlocked));
      if (!!resource.passive) { this.r.get(resource.name).passive = ExchangeFactory(resource.name, resource.passive, 1); }
      if (!!resource.active) { this.r.get(resource.name).active = ExchangeFactory(resource.name, resource.active, 1); }
      if (!!resource.requirement) { this.r.get(resource.name).requirement = ExchangeFactory(resource.name, resource.requirement, 1); }
      if (!!resource.costRatio) { this.r.get(resource.name).costRatio = resource.costRatio; }
      if (!!resource.min) { this.r.get(resource.name).min.f = resource.min; }
      if (!!resource.max) { this.r.get(resource.name).max.f = resource.max; }
      if (!!resource.buff) { this.r.get(resource.name).buff = FnF(resource.buff); }
      if (!!resource.nerf) { this.r.get(resource.name).nerf = FnF(resource.nerf); }
      if (!!resource.isProducer) {
        this.r.get(resource.name).isProducer = resource.isProducer;
        if (resource.isProducer) {
          this.t.add(TriggerFactoryFromRes(this, resource.name, this.common.unlockRatio, resource.active, resource.requirement));
        }
      }
    }

    // Create Upgrades from file
    for (const upgradeArr of Object.entries(this.featureTree.upgrades)) {
      const upgrade = upgradeArr[1];
      this.u.set(upgrade.name, UpgradeFactory(this, upgrade.name, upgrade.isUnlocked, upgrade.type));
      if (!!upgrade.active) { this.u.get(upgrade.name).active = ExchangeFactory(upgrade.name, upgrade.active, 1); }
      if (!!upgrade.action) { this.u.get(upgrade.name).action = upgrade.action; }
    }

    // Create Features from file
    for (const featureArr of Object.entries(this.featureTree.features)) {
      const feature = featureArr[1];
      this.f.set(feature.name, FeatureFactory(feature.name, feature.isUnlocked, feature.activeName));
      if (!!feature.resources) { this.f.get(feature.name).resources = feature.resources; }
      if (!!feature.upgrades) { this.f.get(feature.name).upgrades = feature.upgrades; }
      //this.f.get('research').addComponent('upgrade', 'farming');
    }

    // Create Triggers from file
    for (const triggerArr of Object.entries(this.featureTree.triggers)) {
      const trigger = triggerArr[1];
      this.t.add(TriggerFactory(trigger.name, trigger.type, trigger.condition, trigger.action));
      //triggerList.add(TFactory(game, 'onFirstLibrary1', 'once', {condition: 'game.resources.get("library").quantity > 0', action: 'game.resources.get("science").unlock(); game.features.get("research").unlock();'}));
    }

    //for (const [className, classArray] of Object.entries(this.featureTree)) { }

    this.recalculateAll(this);
  }

  kittensGame() {
    /* Simple resources and upgrades */
        // catnip
        // wood
        // minerals
        // coal
        // iron
        // titanium
        // gold
        // oil
        // uranium
        // unobtainium
        // antimatter
        // catpower
        // science
        // culture
        // faith
        // kittens
        // starchart
        // furs
        // ivory
        // spice
        // unicorns
        // alicorns
        // necrocorns
        // tears
        // karma
        // paragon
        // burned paragon
        // time crystal
        // relic
        // void
        // blackcoin
    /* Crafted resources and upgrades */
        // <make wood>
        // beam
        // slab
        // plate
        // steel
        // concrete
        // gear
        // alloy
        // eludium
        // scaffold
        // ship
        // tanker
        // kerosene
        // parchment
        // manuscript
        // compendium
        // blueprint
        // thorium
        // megalith
    /* Structure resources and upgrades */
        // <gather catnip>
        // <make wood>
        // Catnip field
        // Solar Farm (/ Pasture)
        // Hydro Plant (/ Aqueduct)
        // Hut
        // Log House
        // Mansion
        // Data Center (/ Library)
        // Academy
        // Observatory
        // Bio Lab
        // Barn
        // Warehouse
        // Harbour
        // Mine
        // Quarry
        // Lumber Mill
        // Oil Well
        // Accelerator
        // Steamworks
        // Magneto
        // Smelter
        // Calciner
        // Factory
        // Reactor
        // Broadcast Tower (/ Amphitheatre)
        // Chapel
        // Temple
        // Workshop
        // Tradepost
        // Mint
        // Unicorn Pasture
        // Ziggurat
        // Chronosphere
        // AI Core
    /* Jobs resources and upgrades */
        // Woodcutter
        // Farmer
        // Scholar
        // Hunter
        // Miner
        // Priest
        // Geologist
        // Engineer
    /* Research resources and upgrades */
        // Many
    /* Workshop resources and upgrades */
        // Many
    /* Trade resources and upgrades */
        // Lizards
        // Sharks
        // Griffins
        // Nagas
        // Zebras
        // Spiders
        // Dragons
        // Leviathans
    /* Religion-Unicorn resources and upgrades */
    /* Religion-Sun resources and upgrades */
    /* Religion-Crypto resources and upgrades */
    /* Space resources and upgrades */
    /* Time resources and upgrades */
    /* Void resources and upgrades */
    /* Achievements resources and upgrades */
  }

  recalculateAll() {
    this.common.recalculate(this);
    this.triggers.recalculateAll(this);
    this.resources.forEach(r => {
      r.recalculate(this);
    });
    this.features.forEach(f => {
      f.recalculateAll(this);
    });
    this.upgrades.forEach(u => {
      u.recalculate(this);
    });
  }

  unlockAll() {
    this.features.forEach(f => {
      f.unlockAll(this);
    });
  }

  debug() {
    debugger;
  }
}
