/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_platillo = {
	data : {},
	pageDiv : "#platillo",
	mainObj : {},
	init : function(data,template){
		ctrl_platillo.data = data;
		ctrl_platillo.render();
	},
	render : function(){

		 var items = JSON.search(restRS.MENU,'//*[_id="'+ itemID  +'"]')[0];

  // virtual Object
  var vObj = {};
console.log(platilloID,"platid")
  // CHECK ORDER FOR EXISTING OBJECT
  if(platilloID){
    var orderItem = JSON.search(restModel.platillos,'//*[idPlatillo="'+ platilloID  +'"]')[0];
    console.log(orderItem,"item encontrado")
    vObj = orderItem;
    if(vObj.extras==undefined) {  vObj.extras         = {}; }
  } else {
    vObj.idMenuItem    = itemID;
    vObj.idPlatillo     = utils.generateUUID()
    vObj.nombrePlat     = items.NAME;
    vObj.cantidad       = 1;
    vObj.precioUnitario = items.PRICE;
    vObj.extras         = {};
    vObj.precioTotal    = items.PRICE;
    vObj.comentarios    = "";
  }
  // Render View

 		items.vObj = vObj

		ctrl_platillo.mainObj = template.render('#platilloT',ctrl_platillo.pageDiv,items)

		ctrl_platillo.mainObj.on('savePlatillo',function(event){
			 vObj.comentarios = $('#PLATILLO_COMS').val();
			 console.log(vObj.comentarios + "comentarios" )
     		 ctrl_order.saveOrder(vObj,platilloID,ctrl_platillo.saveDone);
			
		});

		ctrl_platillo.mainObj.on('opcionTap',function(event){
			console.log(event.context)
		});


		ctrl_platillo.mainObj.on('sustraer',function(){
			if(vObj.cantidad>1){
				vObj.cantidad--
				ctrl_platillo.sumaPlatillo(vObj)
			}
		})

		ctrl_platillo.mainObj.on('agregar',function(){
			vObj.cantidad++
			ctrl_platillo.sumaPlatillo(vObj)
		})

		 var footerObj = template.render('#footerMenu',ctrl_listMenu.pageDiv,{},null,null,true)
  		restModel.idUser = userInfo.USERNAME;
		ctrl_order.checkExists(restModel.idUser);
 

		$(ctrl_platillo.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		 myScroll = new IScroll('#wrapperList',{  
		 	click:true })
		

	},
	saveDone : function(){
		 $.mobile.changePage( "#listMenu");
	},
	sumaPlatillo : function(vObj){

		console.log("suma Platillo en platillo")

	  var cantidad = vObj.cantidad
	  var totalAfectaciones = 0

	  for(a in vObj.extras){
	    for (var i = 0; i < vObj.extras[a].length; i++) {
	      var afecExtras = 0;
	      var afectacion = String(vObj.extras[a][i].variacion);
	      if(afectacion.slice(0,1)=="+"){
	        afecExtras += parseFloat(afectacion.slice(1))
	      }
	      if(afectacion.slice(0,1)=="-"){
	        afecExtras -= parseFloat(afectacion.slice(1))
	      }
	      totalAfectaciones += afecExtras * cantidad
	    };
	    
	  }
	  console.log(cantidad, vObj.precioUnitario, totalAfectaciones)

	  vObj.precioTotal =  (cantidad * vObj.precioUnitario) + totalAfectaciones ;

	  console.log("alterando" + vObj.precioTotal)

	  //$('#PLATILLO_PRECIO').text(numeral(vObj.precioTotal || 0).format("$0,0.00"));
	 ctrl_platillo.mainObj.set('vObj',vObj)

	}

}