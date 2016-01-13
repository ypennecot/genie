var express = require('express');
var router = express.Router();

//var piblaster = require('pi-blaster.js');
var Lamp = require('../lamp/lamp');


var state = false;
var lamp = new Lamp();
//var settings = {
//    mondayhour: 7,
//    mondaymin:0,
//    tuesdayhour:7,
//    tuesdaymin:0,
//    wednesdayhour:7,
//    wednesdaymin:7,
//    thursdayhour:7,
//    thursdaymin:0,
//    fridayhour:7,
//    fridaymin:0,
//    saturdayhour:8,
//    saturdaymin:0,
//    sundayhour:8,
//    sundaymin:0
//};

var settings = {
    wakeAllowed: [
        {hour: 18, min: 3},
        {hour: 18, min: 3},
        {hour: 18, min: 3},
        {hour: 18, min: 48},
        {hour: 18, min: 3},
        {hour: 18, min: 3},
        {hour: 18, min: 3}]
};
lamp.updateSettings(settings);

/*
 settings
 */
router.get('/settings', function (req, res) {
    console.log('yeah');
});

router.get('/gettime', function (req, res) {
    console.log('time requested');
    res.send({msg: Date.now()});
});

router.get('/getsettings', function (req, res) {
    console.log('settings requested ', settings);
    res.json(settings);
});


/*
 * POST to adduser.
 */
router.post('/switchon', function (req, res) {
    if (state) {
        console.log('state: ', state);
        state = false;
        lamp.turnLedOff(21);
        //piblaster.setPwm(21, 0 );
    } else {
        console.log('state: ', state);
        state = true;
        lamp.turnLedOn(21);
        //piblaster.setPwm(21, 1 );
    }
    res.send({msg: ''});
});

router.post('/setsettings', function (req, res, onSettingsReceived) {
    //console.log('req.body: ', req.body);
    settings = JSON.parse(req.body);
    console.log('settings received', settings);
    //lamp.updateSettings(settings);
    res.send('coucou');
});

function onSettingsReceived() {
    lamp.updateSettings(settings);
}


module.exports = router;
