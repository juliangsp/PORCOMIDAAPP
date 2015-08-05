/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_listCats = {
	data : {},
	pageDiv : "#listCats",
	init : function(data,template){
		ctrl_listCats.data = data;
		ctrl_listCats.render();
	},
	render : function(){

		var data  =  restRS;

		console.log(data)

		var mainObj = template.render('#listCatsT',ctrl_listCats.pageDiv,data)

		mainObj.on('catDetail',function(event){
			catSelected = event.context._id;
			$.mobile.changePage( "#listMenu");
		});

		

		$(ctrl_listCats.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		 myScroll = new IScroll('#wrapperList',{  
		 	click:true })
		

	}
}