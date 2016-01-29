/**
 * Created by yannick on 07/01/2016.
 */

var settings = {};

$(document).ready(function () {
    getServerTime();
    getSettings();
    $('#btnSwitchNightLight').on('click', switchNightLight);
    $('#btnSwitchWakeAllowed').on('click', switchWakeAllowed);
    $('#updateSettings').on('click', setSettings);
    $('#getState').on('click', getState);
});


function switchNightLight(event) {
    event.preventDefault();
    var temp = {
        'light': 1
    };

    $.ajax({
        type: 'POST',
        data: temp,
        url: '/settings/switchnightlight',
        dataType: 'JSON'
    }).done(function (response) {
        if (response.msg === '') {
            console.log('message reçu');
        } else {
            console.log('NON!! Pas reçu!', response.msg);
        }
    });
}

function switchWakeAllowed(event) {
    event.preventDefault();
    var temp = {
        'light': 1
    };

    $.ajax({
        type: 'POST',
        data: temp,
        url: '/settings/switchwakeallowed',
        dataType: 'JSON'
    }).done(function (response) {
        if (response.msg === '') {
            console.log('message reçu');
        } else {
            console.log('NON!! Pas reçu!', response.msg);
        }
    });
}

function setSettings() {
    settings = {
        wakeAllowed: {
            timing: [
                {
                    hour: parseInt($('#sundayhour').val()),
                    min: parseInt($('#sundaymin').val())
                },
                {
                    hour: parseInt($('#mondayhour').val()),
                    min: parseInt($('#mondaymin').val())
                },
                {
                    hour: parseInt($('#tuesdayhour').val()),
                    min: parseInt($('#tuesdaymin').val())
                },
                {
                    hour: parseInt($('#wednesdayhour').val()),
                    min: parseInt($('#wednesdaymin').val())
                },
                {
                    hour: parseInt($('#thursdayhour').val()),
                    min: parseInt($('#thursdaymin').val())
                },
                {
                    hour: parseInt($('#fridayhour').val()),
                    min: parseInt($('#fridaymin').val())
                },
                {
                    hour: parseInt($('#saturdayhour').val()),
                    min: parseInt($('#saturdaymin').val())
                }],

            duration: parseInt($('#wakeUpAllowedDuration').val() * 1000 * 60),
            intensity: $('#wakeUpAllowedIntensity').val(),
        },
        nightLight: {
            duration: parseInt($('#nightLightDuration').val() * 1000 * 60),
            intensity: $('#nightLightIntensity').val()
        }
    };
    console.log('settings before POST :', settings);
    console.log('settings before POST :', JSON.stringify(settings));

    $.ajax({
        type: 'POST',
        data: settings,
        url: '/settings/setsettings',
        dataType: 'JSON'
    }).done(function (response) {
        if (response.msg === '') {
            console.log('settings reçu');
        } else {
            console.log('NON!! settings pas reçu!', response.msg);
        }
    });
}

function getServerTime() {
    $.getJSON('/settings/gettime', function (data) {
        console.log('time received: ', data);
        var timeoffset = parseInt(new Date().getTimezoneOffset());
        getClock(data.timeStamp + ( -timeoffset + data.timezoneOffset ) * 60 * 1000);
    })
}

function getSettings() {
    $.getJSON('/settings/getsettings', function (data) {
        console.log('settings received: ', data);
        settings = JSON.parse(JSON.stringify(data));
        $('#sundayhour').val(settings.wakeAllowed.timing[0].hour);
        $('#sundaymin').val(settings.wakeAllowed.timing[0].min);
        $('#mondayhour').val(settings.wakeAllowed.timing[1].hour);
        $('#mondaymin').val(settings.wakeAllowed.timing[1].min);
        $('#tuesdayhour').val(settings.wakeAllowed.timing[2].hour);
        $('#tuesdaymin').val(settings.wakeAllowed.timing[2].min);
        $('#wednesdayhour').val(settings.wakeAllowed.timing[3].hour);
        $('#wednesdaymin').val(settings.wakeAllowed.timing[3].min);
        $('#thursdayhour').val(settings.wakeAllowed.timing[4].hour);
        $('#thursdaymin').val(settings.wakeAllowed.timing[4].min);
        $('#fridayhour').val(settings.wakeAllowed.timing[5].hour);
        $('#fridaymin').val(settings.wakeAllowed.timing[5].min);
        $('#saturdayhour').val(settings.wakeAllowed.timing[6].hour);
        $('#saturdaymin').val(settings.wakeAllowed.timing[6].min);
        $('#wakeUpAllowedDuration').val(settings.wakeAllowed.duration / 1000 / 60);
        $('#wakeUpAllowedIntensity').val(settings.wakeAllowed.intensity);
        $('#nightLightDuration').val(settings.nightLight.duration / 1000 / 60);
        $('#nightLightIntensity').val(settings.nightLight.intensity);
    })
}

function getState() {
    $.getJSON('/settings/getstate', function (data) {
        console.log('state received: ', data);
        if(data.nightLightStatus) {
            $('#nightlight').addClass('light-on');
        } else {
            $('#nightlight').removeClass('light-on');
        }
        if(data.wakeAllowedLightStatus) {
            $('#wakeallowed').addClass('light-on');
        } else {
            $('#wakeallowed').removeClass('light-on');
        }
    })
}


function setClock() {
    var d = new Date();

}

function getClock(serverTime) {
    tday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    tmonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //console.log('serverDate', serverDate);
    //console.log(serverDate.timezoneOffset);
    var d = new Date(serverTime);
    var nday = d.getDay(), nmonth = d.getMonth(), ndate = d.getDate(), nyear = d.getYear();
    if (nyear < 1000) nyear += 1900;
    var nhour = d.getHours(), nmin = d.getMinutes(), nsec = d.getSeconds(), ap;
    console.log('hour received from server: ' + nhour);
    if (nhour == 0) {
        ap = " AM";
        nhour = 12;
    }
    else if (nhour < 12) {
        ap = " AM";
    }
    else if (nhour == 12) {
        ap = " PM";
    }
    else if (nhour > 12) {
        ap = " PM";
        nhour -= 12;
    }

    if (nmin <= 9) nmin = "0" + nmin;
    if (nsec <= 9) nsec = "0" + nsec;

    document.getElementById('clockbox').innerHTML = "" + tday[nday] + ", " + tmonth[nmonth] + " " + ndate + ", " + nyear + " " + nhour + ":" + nmin + ":" + nsec + ap + "";
    setTimeout(getClock, 1000, serverTime + 1000);
}
