/**
 * Created by yannick on 09/01/2016.
 */
//var piblaster = require("pi-blaster.js");
var timeToWakePin = 21;



var lamp = function () {
    this.turnLedOn = function (led) {
        //piblaster.setPwm(timeToWakePin, 1 );
        console.log('inside lamp on');
    };

    this.turnLedOff = function (led) {
        //piblaster.setPwm(led, 0 );
        console.log('inside lamp off');
    }
};


module.exports = lamp;