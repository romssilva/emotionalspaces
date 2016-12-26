  var cities = [];
  
  $.getJSON("data.json", function(data) {


    for (var c = 0; c < data.cities.length; c++) {
      cities.push(data.cities[c]);

    }

  });

  function getLat(coordinates) {

    var lat = 0;
    var comma = 0;

    for (var i = 0; i < coordinates.length; i++) {
      if (coordinates[i] === ',') comma = i;
    }

    lat = parseFloat(coordinates.substring(0, comma).trim());

    return lat;

  }

  function getLng(coordinates) {

    var lng = 0;
    var comma = 0;

    for (var i = 0; i < coordinates.length; i++) {
      if (coordinates[i] === ',') comma = i;
    }

    lng = parseFloat(coordinates.substring(comma+1).trim());

    return lng;

  }

  function getValueA(values) {

    var val = 0;
    var comma = 0;

    for (var i = 0; i < values.length; i++) {
      if (values[i] === ',') comma = i;
    }

    val = parseFloat(values.substring(0, comma).trim());

    return val;

  }

  function getValueB(values) {

     var val = 0;
    var comma = 0;

    for (var i = 0; i < values.length; i++) {
      if (values[i] === ',') comma = i;
    }

    val = parseFloat(values.substring(comma+1).trim());

    return val;

  }

  function getLocationData(location) {

    var locationData;
    var lat = location.lat();
    var lng = Math.round(location.lng() * 1000000) / 1000000;
    for (var c = 0; c < cities.length; c++) {
      for (var l = 0; l < cities[c].locations.length; l++) {
        if (lat == getLat(cities[c].locations[l].coordinates) && lng == getLng(cities[c].locations[l].coordinates)) {
          return cities[c].locations[l];
        }
      }
    }

  }

  function getScale(value) {

    var oldMin;
    var oldMax;
    if (value < 11) {
      oldMin = 0;
      oldMax = 10;
    } else {
      oldMin = 300;
      oldMax = 1000;
    }
    
    var oldRange = (oldMax - oldMin);
    var newRange = (1 - 0.2);
    var scale = (((value - oldMin) * newRange) / oldRange) + 0.2;
    return scale;
  }

  function Sound(source,volume,loop)
{
    this.source=source;
    this.volume=volume;
    this.loop=loop;
    var son;
    this.son=son;
    this.finish=false;
    this.stop=function()
    {
        document.body.removeChild(this.son);
    }
    this.start=function()


    {
        if(this.finish)return false;
        this.son=document.createElement("audio");
        this.son.innerHTML = "<source src='"+this.source+"'>";
        this.son.setAttribute("hidden","true");
        this.son.setAttribute("volume",this.volume);
        this.son.setAttribute("autoplay","true");
        this.son.setAttribute("loop",this.loop);
        document.body.appendChild(this.son);
    }
    this.remove=function()
    {
        document.body.removeChild(this.son);
        this.finish=true;
    }
    this.init=function(volume,loop)
    {
        this.finish=false;
        this.volume=volume;
        this.loop=loop;
    }
}

function smoothZoom (map, max, cnt, center) {
    if (cnt > max) {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt - 1, center);
        });
        setTimeout(function(){map.setZoom(cnt)}, 150); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
    else if (cnt < max){
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1, center);
        });
        setTimeout(function(){map.setZoom(cnt)}, 150); // 80ms is what I found to work well on my system -- it might not work well on all systems
    } else if (cnt == max) map.panTo(center);
}  

 function initialize() {


    
   var width = $( window ).width()+ "px";
   var height = $( window ).height() + "px";

   window.onresize = function(event) {

      width = $(window).width() + "px";
      height = $(window).height() + "px";
      mapCanvas.style.height = height;
      mapCanvas.style.width = width;
   }

   var sound;

   var canadaCenter = new google.maps.LatLng(48.650665, -76.631733);
   var canadaZoom = 6;
   var torontoCenter = new google.maps.LatLng(43.656488, -79.397437);
   var torontoZoom = 16;
   var montrealCenter = new google.maps.LatLng(45.493438, -73.577839);;
   var montrealZoom = 18;


   

   var iconImage;

    var valueA = 0;
    var valueB = 0;
    var barValueA = 0;
    var barValueB = 0;
    var infoWindowContent = "";


    var mapCanvas = document.getElementById('map');
    mapCanvas.style.height = height;
    mapCanvas.style.width = width;

    var styles = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#4f595d"
            },
            {
                "visibility": "on"
            }
        ]
    }
];
    
    var mapOptions = {
      center: canadaCenter,
      zoom: canadaZoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);
    map.setOptions({styles: styles});


    var infowindow = new google.maps.InfoWindow();


    var myLatLng;
    var marker = [];
    var images =[];
    var currentImage = 0;
    var timer;
    var markerLevel;
    var scale;


    for (var c = 0; c < cities.length; c++) {
    for (var p = 0; p < cities[c].locations.length; p++) {

      myLatLng = {lat: getLat(cities[c].locations[p].coordinates), lng: getLng(cities[c].locations[p].coordinates)};
      markerLevel = (getValueA(cities[c].locations[p].values) + getValueB(cities[c].locations[p].values))/2

      scale = getScale(markerLevel);

      marker[p] = new google.maps.Marker({
      map: map,
      position: myLatLng,
      icon: {
        url: 'img/heart.png',
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25*scale, 50*scale),
        scaledSize: new google.maps.Size(50*scale, 43*scale)
      }
      });

      marker[p].addListener('mouseover', function() {

        var locationData = getLocationData(this.getPosition());
        valueA = getValueA(locationData.values);
        valueB = getValueB(locationData.values);
        if (valueA <= 10 && valueB <= 10) {
          barValueA = valueA*20;
          barValueB = valueB*20;
        } else {
          barValueA = valueA/5;
          barValueB = valueB/5;
        }

        images = ["img/locations/" + locationData.name + "a.jpg","img/locations/" + locationData.name + "b.jpg","img/locations/" + locationData.name + "c.jpg"];
        infoWindowContent = "<div><h1>Location #"+ locationData.name.substring(1) +"</h1><div style='display: inline-block; width: 114px; heigth: 114px; overflow: hidden;  vertical-align:top; margin-right: 15px'><img style='height: 114px' src='" + images[currentImage] + "'></div><div style='display: inline-block; vertical-align:top'><div style='height: 64px'><div style='display: inline-block; vertical-align:top'><img style=' height: 50px' src='img/matt.svg'></div><div style='display: inline-block; vertical-align:top; background-color: #328FF6; height: 50px; line-height:50px; padding-left: 15px; border-radius: 0 50px 50px 0; width: "+ barValueA +"px'>" + valueA + "</div></div><div style='height: 64px'><div style='display: inline-block; vertical-align:top'><img style='height: 50px' src='img/vivian.svg'></div><div style='display: inline-block; vertical-align:top; background-color: #F2FF58; height: 50px; line-height:50px; padding-left: 15px; border-radius: 0 50px 50px 0; width: "+ barValueB +"px'>" + valueB + "</div></div></div></div>";
        
        infowindow.setContent(infoWindowContent);
        infowindow.open(map, this);
        sound = new Sound(locationData.sound, 90, true);
        sound.start();

        timer = window.setInterval(function(){
          currentImage++;
          if (currentImage > 2) currentImage = 0;
          infoWindowContent = "<div><h1>Location #"+ locationData.name.substring(1) +"</h1><div style='display: inline-block; width: 114px; heigth: 114px; overflow: hidden; vertical-align:top; margin-right: 15px'><img style='height: 114px' src='" + images[currentImage] + "'></div><div style='display: inline-block; vertical-align:top'><div style='height: 64px'><div style='display: inline-block; vertical-align:top'><img style=' height: 50px' src='img/matt.svg'></div><div style='display: inline-block; vertical-align:top; background-color: #328FF6; height: 50px; line-height:50px; padding-left: 15px; border-radius: 0 50px 50px 0; width: "+ barValueA +"px'>" + valueA + "</div></div><div style='height: 64px'><div style='display: inline-block; vertical-align:top'><img style='height: 50px' src='img/vivian.svg'></div><div style='display: inline-block; vertical-align:top; background-color: #F2FF58; height: 50px; line-height:50px; padding-left: 15px; border-radius: 0 50px 50px 0; width: "+ barValueB +"px'>" + valueB + "</div></div></div></div>";
        infowindow.setContent(infoWindowContent);
        },10000);
        
      });
      marker[p].addListener('mouseout', function() {
        currentImage = 0;
        window.clearTimeout(timer);
        infowindow.close();
        sound.remove();
      });

    }}

    $( ".button" ).click(function() {
        
        var city = this.innerHTML;
        
        $("#main").toggleClass("min");
       $("#back").toggleClass("hidden");
        window.setTimeout(function() {
          $("#main").toggleClass("hidden");
          $("#back").toggleClass("min");
        },1000);

        if (city == "Toronto") {
          map.panTo(torontoCenter);
          smoothZoom(map, torontoZoom, map.getZoom(), torontoCenter);
        } else if (city == "Montreal") {
          map.panTo(montrealCenter);
          smoothZoom(map, montrealZoom, map.getZoom(), montrealCenter);
        }
    });

    $( ".back" ).click(function() {
        
        $("#main").removeClass("hidden");
        $("#back").toggleClass("min");
        window.setTimeout(function() {
        $("#back").toggleClass("hidden");
        $("#main").removeClass("min");
        },1000);
        
        smoothZoom(map, canadaZoom-1, map.getZoom(), canadaCenter);
    });

  }

  function initMap() {

  	google.maps.event.addDomListener(window, 'load', initialize);

  }