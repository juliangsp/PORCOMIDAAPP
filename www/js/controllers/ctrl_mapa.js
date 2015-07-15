/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var distanceOnmap=[];
var selecrank=0;

var ctrl_mapa = {
	data : {},
	pageDiv : "#mapa",
	init : function(data,template){
		ctrl_mapa.data = data;
		ctrl_mapa.render();
	},
	render : function(){

		var data  = {
		}

		var mainObj = template.render('#mapaT',ctrl_mapa.pageDiv,data)
		$(ctrl_mapa.pageDiv).trigger("create");

	ms.init();
	mMapa.autoLocate();
	mMapa.getMapCookies();
	
	// Add Location Pin
	var data = [{loc : {lat: 20.523406, lng: -100.8074293}, COLOR:"8B1D1B", LOGOTIPO:"",BUSSINESS:{ CATEGORY:1, NAME:"Autotips"}}]
	mMapa.addPins(data)
	
	// Add Route
	var params = { start : { lat: mMapa.oVars.lat, lng : mMapa.oVars.lng }, end : {lat: 20.523406, lng: -100.8074293 }}
	mMapa.traceRoute(params.start,params.end)

	
	}
}




// leaflef Mapa ----------------------------------------------------
var ms = {
	oVars : {
		categories : {},
		selCat : "",
	},
	restRes : {},
	init : function(){
		mMapa.init(); 
		// Init Geo Google Coder
		gGeo.init();
	
	},
	filtrosDefault: function(){
		var filtros = {
            'latitude': mMapa.oVars.lat,
            'longitude': mMapa.oVars.lng,
            'chkDistance': .06,
           // 'chkPrice': 1,
            'txtSearch': "",
            'sortDistance': 1,
            'sortOrder': "_id",
        };
        return filtros;
	},
	searchNearBy : function(){
		var filtros = ms.setFiltro();
        url= '/usuarios/searchnearby';
        $.ajax({
            type: 'POST',
            data: filtros,
            url: url,
            dataType: 'JSON'
            }).done(function( data ) {
            	ms.restRes = data;
            	mMapa.addPins(data);
            	mList.setList(data);
        });	
	}
}

var mMapa = {
	oVars : {
		defaultLat: 20.6596,
		defaultLng: -103.3496,
		lat :"", 
		lng :"",
		zoom : 12,
		defaultPin : "D76627"
	},
	map  : {},
	userLocation : {},
	marker : [],
	userIcon : L.icon({
            iconUrl		: './img/marcador_usuario.png',
            shadowUrl	: './img/sombra_marcadores.png',
            iconSize	: [53, 42], // size of the icon
            shadowSize	: [51, 43], // size of the shadow
            iconAnchor	: [16, 43], // point of the icon which will correspond to marker's location
            shadowAnchor: [8, 42],  // the same for the shadow
            popupAnchor	: [0, -42] // point from which the popup should open relative to the iconAnchor
    }),	
	init : function(){
		mMapa.getMapCookies();
		mMapa.setMap();
	},
	getMapCookies : function(){
	    mMapa.oVars.lat	 			= utils.getCookie('lat',mMapa.oVars.defaultLat);
	    mMapa.oVars.lng 			= utils.getCookie('lng',mMapa.oVars.defaultLng);
	},
	setMapCookies : function(lat,lng){
		console.log("setting map cookies")
		var d = new Date();
   		d.setTime(d.getTime() + (1*24*60*60*1000));
    	document.cookie="lat="+ lat +";expires="+d.toUTCString();
    	document.cookie="lng="+ lng +";expires="+d.toUTCString();
    	mMapa.oVars.lat = lat;
        mMapa.oVars.lng = lng;
	},
	setMap: function(){
		mMapa.map = L.map ('ubica', {
	        center: [mMapa.oVars.lat,mMapa.oVars.lng ],
	        zoom: mMapa.oVars.zoom
	    });
	  
		// User Icon
		mMapa.userLocation = L.marker([mMapa.oVars.lat,mMapa.oVars.lng], {icon: mMapa.userIcon, draggable:true}).addTo(mMapa.map).bindPopup('tu ubicación').openPopup();

		  mMapa.map.fitBounds([
		 	[20.523406,-100.8074293],
		 	[mMapa.oVars.lat,mMapa.oVars.lng]
	 	],{padding: [50,50]});	
   		//mMapa.userLocation.on('dragend', mMapa.onLocationChange);
        mMapa.map.on('locationfound', mMapa.onLocationFound);
    	mMapa.map.on('locationerror', mMapa.onLocationError);
	 	var tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    	//var tiles = L.tileLayer("http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", { subdomains: "1234" })


    	mMapa.map.addLayer(tiles);

    	

    	//mMapa.map.invalidateSize();

	},
	setLocation : function(lat,lng){
		mMapa.map.setView(new L.LatLng(lat, lng),mMapa.oVars.zoom);
		mMapa.userLocation.setLatLng([lat,lng]).update();
		mMapa.setMapCookies(lat,lng);
	},
	onLocationFound : function(position){
		console.log("location found")
		var pos = position.latlng;
		mMapa.setLocation(pos.lat,pos.lng)
		gGeo.codeLatLng(pos.lat,pos.lng);
	},
	onLocationError : function(){
		console.log("drag location not found");
	},
	onLocationChange : function(event){
		var marker = event.target;  
        var result = marker.getLatLng();  
        gGeo.codeLatLng(result.lat, result.lng);
        mMapa.setMapCookies(result.lat, result.lng);
        mMapa.userLocation.openPopup();
	},
	autoLocate : function(){
		mMapa.map.locate({
       		enableHightAccuracy: true
      	});
	},
	fitBounds: function(){
		var bounds = new L.LatLngBounds(mMapa.marker);
		mMapa.map.fitBounds(bounds);
	},
	clearPins : function(){
		 for(i=0;i<mMapa.marker.length;i++) {
		    mMapa.map.removeLayer(mMapa.marker[i]); };
		    mMapa.marker = [];
	},
	addPins : function(data){
	//	mMapa.clearPins();
		for (var r = 0; r < data.length; r++) {
			var logoURL = data[r].BUSSINESS.LOGOTIPO;
			// COLOR			
			console.log(data[r].COLOR,"color")

			var restIcon = L.icon({
            iconUrl: './img/'+ data[r].COLOR +'.png',
            shadowUrl: './img/sombra_marcadores.png',
            iconSize:     [53, 42], // size of the icon
            shadowSize:   [51, 43], // size of the shadow
            iconAnchor:   [14, 43], // point of the icon which will correspond to marker's location
            shadowAnchor: [8, 42],  // the same for the shadow
            popupAnchor:  [0, -42] // point from which the popup should open relative to the iconAnchor
        	});
			
			//var pin  = 
			var  LamMarker = L.marker([data[r].loc.lat, data[r].loc.lng ], {icon: restIcon}).addTo(mMapa.map).bindPopup();
        	mMapa.marker.push(LamMarker);
		}
	},
	traceRoute : function(start,end){

		

		var _start 	= new google.maps.LatLng(start.lat, start.lng);
		var _end 	= new google.maps.LatLng(end.lat, end.lng);

		  var request = {
		    origin: _start,
		    destination: _end,
		    travelMode: google.maps.TravelMode.DRIVING
		  };



		directionsService = new google.maps.DirectionsService();
    	directionsDisplay = new google.maps.DirectionsRenderer();
    	directionsDisplay.setPanel(document.getElementById('directions-panel'));

    	var steps;
    	var pointList = [];
		 directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		      directionsDisplay.setDirections(response);
		      var distance=response.routes[0].legs[0].distance.text;
		      console.log(distance)
		      distanceOnmap.push(distance);
		     // console.log(response.routes[0].legs[0].duration.text);
		     // console.log(response.routes[0].legs[0].distance.text);
		     // console.log(response.routes[0].legs[0].steps);

		       directionResult = response;
               var myRoute = directionResult.routes[0].legs[0];

                for (var i = 0; i < myRoute.steps.length; i++) {
                var pathis = myRoute.steps[i].path;
	                for (var j = 0; j < pathis.length; j++) {
	                    var pointA = new L.LatLng(pathis[j].A, pathis[j].F); 
	                    pointList.push(pointA);
	                };
           		};
           		if (selecrank==0) {
                selecrank = {'NOMBRE' : 'default','COLOR' : '1B75BB'};
	            };
	            firstpolyline = new L.Polyline(pointList, {
	                    color: '#'+selecrank.COLOR,
	                    weight: 3,
	                    opacity: 0.9,
	                    smoothFactor: 1
	                }).addTo(mMapa.map);
		    };
		  });
			}

}
// Google Geo Code Controller -------------------------------------
var gGeo = {
	oVars : {	
		direccion : "",
		dirParts : {},
		startGeo : {},
		finalGeo : {},
		geoTimer : {},
		inputBox : {}	 
	},
	directionsService  : {},
	directionsDisplay  : {},
	init: function(){
		gGeo.oVars.inputBox = $('#pac-input');
		var input = (document.getElementById('pac-input'));
		var searchBox =  new google.maps.places.SearchBox(input)

		gGeo.directionsService = new google.maps.DirectionsService();
    	gGeo.directionsDisplay = new google.maps.DirectionsRenderer();
		gGeo.directionsDisplay.setPanel(document.getElementById('directions-panel'));

		gGeo.getGeoCookies();
		if(gGeo.oVars.direccion!="") { gGeo.oVars.inputBox.val(gGeo.oVars.direccion) }

		$('#btnFindEnter').on('click', gGeo.triggerSearch);

	    gGeo.oVars.inputBox.keypress(function (e) {
	         var key = e.which;
	         if(key == 13)  {
	            gGeo.triggerSearch();
	            return false;  
	          }
	     });

	    google.maps.event.addListener(searchBox, 'places_changed', function () {
            var places = searchBox.getPlaces();
                if (places.length == 0) {
                    return;
                }
                gGeo.codeLatLng(places[0].geometry.location.k,places[0].geometry.location.D);
                mMapa.setLocation(places[0].geometry.location.k,places[0].geometry.location.D)
                var address = '';
                if (places[0].address_components) {
                    address = [
                        (places[0].address_components[0] && places[0].address_components[0].short_name || ''),
                        (places[0].address_components[1] && places[0].address_components[1].short_name || ''),
                        (places[0].address_components[2] && places[0].address_components[2].short_name || '')
                    ].join(' ');
                }
        });
	},
	getGeoCookies : function(){
	    gGeo.oVars.direccion = utils.getCookie('direccion');
	},
	setGeoCookies : function(direccion){
		var d = new Date();
   		d.setTime(d.getTime() + (1*24*60*60*1000));
    	document.cookie="direccion="+ direccion +";expires="+d.toUTCString();
    	gGeo.oVars.direccion = direccion;
	},
	codeLatLng : function(lat,lng){
        gGeo.oVars.startGeo = new Date().getTime();
        var timeOn = (Math.abs(gGeo.oVars.finalGeo - gGeo.oVars.startGeo))
        if(!timeOn || timeOn>2000){
            gGeo.initLatLng(lat, lng);    
        } else {
            mMapa.userLocation.bindPopup('<div id="loaderGeo"><img src="../images/gif-load.gif" style="text-align:center;width:20px;height:20px;"></div>').openPopup();
            clearTimeout(gGeo.oVars.geoTimer);
            gGeo.oVars.geoTimer=setTimeout(function(){ gGeo.initLatLng(lat, lng)},2000);
        }
    },
    initLatLng : function(lat, lng) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                var parts = results[0].address_components
                   gGeo.oVars.dirParts = {
                   		numero 	: parts[0].long_name,
                   		calle	: parts[1].long_name,
                   		colonia : parts[2].long_name,
                   		ciudad  : parts[3].long_name,
                   		estado 	: parts[4].long_name,
                   		pais 	: parts[5].long_name,
                   		cp 		: parts[6].long_name,
                   }
                 
                   gGeo.setGeoCookies(results[0].formatted_address);
                   gGeo.oVars.inputBox.val(results[0].formatted_address);
                   gGeo.oVars.finalGeo = new Date().getTime();
                 // if(profileImage){
                //  mMapa.userLocation.bindPopup('<img id="fotito2" class=\"fb-photo img-polaroid\" src=\"https://' + profileImage  + '\">').openPopup();
                 //   }
                } else {
                   console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    },
    triggerSearch : function(){
        var input =(document.getElementById('pac-input'));
        google.maps.event.trigger( input, 'focus')
        google.maps.event.trigger( input, 'keydown', {keyCode:13})
    }


}