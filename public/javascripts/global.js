/**
 * Created by yannick on 07/01/2016.
 */

var settings = {};

$(document).ready(function () {
    getServerTime();
    getSettings();
    $('#btnTurnLightOn').on('click', switchLight);
    $('#updateSettings').on('click', setSettings);
    //$('#mondayhour').on('blur', setSettings);
    //$('#mondaymin').on('blur', setSettings);
    //$('#tuesdayhour').on('blur', setSettings);
    //$('#tuesdaymin').on('blur', setSettings);
    //$('#wednesdayhour').on('blur', setSettings);
    //$('#wednesdaymin').on('blur', setSettings);
    //$('#thursdayhour').on('blur', setSettings);
    //$('#thursdaymin').on('blur', setSettings);
    //$('#fridayhour').on('blur', setSettings);
    //$('#fridaymin').on('blur', setSettings);
    //$('#saturdayhour').on('blur', setSettings);
    //$('#saturdaymin').on('blur', setSettings);
    //$('#sundayhour').on('blur', setSettings);
    //$('#sundaymin').on('blur', setSettings);
});


function switchLight(event) {
    event.preventDefault();
    var temp = {
        'light': 1
    };

    $.ajax({
        type: 'POST',
        data: temp,
        url: '/settings/switchon',
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
                hour: $('#sundayhour').val(),
                min: $('#sundaymin').val()
            },
            {
                hour: $('#mondayhour').val(),
                min: $('#mondaymin').val()
            },
            {
                hour: $('#tuesdayhour').val(),
                min: $('#tuesdaymin').val()
            },
            {
                hour: $('#wednesdayhour').val(),
                min: $('#wednesdaymin').val()
            },
            {
                hour: $('#thursdayhour').val(),
                min: $('#thursdaymin').val()
            },
            {
                hour: $('#fridayhour').val(),
                min: $('#fridaymin').val()
            },
            {
                hour: $('#saturdayhour').val(),
                min: $('#saturdaymin').val()
            }]
    };


    $.ajax({
        type: 'POST',
        data: JSON.stringify(settings),
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
        getClock(data.msg);
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
    })
}


tday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
tmonth = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

function setClock() {
    var d = new Date();

}

function getClock(serverDate) {
    var d = new Date(serverDate);
    var nday = d.getDay(), nmonth = d.getMonth(), ndate = d.getDate(), nyear = d.getYear();
    if (nyear < 1000) nyear += 1900;
    var nhour = d.getHours(), nmin = d.getMinutes(), nsec = d.getSeconds(), ap;

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
    setTimeout(getClock, 1000, serverDate + 1000);
}
