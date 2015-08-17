/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_listRest = {
	data : {},
	pageDiv : "#listRest",
	restData : "",
	init : function(data){
		ctrl_listRest.data = data;
		ctrl_listRest.render();
	},
	render : function(){

		console.log("RENDERIZANDO RESTAURANTES CON DISTANCE")

		var data  = { items :ms.restRes };
		console.log(data)
		var mainObj = template.render('#listRestT',ctrl_listRest.pageDiv,data)

		mainObj.on('listDetail',function(event){
			jqm.showLoader("Cargando...")
			idRest = event.context._id
			ctrl_listRest.getRestInfo(idRest);

		});

		$(ctrl_listRest.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		 myScroll = new IScroll('#wrapperList',{  
		 	click:true })
		

	},
	getRestInfo : function(idRest){
        $.ajax({
            type: 'POST',
            data: {idRest:idRest},
            url: serverURL + '/ordenes/restInfo',
            dataType: 'JSON'
            }).done(function( response ) {
            	restRS = response;
             	nombreRest = response.BUSSINESS.NAME;
             	restModel.nombreRest = response.BUSSINESS.NAME;
             	getServerTime(validTime)
             	ctrl_order.checkOrders(idRest,ctrl_listRest.changePage);
            	
        });	
	},
	changePage : function(){
		$.mobile.changePage( "#listCats");
	}
}