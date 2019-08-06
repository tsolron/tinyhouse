'use strict';

/**
 * TODO functions
 * @type {class}
 * @property {Number} ticksPerTenSeconds Default: 50
 * @property {Boolean} isPaused
 * @property {Number} timeTick Total ticks progressed since start
 * @property {Number} gameLoop ID to setInterval timer
 * @property {Number} slowTick Number of ticks to iterate
 */
export default class Time {
  constructor(tpts) {
    this.ticksPerTenSeconds = Number(tpts);
    this.isPaused = true;
    this.timeTick = 0;
    this.gameLoop = null;
    this.slowTick = 0;
  }

  get tt() { return this.timeTick; }
  get gameLoopInterval() { return 10000 / this.ticksPerTenSeconds; }

  everySecond(game) {
    game.triggers.check(game);
  }

  //Note: Since this is called within setInterval, "this" refers to Window not Time
  tick(game) {
    if ((!game.time.isPaused) || (game.time.isPaused && game.time.slowTick > 0)) {
      // Manage tick values
      game.time.timeTick++;
      game.time.slowTick--;
      game.time.slowTick = Math.max(game.time.slowTick, 0);

      // Clean game
      if (game.dirty) { game.recalculateAll(game); }

      // Passive incomes
      game.features.forEach(f => {
        f.doPassive(game, game.common.globalBuff.n, game.common.globalNerf.n);
      });

      // User actions (active income)
      game.actions.runNextAction(game);

      // Triggers
      if (game.time.timeTick % (game.time.ticksPerTenSeconds / 10) == 0) { game.time.everySecond(game); }
    }
  }

  // fastTick(n) { } // Not perfect, used for quickly fast-forwarding

  pause() {
    this.isPaused = true;
    this.slowTick = 0;
  }

  start(game) {
    this.isPaused = false;
  }
};
