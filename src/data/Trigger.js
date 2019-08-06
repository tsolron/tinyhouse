'use strict';

import {ExchangeFactory} from './Exchange.js';
import {FnF} from './Fn.js';

/**
 * TODO functions
 * @type {class}
 * @param {string} n Used to set name
 * @param {string} t Used to set type
 * @property {string} name Name of Trigger
 * @property {string} type ['once', 'alwaysOn']
 * @property {Boolean} hasTriggered
 * @property {string} condition string to eval()
 * @property {string} action string to eval()
 */
export default class Trigger {
  constructor(n, t) {
    this.name = n;
    this.type = t;
    this.hasTriggered = false;
    this.condition = '';
    this.action = '';
    this.buildCost = ExchangeFactory('','');
    this.requirement = ExchangeFactory('','');
  }

  recalculate(game) {
    this.buildCost.recalculate(game);
    this.requirement.recalculate(game);
  }

  test(game) {
    if (this.condition === "unlockRatio") {
      //debugger;
      let bc = this.buildCost.canExchange(game, 1, game.common.globalNerf.n);
      let req = this.requirement.canExchange(game, 1, 1);
      if (bc && req) {
        eval(this.action);
        this.hasTriggered = true;
        return true;
      } else {
        return false;
      }
    } else {
      let c = eval(this.condition);
      if (c) {
        eval(this.action);
        this.hasTriggered = true;
        return true;
      }
      return false;
    }
  }
}

/**
 * TODO functions
 * @type {function}
 * @param {Game} game
 * @param {string} n Name of Trigger
 * @param {string} t Type ['once', 'always']
 * @param {Object} args - Options to initialize the component with
 * @param {String} args.condition - This Trigger's condition
 * @param {Boolean} args.action - This Trigger's action
 */
export function TriggerFactory(n, t, c, a)
{
  let tri = new Trigger(n, t);
  tri.condition = c;
  tri.action = a;
  return tri;
}

export function TriggerFactoryFromRes(game, name, unlockRatio, cList, req)
{
  let triName = name + "Unlock";
  let tri = new Trigger(triName, "once");
  tri.condition = "unlockRatio";
  tri.action = "game.r.get('"+name+"').unlock()";
  tri.buildCost = ExchangeFactory(name, cList, 0.3);
  //TODO: Ignoring req for now
  //if (!!req) { tri.requirement = req; }
  return tri;
}

/**
 * TODO functions
 * @type {class}
 * @property {Map.<string,Trigger>} waitingTriggers ['name', Trigger]
 * @property {Map.<string,Trigger>} expiredTriggers ['name', Trigger]
 */
export class TriggerList {
  constructor() {
    this.waitingTriggers = new Map();
    this.expiredTriggers = new Map();
  }

  recalculateAll(game) {
    this.waitingTriggers.forEach(t => {
      t.recalculate(game);
    });
  }

  add(t) {
    if (this.expiredTriggers.has(t.name)) {
      // Cannot create as it already exists in expired
      return false;
    }
    if (this.waitingTriggers.has(t.name)) {
      // Cannot create as it already exists in waiting
      return false;
    }

    // Create code
    this.waitingTriggers.set(t.name, t);
    return true;
  }

  addConditionToTrigger(n, addCond) {
    if (this.waitingTriggers.has(n)) {
      let cond = this.waitingTriggers.get(n).condition;
      cond = "("+cond+") && ("+addCond+")";
    } else {
      return false;
    }
  }

  check(game) {
    let rmq = [];

    this.waitingTriggers.forEach(t => {
      if (t.test(game) && t.type === 'once') {
        rmq.push(t.name);
      }
    });

    /*this.expiredTriggers.forEach(t => {
      if (t.test(game) && t.type === 'once') {
        rmq.push(t.name);
      }
    });*/

    if (rmq.length > 0) {
      for (const trigger of rmq) {
        this.expiredTriggers.set(trigger, this.waitingTriggers.get(trigger));
        this.waitingTriggers.delete(trigger);
      }
    }
  }

}
