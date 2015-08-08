/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_home = {
	data : {},
	pageDiv : "#mainScreen",
	map  : {},
	init : function(data,template){
		ctrl_home.data = data;
		ctrl_home.render();
	},
	render : function(){

		$(ctrl_home.pageDiv).empty();
		var mainObj = template.render('#mainT',ctrl_home.pageDiv,{})
		

		mainObj.on('buscar',function(event){
			console.log(gGeo.oVars.lat,"YAYAY")
			if(gGeo.oVars.lat!=null){
				jqm.showLoader("buscando");
				ms.searchNearBy(ctrl_home.searchComplete);	
			} else{
				alert("Se requiere una dirección válida para localizar restaurantes.")
			}
		})

		mainObj.on('autoLocate',function(event){
			ctrl_home.getLocation();
		})
		
		gGeo.init();
  		ctrl_login.init(ctrl_home.loginRet)


  		var footerObj = template.render('#footerT',ctrl_home.pageDiv,{},null,null,true)


  		$(ctrl_home.pageDiv).trigger("create");
  		

	},
	loginRet : function(){
  		restModel.idUser = userInfo.USERNAME;
		ctrl_order.checkExists(restModel.idUser);
	},
	searchComplete : function(){
		jqm.hideLoader();
		$.mobile.changePage("#listRest");
	},
	getLocation: function(){
		jqm.showLoader("localizando...");
		//ctrl_home.map.locate({setView: true, maxZoom: 16});
		navigator.geolocation.getCurrentPosition(ctrl_home.onLocationFound, ctrl_home.onLocationError,{maximumAge:3000,timeout:35000,enableHighAccuracy:false});
    //ctrl_home.map.on('locationfound', ctrl_home.onLocationFound);
    //ctrl_home.map.on('locationerror', ctrl_home.onLocationError);
	},
	onLocationFound : function(position){
		jqm.hideLoader();
		var pos = position.latlng;
		userLat = pos.lat;
		userLng = pos.lng;
		gGeo.initLatLng(userLat,userLng)
	},
	onLocationError : function(error){
    jqm.hideLoader();
		alert('code: ' + error.code + '\n' +
'message: ' + error.message + '\n');
	}
}

var gGeo = {
	oVars : {	
		direccion : "",
		dirParts : {},
		startGeo : {},
		finalGeo : {},
		geoTimer : {},
		inputBox : {},
		lat : 0,
		lng : 0,	 
	},
	directionsService  : {},
	directionsDisplay  : {},
	init: function(){
		console.log("incializando home..........................................")
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

            console.log(places[0].geometry.location)
                if (places.length == 0) {
                    return;
                }

                console.log(places)
                //mMapa.setMapCookies(mMapa.oVars.lat,mMapa.oVars.lng);
                //gGeo.codeLatLng(places[0].geometry.location.A,places[0].geometry.location.F);
               // mMapa.setLocation(places[0].geometry.location.k,places[0].geometry.location.D)
               gGeo.setGeoCookies(gGeo.oVars.inputBox.val(),places[0].geometry.location.G,places[0].geometry.location.K )

               
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
		gGeo.oVars.lat 			= window.localStorage.getItem("lat");
		gGeo.oVars.lng 			= window.localStorage.getItem("lng");
	    gGeo.oVars.direccion 	= window.localStorage.getItem("direccion");
	},
	setGeoCookies : function(direccion,lat,lng){
		
    	window.localStorage.setItem("direccion", direccion);
    	window.localStorage.setItem("lat", lat);
    	window.localStorage.setItem("lng", lng);

    	console.log("setting" + direccion + " - " + lat + " - " + lng)

    	gGeo.oVars.direccion = direccion;
    	gGeo.oVars.lat = lat;
    	gGeo.oVars.lng = lng;
	},
	codeLatLng : function(lat,lng){
		console.log(lat + " lato")
        gGeo.oVars.startGeo = new Date().getTime();
        gGeo.initLatLng(lat, lng);    
        //var timeOn = (Math.abs(gGeo.oVars.finalGeo - gGeo.oVars.startGeo))
       /*if(!timeOn || timeOn>2000){
            gGeo.initLatLng(lat, lng);    
        } else {
            mMapa.userLocation.bindPopup('<div id="loaderGeo"><img src="../images/gif-load.gif" style="text-align:center;width:20px;height:20px;"></div>').openPopup();
            clearTimeout(gGeo.oVars.geoTimer);
            gGeo.oVars.geoTimer=setTimeout(function(){ gGeo.initLatLng(lat, lng)},2000);
        } */
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
                 
                   gGeo.setGeoCookies(results[0].formatted_address,lat,lng);
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


// leaflef Mapa ----------------------------------------------------
var ms = {
	oVars : {
		categories : {},
		selCat : "",
	},
	restRes : {},
	init : function(){
		gGeo.init();
	},
	setFiltro : function(){
		var filtros = {
            'latitude': gGeo.oVars.lat,
            'longitude': gGeo.oVars.lng,
            'chkPickup': 0 ,
            'chkDelivery': 0,
            'chkCredit': 0,
           // 'chkOpen': document.getElementById("chkOpen").checked ? 1: 0,
           // 'chkPromo': document.getElementById("chkPromo").checked ? 1: 0,
            'chkDistance':  .5,
            //'chkPrice': document.getElementById("rangePrice").value || "",
            'txtSearch': "",
            'sortDistance': 1,
            'sortOrder': 1,
            'sortRank': 1,
            'category': ""
        };
        return filtros;
	},
	searchNearBy : function(callback){
		var filtros = ms.setFiltro();
        url= 'http://192.168.100.200:3005/usuarios/searchnearby';
        $.ajax({
            type: 'POST',
            data: filtros,
            url: url,
            dataType: 'JSON'
            }).done(function( data ) {
            	ms.restRes = data;
            	callback();
            	//mMapa.addPins(data);
            	//mList.setList(data);
        });	
	}
}