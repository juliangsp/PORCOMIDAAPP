/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_first = {
	data : {},
	pageDiv : "#firstP",
	init : function(data,template){
		ctrl_first.data = data;
		ctrl_first.render();
	},
	render : function(){

		console.log("iniciando First")
		$(ctrl_first.pageDiv).empty();

		var mainObj = template.render('#firstT',ctrl_first.pageDiv,{},null)

		mainObj.on('login',function(){
			$.mobile.changePage( "#login", {
			  //transition: "slide",
			  //reverse: false,
			 // changeHash: true
			});
		});

		mainObj.on('registro',function(){
			$.mobile.changePage( "#registro", {
			  //transition: "slide",
			 // reverse: false,
			 // changeHash: true
			});
		});

		$(ctrl_first.pageDiv).trigger("create");

	}
}