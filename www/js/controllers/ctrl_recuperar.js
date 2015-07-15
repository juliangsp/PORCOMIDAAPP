/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_recuperar = {
	data : {},
	pageDiv : "#recuperar",
	init : function(data,template){
		ctrl_recuperar.data = data;
		ctrl_recuperar.render();
	},
	render : function(){

		$(ctrl_recuperar.pageDiv).empty();

		var mainObj = template.render('#recuperarT',ctrl_recuperar.pageDiv,{},null)


		mainObj.on('recuperar',function(){
			$.mobile.changePage( "#recuperarListo", {
			 // transition: "slide",
			 // reverse: false,
			 // changeHash: true
			});
		});

			mainObj.on('cancelar',function(){
			$.mobile.changePage( "#login", {
			 //// transition: "slide",
			  //reverse: false,
			 // changeHash: true
			});
		});

		$(ctrl_recuperar.pageDiv).trigger("create");

	}
}