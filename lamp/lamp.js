/**
 * Created by yannick on 09/01/2016.
 */
//var piblaster = require("pi-blaster.js");

    var State = require("./State");

var timeToWakePin = 21;
var nightLightPin = 20;

var settings = {
    wakeAllowed: {},
    wakeAllowedDuration: 1000
};
var onTimers = [];
var offTimers = [];
var nightLightTimer;


var lamp = function () {

    this.turnNightLightOn = function () {
        console.log('State require: ', State.nightLightStatus);
        State.nightLightStatus = true;
        console.log('State require: ', State.nightLightStatus);
        //piblaster.setPwm(nightLightPin, settings.nightLight.intensity );
        console.log('LAMP: Switching nightLight on');
        nightLightTimer = setTimeout(this.turnNightLightOff, parseInt(settings.nightLight.duration));
    };

    this.turnNightLightOff = function () {
        State.nightLightStatus = false;
        console.log('State require: ', State.nightLightStatus);

        if (nightLightTimer) { clearTimeout(nightLightTimer)}
        //piblaster.setPwm(led, 0 );
        console.log('LAMP: Switching nightLight off');
    };

    this.updateSettings = function (newSettings) {
        console.log('LAMP: settings updated', newSettings);
        settings = newSettings;
        for (var i = 0; i <= 6; i++) {
            this.updateTimer(i, settings.wakeAllowed[i].hour, settings.wakeAllowed[i].min);
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
        console.log('NOW - Hours: ' + dateTimeNow.getHours() + ' min: ' + dateTimeNow.getMinutes() + ' sec: ' + dateTimeNow.getSeconds());
        console.log('THEN- Hours: ' + hour + ' min: ' + minute);
        console.log('timeNow: ' + timeNow);
        var timeThen = (hour * 3600 * 1000 + minute * 60 * 1000);
        console.log('timeThen: ' + timeThen);
        var daysLeft = ( dayNum >= today ) ? dayNum - today : dayNum + 7 - today;
        if (daysLeft === 0) {
            if (timeNow > timeThen) {
                daysLeft = daysLeft + 7;
            }
        }
        var timeLeft = timeThen - timeNow;
        var millisecondsBeforeWakeUpAllowed = daysLeft * 24 * 3600 * 1000 + timeLeft;
        console.log(dayNum + ' on in: ' + millisecondsBeforeWakeUpAllowed / 1000 / 3600);
        onTimers[dayNum] = setTimeout(this.startWakeUpAllowedLight, millisecondsBeforeWakeUpAllowed);
    };

    this.startWakeUpAllowedLight = function () {
        console.log('wake up allowed light turned on');
        //piblaster.setPwm(timeToWakePin, 1);
        if (offTimers[0]) {
            clearTimeout(offTimers[0])
        }
        offTimers[0] = setTimeout(this.stopWakeAllowedLight, 1000);
    };

    this.stopWakeAllowedLight = function () {
        console.log('wake up allowed light turned off');
        //piblaster.setPwm(timeToWakePin, 0);
    }
};

module.exports = lamp;