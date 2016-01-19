/**
 * Created by yannick on 09/01/2016.
 */
var piblaster = require("pi-blaster.js");
var gpio = require("rpi-gpio");

var State = require("./State");

var TIME_TO_WAKE_LED_PIN = 21;
var NIGHTLIGHT_LED_PIN = 22;
var NIGHTLIGHT_BUTTON_PIN = 7;

var SMOOTH_TRANSITION_STEP = 100;

var lamp = function () {

    this.nightLightTimer = null;
    this.wakeAllowedOffTimer = null;
    this.wakeAllowedOnTimers = [];
    this.wakeAllowedOffTimers = [];
    this.settings = {};
    this.smoothInterval = [];

    this.init = function () {
        //Set everything to 0
        piblaster.setPwm(TIME_TO_WAKE_LED_PIN, 0);
        piblaster.setPwm(NIGHTLIGHT_LED_PIN, 0);

        //Listen to Button
        gpio.setup(NIGHTLIGHT_BUTTON_PIN, gpio.DIR_IN, gpio.EDGE_RISING);
        gpio.on('change', function(channel, value) {
            console.log('Channel ' + channel + ' value is now ' + value);
            this.turnNightLightOn();
        }.bind(this));
    };

    this.turnNightLightOn = function () {
        console.log('LAMP: Switching nightLight ON');
        piblaster.setPwm(NIGHTLIGHT_LED_PIN, this.settings.nightLight.intensity );
        State.nightLightStatus = true;
        //smoothlyChangeLedValue(NIGHTLIGHT_LED_PIN, 0, settings.nightLight.intensity, 2000);
        console.log('LAMP: Setting nightLamp off in ' + parseInt(this.settings.nightLight.duration) / 1000 / 60 + ' min');
        nightLightTimer = setTimeout(this.turnNightLightOff, parseInt(this.settings.nightLight.duration));
    };

    this.turnNightLightOff = function () {
        console.log('LAMP: Switching nightLight OFF');
        if (this.nightLightTimer) { clearTimeout(this.nightLightTimer)}
        //smoothlyChangeLedValue(NIGHTLIGHT_LED_PIN, settings.nightLight.intensity, 0, 2000);
        piblaster.setPwm(NIGHTLIGHT_LED_PIN, 0 );
        State.nightLightStatus = false;
    };

    this.updateSettings = function (newSettings) {
        console.log('LAMP: updating settings with', newSettings);
        //console.log('Lamp timing: ', newSettings.wakeAllowed.timing);
        this.settings = newSettings;
        for (var i = 0; i <= 6; i++) {
            this.updateTimer(i, this.settings.wakeAllowed.timing[i].hour, this.settings.wakeAllowed.timing[i].min);
        }

    };

    this.updateTimer = function (dayNum, hour, minute) {
        if (this.wakeAllowedOnTimers[dayNum]) {
            clearTimeout(this.wakeAllowedOnTimers[dayNum]);
            clearTimeout(this.wakeAllowedOffTimers[dayNum]);
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
        this.wakeAllowedOnTimers[dayNum] = setTimeout(this.startWakeUpAllowedLight, millisecondsBeforeWakeUpAllowed);
        //wakeAllowedOffTimers[dayNum] = setTimeout(this.stopWakeAllowedLight, millisecondsBeforeWakeUpAllowed + parseInt(settings.wakeAllowed.duration));
    };

    this.startWakeUpAllowedLight = function () {
        State.wakeAllowedLightStatus = true;
        console.log('LAMP: wake up allowed light switched on');
        piblaster.setPwm(TIME_TO_WAKE_LED_PIN, this.settings.wakeAllowed.intensity);
        //console.log('setting timeout to turn off');
        console.log('LAMP: setting wakeAllowed off timer in ' + parseInt(this.settings.wakeAllowed.duration) / 1000 / 60 + ' minutes');
        this.wakeAllowedOffTimer = setTimeout(this.stopWakeAllowedLight, parseInt(this.settings.wakeAllowed.duration));
    };

    this.stopWakeAllowedLight = function () {
        clearTimeout(this.wakeAllowedOffTimer);
        State.wakeAllowedLightStatus = false;
        piblaster.setPwm(TIME_TO_WAKE_LED_PIN, 0);
        console.log('wake up allowed light turned off');
    };

    //function smoothlyChangeLedValue(ledPin, currentValue, targetValue, duration) {
    //    smoothInterval[ledPin] = setInterval(changeLedValue, SMOOTH_TRANSITION_STEP, ledPin, currentValue, targetValue, duration, Date.now());
    //}
    //
    //function changeLedValue(ledPin, initialValue, targetValue, duration, startTime) {
    //    if (Date.now() > startTime + duration ) {
    //        piblaster.setPwm(ledPin, targetValue);
    //        console.log('ending smooth animation');
    //        clearInterval(smoothInterval[ledPin]);
    //    } else {
    //        var newValue = (Date.now() - startTime) / duration * (targetValue - initialValue);
    //        console.log('setting PWM to :', newValue);
    //        piblaster.setPwm(ledPin, newValue);
    //    }
    //}

};

module.exports = lamp;