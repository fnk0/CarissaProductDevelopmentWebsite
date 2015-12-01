/**
 * Created by carissagabilheri on 11/4/15.
 */
var map;
function initMap() {

    var myLatLng = {lat: 36.1157, lng: -97.0586};

    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 5
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'Hello World!'

    });
}