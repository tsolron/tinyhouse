'use strict';

import {FnF} from './Fn.js';

/**
 * TODO functions
 * @type {class}
 * @param {Number} t Used to set timeTick
 * @param {Exchange} e Used to set exchange
 * @property {Number} timeTick
 * @property {Number} exchange
 */
export default class Action {
  constructor(tt, type) {
    this.timeTick = tt;
    this.type = type;
    this.exchange = null;
    this.action = null;
  }

  do(game) {
    if (this.exchange.once(game, game.common.globalBuff.n, game.common.globalNerf.n)) {
      //TODO: Is this needed? Can use game.dirty?
      game.recalculateAll(game);
      if (!!this.action) {
        eval(this.action);
      }
    }
  }

  // Not current - may not work properly
  undo(game) {
    this.exchange.unOnce(game);
    game.recalculateAll(game);
  }
};

/**
 * @type {function}
 * @param {Game} game
 * @param {string} f
 */
export function ActionFactory(game, tt, type, args)
{
  let act = new Action(tt, type);

  switch(type) {
    case "u":
    case "upgrade":
      act.exchange = args[0];
      act.action = args[1];
      break;
    case "r":
    case "resource":
      act.exchange = args[0];
      break;
    default:
  }
  return act;

  act.recalculate(game);
};

/**
 * TODO functions
 * @type {class}
 * @param {Number} n Used to set max_history
 * @property {Array.<Action>} act_list
 * @property {Array.<Action>} past_actions
 * @property {Number} max_history
 */
export class ActionList {
  constructor(n) {
    this.act_list = [];
    this.past_actions = [];
    this.max_history = Number(n);
  }

  runNextAction(game) {
    if (this.act_list.length == 0) {
      return;
    }
    let cur_act = this.act_list.shift();
    cur_act.do(game);
    this.past_actions.push(cur_act);
    if (this.past_actions.length > this.max_history) {
      this.past_actions.shift();
    }
  }

  rollbackPreviousAction(game) {
    if (this.past_actions.length == 0) {
      return;
    }
    let cur_act = this.past_actions.pop();
    cur_act.undo(game);
  }

  addAction(act) {
    this.act_list.push(act);
  }

  addActionByName(game, type, name) {
    switch(type) {
      case "u":
      case "upgrade":
        if (!!game.u.get(name).active && !!game.u.get(name).action) {
          this.addAction(ActionFactory(game, game.time.tt, type, [game.u.get(name).active, game.u.get(name).action]));
        }
        break;
      case "r":
      case "resource":
        if (!!game.r.get(name).active) {
          this.addAction(ActionFactory(game, game.time.tt, type, [game.r.get(name).active]));
        }
        break;
      default:
    }
  }

  doActiveByOther(game, type, name) {
    switch(type) {
      case "u":
      case "upgrade":
        game.u.get(name).doActive(game, game.common.globalBuff.n, game.common.globalNerf.n);
        break;
      case "r":
      case "resource":
        game.r.get(name).doActive(game, game.common.globalBuff.n, game.common.globalNerf.n);
        break;
      default:
    }
  }

  cancelLastAction() {
    this.act_list.pop();
  }
}
