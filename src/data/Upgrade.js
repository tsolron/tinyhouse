'use strict';

import Resource from './Resource.js';
import Exchange from './Exchange.js'

export default class Upgrade extends Resource
{
  constructor (n, u, t)
  {
    super(n, u);
    this.type = t;
    this.action = '';
  }

  doActive(game, buff, nerf) {
    super.doActive(game, buff, nerf);
    if (!!this.action) {
      eval(this.action);
    }
  }
}

export function UpgradeFactory(n, u, t) {
  return new Upgrade(n, u, t);
}
