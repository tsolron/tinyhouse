export default class Option {
  constructor() {
    this._gain = null;
    this._cost = null;
    this._req = null;
    this._funGain = null;
    this._funCost = null;
    this._funReq = null;
    // [{name:'mass',quantity:'fun'}]
  }

  get gain() { return this._gain; }
  set funGain(fg) { this._funGain = fg; }

  get cost() { return this._cost; }
  set funCost(fc) { this._funCost = fc; }

  get req() { return this._req; }
  set funReq(fr) { this._funReq = fr; }

  recalculate(resPool) {
    // TODO: Add string validation (could allow exploits)
    this._gain = this._funGain;
    if (typeof this._gain !== "undefined") {
      let abc = 123;
      //this._gain.forEach(r => {
        //r.quantity = eval(r.quantity);
      //});
    }

    /*
    this._cost = this._funCost;
    if (typeof this._cost !== "undefined") {
      this._cost.forEach(r => {
        r.quantity = eval(r.quantity);
      });
    }

    this._req = this._funReq;
    if (typeof this._req !== "undefined") {
      this._req.forEach(r => {
        r.quantity = eval(r.quantity);
      });
    }
*/
    //Math.evaluate(f);
    //return eval('let a = 3; console.log(eval("a * 2"));');
  }
}

export function OptionFactory(resPool, args)
{
  let op = new Option();
  if (typeof args['type'] !== "undefined") {
    if (args['type'] == '1resperclick') {
      op.funGain = [{name:'mass',quantity:'1'}]
    }
  } else if (typeof args['gain'] !== "undefined" ||
             typeof args['cost'] !== "undefined" ||
             typeof args['req'] !== "undefined") {
    op.funGain = args['gain'];
    op.funCost = args['cost'];
    op.funReq = args['req'];
    op.recalculate(resPool);
  }
  return op;
};
