'use strict';

//import fs from 'fs'

/**
 * TODO functions
 * @type {class}
 * @property {string} f
 * @property {Number} n
 */
export default class Save {
  constructor() {
    this._f = '';
    this._d = {};
  }

  get f() { return this._f; }
  set f(f) { this._f = f; }

  get d() { return this._d; }
  set d(d) { this._d = d; }

  // Untested
  readFromFile() {
    //debugger;
    const fs = require('fs');
    fs.readFileSync(this.f, (err, data) => {
        if (err) throw err;
        this.d = JSON.parse(data);
        console.log(this.d);
    });
  }

  // Untested
  writeToFile() {
    //const fs = require('fs');
    var fileContent = "hello";
    // If fileContent is an Object, then use JSON.stringify(fileContent, null, 2) below

    fs.writeFile("./sample.txt", fileContent, (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("File has been created");
    });

  }
};
