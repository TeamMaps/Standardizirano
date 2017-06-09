var feed = document.getElementById("novo");                        // feed sa slikama desno gdje idu media objekti 
var vmtitle = document.getElementById("vmtitle");                  // view modal title 
var vmopis = document.getElementById("vmopis");                    // view modal opis
var karouselkuka = document.getElementById("karouselkuka");        // polje unutar modala
var karousel = document.getElementById("myCarousel");
var slike = [];
var icon = 1;
var currentIcon = document.getElementById("ikona1");
var title = document.getElementById("title");
var opis = document.getElementById("opis");
var privatnost = document.getElementsByName("privatnost");
var viewCarousel = document.getElementById("viewCarousel")
var viewKuka = document.getElementById("viewKuka");
var bodyKuka = document.getElementById("bodyKuka");
var viewPrva = document.getElementById("viewprva");
var viewDruga = document.getElementById("viewdruga");
var mediaPointeri = [];
var udaljenost = document.getElementById("udaljenost");
for(var i = 0; i < 20; i++){
    mediaPointeri[i] = [];
}
var aktivni = document.getElementById("aktivni");
var tornadoFooter = document.getElementById("tornadoFooter");
var localData = [];

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
          map.addListener('mouseover', function(e){
             padlng = e.latLng.lng();
             padlat = e.latLng.lat();
          })
}    

function iconSelector(that){
    currentIcon.className =''; 
    currentIcon = that; 
    that.className +=' active';
}

function modalSend(){
    for(var i=0;i<privatnost.length;i++){
        if(privatnost[i].checked){ checked = privatnost[i].value; break};
        checked=0;
    }
    var dataObjekt = {lat:lat,lng:lng, icon:icon, opis: opis.value, path: slike.toString(), title:title.value}
    localData.push(dataObjekt);
    teamMarkerMediaConstructor(dataObjekt);
    $('#myModal').modal("toggle");
    title.value = "";
    opis.value = "";
    slike = [];
    icon = 1;
    currentIcon.className = "";
    currentIcon = document.getElementById("ikona1");
    currentIcon.className = "active";
    aktiv = 0;
}
// reader objekt?
//function saljiSliku(){
//    if(document.getElementById("shit").value !== ""){ 
//    $('#imageForm').ajaxSubmit({url: '/images', type: 'post',  success : function (response) {
//           if(aktiv === 0){document.getElementById("prva").src= response ; karousel.style.display = "block";aktiv++;slike.push(response)}
//           else if(aktiv === 1){document.getElementById("druga").src = response; document.getElementById("druga").style.display="block"; aktiv++;slike.push(response)}
//           else{ 
//           var cdiv = document.createElement("div");
//           cdiv.className = "item";
//           slike.push(response);
//           var img = document.createElement("img");
//           img.src = response;
//           cdiv.appendChild(img);
//           karouselkuka.appendChild(cdiv);
//           }
//        }});
//    document.getElementById('shit').value="";
//    }
//}
//lokalno u ovaj konstruktor
function teamMarkerMediaConstructor(dataObject){
    var marker = new google.maps.Marker({
        position: { lat : dataObject.lat, lng : dataObject.lng },
        icon: "./images/icon"+dataObject.icon+".png",
        images: dataObject.path.split(","),
        map: map,
        title: dataObject.title,
        content: dataObject.opis,
        id: dataObject.marker_id || "lokalno",
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
        viewKuka.insertBefore(divic, aktivni);
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
        image.src= dataObject.photo || './images/no-avatar.jpg';
        image.className = "media-object mediaslika";
        image.height = "100";
        var mediabody = document.createElement("div");
        mediabody.className = "media-body";
        var mediaheading = document.createElement("h4");
        mediaheading.innerHTML = dataObject.username || "Username";
        mediaheading.className = "media-heading";
        mediaheading.style.borderBottom ="solid blue 1px";
        var textnode = document.createElement("p");
        textnode.innerHTML = dataObject.title;
        medialeft.appendChild(image);
        mediabody.appendChild(mediaheading);
        mediabody.appendChild(textnode);
        media.appendChild(medialeft);
        media.appendChild(mediabody);
        mediaPointeri[dataObject.icon-1].push(media)
        feed.insertBefore(media,feed.firstChild);
}

function iconMediaToggler(num,ikon){
    if(typeof mediaPointeri[num-1][0] != "undefined"){

    if(ikon.className == "active"){ikon.className= "";for(x in mediaPointeri[num-1]){mediaPointeri[num-1][x].style.display = "none"; mediaPointeri[num-1][x].googlemarker.setVisible(false)}}
        
    else {ikon.className = "active" ; for(x in mediaPointeri[num-1]){mediaPointeri[num-1][x].style.display = "block"; 
                                                                     mediaPointeri[num-1][x].googlemarker.setVisible(true)}}
        
    }
}
    
    

$('#viewModal').on('hidden.bs.modal', function () {
  if ( typeof bodyKuka.childNodes[0] == "object" && bodyKuka.childNodes[0].height == "300"){ bodyKuka.removeChild(bodyKuka.childNodes[0])};
  for (x in viewKuka.children){if(typeof x.id == undefined){console.log(x);delete x}};
  viewCarousel.style.display = "none";
  tornadoFooter.style.display = "none";
})

function tornado(){
    tornadoArray = [];
    var pad = new google.maps.LatLng (padlat,padlng);
    for(var i = 0; i < 20; i++){
    if(typeof mediaPointeri[i][0] != "undefined" && mediaPointeri[i][0].style.display == "none"){continue}; 
    for(x in mediaPointeri[i])
    tornadoArray.push({udaljenost:(google.maps.geometry.spherical.computeDistanceBetween(pad, mediaPointeri[i][x].googlemarker.getPosition())/1000).toFixed(2),
                  pointer:mediaPointeri[i][x]}
                );
    }
    tornadoArray.sort(function(a, b){return a.udaljenost-b.udaljenost});
    tornadopos = 0;
    tornadoFooter.style.display = "block";
    udaljenost.innerHTML = "Udaljenost:"+tornadoArray[0].udaljenost+"km";
    tornadoArray[0].pointer.googlemarker.markModal();
}
//dodat da tornado ignorira skrivene, uljepsat modale
function tornadoView(num){
    $('#viewModal').modal("hide");
    tornadoFooter.style.display = "block";
    tornadopos += num;
    console.log( tornadoArray[tornadopos]);
    if(tornadopos < 0){tornadopos = tornadoArray.length-1};
    udaljenost.innerHTML = "Udaljenost:"+tornadoArray[tornadopos].udaljenost+"km";
    tornadoArray[tornadopos].pointer.googlemarker.markModal(); 
}

function localStore(ime,item){
    localStorage.setItem(ime, JSON.stringify(item));
}

function localStoreRetrieve(ime){
    return JSON.parse(localStorage.getItem(ime));
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
