var feed = document.getElementById("novo");
var profilna = document.getElementById("profilnaslika");
var vmtitle = document.getElementById("vmtitle");
var vmopis = document.getElementById("vmopis");
var karouselkuka = document.getElementById("karouselkuka");
var karousel = document.getElementById("myCarousel");
var slike = [];
var icon = "./images/icon1.png";
var currentIcon = document.getElementById("ikona1");

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
              console.log(this.responseText);
              var podatci = JSON.parse(this.responseText)
              for(x in podatci){
              var marker = new google.maps.Marker({
              position: { lat : podatci[x].lat, lng : podatci[x].lng },
              icon:podatci[x].icon,
              images: podatci[x].path.split(","),
              map: map,
              title: podatci[x].title,
              content: podatci[x].opis,
              id: podatci[x].marker_id
              });
              marker.addListener("mouseover", function(){
              infowindow = new google.maps.InfoWindow();
              infowindow.setContent(this.content);
              infowindow.open(map, this);
              });
              marker.addListener("mouseout", function(){
              infowindow.close();
              });
              marker.addListener("click",function(){
              // poptuni prikaz
                  vmtitle.innerHTML = this.title;
                  vmopis.innerHTML = this.content;
                  $('#viewModal').modal();
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
                  vmtitle.innerHTML = this.googlemarker.title;
                  vmopis.innerHTML = this.googlemarker.content;
                  $('#viewModal').modal();
              })
              var medialeft = document.createElement("div");
              medialeft.className = "media-left";
              medialeft.style.padding = "10px";
              var image = document.createElement("img");
              image.src= podatci[x].photo;
              image.className = "media-object mediaslika";
              image.height = "100";
              var mediabody = document.createElement("div");
              mediabody.className = "media-body";
              var mediaheading = document.createElement("h4");
              mediaheading.innerHTML = podatci[x].username;
              mediaheading.className = "media-heading";
              mediaheading.style.borderBottom ="solid blue 1px";
              var textnode = document.createElement("p");
              textnode.innerHTML = podatci[x].title;
              medialeft.appendChild(image);
              mediabody.appendChild(mediaheading);
              mediabody.appendChild(textnode);
              media.appendChild(medialeft);
              media.appendChild(mediabody);
              feed.appendChild(media);
              }
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
            var data = JSON.parse(this.responseText);
            document.getElementById("profil").innerHTML = "<span class='glyphicon glyphicon-user'></span>"+data.name;
        }
    }
    ajax.send();
}

var aktiv = 0;
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

