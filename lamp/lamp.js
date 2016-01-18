/**
 * Created by yannick on 09/01/2016.
 */
var piblaster = require("pi-blaster.js");
var gpio = require("rpi-gpio");

var State = require("./State");

var timeToWakeLedPin = 21;
var nightLightLedPin = 22;
var nightLightButtonPin = 7;

var settings = {
    wakeAllowed: {},
    wakeAllowedDuration: 10 * 60 * 1000
};
var onTimers = [];
var offTimers = [];
var nightLightTimer;
var wakeAllowedOffTimer;



piblaster.setPwm(timeToWakeLedPin, 0);
piblaster.setPwm(nightLightLedPin, 0);



var lamp = function () {

    this.init = function () {
        gpio.setup(nightLightButtonPin, gpio.DIR_IN, gpio.EDGE_RISING);

        gpio.on('change', function(channel, value) {
            console.log('Channel ' + channel + ' value is now ' + value);
            this.turnNightLightOn();
        }.bind(this));
    };

    this.turnNightLightOn = function () {
        State.nightLightStatus = true;
        piblaster.setPwm(nightLightLedPin, settings.nightLight.intensity );
        console.log('LAMP: Switching nightLight ON');
        nightLightTimer = setTimeout(this.turnNightLightOff, parseInt(settings.nightLight.duration));
    };

    this.turnNightLightOff = function () {
        State.nightLightStatus = false;
        console.log('LAMP: Switching nightLight OFF');
        if (nightLightTimer) { clearTimeout(nightLightTimer)}
        piblaster.setPwm(nightLightLedPin, 0 );
    };

    this.updateSettings = function (newSettings) {
        console.log('LAMP: settings updated', newSettings);
        settings = newSettings;
        for (var i = 0; i <= 6; i++) {
            this.updateTimer(i, settings.wakeAllowed[i].hour, settings.wakeAllowed[i].min);
        }

    };

    this.updateTimer = function (dayNum, hour, minute) {
        if (onTimers[dayNum]) {
            clearTimeout(onTimers[dayNum]);
            clearTimeout(offTimers[dayNum]);
        }
        var dateTimeNow = new Date();
        var today = dateTimeNow.getDay();
        var timeNow = dateTimeNow.getHours() * 3600 * 1000 + dateTimeNow.getMinutes() * 60 * 1000 + dateTimeNow.getSeconds() * 1000;
        //console.log('NOW - Hours: ' + dateTimeNow.getHours() + ' min: ' + dateTimeNow.getMinutes() + ' sec: ' + dateTimeNow.getSeconds());
        //console.log('THEN- Hours: ' + hour + ' min: ' + minute);
        //console.log('timeNow: ' + timeNow);
        var timeThen = (hour * 3600 * 1000 + minute * 60 * 1000);
        //console.log('timeThen: ' + timeThen);
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
        offTimers[dayNum] = setTimeout(this.stopWakeAllowedLight, millisecondsBeforeWakeUpAllowed + parseInt(settings.wakeAllowedDuration));
    };

    this.startWakeUpAllowedLight = function () {
        State.wakeAllowedLightStatus = true;

        console.log('wake up allowed light turned on');
        piblaster.setPwm(timeToWakeLedPin, 1);
        //console.log('setting timeout to turn off');
        wakeAllowedOffTimer = setTimeout(this.stopWakeAllowedLight, parseInt(settings.wakeAllowedDuration));
    };

    this.stopWakeAllowedLight = function () {
        console.log('wake up allowed light turned off');
        State.wakeAllowedLightStatus = false;
        piblaster.setPwm(timeToWakeLedPin, 0);
    }
};

module.exports = lamp;