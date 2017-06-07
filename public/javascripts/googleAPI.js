if(localStorage.markers === undefined){ markers = []; }
else markers = JSON.parse(localStorage.getItem("markers"));
// pretrazuje local storage za oznaku markers i taj value parsa u ovaj var, akmo je nema stvara prazni globalni array markers

var title = document.getElementById("title");
var opis = document.getElementById("opis");
var privatnost = document.getElementsByName("privatnost");

function initMap() {
        var uluru = {lat: 45.3430556, lng: 14.4091667};
         map = new google.maps.Map(document.getElementById('map'), {
          zoom: 8,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          icon: "./images/icon1.png",
          map: map
        });
     //listener je property mape
        map.addListener('click', function(e) {
        lng = e.latLng.lng();
        lat = e.latLng.lat();
        $('#myModal').modal();
        });
}                                 // stvara globalnu varijablu mapa s centrom u Rijeci(default)                          

function placeMarker(latLng, map) {
  
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    content: "ayy"
  });
    marker.addListener("click", function(){
    var infowindow = new google.maps.InfoWindow();
    infowindow.setContent(this.content);
    infowindow.open(map, this);
  });
    markers.push(latLng)
} // funkcija vezana za event listener mape, poziva getContent pravi marker i pusha latLng i content u markers

function markerReviver(latLng, map){
    var marker = new google.maps.Marker({
        position:latLng,
        map:map,
        content: "ayy"
    });
    marker.addListener("click", function(){
        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent(this.content);
        infowindow.open(map,this);
    });
} // kad se ucita stranica stavlja markere iz local storagea na mapu

function ucitajPodatke(){
    
   for(var i = 0; i < markers.length ; i++){
        markerReviver(markers[i], map)
   }
//  
//    FB.getLoginStatus(function(response) {
//    if (response.status === 'connected') {
//    user = response.authResponse.userID
//    }
//    else {
//   FB.login();
//   }
//   });
} // body onload funkcija koja poziva markerReviver na svaki element markers arraya

function spremiPodatke(){
    localStorage.setItem("markers", JSON.stringify(markers));
} // button onclick triggered sprema trenutni markers u local storage

function posaljiForm(){
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       document.getElementById("demo").innerHTML = xhttp.responseText;
    }
    };
    xml.open("POST", "/markerform", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var lokacijaJSON = JSON.stringify(lokacija);
    xml.send("title="+title.value+"&opis="+opis.value+"&lokacija="+lokacijaJSON+"&user="+user);
}

function modalSend (){
    var paket = new XMLHttpRequest();
    paket.open("POST","/markers",true);
    paket.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    paket.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 402) {
       document.getElementById("error").innerHTML = paket.responseText;
       $('#errorModal').modal();
       }
    };
    for(var i=0;i<privatnost.length;i++){
        if(privatnost[i].checked){ checked = privatnost[i].value};
    }
    paket.send('title='+title.value+'&privatnost='+checked+'&lat='+lat+'&lng='+lng+'&opis='+opis.value+'&slike='+slike+"&icon="+icon);
     var marker = new google.maps.Marker({
              position: { lat : lat, lng : lng },
              icon: icon,
              map: map,
              content: opis.value
              });
              marker.addListener("mouseover", function(){
              infowindow = new google.maps.InfoWindow();
              infowindow.setContent(this.content);
              infowindow.open(map, this);
              });
              marker.addListener("mouseout", function(){
              infowindow.close();
              })
    $('#myModal').modal("toggle");
    title.value = "";
    opis.value = "";
    icon = "./images/icon1.png";
    currentIcon.className = "";
    currentIcon = document.getElementById("ikona1");
    currentIcon.className = "active";
    aktiv = 0;
}