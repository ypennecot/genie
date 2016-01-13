/**
 * Created by yannick on 09/01/2016.
 */
//var piblaster = require("pi-blaster.js");
var timeToWakePin = 21;
var settings = {
    wakeAllowed: {},
    wakeAllowedDuration: 100000
};
var onTimers = [];
var offTimers = [];

var lamp = function () {

    this.turnLedOn = function (led) {
        //piblaster.setPwm(timeToWakePin, 1 );
        console.log('inside lamp on');
    };

    this.turnLedOff = function (led) {
        //piblaster.setPwm(led, 0 );
        console.log('inside lamp off');
    };

    this.updateSettings = function (newSettings) {
        console.log('settings updated', newSettings);
        for (var i = 0; i <= 6; i++) {
            //if ((newSettings.wakeAllowed[i].hour != settings.wakeAllowed[i].hour) || ( newSettings.wakeAllowed[i].min != settings.wakeAllowed[i].min )) {
                this.updateTimer(i, newSettings.wakeAllowed[i].hour, newSettings.wakeAllowed[i].min);
                settings.wakeAllowed[i] = newSettings.wakeAllowed[i];

            //}
        }
    };


    this.updateTimer = function (dayNum, hour, minute) {
        console.log('timer updated');
        if (onTimers[dayNum]) {
            clearTimeout(onTimers[dayNum]);
        }
        var dateTimeNow = new Date();
        var today = dateTimeNow.getDay();
        var timeNow = dateTimeNow.getHours() * 3600 * 1000 + dateTimeNow.getMinutes() * 60 * 1000 + dateTimeNow.getSeconds() * 1000;
        var timeThen = (hour * 3600 * 1000 + minute * 60 * 1000);
        var daysLeft = ( dayNum >= today ) ? dayNum - today : dayNum + 7 - today;
        if (daysLeft === 0) {
            if (timeNow > timeThen) {
                daysLeft = daysLeft + 7;
            }
        }
        var timeLeft = timeThen - timeNow;
        var millisecondsBeforeWakeUpAllowed = daysLeft * 24 * 3600 * 1000 + timeLeft;
        console.log('on in:', millisecondsBeforeWakeUpAllowed/1000 / 3600)
        onTimers[dayNum] = setTimeout(this.startWakeUpAllowedLight, millisecondsBeforeWakeUpAllowed);
    };

    this.startWakeUpAllowedLight = function () {
        console.log('wake up allowed light turned on');
        //piblaster.setPwm(timeToWakePin, 1);
        if (offTimers[0]) {
            clearTimeout(offTimers[0])
        }
        offTimers[0] = setTimeout( this.stopWakeUAllowedLight, 100000);
    };

    this.stopWakeUAllowedLight = function () {
        console.log('wake up allowed light turned off');
        //piblaster.setPwm(timeToWakePin, 0);
    }
};

module.exports = lamp;