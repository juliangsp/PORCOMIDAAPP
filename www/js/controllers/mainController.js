/**********************************************************
*	MAIN CONTROLLER
***********************************************************/



var userLat = 20.6596;
var userLng = -103.3496;
//var serverURL = "http://192.168.100.200:3005";
var serverURL = "http://porcomida.com";


var mainC = {
	init: function(callback){
		mainC.initFoundation();
		mainC.loadTemplateFile(ctrl_core.init);

	},
	initFoundation : function(){
		$(document).foundation();
		$(document).foundation('alert','events');

		// Abide Validation
		$(document).foundation('abide', {
	      patterns: {
	        short_field: /^.{,40}$/,
	        long_field: /^.{,72}$/
	      }
    	}); 
	},
	loadTemplateFile: function(callback){
		$("#templateLoader").load("./templates/views.html",function(){
			callback();
		}); 
	},

}

var jqm = {
	showLoader : function(text){
		console.log("show loader")
		$.mobile.loading( "show", {
		  text: text || "",
		  textVisible: true,
		  theme: "z",
		  html: ""
		});
	},
	hideLoader : function(){
		console.log("hide loader")
		$.mobile.loading( "hide", {
		  text: "",
		  textVisible: true,
		  theme: "z",
		  html: ""
		});
	},
	dialog : function(params){
		$('#diag_Title').html(params.title)
		$('#diag_text').html(params.text)
		$.mobile.changePage('#dialog1', 'pop', true, true);
		
	}

}

/**********************************************************
*	FOUNDATION CONTROLLERS
***********************************************************/
var foundationJS = {
	createAlert : function(msg,div,tipo){
		template.render('#alertT',div,{msg:msg,tipo:tipo});
	}
}


/**********************************************************
*	TEMPLATE RENDERER
***********************************************************/
var template = {
	render: function(template,output,data,callback,partials,append){
		var options = {
		  el: output,
		  template:  template,
		  partials: partials,
		  data : data,
		  append : append || false
		}
		// BIND HELPERS
		for (var a in rh){
			options.data[a] = rh[a];
		}
		var ractive = new Ractive(options);
		// IF CALLBACK
		if(callback) { callback()};
		return ractive;
	},
	setListeners : function(){

	},
	update: function(){

	},

}


/**********************************************************
*	DATABASE CONTROLLER
***********************************************************/
var dbC = {
	serverURL : "http://192.168.100.200:3005/",
	query : function(url,type,params,callback,errorCB,extra){
		console.log(url,type,params)
		 $.ajax({
	        type: type,
	        data: params,
	        url: url,
	        dataType: 'JSON',
	        
	        }).done(function( response ) {
        		if(callback) { callback(response,extra) }
	        }).fail(function( response ) {
	           	console.log("fail query",response,extra);
	           	if(errorCB) { errorCB(response,extra) }
	    }); 
	}
}


/**********************************************************
*	REACTIVE HANDLERS
***********************************************************/
var rh = {
	checked : function(lvalue,rvalue,defaultVal){
		console.log(lvalue +  " - " + lvalue)

		if(lvalue==undefined && defaultVal){ lvalue = defaultVal; }
		if( lvalue==rvalue ) {
	       return ' checked="checked"'  } else { return "" };
	},
	timeConverter : function(value){
		return utils.timeConverter(value);
	},	
	distance : function(value){
		return value.toFixed(2) || 0 ;
	},
	pesos : function(value){
		return numeral(value || 0).format("$0,0.00")
	},
	platilloImagen : function(value){
	var html=''
	   if(value!=null){ 
	        html+='<img id="foto" src="' serverURL + value +'" class="fotoPlatillo">';
	   }
    return html;
	},
	pesos : function(value){
		return numeral(value || 0).format("$0,0.00")	
	},
	direccionSel : function(value,field){
		console.log(value + " - " + field)
		if(value[0]!=undefined){
	    return value[0][field]; 
	  } else  { return "" } 
	},
	checkPuntos : function(value){
		return value;
	},
	extrasH : function(value){
		var html= '';
      for (var a in value){
        for (var i = 0; i < value[a].length; i++) {
           html += '<div>' +  value[a][i].nombre + '</div>'
        };
      }
     return html; 
	},
	controls : function(item,vObj){

		  var html = '<div id="extra_'+ item.ID +'" class="small-12 column">';
    
    html+= '<div id="labelNombre_'+ item.ID +'" class="labelNombreOpciones">' +  item.NOMBRE + '</div>'
    for (var i = 0; i < item.OPCIONES.length; i++) {
      var variacionPrecio = 0
      var variacionTexto  = ""     
      if(item.OPCIONES[i].MONTO!=0){
        variacionTexto =  '<label class="cambioPrecio">(' + item.OPCIONES[i].MONTO +')</label>'
        variacionPrecio = item.OPCIONES[i].MONTO;
      }
      // Check if checked
     // console.log(item,"item opciones")
      var checked = ""
      var check = JSON.search(vObj,'//*[nombre="'+ item.OPCIONES[i].NOMBRE +'"]')[0];
      if(check!=undefined){ checked = "checked" }

      html+= '<label class="platCheck"><input '+ checked +' data-nombre="'+ item.OPCIONES[i].NOMBRE +'" data-variacion="'+ variacionPrecio + '" type="'+ (item.TIPO==1 ? "checkbox" : "radio") +'" name="' + item.ID + '" value="'+  item.OPCIONES[i].NOMBRE +'">' +  item.OPCIONES[i].NOMBRE + " " + variacionTexto + '</input></label>'
    };
  html+= "</div>";


  if(item.MAXIMAS>0){
      limit =item.MAXIMAS;
      var labelAviso ='<label class="labelAviso">(Máximo ' + item.MAXIMAS +' Opciones)</label>'
      $('#labelNombre_' + item.ID).html(labelAviso);
   }

   	$('body').off('change','input[name="'+  item.ID +'"]')
   	$('body').on('change','input[name="'+  item.ID +'"]',function () {
      var cnt = $('input[name="'+ item.ID +'"]:checked').length;
      if (cnt > limit){ $(this).prop("checked", ""); }
        //
        console.log("datavariacion", $(this).data("variacion"))
        var selected = [];
        $('input[name="' + item.ID + '"]:checked').each(function() {
          var itemOn = {variacion : $(this).data('variacion'), nombre: $(this).data('nombre') }
            selected.push(itemOn);
        });

        vObj.extras[item.ID] = selected;
        ctrl_order.sumaPlatillo(vObj);
    });

	  return html;

	}
}





//  ----------------------------------  mMapa ------------------------------------------------------------
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
	init : function(){
		mMapa.getMapCookies();
		mMapa.setMap();
	},
	getMapCookies : function(){
	    mMapa.oVars.lat	 			= window.localStorage.getItem("lat"); //utils.getCookie('lat',mMapa.oVars.defaultLat);
	    mMapa.oVars.lng 			= window.localStorage.getItem("lng"); //utils.getCookie('lng',mMapa.oVars.defaultLng);
	   
	},
	setMapCookies : function(lat,lng){
		console.log("setting map cookies 2")
		//var d = new Date();
   		//d.setTime(d.getTime() + (1*24*60*60*1000));
    	//document.cookie="lat="+ lat +";expires="+d.toUTCString();
    	//document.cookie="lng="+ lng +";expires="+d.toUTCString();

    	 window.localStorage.setItem("lat", lat);
    	 window.localStorage.setItem("lng", lng);

    	mMapa.oVars.lat = lat;
        mMapa.oVars.lng = lng;
	},
	setMap: function(div){
		mMapa.map = L.map (div, {
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
