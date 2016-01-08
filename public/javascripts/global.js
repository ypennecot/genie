/**
 * Created by yannick on 07/01/2016.
 */
$('#btnTurnLightOn').on('click', switchLight);

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