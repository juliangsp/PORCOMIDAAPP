/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_descuento = {
	data : {},
	pageDiv : "#descuento",
	init : function(data,template){
		ctrl_descuento.data = data;
		ctrl_descuento.render();
	},
	render : function(){


		$(ctrl_descuento.pageDiv).empty();

		var data  = {
			items : [
				{text: "Listado"},
				{text: "Por mayor porcentaje"},
				{text: "Especialidad"},
				{text: "Estado"},
				{text: "Zona"},
				
			]
		}

		var mainObj = template.render('#descuentoT',ctrl_descuento.pageDiv,data)
		$(ctrl_descuento.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		
		mainObj.on('getSuc',function(event){
			$.mobile.changePage( "#list");
		})
		

	},
}