export default class Action {
  constructor(t, g, c, n) {
    this.timeTick = t;
    this.gain = g;
    this.actualGain = null; // TODO: For undoing actions accurately
    this.cost = c;
    // TODO: Hard coded for now
    this.repeat = 1;
    this.state = 'new';
  }

  validateProcess(resPool) {
    let result = true;
    this.cost.forEach(r => {
      if (!resPool.get(r.name).testAddMin(-r.quantity * this.repeat)) {
        result = false;
      }
    });

    return result;
  }

  process(resPool) {
    if (this.validateProcess(resPool)) {
      this.cost.forEach(r => {
        resPool.get(r.name).add(-r.quantity * this.repeat);
      });
      this.gain.forEach(r => {
        resPool.get(r.name).add(r.quantity * this.repeat);
      });
      this._state = 'complete';
    }
    else {
      this._state = 'cancelled';
    }
  }

  validateUndo(resPool) {
    let result = true;
    this.gain.forEach(r => {
      if (!resPool.get(r.name).testAddMin(-r.quantity * this.repeat)) {
        result = false;
      }
    });

    return result;
  }

  // TODO: Not up to date
  undo(resPool) {
    if (this.validateUndo(resPool)) {
      this.gain.forEach(r => {
        resPool.get(r.name).add(-r.quantity * this.repeat);
      });
      this.cost.forEach(r => {
        resPool.get(r.name).add(r.quantity * this.repeat);
      });
      this._state = 'undone';
    }
    else {
      this._state = 'cancelled';
    }
  }
};
