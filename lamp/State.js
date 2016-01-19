/**
 * Created by yannick on 14/01/2016.
 */

var State = function () {
        if(!State.initiated) {
            State.nightLightStatus = false;
            State.wakeAllowedLightStatus = false;
        } else {
            State.initiated = true;
        }
    };

module.exports = State;