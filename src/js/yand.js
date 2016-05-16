/**
 * Created by Markoff on 13.05.2016.
 */
'use strict';

var myMap,  MarkCoords;
var myPlacemark,myPlacemark_buttom_left,myPlacemark_buttom_right,myPlacemark_top_left,myPlacemark_top_right;
MarkCoords = [startX, startY];

function savecoordinats (){
    var new_coords = [MarkCoords[0].toFixed(4), MarkCoords[1].toFixed(4)];

    var new_coords_buttom_left =  [(MarkCoords[0]-deltaX).toFixed(4), (MarkCoords[1]-deltaY).toFixed(4)];
    var new_coords_buttom_right = [(MarkCoords[0]-deltaX).toFixed(4), (MarkCoords[1]+deltaY).toFixed(4)];
    var new_coords_top_left =     [(MarkCoords[0]+deltaX).toFixed(4), (MarkCoords[1]-deltaY).toFixed(4)];
    var new_coords_top_right =    [(MarkCoords[0]+deltaX).toFixed(4), (MarkCoords[1]+deltaY).toFixed(4)];


    myPlacemark.getOverlay().getData().geometry.setCoordinates(new_coords);
    myPlacemark_buttom_left.getOverlay().getData().geometry.setCoordinates(new_coords_buttom_left);
    myPlacemark_buttom_right.getOverlay().getData().geometry.setCoordinates(new_coords_buttom_right);
    myPlacemark_top_left.getOverlay().getData().geometry.setCoordinates(new_coords_top_left);
    myPlacemark_top_right.getOverlay().getData().geometry.setCoordinates(new_coords_top_right);



    $("#lat").text(new_coords[0]);
    $("#long").text(new_coords[1]);

}


$(document).ready(function(){




    ymaps.ready(init);

    function init () {

        //Определяем начальные параметры карты
        myMap = new ymaps.Map('YMapsID', {
            center: [startX, startY],
            zoom: 11
        });

        //Добавляем элементы управления на карту
        myMap.controls
            .add('zoomControl');




        //Определяем метку и добавляем ее на карту
        myPlacemark = new ymaps.Placemark([startX, startY],{}, {preset: "twirl#redIcon", draggable: true});
        myPlacemark_buttom_left = new ymaps.Placemark([startX-deltaX, startX-deltaY],{}, {preset: "twirl#blueIcon", draggable: false});
        myPlacemark_buttom_right = new ymaps.Placemark([startX-deltaX, startY+deltaY],{}, {preset: "twirl#blueIcon", draggable: false});
        myPlacemark_top_left = new ymaps.Placemark([startX+deltaX, startX-deltaY],{}, {preset: "twirl#blueIcon", draggable: false});
        myPlacemark_top_right = new ymaps.Placemark([startX+deltaX, startY+deltaY],{}, {preset: "twirl#blueIcon", draggable: false});


        myMap.geoObjects.add(myPlacemark);
        myMap.geoObjects.add(myPlacemark_buttom_left);
        myMap.geoObjects.add(myPlacemark_buttom_right);
        myMap.geoObjects.add(myPlacemark_top_left);
        myMap.geoObjects.add(myPlacemark_top_right);


        savecoordinats();


        //Отслеживаем событие перемещения метки
        myPlacemark.events.add("dragend", function (e) {
            MarkCoords = this.geometry.getCoordinates();
            savecoordinats();
        }, myPlacemark);

        //Отслеживаем событие щелчка по карте
        myMap.events.add('click', function (e) {
            MarkCoords = e.get('coordPosition');
            savecoordinats();
        });


        //Ослеживаем событие изменения области просмотра карты - масштаб и центр карты
        myMap.events.add('boundschange', function (event) {
            if (event.get('newZoom') != event.get('oldZoom')) {
                savecoordinats();
            }
            if (event.get('newCenter') != event.get('oldCenter')) {
                savecoordinats();
            }

        });

    }

    //Функция для передачи полученных значений в форму



});