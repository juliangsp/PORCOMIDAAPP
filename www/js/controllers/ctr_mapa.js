//  FRONT SEARCH ADDO STUDIOS 2015 R  v| Beta 1.0


//------------------------------------------------------------------------
// Main Controller 
var ms = {
	oVars : {
		categories : {},
		selCat : "",
	},
	restRes : {},
	init : function(){
		// Check user
		checkFacebook();
		// Init Leaflef
		mMapa.init(); 
		// Init Geo Google Coder
		gGeo.init();
		ms.setListeners();
		ms.setBackground();
	},
	setBackground : function(){
		var azar = Math.floor((Math.random() * 5) + 1);
    	document.getElementById("header").style.backgroundImage="url('../images/fondo"+azar+".jpg')";
	},
	setListeners : function(){
		// Autolocate Button
		$('#btnFindLC').on('click', mMapa.autoLocate);
	},
	renderData  : function(id,rs,div){
    var source      = $(id).html()
    var template    = Handlebars.compile(source);
    var html        = template(rs);
     $(div).append(html);
	},
	setWindowListeners : function(){

	},
	renderView : function(){

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
	setFiltro : function(){
		var filtros = {
            'latitude': mMapa.oVars.lat,
            'longitude': mMapa.oVars.lng,
            'chkPickup': document.getElementById("chkPickup").checked ? 1 : 0 ,
            'chkDelivery': document.getElementById("chkDelivery").checked ? 1: 0,
            'chkCredit': document.getElementById("chkCredit").checked ? 1: 0,
           // 'chkOpen': document.getElementById("chkOpen").checked ? 1: 0,
           // 'chkPromo': document.getElementById("chkPromo").checked ? 1: 0,
            'chkDistance': (document.getElementById("rangeDistance").value)/100 || .5,
            //'chkPrice': document.getElementById("rangePrice").value || "",
            'txtSearch': document.getElementById("search-input").value || "",
           // 'sortDistance': sortDistance || 1,
            //'sortOrder': sortOrder || 1,
           // 'sortRank': sortRank || 1,
            'category': ms.oVars.selCat
        };
        console.log(filtros,"filtros")
        return filtros;
	},
	searchDefault : function(filtros){
        url= '/usuarios/searchDef';
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
	},
	searchSuggestions : function(){
		$('#suggestions table tbody').empty()
		var filtros = ms.setFiltro();
		$.ajax({
            type: 'POST',
            data: filtros,
            url: '/usuarios/suggestions',
            dataType: 'JSON'
            }).done(function( data ) {
            	ms.listSuggestions(data);
        });    	
	},
	listSuggestions : function(data){
		$('#suggestions table tbody').empty()
		var listOfSugges = data;
		var sugges = JSON.search(listOfSugges, '//BUSSINESS/CATEGORY');
		var count = sugges.count_value();
        count = sortObject(count).reverse();
        var cLength;
	        (count.length>6) ? cLength=6 : cLength=count.length;
	        for (var i = 0; i < cLength; i++) {
	            var color;
	            var cat =  ms.oVars.categories;
	            for (var j = 0; j < cat.length; j++) {
	                if(count[i].key==cat[j].NOMBRE){
	                    color = cat[j].COLOR;
	                   count[i].COLOR = color;
	                }
        };
        	ms.renderData('#h_suggBox', count[i] ,"#suggestions table tbody")  
    	}

    	console.log("cLength-------------",cLength,data)
    	if(cLength==0){
    		ms.renderData('#h_suggBoxEmpty', count[i] ,"#suggestions table tbody")  
    	}
    	ms.searchNearBy();
	},
	selecsugges: function(value){
		ms.oVars.selCat = value;
		ms.searchNearBy();
	},
	getCategories : function(callback){
		$.ajax({
        type: 'POST',
        url: '/usuarios/categories',
        dataType: 'JSON'
        }).done(function( data ) {
            ms.oVars.categories = data;
            if(callback) { callback(); }
        });
	}
}
//  Main List------------------------------------------------------
var mList  = {
	data : {},
	setList : function(data){
		mList.showFilters();
		mList.setListeners();
		mList.data = data;
		mList.clearList();
		mList.renderList();
	},
	clearList:function(){
		$('#listado').empty();
	},
	setListeners : function(){
		// SEARCH GEO CODER GOOGLE  KEY PRESS
		$( "#search-input" ).on( "keydown", function(event) {
      	if(event.which == 13) 
         	ms.searchNearBy();
    	});
    	//SelectionChange for range
	    $('#rangeDistance').change(function() {
	       // $('#txtRatioDistance').text($(this).val());
	        $('#t_radio').text("Distancia: "+$(this).val()+" Km." );
	        ms.searchNearBy();
	    });
	},
	showFilters  : function(){
		$('#search').show();
	},
	hideFilters : function(){
		$('#search').hide();
	},
	renderList : function(){
		
		for (var i = 0; i < mList.data.length; i++) {
			console.log(mList.data[i],"datos lista")
			ms.renderData('#h_list', mList.data[i] ,"#listado") 
		};
	},
	showMenus : function(valor){
		val = valor;
   		window.location.href = "/restaurants/" + val;
	}
}
// leaflef Mapa ----------------------------------------------------

var mMapa = {
	oVars : {
		defaultLat: 20.6596,
		defaultLng: -103.3496,
		lat :"", 
		lng :"",
		zoom : 14,
		defaultPin : "D76627"
	},
	map  : {},
	userLocation : {},
	marker : [],
	userIcon : L.icon({
            iconUrl: '../images/marcador_usuario.png',
            shadowUrl: '../images/sombra_marcadores.png',
            iconSize:     [53, 42], // size of the icon
            shadowSize:   [51, 43], // size of the shadow
            iconAnchor:   [16, 43], // point of the icon which will correspond to marker's location
            shadowAnchor: [8, 42],  // the same for the shadow
            popupAnchor:  [0, -42] // point from which the popup should open relative to the iconAnchor
    }),	
	init : function(){
		mMapa.getMapCookies();
		mMapa.setMap();
	},
	getMapCookies : function(){
	    mMapa.oVars.lat	 			= getCookie('lat',mMapa.oVars.defaultLat);
	    mMapa.oVars.lng 			= getCookie('lng',mMapa.oVars.defaultLng);
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
	        zoom: 14
	    });
		// User Icon
		mMapa.userLocation = L.marker([mMapa.oVars.lat,mMapa.oVars.lng], {icon: mMapa.userIcon, draggable:true}).addTo(mMapa.map).bindPopup('tu ubicación').openPopup();
   		// Drag Listener
   		mMapa.userLocation.on('dragend', mMapa.onLocationChange);
        mMapa.map.on('locationfound', mMapa.onLocationFound);
    	mMapa.map.on('locationerror', mMapa.onLocationError);
	 	var tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    	mMapa.map.addLayer(tiles);
    	mMapa.map.invalidateSize();
    	ms.searchSuggestions();
    	// Primeras sugerencias
    	ms.searchDefault(ms.filtrosDefault());

	},
	setLocation : function(lat,lng){
		mMapa.map.setView(new L.LatLng(lat, lng),mMapa.oVars.zoom);
		mMapa.userLocation.setLatLng([lat,lng]).update();
		mMapa.setMapCookies(lat,lng);
	},
	onLocationFound : function(position){
		var pos = position.latlng;
		mMapa.setLocation(pos.lat,pos.lng)
		gGeo.codeLatLng(pos.lat,pos.lng);
		ms.searchSuggestions();
	},
	onLocationError : function(){
		console.log("drag location not found");
	},
	onLocationChange : function(event){
		var marker = event.target;  
        var result = marker.getLatLng();  
        gGeo.codeLatLng(result.lat, result.lng);
        mMapa.setMapCookies(result.lat, result.lng);
        //var sugess2 = document.getElementById('suggestions'); sugess2.style.display = 'block';
        //var search2 = document.getElementById('search'); search2.style.display = 'block';
        //var header = document.getElementById('header'); header.style.height = '435px';
        $("#header").animate({height:'500px'});
        mMapa.userLocation.openPopup();
        ms.searchSuggestions();
	},
	updateLocCookies : function(){

	},
	autoLocate : function(){
		mMapa.map.locate({
       		enableHightAccuracy: true
      	});
	},
	clearPins : function(){
		 for(i=0;i<mMapa.marker.length;i++) {
		    mMapa.map.removeLayer(mMapa.marker[i]); };
		    mMapa.marker = [];
	},
	addPins : function(data){
		mMapa.clearPins();
		for (var r = 0; r < data.length; r++) {
			var logoURL = data[r].BUSSINESS.LOGOTIPO;
			// COLOR
			var color;
			if(data[r].BUSSINESS.CATEGORY!=undefined){
			color = JSON.search(ms.oVars.categories,'//*[NOMBRE="' + data[r].BUSSINESS.CATEGORY[0] +'"]')  ;
			}
			if(color==undefined) { color =  mMapa.oVars.defaultPin} else { color = color[0].COLOR } ;

			if(logoURL==undefined){ 
				logo = '<div class="textPop">' +data[r].BUSSINESS.NAME + '</div>';	
			}else{
				var logo = '<div class="logoPin" onclick="mList.showMenus(\''+data[r]._id+'\')"><img src="../'+ logoURL +'" style="text-align:center;width:60px;"></div> '
			}

			var restIcon = L.icon({
            iconUrl: '../images/'+ color +'.png',
            shadowUrl: '../images/sombra_marcadores.png',
            iconSize:     [53, 42], // size of the icon
            shadowSize:   [51, 43], // size of the shadow
            iconAnchor:   [14, 43], // point of the icon which will correspond to marker's location
            shadowAnchor: [8, 42],  // the same for the shadow
            popupAnchor:  [0, -42] // point from which the popup should open relative to the iconAnchor
        	});
			
			//var pin  = 
			var  LamMarker = L.marker([data[r].loc.lat, data[r].loc.lng ], {icon: restIcon}).addTo(mMapa.map).bindPopup(logo);
        	mMapa.marker.push(LamMarker);
		}
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
	    gGeo.oVars.direccion = getCookie('direccion');
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
                   console.dir(gGeo.oVars.dirParts)
                   gGeo.setGeoCookies(results[0].formatted_address);
                   gGeo.oVars.inputBox.val(results[0].formatted_address);
                   gGeo.oVars.finalGeo = new Date().getTime();
                  if(profileImage){
                  mMapa.userLocation.bindPopup('<img id="fotito2" class=\"fb-photo img-polaroid\" src=\"https://' + profileImage  + '\">').openPopup();
                    }
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

// Helpers
Handlebars.registerHelper('cCase', function(value) {
        return String(value).toLowerCase().capitalize();
});

Handlebars.registerHelper('distance', function(value) {
        return value.toFixed(2);
});

Handlebars.registerHelper('logoImagen', function(value,idOrder) {
   var html=''
   console.log(value,"valor foto")
   if(value!=null){
        html+='<img id="foto" src="../'+ value +'" class="fotoLogoList">';
   }else
   {
   	 html+='<img id="foto" src="../images/perfil_default_rest.png" class="fotoLogoList">'; 	
   }
    return new Handlebars.SafeString(html);
});

Handlebars.registerHelper('iconosList', function(value) {   
    var html = "";
    if ( value.CREDITCARD=='1') { html+='<div class="itemIco"><div class="icoSim"><img  src="./images/visa.png"> </div>Tarjeta de Crédito</div>'; };
    if ( value.PICKUP=='1') { html+='<div class="itemIco"><div class="icoSim"><img src="./images/recojer.png"></div>Entrega en local</div>'; };
    if ( value.PAIDATHOME=='1') { html+='<div class="itemIco"><div class="icoSim"><img src="./images/efectivo.png"></div>Efectivo</div>'; };
    if ( value.PROMO=='1') { html+='<div class="itemIco"><div class="icoSim"><img  src="./images/descuento.png"></div>Descuento</div>'; };
    if ( value.DELIVERY=='1') {html+='<div class="itemIco"><div class="icoSim"><img src="./images/motito.png"></div>Entrega a domicilio</div>'; };

    return new Handlebars.SafeString(html);
});

Handlebars.registerHelper('pesos', function(value) {
        return numeral(value).format("$0,0.00")
});


Handlebars.registerHelper('tipoCocina', function(value) {
    	var html=""   
    	if(value!=undefined){ 
	    	for (var i = 0; i < value.length; i++) {
	    		html += String(value[i] + "" + ((i<value.length-1) ? ", " : "")).toLowerCase().capitalize();
	    	};
	    	return html;
    	} else {
    		return "";
    	} 
});


