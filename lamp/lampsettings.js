/**
 * Created by yannick on 14/01/2016.
 */

var LampSettings = function () {
    if(!LampSettings.initiated) {
        LampSettings.settings = require('./settings.json')
    } else {
        LampSettings.initiated = true;
    }
};

module.exports = LampSettings;