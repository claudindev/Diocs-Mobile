// BICYCLING or RUNNING

let calcRoute;

let testInputs;

function initMap() {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var saoPaulo = new google.maps.LatLng( -23.5503099, -46.6363896 );
    var mapOptions = {
        language: 'pt-BR',
        center: saoPaulo,
        zoom: 17,
        zoomControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        units: 'metric'
    }

    localStorage.clear();

    calcRoute = function(selectedMode) {
        var start = document.getElementById('start').value;
        var end = document.getElementById('end').value;

        var request = {
            origin: start,
            destination: end,
            travelMode: selectedMode,
            language: 'pt-BR'
        };
        directionsService.route(request, function(result, status) {

            if (status == 'OK') {
                directionsRenderer.setDirections(result);

                document.getElementsByClassName('busca-wrapper')[0].classList.add('busca-hidden');
                document.getElementsByClassName('resultados')[0].classList.remove('resultados-hidden');
                document.getElementsByClassName('grid-wrapper')[0].classList.add('grid-wrapper-maior');
                aumentarPonto();
            } else {
                alert('Não consegui identificar os endereços. Tente ser mais específico (ex. Rua Exemplo, 123, Cidade Exemplo)');
                return false;
            }
    
            let duracao = result.routes[0].legs[0].duration.text;
            
            let horasPos = duracao.indexOf("hour");
            let minPos = duracao.indexOf("min");
            let horas = duracao.slice(0, horasPos-1);
            let minutos;

            let distancia = parseFloat(result.routes[0].legs[0].distance.text.replace(' km', ''));
            
            let economia;

            if (localStorage.getItem('economia')) {
                economia = JSON.parse(localStorage.getItem('economia'));
            } else {
                economia = {
                    gco2: parseInt(distancia*200), 
                    money: parseInt(parseInt(distancia)*5)
                };
            }

            localStorage.setItem('economia', JSON.stringify(economia));

            document.getElementsByClassName('economia-gco2')[0].innerHTML = economia.gco2 +"gCO²";

            document.getElementsByClassName('economia-money')[0].innerHTML = 'R$'+ economia.money;

            if (horasPos != -1 && horasPos != 0 && horasPos != NaN) {
                minutos = duracao.slice(minPos-3, minPos-1);
                duracao = horas + "h e " + minutos + "min";
            } else {
                minutos = duracao.slice(0, minPos-1);
                duracao = minutos + "min";
            }

            let origin = result.routes[0].legs[0].start_address;
            let destination = result.routes[0].legs[0].end_address;

            origin = encodeURIComponent(origin);
            destination = encodeURIComponent(destination);
            
            if (selectedMode == 'WALKING') {
                document.getElementById('res-andando-texto').innerHTML = duracao;
                document.getElementById('res-bike-texto').innerHTML = '';

                document.getElementById('res-bike-texto').classList.add('res-hidden');
                document.getElementById('res-andando-texto').classList.remove('res-hidden');
                document.getElementById('bike-icon').classList.remove('res-icon-selected');
                document.getElementById('andando-icon').classList.add('res-icon-selected');

                let mapsURI = 'https://www.google.com/maps/dir/?api=1&origin='+ origin +'&destination='+ destination +'&travelmode=walking';

                document.getElementById('btn-rota').setAttribute('onclick', 'window.open("'+ mapsURI +'", "_blank")');

            } else {
                document.getElementById('res-bike-texto').innerHTML = duracao;
                document.getElementById('res-andando-texto').innerHTML = '';

                document.getElementById('res-bike-texto').classList.remove('res-hidden');
                document.getElementById('res-andando-texto').classList.add('res-hidden');
                document.getElementById('bike-icon').classList.add('res-icon-selected');
                document.getElementById('andando-icon').classList.remove('res-icon-selected');

                let mapsURI = 'https://www.google.com/maps/dir/?api=1&origin='+ origin +'&destination='+ destination +'&travelmode=bicycling';

                document.getElementById('btn-rota').setAttribute('onclick', 'window.open("'+ mapsURI +'", "_blank")');

            }
        });
    };
    
    testInputs = function() {
        var test1 = document.getElementById('start').value;
        var test2 = document.getElementById('end').value;
        if (test1 == '' || test2 == '') {
            alert('Por favor, preencha os dois campos.');
            return false;
        } else if (test1 == test2) {
            alert('Por favor, busque por endereços diferentes.');
            return false;
        } else {
            calcRoute('WALKING');
        }
    }

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    directionsRenderer.setMap(map);
}