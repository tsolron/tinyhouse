'use strict';

import {FnF} from './Fn.js';

/**
 * TODO functions
 * @type {class}
 * @param {Map.<string, Fn>} l Used to set list
 * @property {Map.<string, Fn>} list Map of costs/gains ['resource', Fn]
 * @property {Boolean} hasCost
 */
export default class Exchange {
  constructor(l) {
    this.creationList = l;
    this.list = new Map();
    this.hasCost = false;
    this.strReplaceFrom = "_rself_";
    this.strReplaceTo = "game.r.get('_name_')";
  }

  setup(name, l, mult) {
    for (var i = 0; i < l.length; i++) {
      let clean = this.strReplaceFrom.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      let regex = new RegExp(clean, 'g');
      let to = this.strReplaceTo.replace(/_name_/g, name);
      let fnStr = l[i][1].replace(regex, to);
      if (mult !== "1") {
        this.list.set(l[i][0], FnF(mult.toString() + " * " + fnStr));
      } else {
        this.list.set(l[i][0], FnF(fnStr));
      }
    }
  }

  recalculate(game) {
    this.hasCost = false;
    this.list.forEach(fn => {
      fn.recalculate(game);
      if (fn.n < 0) { this.hasCost = true; }
    });
  }

  canExchange(game, buff, nerf) {
    for (let value of this.list.entries()) {
      let mod = value[1].n * (value[1].n < 0) ? (value[1].mult(nerf)) : (value[1].mult(buff));
      if (game.resources.get(value[0]).quantity + mod < game.resources.get(value[0]).min.n) {
        return false;
      }
    }
    return true;
  }

  doExchange(game, buff, nerf) {
    for (let value of this.list.entries()) {
      let mod = (value[1].n < 0) ? (value[1].mult(nerf)) : (value[1].mult(buff));
      game.resources.get(value[0]).add(mod);
    }
  }

  once(game, buff, nerf) {
    if (!this.hasCost) {
      this.doExchange(game, buff, nerf);
      return true;
    } else if (this.canExchange(game, buff, nerf)) {
        this.doExchange(game, buff, nerf);
        return true;
    } else {
      return false;
    }
  }

  canUnExchange(game) {
    for (let value of this.list.entries()) {
      if (game.resources.get(value[0]).quantity - value[1].n < game.resources.get(value[0]).min.n) {
        return false;
      }
    }
    return true;
  }

  undoExchange(game) {
    for (let value of this.list.entries()) {
      let sellPenalty = (value[1].n < 0) ? 0.5: 1.0;
      game.resources.get(value[0]).quantity -= value[1].n * sellPenalty;
    }
  }

  unOnce(game) {
    if (this.canUnExchange(game)) {
        this.undoExchange(game);
    }
  }
}

export function ExchangeFactory(name, l, mult)
{
  let e = new Exchange(l);
  e.setup(name, l, mult);
  return e;
};
