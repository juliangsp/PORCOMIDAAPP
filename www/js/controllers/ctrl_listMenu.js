/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_listMenu = {
	data : {},
	pageDiv : "#listMenu",
	init : function(data,template){
		ctrl_listMenu.data = data;
		ctrl_listMenu.render();
	},
	render : function(){

		
		var fItems = JSON.search(restRS.MENU, '//*[CATEGORY="' + catSelected + '"]')

		for (var i = 0; i < fItems.length; i++) {
			var curr = fItems[i]._id
			var esta = JSON.search(restModel.platillos, '//*[idMenuItem="' + curr + '"]')

			if(esta.length>0) { fItems[i].already = true; fItems[i].cantidadOrden = esta[0].cantidad }
		};

		var data  = { items : fItems  };

		var mainObj = template.render('#listMenuT',ctrl_listMenu.pageDiv,data)

		mainObj.on('platilloDetail',function(event){
			itemID = event.context._id;
			platilloID = null;
			$.mobile.changePage( "#platillo");
		});

		var footerObj = template.render('#footerMenu',ctrl_listMenu.pageDiv,{},null,null,true)
		
  		//restModel.idUser = userInfo.USERNAME;
		//ctrl_order.checkExists(restModel.idUser);

		$(ctrl_listMenu.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		 myScroll = new IScroll('#wrapperList',{  
		 	click:true })
		
		ctrl_listMenu.getItems();



	},
	getItems : function(){
		console.log("getting items")
		 restModel.idUser = userInfo.USERNAME;
		ctrl_order.checkExists(restModel.idUser);
		
	}
}