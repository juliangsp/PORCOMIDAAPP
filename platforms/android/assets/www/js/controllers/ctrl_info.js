/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_info = {
	data : {},
	pageDiv : "#infoSuc",
	init : function(data,template){
		ctrl_info.data = data;
		ctrl_info.render();
	},
	render : function(){

		var data  = {
				 url:"#infoSuc",
				 nSucursal: "Miramontes 2",
				 distancia:"1.2 km.",
				 tags: "Afinación, Suspensión, Frenos",
				 direccion: "Miramontes #412, Alameda Central",
				 estado:"Mexico D.F.",
				 cp:"13230",
				 tel1:"(55) 5863-2285"
		}

		var mainObj = template.render('#infoT',ctrl_info.pageDiv,data)
		$(ctrl_info.pageDiv).trigger("create");

		mainObj.on('genMap',function(){
			$.mobile.changePage( "#mapa");
			//window.location = "#mapa"
		})
		
	}
}