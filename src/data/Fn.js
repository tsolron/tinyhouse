'use strict';

/**
 * TODO functions
 * @type {class}
 * @property {string} f
 * @property {Number} n
 */
export default class Fn {
  constructor() {
    this._f = '1';
    this.n = 1;
  }

  get f() { return this._f; }
  set f(f) { this._f = f; }

  recalculate(game) {
    let result = Number(eval(this.f));
    this.n = result;
  }

  mult(other) {
    return this.n * other;
  }
};

/**
 * @type {function}
 * @param {Game} game
 * @param {string} f
 */
export function FnF(f)
{
  let fn = new Fn();
  fn.f = f;
  return fn;
};
