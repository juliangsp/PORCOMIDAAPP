/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_loginS = {
	data : {},
	pageDiv : "#login",
	init : function(data,template){
		ctrl_loginS.data = data;
		ctrl_loginS.render();
	},
	render : function(){

		$(ctrl_loginS.pageDiv).empty();

		var mainObj = template.render('#loginT',ctrl_loginS.pageDiv,{},null)

		mainObj.on('ingresar',function(){
			$.mobile.changePage( "#mainScreen", {
			  //transition: "slide",
			 // reverse: false,
			 // changeHash: true
			});
		});

			mainObj.on('cancelar',function(){
			$.mobile.changePage( "#firstP", {
			 // transition: "slide",
			 // reverse: true,
			 // changeHash: true
			});
		});



		$(ctrl_loginS.pageDiv).trigger("create");

	}
}