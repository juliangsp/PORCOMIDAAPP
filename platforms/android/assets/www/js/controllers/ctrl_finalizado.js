/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_finalizado = {
	data : {},
	pageDiv : "#finalizado",
	init : function(data,template){
		ctrl_finalizado.data = data;
		ctrl_finalizado.render();
	},
	render : function(){

		
		var data = {};
		var mainObj = template.render('#finalizadoT',ctrl_finalizado.pageDiv,data)

		mainObj.on('goMain',function(event){
			$.mobile.changePage( "#mainScreen");
			ctrl_home.loginRet();
			
		});

		$(ctrl_finalizado.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		 myScroll = new IScroll('#wrapperList',{  
		 	click:true })
		

	}
}