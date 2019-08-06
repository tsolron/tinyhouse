export default class ActionList {
  constructor(n) {
    this.cur_act = null;
    this.act_list = [];
    this.past_actions = [];
    this.max_history = n;
  }

  runNextAction(resPool) {
    if (this.act_list.length == 0) {
      return;
    }
    this.cur_act = this.act_list.shift();
    this.cur_act.process(resPool);
    this.past_actions.push(this.cur_act);
    if (this.past_actions.length > this.max_history) {
      this.past_actions.shift();
    }
  }

  rollbackPreviousAction(resPool) {
    if (this.past_actions.length == 0) {
      return;
    }
    this.cur_act = this.past_actions.pop();
    this.cur_act.undo(resPool);
    //this.act_list.unshift(this.cur_act);
  }

  addAction(act) {
    this.act_list.push(act);
  }

  cancelLastAction() {
    this.act_list.pop();
  }
}
