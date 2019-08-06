'use strict';

import {FnF} from './Fn.js';

export class Common {
  constructor() {
    //this._list = new Map();
    // [{name:'mass',quantity:'fun'}]
    this.globalBuff = FnF('10');
    this.globalNerf = FnF('1');
    this.unlockRatio = 0.3;
  }

  /*add(n, v) {
    if (this._list.get(n) === 'undefined') {
      this._list.set(n, v);
    }
    else {
      //TODO: Already exists so display error message
    }
  }*/

  recalculate(game) {
    this.globalBuff.recalculate(game);
    this.globalNerf.recalculate(game);
  }
}
