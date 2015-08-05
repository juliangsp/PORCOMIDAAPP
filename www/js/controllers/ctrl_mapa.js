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


}