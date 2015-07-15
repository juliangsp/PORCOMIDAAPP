/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_home = {
	data : {},
	pageDiv : "#mainScreen",
	init : function(data,template){
		ctrl_home.data = data;
		ctrl_home.render();
	},
	render : function(){


		$(ctrl_home.pageDiv).empty();

		var data  = {
			items : [
				{url:"#list",text: "Cerca de mí", ico : 'fa-map-marker'},
				{url:"#descuento",text: "Descuentos", ico : 'fa fa-money'},
				{url:"#especialidad",text: "Servicios por especialidad" , ico : 'fa-tag'},
				{url:"#list",text: "Por calificación", ico : 'fa-star'},
				{url:"#contacto",text: "Contacto", ico : 'fa-envelope'}
			]
		}


		console.log($('#menuT').html())
		var mainObj = template.render('#mainT',ctrl_home.pageDiv,data,null,{menuT : $('#menuT').html()})
		$(ctrl_home.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		
		mainObj.on('getSuc',function(event){
			$.mobile.changePage( event.context.url);
		})
		
		 ctrl_home.getLocation();

	},
	getLocation: function(){
		var map = L.map('map');
		map.locate({setView: true, maxZoom: 16});

		map.on('locationfound', ctrl_home.onLocationFound);
    	map.on('locationerror', ctrl_home.onLocationError);
	},
	onLocationFound : function(position){
		
		var pos = position.latlng;
		userLat = pos.lat;
		userLng = pos.lng;

		console.log(userLat + " - " + userLng + " user found")
	},
	onLocationError : function(){
		console.log("drag location not found");
	}
}