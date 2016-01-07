var express = require('express');
var router = express.Router();



/*
 settings
 */
router.get('/settings', function (req, res) {
    console.log('coucou');
});

/*
 * POST to adduser.
 */
router.post('/update', function (req, res) {
    console.log('coucou');
    res.send( {msg: ''});
});


module.exports = router;
