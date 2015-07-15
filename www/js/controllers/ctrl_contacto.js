/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_contacto = {
	data : {},
	pageDiv : "#contacto",
	init : function(data,template){
		ctrl_contacto.data = data;
		ctrl_contacto.render();
	},
	render : function(){

		$(ctrl_contacto.pageDiv).empty();

		var mainObj = template.render('#contactoT',ctrl_contacto.pageDiv,{},null)


		mainObj.on('enviar',function(){
			$.mobile.changePage( "#mensajeEnviado", {
			 // transition: "slide",
			 // reverse: false,
			 // changeHash: true
			});
		});


			mainObj.on('cancelar',function(){
			$.mobile.changePage( "#mainScreen", {
			 // transition: "slide",
			 // reverse: true,
			 // changeHash: true
			});
		});

		$(ctrl_contacto.pageDiv).trigger("create");

	}
}