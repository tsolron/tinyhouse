'use strict';

import {FnF} from './Fn.js';
import {ExchangeFactory} from './Exchange.js';

/**
 * TODO functions
 * @type {class}
 * @param {Game} game
 * @param {string} n Used to set name
 * @param {Number} q Used to set quantity
 * @param {Boolean} u Used to set isUnlocked
 * @property {string} name
 * @property {Number} quantity
 * @property {Boolean} isUnlocked
 * @property {Array.<string>} influencers TODO: Need to implement
 * @property {Fn} min
 * @property {Fn} max
 * @property {Exchange} passive
 * @property {Exchange} active
 * @property {Exchange} requirement
 * @property {Fn} buff
 * @property {Fn} nerf
 * @property {Boolean} isAssigned
 * @property {string} assignedBy
 * @property {Number} numAssigned
 */
export default class Resource {
  constructor(n, u) {
    this.name = n;
    this.isUnlocked = u;
    this.quantity = 0;
    this.min = FnF('0');
    this.max = FnF('Infinity');
    this.passive = ExchangeFactory('',''); // Exchange
    this.active = ExchangeFactory('',''); // Exchange
    this.requirement = ExchangeFactory('',''); // Exchange, for self.active, does not modify resources
    this.costRatio = 1,
    this.buff = FnF('1'); // Fn, multiplies passive/active gains
    this.nerf = FnF('1'); // Fn, multiplies passive/active costs
    this.isProducer = false; // bool, true means additions to this ignore buff
    this.isAssigned = false; // bool, indicates 'quantity' is from assignment of other resources
    this.assignedBy = ''; // 'resource.name'
    this.numAssigned = 0; // Number of self.quantity assigned to others
  }

  get displayQuantity() {
    //return this.quantity.toFixed(2);
    //return parseFloat(Math.round(this.quantity * 100) / 100).toFixed(2);
    return Number(Math.round(parseFloat(this.quantity + 'e' + 2)) + 'e-' + 2);
  }

  get qty() { return this.quantity; }
  set qty(q) { this.quantity = q; }

  unlock() {
    this.isUnlocked = true;
  }

  add(num) {
    this.quantity += num;
    this.quantity = Math.min(this.quantity, this.max.n);
    this.quantity = Math.max(this.quantity, this.min.n);
  }

  doPassive(game, buff, nerf) {
    if (this.isUnlocked) {
      this.passive.once(game, this.buff.mult(buff), this.nerf.mult(nerf));
    }
  }

  doActive(game, buff, nerf) {
    let doBuff = (this.isProducer) ? (1) : (this.buff.mult(buff));
    this.active.once(game, doBuff, this.nerf.mult(nerf));
    game.dirty = true;
  }

  assign(game, type, n) {
    //TODO: Implement 'type' (once, upto, exact, max)
    let assigner = game.resources.get(this.assignedBy);
    if (n <= (assigner.quantity - assigner.numAssigned)) {
      this.quantity += n;
      assigner.numAssigned += n;
    }
  }

  unassign(game, type, n) {
    //TODO: Implement 'type' (once, upto, exact, max)
    if (n <= this.quantity) {
      this.quantity -= n;
      game.resources.get(assignedBy).numAssigned -= n;
    }
  }

  recalculate(game) {
    if (!!this.min) { this.min.recalculate(game); }
    if (!!this.max) { this.max.recalculate(game); }
    if (!!this.passive) { this.passive.recalculate(game); }
    if (!!this.active) { this.active.recalculate(game); }
    if (!!this.requirement) { this.requirement.recalculate(game); }
    if (!!this.buff) { this.buff.recalculate(game); }
    if (!!this.nerf) { this.nerf.recalculate(game); }
  }
}

/**
 * TODO functions and args
 * @type {function}
 * @param {Game} game
 * @param {string} n Used to set name
 * @param {Number} q Used to set quantity
 * @param {Boolean} u Used to set isUnlocked
 * @param {Object} args [description]
 * @return {Resource}
 * @constructor
 */
export function ResourceFactory(n, u)
{
  return new Resource(n, u);
};
