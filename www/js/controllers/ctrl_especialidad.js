/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_espec = {
	data : {},
	pageDiv : "#especialidad",
	init : function(data,template){
		ctrl_espec.data = data;
		ctrl_espec.render();
	},
	render : function(){


		$(ctrl_espec.pageDiv).empty();

		var data  = {
			items : [
				{text: "Autolavado"},
				{text: "Bombas y Frenos"},
				{text: "Bombas gasolina"},
				{text: "Carter"},
				{text: "Dirección Hidráulica"},
				{text: "Espejo"},
				{text: "Freno"},
				{text: "Grua"},
				{text: "Inyección Electrónica"},
				{text: "Mecánica en General"},
				
			]
		}

		var mainObj = template.render('#especT',ctrl_espec.pageDiv,data)
		$(ctrl_espec.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		
		mainObj.on('getSuc',function(event){
			$.mobile.changePage( "#list");
		})
		

	},
}