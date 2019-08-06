<template>
  <div id="app" class="theme">
    <h1>timeTick : {{ timeTick }}</h1>

    <div>
      <button @click="undo">Undo</button>
      <button @click="pause">Pause</button>
      <button @click="start">Play</button>
    </div>

    <hr><br>

    <div v-for="feat of this.game.features" v-bind:feat="feat" v-bind:game="game">
      <div v-for="res of feat[1].resources" v-bind:res="res">
        <div v-show="game.r.get(res).isUnlocked" class="bouter">
          <div class="left"><p class="atext">{{feat[0]}} : <b>{{res}}</b> : {{game.r.get(res).displayQuantity}}<span v-show="(game.r.get(res).max.n < Infinity)"> / {{game.r.get(res).max.n}}</span></p></div>
          <div class="right"><button @click="doActive('resource',res)" class="btn">{{feat[1].activeName}} {{res}}</button></div>
        </div>
      </div>
    </div>

    <br><hr><br>

    <button @click="doActive('upgrade','farming')">Research Farming</button>

    <button @click="doUnlockEverything()">Unlock Everything</button>

    <button @click="debug()">Debug</button>

  </div>
</template>


<script>
'use strict';

import Game from './data/Game.js'

export default {
  name: 'app',
  components: {

  },
  data () {
    return {
      game: new Game(),
    }
  },
  methods: {
    undo: function() {
      this.game.actions.rollbackPreviousAction(this.game);
    },
    pause: function() {
      this.game.time.pause();
    },
    start: function() {
      this.game.time.start(this.game);
    },
    doActive: function(type, name) {
      this.game.actions.doActiveByOther(this.game, type, name);
    },
    doUnlockEverything: function() {
      this.game.unlockAll();
    },
    debug: function() {
      this.game.debug();
    }
  },
  computed: {
    timeTick: function() {
      return this.game.time.timeTick;
    },
  },
  created: function() {
    //this.game.buildStructure();
    this.game.buildFromFile();
    this.game.time.start(this.game);
    this.game.recalculateAll(this.game);
    this.game.time.gameLoop = setInterval(this.game.time.tick, (this.game.time.gameLoopInterval), this.game);
  },
}
</script>


<style>
:root {
  color: #DCDCDC;
	background-color: #201F1D;
}
.bouter {
  /*border: solid 1px white;*/
}
.atext {
  /*border: solid 1px green;*/
  vertical-align: middle;
  line-height: 38px;
  margin: 3px;
}
div.left {
  display: inline-block;
  vertical-align: top;
  width: 230px;
  height: 46px;
  box-sizing: border-box;
  /*border: solid 1px yellow;*/
}
div.right {
  display: inline-block;
  vertical-align: top;
  width: 150px;
  height: 46px;
  /*border: solid 1px red;*/
}
.btn {
  color: #DCDCDC;
  width: 144px;
  height: 40px;
  margin: 3px;
  background-color: #201F1D;
  border: solid 1px rgb(184, 117, 58);
}
.btn:hover{
	border: solid 1px orange;
	background-color: #222222;
}
</style>
