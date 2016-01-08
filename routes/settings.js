var express = require('express');
var router = express.Router();

var piblaster = require('pi-blaster.js');

var state = false;


/*
 settings
 */
router.get('/settings', function (req, res) {
    console.log('yeah');
});

/*
 * POST to adduser.
 */
router.post('/update', function (req, res) {
    console.log('coucou');
    if (state) {
        console.log('state: ', state);
        state = false;
        piblaster.setPwm(21, 0 );
    } else {
        console.log('state: ', state);
        state = true;
        piblaster.setPwm(21, 1 );
    }

    res.send( {msg: state});
});


module.exports = router;
