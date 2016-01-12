/**
 * Created by yannick on 07/01/2016.
 */



$(document).ready(function() {
    getServerTime();
    $('#btnTurnLightOn').on('click', switchLight);
    $('#mondayhour').on('input', setSettings());
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

function setSettings(settings) {
    var oldsettings = {
        mondayhour: 8,
        mondaymin:0,
        tuesdayhour:7,
        tuesdaymin:0,
        wednesdayhour:7,
        wednesdaymin:7,
        thursdayhour:7,
        thursdaymin:0,
        fridayhour:7,
        fridaymin:0,
        saturdayhour:8,
        saturdaymin:0,
        sundayhour:8,
        sundaymin:0
    };

    $.ajax({
        type: 'POST',
        data: oldsettings,
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
