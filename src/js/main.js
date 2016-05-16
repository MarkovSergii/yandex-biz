/**
 * Created by Markoff on 12.05.2016.
 */

'use strict';

var result_mas = [];
var result_count = result_mas.length;

var CSV = function (array) {
    // Use first element to choose the keys and the order
    var keys = Object.keys(array[0]);

    // Build header
    var result = keys.join(";") + "\n";

    // Add the rows
    array.forEach(function(obj){
        keys.forEach(function(k, ix){
            if (ix) result += ";";
            result += obj[k];
        });
        result += "\n";
    });

    return result;
};

var check_for_dubles = function(incoming_mas)
{
    var new_mas =[];
    for (var i= 0 ; i<incoming_mas.length;i++)
    {

        for (var j=0;j<result_mas.length;j++)
        {
            var found = false;
            if (result_mas[j].id == incoming_mas[i].id)
            {
                found = true;
                break;
            }
        }
        if (!found)
        {
            new_mas.push(incoming_mas[i])
        }

    }

    return new_mas;
};


var structure_date = function(some)
{

    if (some)
    {
        var res = "";
        var res_tel = "";
        if (Array.isArray(some))
        {
            some.forEach(function(item, i, arr){
                if (item.formatted)
                {
                    res = res + item.formatted+',';
                }
                else
                {
                    if (item.href)
                    {
                        res = res + item.href+',';
                    }
                    else
                    {
                        res = res + item.name+',';
                    }
                }


            });
        }
        else
        {
            if (typeof some === 'object')
            {
                res = some.name;
            }
            else{
                res = some;
            }

        }
        return res;
    }
    else
    {
        return "";
    }


};

var getCorrectData = function(body)
{
    var mas =[];

    body.features.forEach(function(item){
        var one_company = {};

        one_company.id = item.properties.CompanyMetaData.id;
        one_company.name = item.properties.CompanyMetaData.name;
        one_company.address = item.properties.CompanyMetaData.address;
        one_company.url = structure_date(item.properties.CompanyMetaData.url);
        one_company.Categories = structure_date(item.properties.CompanyMetaData.Categories);
        one_company.Phones = structure_date(item.properties.CompanyMetaData.Phones);
        one_company.Links = structure_date(item.properties.CompanyMetaData.Links);
        one_company.postalCode = structure_date(item.properties.CompanyMetaData.postalCode);
        one_company.email = structure_date(item.properties.CompanyMetaData.email);
        one_company.emails = structure_date(item.properties.CompanyMetaData.emails);


        mas.push(one_company);


    });



    return mas
};


var ckeck_cookie_api = function()
{
   return api =  $.cookie('api_key');

};


$(document).ready(function(){

alert('heelo');
   (function(){
       // проверить наличие ключа в куки
       // если есть то поставить его
        if (ckeck_cookie_api())
        {
            $('#api_key').val(ckeck_cookie_api());
        }
        $('#obl').mask('0.00');
        $('#obl').val(zone);
    })();

    $('#btn_get_data').click(function(){


        var lat = $("#lat").text();
        var long =  $("#long").text();
        var obl = $('#obl').val();
        var input_text = $('#search_text').val();
        var API_KEY = $('#api_key').val();
        if (input_text!='' && API_KEY!='')
        {

                // проверить галочку про сохранение ключа
                // проверить наличие ключа
                // если нет то записать
                if ($('#save_api').prop('checked'))
                {
                    var saved_api = ckeck_cookie_api();
                    if (saved_api)
                    {
                        if (saved_api != API_KEY)
                        {
                            $.cookie('api_key',API_KEY);
                        }
                    }
                    else
                    {
                        $.cookie('api_key',API_KEY);
                    }
                }





                $.get('https://search-maps.yandex.ru/v1/?text=' + encodeURIComponent(input_text) + '&ll=' + long + ',' + lat + '&spn=' + obl + ',' + obl + '&type=biz&results=500&rspn=1&lang=ru_RU&apikey=' + API_KEY, function (data) {

                        if (data.status)
                        {
                           if (data.status=="error")
                           {
                               swal("Error!", "Ошибка или лимит", "error");
                           }
                        }
                        else
                        {
                            var some_data = getCorrectData(data);

                            result_mas = result_mas.concat(check_for_dubles(some_data));
                            result_count = result_mas.length;
                            swal("Успех", "Найдено " + some_data.length + " компаний");
                            $('#result_count').text(result_count);
                        }


                     })
                    .fail(function () {
                        swal("Error!", "Ошибка", "error");
                    });



        }
        else
        {
            swal("Error!", "Нужно ввести поисковую фразу и API ключ", "error")
        }

    });

    $('#set_obl_btn').click(function(){

        zone = $('#obl').val();
        deltaX = Number(zone);
        deltaY = Number(zone);
        savecoordinats();
    });

    $('#save_all').click(function(){

  if (_.isEmpty(result_mas))
  {
      swal("Внимание!", "Масив с данными пустой", "warning");
  }
  else {
          swal({
              title: "Сохранение!",
              text: "Введите имя файла для сохранения:",
              type: "input",
              showCancelButton: true,
              closeOnConfirm: false,
              animation: "slide-from-top",
              inputPlaceholder: "Имя файла"
          }, function (inputValue) {
              if (inputValue === false) return false;
              if (inputValue === "") {
                  swal.showInputError("Необходимо ввести имя!");
                  return false
              }
              var blob = new Blob([CSV(result_mas)], {type: "text/plain;charset=utf-8"});
              saveAs(blob, inputValue + ".csv");
              swal("Отлично!", "Успешно сохранено", "success");

          });
      }



    });

    $('#show_all').click(function(){


        if (_.isEmpty(result_mas))
        {
            swal("Внимание!", "Масив с данными пустой", "warning");
        }
        else{
            var nw = window.open('newpage.html', '_blank');

            $.get('table.html',function(data){
                var compiled = _.template(data);
                nw.document.write(compiled({company:result_mas}));
                nw.document.close();
            });
        }


    });

    $('#delete_all').click(function(){
        swal({
            title: "Вы уверены?",
            text: "Все данные будут удалены",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Да, удалить!",
            cancelButtonText: "Отмена",
            closeOnConfirm: false
        }, function () {

            result_mas = [];
            result_count = result_mas.length;
            $('#result_count').text(result_count);
            swal({
                title:"Удалено!",
                text:"Можете приступать к новой добыче :).",
                type:"success",
                timer: 1000
            });
        });
    });

});