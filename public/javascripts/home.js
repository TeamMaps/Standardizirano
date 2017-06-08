var feed = document.getElementById("novo");                        // feed sa slikama desno gdje idu media objekti 
var vmtitle = document.getElementById("vmtitle");                  // view modal title 
var vmopis = document.getElementById("vmopis");                    // view modal opis
var karouselkuka = document.getElementById("karouselkuka");        // polje unutar modala
var karousel = document.getElementById("myCarousel");
var slike = [];
var icon = "./images/icon1.png";
var currentIcon = document.getElementById("ikona1");
var title = document.getElementById("title");
var opis = document.getElementById("opis");
var privatnost = document.getElementsByName("privatnost");
var viewCarousel = document.getElementById("viewCarousel")
var viewKuka = document.getElementById("viewKuka");
var bodyKuka = document.getElementById("bodyKuka");
var viewPrva = document.getElementById("viewprva");
var viewDruga = document.getElementById("viewdruga");

var aktiv = 0;

function initMap() {
        var uluru = {lat: 45.3430556, lng: 14.4091667};
         map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          streetViewControl: false,
          zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
          },
          zoom: 8,
          center: uluru
        });
        map.addListener('click', function(e) {
        lng = e.latLng.lng();
        lat = e.latLng.lat();
        $('#myModal').modal();
        });
}    

function iconSelector(that){
    currentIcon.className =''; 
    currentIcon = that; 
    that.className +=' active';
}

function dobaviMarkere(){
    var ajax = new XMLHttpRequest();
    ajax.open("GET","/markers", true);
    ajax.onreadystatechange = function (){
        if(ajax.readyState == XMLHttpRequest.DONE && ajax.status == 200){
              var podatci = JSON.parse(this.responseText)
              for(x in podatci){teamMarkerMediaConstructor(podatci[x])}
          }
    }
    ajax.send();
}

function obrisiMarker(marker){
    marker.setVisible(false);
    var brisac = new XMLHttpRequest();
    brisac.open("DELETE","/markers"+marker.id, true);
    brisac.send();
}

function dohvatiUsera(){
    var ajax = new XMLHttpRequest();
    ajax.open("GET","/users",true);
    ajax.onreadystatechange = function (){
        if(ajax.readyState == XMLHttpRequest.DONE && ajax.status == 200){
            console.log(this.responseText)
            var data = JSON.parse(this.responseText);
            document.getElementById("profile").innerHTML = data.name;
            document.getElementById("profilna").src = data.picture;
        }
    }
    ajax.send();
}

function modalSend(){
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

function saljiSliku(){
    if(document.getElementById("shit").value !== ""){ 
    $('#imageForm').ajaxSubmit({url: '/images', type: 'post',  success : function (response) {
           if(aktiv === 0){document.getElementById("prva").src= response ; karousel.style.display = "block";aktiv++;slike.push(response)}
           else if(aktiv === 1){document.getElementById("druga").src = response; document.getElementById("druga").style.display="block"; aktiv++;slike.push(response)}
           else{ 
           var cdiv = document.createElement("div");
           cdiv.className = "item";
           slike.push(response);
           var img = document.createElement("img");
           img.src = response;
           cdiv.appendChild(img);
           karouselkuka.appendChild(cdiv);
           }
        }});
    document.getElementById('shit').value="";
    }
}

function teamMarkerMediaConstructor(dataObject){
    var marker = new google.maps.Marker({
        position: { lat : dataObject.lat, lng : dataObject.lng },
        icon: dataObject.icon,
        images: dataObject.path.split(","),
        map: map,
        title: dataObject.title,
        content: dataObject.opis,
        id: dataObject.marker_id,
        markModal: function(){
        vmtitle.innerHTML = this.title;
        vmopis.innerHTML = this.content;
        if(this.images.length == 1){
        var img = document.createElement("img");
        img.src = this.images[0];
        img.style.display = "block";
        img.style.margin = "auto";
        img.height = "300";
        bodyKuka.appendChild(img);
        }
        if(this.images.length > 1){
        var x = this.images.length - 2;
        viewPrva.src = this.images[0];
        viewDruga.src = this.images[1];
        for(var i = 0; i < x; i++){
        var divic = document.createElement("div");
        divic.className = "item";
        var img = document.createElement("img");
        img.src = this.images[2+i];
        divic.appendChild(img);
        viewKuka.appendChild(divic);
        }
        viewCarousel.style.display = "block";
        }
        $('#viewModal').modal();
        }});
        marker.addListener("mouseover", function(){
        infowindow = new google.maps.InfoWindow();
        infowindow.setContent(this.content);
        infowindow.open(map, this);
        });
        marker.addListener("mouseout", function(){
        infowindow.close();
        });
        marker.addListener("click",function(){
        this.markModal();
        })
              
        var media = document.createElement("li");
        media.className = "media";
        media.style.borderBottom = "1px solid black";
        media.style.backgroundColor = "white";
        media.googlemarker = marker;
        media.addEventListener("mouseover", function(){
            infowindow = new google.maps.InfoWindow();
            infowindow.setContent(this.googlemarker.content);
            infowindow.open(map, this.googlemarker);
            map.panTo(this.googlemarker.position);
        })
        media.addEventListener("mouseout", function(){
            infowindow.close();
        })
        media.addEventListener("click", function(){
            this.googlemarker.markModal();
        })
        var medialeft = document.createElement("div");
        medialeft.className = "media-left";
        medialeft.style.padding = "10px";
        var image = document.createElement("img");
        image.src= dataObject.photo;
        image.className = "media-object mediaslika";
        image.height = "100";
        var mediabody = document.createElement("div");
        mediabody.className = "media-body";
        var mediaheading = document.createElement("h4");
        mediaheading.innerHTML = dataObject.username;
        mediaheading.className = "media-heading";
        mediaheading.style.borderBottom ="solid blue 1px";
        var textnode = document.createElement("p");
        textnode.innerHTML = dataObject.opis;
        medialeft.appendChild(image);
        mediabody.appendChild(mediaheading);
        mediabody.appendChild(textnode);
        media.appendChild(medialeft);
        media.appendChild(mediabody);
        feed.appendChild(media);
}

$('#viewModal').on('hidden.bs.modal', function () {
  if ( typeof bodyKuka.childNodes[0] == "object"){ bodyKuka.removeChild(bodyKuka.childNodes[0])};
  while (viewKuka.lastChild.className != "right carousel-control"){ viewKuka.removeChild(viewKuka.lastChild)};
  viewCarousel.style.display = "none";
})
// probs ne trea
// window.fbAsyncInit = function() {
//    FB.init({
//      appId      : '224816561339578',
//      xfbml      : true,
//      version    : 'v2.9'
//    });
//    FB.AppEvents.logPageView();
//   };
//
//   (function(d, s, id){
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) {return;}
//     js = d.createElement(s); js.id = id;
//     js.src = "//connect.facebook.net/en_US/sdk.js";
//     fjs.parentNode.insertBefore(js, fjs);
//   }(document, 'script', 'facebook-jssdk'));
