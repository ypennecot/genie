var express = require('express');
var router = express.Router();

var Lamp = require('../lamp/lamp');
var State = require('../lamp/State');

var lamp = new Lamp();


var settings = {
    wakeAllowed: [
        {hour: 18, min: 3},
        {hour: 18, min: 3},
        {hour: 18, min: 3},
        {hour: 18, min: 48},
        {hour: 12, min: 54},
        {hour: 18, min: 3},
        {hour: 18, min: 3}],
    wakeAllowedDuration: 1000 * 60 * 30,
    wakeAllowedIntensity: 0.2,
    nightLight: {
        duration: 30 * 60 * 1000,
        intensity: 0.5
    }
};
lamp.init();
lamp.updateSettings(settings);

/*
 settings
 */
router.get('/settings', function (req, res) {
    console.log('GET /settings');
});


router.get('/gettime', function (req, res) {
    console.log('GET /settings/gettime');
    console.log('time requested' + Date.now());
    console.log(new Date().getTimezoneOffset());
    res.send({
        timeStamp: Date.now(),
        timezoneOffset: new Date().getTimezoneOffset()
    });
});

router.get('/getsettings', function (req, res) {
    console.log('GET /settings/getsettings');
    console.log('settings requested ', settings);
    res.json(settings);
});

router.post('/switchnightlight', function (req, res) {
    if (State.nightLightStatus) {
        lamp.turnNightLightOff();
    } else {
        lamp.turnNightLightOn();
    }
    res.send({msg: ''});
});

router.post('/switchwakeallowed', function (req, res) {
    if (State.wakeAllowedLightStatus) {
        lamp.stopWakeAllowedLight();
    } else {
        lamp.startWakeUpAllowedLight();
    }
    res.send({msg: ''});
});

router.post('/setsettings', function (req, res) {
    console.log('req.body: ', req.body);
    settings = JSON.parse(JSON.stringify(req.body));
    console.log('settings received', settings);
    lamp.updateSettings(settings);
    res.send('coucou');
});


module.exports = router;
