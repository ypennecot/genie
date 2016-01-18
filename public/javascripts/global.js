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
        wakeAllowed: [
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
        wakeAllowedDuration: parseInt($('#wakeUpAllowedDuration').val() * 1000 * 60 ),
        wakeAllowedIntensity:$('#wakeUpAllowedIntensity').val(),
        nightLight: {
            duration: parseInt($('#nightLightDuration').val() * 1000 * 60 ),
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
        getClock(data.timeStamp + ( - timeoffset + data.timezoneOffset )*60 * 1000 );
    })
}

function getSettings() {
    $.getJSON('/settings/getsettings', function (data) {
        console.log('settings received: ', data);
        settings = JSON.parse(JSON.stringify(data));
        $('#sundayhour').val(settings.wakeAllowed[0].hour);
        $('#sundaymin').val(settings.wakeAllowed[0].min);
        $('#mondayhour').val(settings.wakeAllowed[1].hour);
        $('#mondaymin').val(settings.wakeAllowed[1].min);
        $('#tuesdayhour').val(settings.wakeAllowed[2].hour);
        $('#tuesdaymin').val(settings.wakeAllowed[2].min);
        $('#wednesdayhour').val(settings.wakeAllowed[3].hour);
        $('#wednesdaymin').val(settings.wakeAllowed[3].min);
        $('#thursdayhour').val(settings.wakeAllowed[4].hour);
        $('#thursdaymin').val(settings.wakeAllowed[4].min);
        $('#fridayhour').val(settings.wakeAllowed[5].hour);
        $('#fridaymin').val(settings.wakeAllowed[5].min);
        $('#saturdayhour').val(settings.wakeAllowed[6].hour);
        $('#saturdaymin').val(settings.wakeAllowed[6].min);
        $('#nightLightDuration').val(settings.nightLight.duration / 1000 / 60 );
        $('#nightLightIntensity').val(settings.nightLight.intensity);
        $('#wakeUpAllowedDuration').val(settings.wakeAllowedDuration / 1000 / 60 );
        $('#wakeUpAllowedIntensity').val(settings.wakeAllowedIntensity);

    })
}


function setClock() {
    var d = new Date();

}

function getClock(serverTime) {
    tday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
    tmonth = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    //console.log('serverDate', serverDate);
    //console.log(serverDate.timezoneOffset);
    var d = new Date(serverTime);
    var nday = d.getDay(), nmonth = d.getMonth(), ndate = d.getDate(), nyear = d.getYear();
    if (nyear < 1000) nyear += 1900;
    var nhour = d.getHours(), nmin = d.getMinutes(), nsec = d.getSeconds(), ap;
    console.log('hour received from server: '+ nhour);
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
