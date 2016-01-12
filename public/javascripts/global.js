/**
 * Created by yannick on 07/01/2016.
 */

var settings = {};

$(document).ready(function() {
    getServerTime();
    getSettings();
    $('#btnTurnLightOn').on('click', switchLight);
    $('#mondayhour').on('blur', setSettings);
    $('#mondaymin').on('blur', setSettings);
    $('#tuesdayhour').on('blur', setSettings);
    $('#tuesdaymin').on('blur', setSettings);
    $('#wednesdayhour').on('blur', setSettings);
    $('#wednesdaymin').on('blur', setSettings);
    $('#thursdayhour').on('blur', setSettings);
    $('#thursdaymin').on('blur', setSettings);
    $('#fridayhour').on('blur', setSettings);
    $('#fridaymin').on('blur', setSettings);
    $('#saturdayhour').on('blur', setSettings);
    $('#saturdaymin').on('blur', setSettings);
    $('#sundayhour').on('blur', setSettings);
    $('#sundaymin').on('blur', setSettings);
    //setInterval(getClock,1000);
});


function switchLight(event) {
    event.preventDefault();
    var settings = {
        'light': 1
    };

    $.ajax({
        type: 'POST',
        data: settings,
        url: '/settings/update',
        dataType: 'JSON'
    }).done(function( response ) {
        if (response.msg ==='') {
            console.log('message reçu');
        } else {
            console.log('NON!! Pas reçu!', response.msg);
        }
    });
}

function setSettings() {
    settings = {
        mondayhour: $('#mondayhour').val(),
        mondaymin:$('#mondaymin').val(),
        tuesdayhour:$('#tuesdayhour').val(),
        tuesdaymin:$('#tuesdaymin').val(),
        wednesdayhour:$('#wednesdayhour').val(),
        wednesdaymin:$('#wednesdaymin').val(),
        thursdayhour:$('#thursdayhour').val(),
        thursdaymin:$('#thursdaymin').val(),
        fridayhour:$('#fridayhour').val(),
        fridaymin:$('#fridaymin').val(),
        saturdayhour:$('#saturdayhour').val(),
        saturdaymin:$('#saturdaymin').val(),
        sundayhour:$('#sundayhour').val(),
        sundaymin:$('#sundaymin').val()
    };

    $.ajax({
        type: 'POST',
        data: settings,
        url: '/settings/setsettings',
        dataType: 'JSON'
    }).done(function( response ) {
        if (response.msg ==='') {
            console.log('settings reçu');
        } else {
            console.log('NON!! settings pas reçu!', response.msg);
        }
    });
}



function getServerTime(){
    $.getJSON('/settings/gettime', function(data) {
        console.log('time received: ', data);
        getClock(data.msg);
    })
}

function getSettings(){
    $.getJSON('/settings/getsettings', function(data) {
        console.log('settings received: ', data);
        settings = data;
        $('#mondayhour').val(settings.mondayhour);
        $('#mondaymin').val(settings.mondaymin);
        $('#tuesdayhour').val(settings.tuesdayhour);
        $('#tuesdaymin').val(settings.tuesdaymin);
        $('#wednesdayhour').val(settings.wednesdayhour);
        $('#wednesdaymin').val(settings.wednesdaymin);
        $('#thursdayhour').val(settings.thursdayhour);
        $('#thursdaymin').val(settings.thursdaymin);
        $('#fridayhour').val(settings.fridayhour);
        $('#fridaymin').val(settings.fridaymin);
        $('#saturdayhour').val(settings.saturdayhour);
        $('#saturdaymin').val(settings.saturdaymin);
        $('#sundayhour').val(settings.sundayhour);
        $('#sundaymin').val(settings.sundaymin);
    })
}



tday=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
tmonth=new Array("January","February","March","April","May","June","July","August","September","October","November","December");

function setClock() {
    var d=new Date();

}

function getClock(serverDate){
    var d=new Date(serverDate);
    var nday=d.getDay(),nmonth=d.getMonth(),ndate=d.getDate(),nyear=d.getYear();
    if(nyear<1000) nyear+=1900;
    var nhour=d.getHours(),nmin=d.getMinutes(),nsec=d.getSeconds(),ap;

    if(nhour==0){ap=" AM";nhour=12;}
    else if(nhour<12){ap=" AM";}
    else if(nhour==12){ap=" PM";}
    else if(nhour>12){ap=" PM";nhour-=12;}

    if(nmin<=9) nmin="0"+nmin;
    if(nsec<=9) nsec="0"+nsec;

    document.getElementById('clockbox').innerHTML=""+tday[nday]+", "+tmonth[nmonth]+" "+ndate+", "+nyear+" "+nhour+":"+nmin+":"+nsec+ap+"";
    setTimeout(getClock,1000,serverDate+1000);
}
