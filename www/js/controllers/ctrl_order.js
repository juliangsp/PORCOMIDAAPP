
/**********************************************************
*	GLOBAL ORDER VARS
;***********************************************************/
var orderID;			// Order Main ID
var orderJson;			// Local Order JSON
var orderRS     = {} 	// Order Record Set
var restRS;				// Restaurant INFO Record Set
var userRS;				// User Info
var idRest;
var nombreRest = ""
var serverTime;
var FBratio = .05

var restModel = {
	// Datos Generales
	idRest		: "",
	nombreRest 				: nombreRest,
	idUser 				: "",
};	


var ctrl_order = {
	init : function(){

	},
	checkOrders : function(idRest,callback){
		  restModel.idRest = idRest;
  		restModel.idUser = userInfo.USERNAME;
  		ctrl_order.checkOrder(restModel,callback);
	},
	checkOrder : function(data,callback){
		$.ajax({
          type: 'POST',
            data: data,
            url: serverURL + '/ordenes/checkOrder',
            dataType: 'JSON'
             }).done(function( response ) {
             restModel = response;
             if(callback) { callback(restModel.idRest) }
          }).fail(function( response ) {
              alert("Error de conexión, intente nuevamente mas tarde.");   
    	});   
	},
  checkExists : function(user){
    $.ajax({
          type: 'POST',
            data: {idUser : user},
            url: serverURL + '/ordenes/existsOrder',
            dataType: 'JSON'
             }).done(function( response ) { 
             ctrl_order.checkOrder_Return(response);
          }).fail(function( response ) {
             // alert(JSON.stringify(response));   
      });   
  },
  checkOrder_Return : function(response){
      if('platillos' in response && response.platillos.length>0){
            $('.badge').html(response.platillos.length).fadeIn()
      }else{
          $('.badge').html(0).fadeOut()
      }
  
  },
	updateOrder : function(data,callback){
	  delete data['__v']  // Delete mongoose version data 
    delete data['_id'];
	  $.ajax({
	          type: 'POST',
	            data: data,
	            url: serverURL + '/ordenes/updateOrder',
	            dataType: 'JSON'
	             }).done(function( response ) {
	             restModel = response;
	             if(callback) { callback()  } ;
	          }).fail(function( response ) {
	              alert("Error de conexión, intente nuevamente mas tarde.");   
	              console.log(response.status)
	    });   
	}, 
	finishOrder : function(data,callback){
	  $.ajax({
	          type: 'POST',
	            data: data,
	            url: serverURL + '/ordenes/finishOrder',
	            dataType: 'JSON'
	             }).done(function( response ) {
	             if(callback) { callback()  } ;
	          }).fail(function( response ) {
	              alert("Error de conexión, intente nuevamente mas tarde.");   
	              console.log(response.status)
	    });   
	},
	saveOrder : function(vObj,platilloID,callback){
	  //  $('#savePlatillo').attr("disabled", 'disabled').text("actualizando...");

	    if(platilloID){
	      var platilloIn = JSON.search(restModel,'//*[idPlatillo="'+ platilloID  +'"]')[0]
	      platilloIn = vObj;
	    }
	    else{
	      restModel.platillos.push(vObj);  
	    }
      
	   ctrl_order.updateOrder(restModel,callback)
	},
  sumaPlatillo : function(vObj){

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
   try {
   ctrl_platillo.mainObj.set('vObj',vObj)
   
   $(ctrl_platillo.pageDiv).trigger("create"); 
 } catch (e){}

  },
  removeItem : function(idPlatillo){
    utils.removeObjArr(restModel.platillos,"idPlatillo",idPlatillo);
  },
  clearCart : function(){
  restMode.platillo = [];
  renderCart();
  }


}


function validTime(time){
  var rs = restRS.BUSSINESS.SCHEDULE;

  var dateServer = new Date([time.unix] * 1000);
  var hour = dateServer.getHours();
  var min = dateServer.getMinutes();
  var day  = dateServer.getDay();

console.log(day,"day")

   if(day==0) { day= 6} else { day = day }
  var fraccion;
  if(min<30) { fraccion = ""} else { fraccion = ".5" };
  var conv = hour + fraccion;

  console.log(conv,day,"Aqui murio")

  if(rs["day"+ day].indexOf(conv)==-1){ 
      $('#horarioInvalido').append('<div class="horarioWarn"> El restaurante no esta en horario de servicio en este momento.</div>')
   } else { return false; }
    
}

function comision(monto){
  var baseFija = 5;
  var basePorcentual = .05;

  return monto * (basePorcentual) + baseFija
}


/* get Server Time  */
function getServerTime(callback,params){
   $.ajax({
          type: 'GET',
            data: {},
            url: serverURL + '/ordenes/serverTime',
            dataType: 'JSON'
             }).done(function( response ) {
             serverTime = response;
             if(callback) { callback(serverTime,params)  } ;
          }).fail(function( response ) {
              alert("Error de conexión, intente nuevamente mas tarde." + response);   
    });
}





var conekta = {
  params : "",
  init : function(params){
    console.log("params conekta")
    console.log(params)
    conekta.params = params;
    Conekta.setPublishableKey("key_Vn8JpHpfhQxurnDNFps7zzg");
    //Conekta.setPublishableKey("key_NayDnNe1DDfs7AmQrh4p7iA"); // sandbox
  },
  tokenize: function(tokenParams){
    Conekta.token.create(tokenParams, conekta.successResponseHandler, conekta.errorResponseHandler);
  },
  successResponseHandler : function(token) {
    var params = {};
    params.conektaTokenId = token.id;
    //params.card = tokenParams;
    params.total = String(parseFloat(restModel.total).toFixed(2)).replace('.', '');
    params.desc = "Orden:" + restModel.idOrder;
    console.log('success card', tokenParams )

     $.ajax({
          type: 'POST',
            data: params,
            url: serverURL + '/ordenes/process_payment',
            dataType: 'JSON'
             }).done(function( response ) {
               conekta.responseHandler(response);
          }).fail(function( response ) {
              conekta.errorResponseHandler(response.text)
    });

  },
  errorResponseHandler : function(error) {
  
    
    $('#cardError').show();
    $('#errorText').append('<p>'+ error.message_to_purchaser +'</p><p>Revise sus datos por favor</p>')
    $('#btnErrorCard').click(showCheckOut)
    jqm.hideLoader();
    jqm.dialog({text:error.message_to_purchaser +'</p><p>Revise sus datos por favor</p>',title:"Error al procesar el pago."})

  },
  responseHandler : function(response){
    if(response.status=="paid"){

       ctrl_order.updateOrder(restModel,clearCart)    
        updateUserInfo(userInfo)    
       createOperacion(conekta.params);
       jqm.hideLoader();
       jqm.dialog({text:error.message_to_purchaser +'</p><p>El cargo a la tarjeta ha sido exitoso.</p>',title:"Orden en proceso."})

    }
    console.log(response)
  }


}
