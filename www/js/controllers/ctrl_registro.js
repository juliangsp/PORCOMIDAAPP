/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_registro = {
	data : {},
	pageDiv : "#registro",
	init : function(data,template){
		ctrl_registro.data = data;
		ctrl_registro.render();
	},
	render : function(){

		$(ctrl_registro.pageDiv).empty();

		var mainObj = template.render('#registroT',ctrl_registro.pageDiv,{},null)

		mainObj.on('regrdy',function(){

			$.mobile.changePage( "#login", {
			  transition: "pop",
			  reverse: false,
			  changeHash: true
			});
		});

		mainObj.on('ingresar',function(){
			$.mobile.changePage( "#mainScreen", {
			  transition: "slide",
			  reverse: false,
			  changeHash: true
			});
		});

			mainObj.on('cancelar',function(){
			$.mobile.changePage( "#firstP", {
			  transition: "slide",
			  reverse: false,
			  changeHash: true
			});
		});

		$(ctrl_registro.pageDiv).trigger("create");

	}
}