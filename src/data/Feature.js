'use strict';

import {FnF} from './Fn.js';

/**
 * TODO functions
 * @type {class}
 * @param {string} n Used to set name
 * @param {Boolean} u Used to set isUnlocked
 * @property {string} name
 * @property {Boolean} isUnlocked
 * @property {Array.<string>} resources Array of 'resource'
 * @property {Array.<string>} upgrades Array of 'upgrade'
 * @property {Fn} buff
 * @property {Fn} nerf
 */
export default class Feature {
  constructor(n, u) {
    this.name = n;
    this.isUnlocked = u;
    this.resources = [];
    this.upgrades = [];
    this.activeName = '';
    this.buff = FnF('1'); // Fn
    this.nerf = FnF('1'); // Fn
  }

  unlock() {
    this.isUnlocked = true;
  }

  addComponent(type, n) {
    let where = null;
    if (type === 'resource' || type === 'r') {
      where = this.resources;
    } else if (type === 'upgrade' || type === 'u') {
      where = this.upgrades;
    }

    if (where.includes(n)) {
      // Cannot add, already in list
      return false;
    } else {
      where.push(n);
    }
  }

  addResource(n) {
    addComponent('resource', n);
  }

  doPassive(game, buff, nerf) {
    this.resources.forEach(name => {
      if (!!game.resources.get(name).passive) {
        game.resources.get(name).doPassive(game, this.buff.mult(buff), this.nerf.mult(nerf));
        //game.resources.get(name).passive.once(game);
      }
    });
  }

  recalculate(game) {
    if (!!this.buff) {
      this.buff.recalculate(game);
    }
    if (!!this.nerf) {
      this.nerf.recalculate(game);
    }
  }

  recalculateAll(game) {
    this.recalculate(game);
    for (let n of this.resources) {
      game.resources.get(n).recalculate(game);
    }
    for (let n of this.upgrades) {
      game.upgrades.get(n).recalculate(game);
    }
  }

  unlockAll(game) {
    this.unlock();
    for (let n of this.resources) {
      game.resources.get(n).unlock();
    }
    for (let n of this.upgrades) {
      game.upgrades.get(n).unlock();
    }
  }
}

/**
 * @type {function}
 * @param {string} n Used to set name
 * @param {Boolean} u Used to set isUnlocked
 * @param {Array.<string>} l Used to set list
 * @constructor
 */
export function FeatureFactory(n, u, an)
{
  let feature = new Feature(n, u);
  feature.activeName = an;
  return feature;
};
