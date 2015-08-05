/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_cart = {
	data : {},
	pageDiv : "#cart",
	init : function(data,template){
		ctrl_cart.data = data;
		ctrl_cart.checkOrders()
	},
	checkOrders : function(){
  	restModel.idUser = userInfo.USERNAME;
  	ctrl_cart.checkOrder(restModel.idUser);
	},
	checkOrder : function(user){
		$.ajax({
          type: 'POST',
            data: {idUser : user},
            url: serverURL + '/ordenes/existsOrder',
            dataType: 'JSON'
             }).done(function( response ) {
             restModel = response;
            	if(response.length>0){
                ctrl_cart.getRestInfo(response.idRest)  
              }else{
                ctrl_cart.render();
              }
              
          }).fail(function( response ) {
              console.log(response)
              alert("Error de conexión, intente nuevamente mas tarde.");   
    	});   
	},
	getRestInfo : function(idRest){
		console.log(idRest)
        $.ajax({
            type: 'POST',
            data: {idRest:idRest},
            url: serverURL + '/ordenes/restInfo',
            dataType: 'JSON'
            }).done(function( response ) {
                console.log(response)
            console.log("respuesta orden")
            	restRS = response;
             	nombreRest = response.BUSSINESS.NAME;
             	restModel.nombreRest = response.BUSSINESS.NAME;
             	getServerTime(validTime)
             	ctrl_cart.render()
            	
        });	
	},
	render : function(){

		var data = { data : restModel }
		var mainObj = template.render('#cartT',ctrl_cart.pageDiv,data)

		mainObj.on('goResume',function(event){
			$.mobile.changePage( "#resume");	
		});

		console.log(data)

		
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		 myScroll = new IScroll('#wrapperList',{  
		 	click:true })
		
		renderCart()		
    $(ctrl_cart.pageDiv).trigger("create");

	}
}


function renderCart(){

    $('#cartItems').empty();
    $('#cartTotals').empty();
    var platillos = restModel.platillos;

    var subTotal = 0;
    var envio = 0;
    var total = 0;

    console.log('platillos' in restModel)

    if(!('platillos' in restModel) ){
        $('#cartItems').append('<div class="emptyCart">Agrega Platillos a tu orden</div>')
        $('#cartSend').hide();
    } else {





    for (var i = 0; i < platillos.length; i++) {
      subTotal+= platillos[i].precioTotal;
      


      var itemR = { data : platillos[i] }
	  template.render('#h_cartItem',"#cartItems",itemR,null,null,true)
      //renderData('#h_cartItem', platillos[i] ,"#cartItems")


      $('#' +platillos[i].idPlatillo).unbind();
      $('#' +platillos[i].idPlatillo).click(function(){
        window.event.stopPropagation();
        var platilloID = $(this).attr('id');
        var menuItem = $(this).data('menuitem');
         createBox('platilloView',menuItem,platilloID);
      })

      $('#mas_'+ platillos[i].idPlatillo).unbind();
      $('#mas_'+ platillos[i].idPlatillo).click(function(){
        var platilloID = $(this).attr('id').slice(4);
        var menuItem = $(this).data('menuitem')
         var orderItem = JSON.search(restModel.platillos,'//*[idPlatillo="'+ platilloID  +'"]')[0];
          orderItem.cantidad++
          ctrl_order.sumaPlatillo(orderItem);
          renderCart();
          ctrl_order.saveOrder(orderItem,platilloID,null)
           $(ctrl_cart.pageDiv).trigger("create");
      })

      $('#men_'+ platillos[i].idPlatillo).unbind()
      $('#men_'+ platillos[i].idPlatillo).click(function(){
        var platilloID = $(this).attr('id').slice(4);
        var menuItem = $(this).data('menuitem')
          var orderItem = JSON.search(restModel.platillos,'//*[idPlatillo="'+ platilloID  +'"]')[0];
          if(orderItem.cantidad>1){
            orderItem.cantidad--
            ctrl_order.sumaPlatillo(orderItem);
            renderCart();
            ctrl_order.saveOrder(orderItem,platilloID,null)
             $(ctrl_cart.pageDiv).trigger("create");
          }else {
            ctrl_order.removeItem(platilloID)
            ctrl_order.sumaPlatillo(orderItem);
            if(restModel.platillos.length==0) { restModel.platillos = ["0"] }
           	renderCart();
            ctrl_order.saveOrder(orderItem,platilloID,null)
             $(ctrl_cart.pageDiv).trigger("create");
          }
      })
    };




      if(restModel.tipoEnvio==undefined){  restModel.tipoEnvio = 2;restModel.envio = restRS.BUSSINESS.DELIVERYPRICE };

      $('#cartTipo').empty();

      var tipoData = { data : restModel}
      template.render('#h_cartTipo',"#cartTipo",tipoData )
      //renderData('#h_cartTipo', restModel ,"#cartTipo")

      if(restRS.BUSSINESS.PICKUP=='0'){
        $('#pb1').prop( "disabled", true );
        restModel.tipoEnvio = 2;
    }

     if(restRS.BUSSINESS.DELIVERY=='0'){
        $('#pb2').prop( "disabled", true );
        restModel.envio = 0;
        restModel.tipoEnvio = 1;
    }

       //------------------  TIPO ENVIO 
      $('#pb1').unbind() 
      $('#pb1').change(function(){
          restModel.tipoEnvio = 1;
          restModel.envio = 0;
          ctrl_order.updateOrder(restModel,renderCart)

      })
       $('#pb2').unbind()
       $('#pb2').change(function(){
          restModel.tipoEnvio = 2;
          restModel.envio = restRS.BUSSINESS.DELIVERYPRICE

          ctrl_order.updateOrder(restModel,renderCart)

      })

  restModel.subtotal = subTotal;
  restModel.envio = restModel.envio || 0;
  restModel.descuentoPuntos = restModel.descuentoPuntos || 0;
  
  // DESCUENTOS CUPONES
  if(restModel.cupon!=undefined){
      if(restModel.cupon.TIPO=="1"){ restModel.descuentoCupon = (parseFloat(restModel.subtotal || 0) * (parseFloat(restModel.cupon.VALOR))/100) }
      if(restModel.cupon.TIPO=="2"){ restModel.descuentoCupon = parseFloat(restModel.cupon.VALOR)  }
   }  


  restModel.totalDescuentos =  parseFloat((restModel.descuentoCupon || 0) + (restModel.descuentoPuntos || 0));
  restModel.total = subTotal +  restModel.envio - (restModel.totalDescuentos || 0) ;

  restModel.comision     = comision(restModel.total);

  	var totData = { data : restModel }
    template.render('#h_cartTotals',"#cartTotals", totData )
   //renderData('#h_cartTotals', restModel ,"#cartTotals")


if(restModel.cupon!=undefined){
  console.log("si hubo cupon")
      $('#PAGOS_CUPON').hide();
      $('#validarCupon').hide();
      var valor = restModel.cupon.VALOR;
      var frase = "";
       if(restModel.cupon.TIPO==1){
            frase = restModel.cupon.NAME + " - " + valor + " % de descuento." ;
          }
      if(restModel.cupon.TIPO==2){
            frase = restModel.cupon.NAME + " - Descuento por: " + numeral(valor || 0).format("$0,0.00") + ".";
          }
     
          $('#msgCupon').empty().append('<p>Cupón valido. ' + frase +  '</p>')
          $('#msgCupon').css({'background-color':'green'})
   }  


      // FB 

     if(parseFloat(restModel.subtotal)<parseFloat(restRS.BUSSINESS.MINORDER)){
     	console.log("PASO ACA LA MATA")
    $('#cartTotals').append('<div id="minOrder">Orden mínima (Subtotal) es de ' + numeral(parseFloat(restRS.BUSSINESS.MINORDER || 0)).format("$0,0.00") +'</div>')
    $('#cartSend').addClass('disabledSend')
    $('#cartEnd').addClass('disabledSend')

     $('#cartSend').unbind( "click" );
    $('#cartEnd').unbind( "click" );


  } else{
  	console.log("TONS ACA")
      $('#cartSend').unbind();
      $('#cartSend').click(function(){
      
        restModel.estatus=1;
        ctrl_order.updateOrder(restModel,renderCart)        
         $.mobile.changePage( "#resume");
     })
     
       $('#cartSend').removeClass('disabledSend')
       $('#cartEnd').removeClass('disabledSend')

  }

}

   $(ctrl_cart.pageDiv).trigger("create");
}