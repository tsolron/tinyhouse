export default class Resource {
  constructor(n, resPool) {
    this.name = n;
    this.resPool = resPool;
    this._baseRPT = [{name:this.name,quantity:1}];
    this._baseROC = [];
    this._quantity = 0;
    this._minimum = 0;
    this._maximum = 100;
    this._isComposite = false;
    this._isStructure = false;
    this._cost = null;
  }

  get selfRPT() {
    let result = 0;
    this._baseRPT.forEach(r => {
      if (r.name == this.name) {
        result = r.quantity;
      }
    });
    return result;
  }
  set selfRPT(n) {
    let exists = false;
    this._baseRPT.forEach(r => {
      if (r.name == this.name) {
        exists = true;
        r.quantity = n;
      }
    });
    if (!exists) {
      this._baseRPT.push({name:this.name,quantity:n});
    }
  }

  get baseRPT() { return this._baseRPT; }
  set baseRPT(rpt) { this._baseRPT = rpt; }

  get baseROC() { return this._baseROC; }
  set baseROC(roc) { this._baseROC = roc; }

  get quantity() { return this._quantity; }
  set quantity(q) { this._quantity = q; }

  get minimum() { return this._minimum; }
  set minimum(q) { this._minimum = q; }

  get maximum() { return this._maximum; }
  set maximum(q) { this._maximum = q; }

  get isComposite() { return this._isComposite; }
  set isComposite(ic) { this._isComposite = ic; }

  get isStructure() { return this._isStructure; }
  set isStructure(is) { this._isStructure = is; }

  get cost() { return this._cost; }
  set cost(c) { this._cost = c; }

  tick(n) {
    let rpt = this._baseRPT;
    if (rpt.length === 1 && rpt[0].name === this.name) {
      this.add(rpt[0].quantity * n);
    }
    else {
      rpt.forEach(r => {
        // TODO: Currenly only linear growth with quantity. Add other growth.
        this.resPool.get(r.name).add(r.quantity * n * this._quantity);
      });
    }
  }

  getCraftGain() {
    return [{name:this.name, quantity:1}];
  }

  add(n) {
    this._quantity += n;
    this._quantity = Math.min(this._quantity,this._maximum);
    this._quantity = Math.max(this._quantity,this._minimum);
  }

  testAddMin(n) {
    if (this._quantity + n >= this._minimum) {
      return true;
    }
    return false;
  }

  testCost(n) {
    if (this.cost == null) { return true; }
    let result = true;
    this.cost.forEach(r => {
      if (!this.resPool.get(r.name).testAddMin(-r.quantity * this.repeat)) {
        result = false;
      }
    });

    return result;
  }
};
