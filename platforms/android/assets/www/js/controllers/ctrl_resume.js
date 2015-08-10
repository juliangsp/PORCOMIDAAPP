/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_resume = {
	data : {},
	pageDiv : "#resume",
	init : function(data,template){
		ctrl_resume.data = data;
		ctrl_resume.render();
	},
	render : function(){


		//var fItems = JSON.search(selResData.MENU, '//*[_id="' + selPlatillo + '"]')
		
		var data =  { order: restModel,
					 rest : restRS,
					 user : userInfo }

		var mainObj = template.render('#resumeT',ctrl_resume.pageDiv,data)

		mainObj.on('goResume',function(event){
			itemAgregar(event.context._id)
			
		});

		$(ctrl_resume.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		 myScroll = new IScroll('#wrapperList',{  
		 	click:true })
		
		showCheckOut();
	}
}

function showCheckOut(){
  
    $('#rangeFB').on('input',function(){
          var newval=$(this).val();

           $("#valUsados").text(newval);
           restModel.descuentoPuntos = newval * FBratio;
           restModel.puntosUsados = newval;
          
           $("#valDescuento").text(numeral(restModel.descuentoPuntos || 0).format("$0,0.00"));
           renderCart();
    })

    $('#TIPOOP').change(function(){ 
        restModel.tipoEnvio = $('input[name="TIPOOP"]:checked').val();
        ctrl_order.updateOrder(restModel);
        setPago(restModel.tipoEnvio);
    });

    $('#fact1').change(function(){ 
         if($(this).is(":checked")) { restModel.factura = 2;
         }else{
            restModel.factura = 1;
         }
        
        ctrl_order.updateOrder(restModel);
        setFactura(restModel.factura);
    });

    setPago(restModel.tipoEnvio);
    setFactura(restModel.factura);

   // $("#ORDER_CHANGE").autoNumeric('init', {aForm:"true", aSep: ',', aDec: '.',aSign: '$'});

    $('#validarCupon').click(function(){
          checkValid($('#PAGOS_CUPON').val())
        
    })

     $('#cartEnd').unbind();
      $('#cartEnd').click(function(){
          endOrder();
      })



}



function endOrder(){    
        getServerTime(endData);
}
function endData(){

    var err = "";
    var errFields = [];

    restModel.datosUsuario = {};
    // Asign to Local JSON 
    restModel.instrucciones             = $('#ORDER_INSTRUCCCIONES').val();
    restModel.datosUsuario.nombre        = $('#USUARIO_NAME').val();
    restModel.datosUsuario.correo        = $('#USUARIO_EMAIL').val();
    restModel.datosUsuario.movil         = $('#USUARIO_MOVIL').val();
    
    restModel.datosEnvio = {};

    restModel.datosEnvio.direccion       = $('#ORDER_DIRECCION').val();
    restModel.datosEnvio.numero          = $("#ORDER_NUMEROINTERIOR").val(); 
    restModel.datosEnvio.entrecalles     = $("#ORDER_CALLES").val(); 
    restModel.datosEnvio.colonia         = $("#ORDER_COLONIA").val(); 
    restModel.datosEnvio.cp              = $("#ORDER_CP").val(); 

    restModel.locUser = {};
    restModel.locUser.lat = 0.1
    restModel.locUser.lng = 0.1


    restModel.datosFactura = {};

    restModel.factura                 = $("#factura input[type='checkbox']:checked").val(); 
    restModel.datosFactura.nombre     = $('#FACTURA_NOMBRE').val();
    restModel.datosFactura.rfc        = $('#FACTURA_RFC').val();
    restModel.datosFactura.direccion  = $('#FACTURA_DIRECCION').val();
    restModel.datosFactura.numero     = $('#FACTURA_NUMERO').val();
    restModel.datosFactura.cp         = $('#FACTURA_CP').val();

    restModel.idCupon                 = $('#PAGOS_CUPON').val();
    restModel.descuentoPuntos         = "0";
    restModel.puntosGenerados         = "0";

     restModel.datosPago = {};

    restModel.datosPago.tipoPago      = $("#TIPOOP input[type='radio']:checked").val(); 
    restModel.datosPago.nombreTarjeta = $('#PAGOS_NOMBRETARJETA').val();
    restModel.datosPago.numeroTarjeta = $('#PAGOS_NUMEROTARJETA').val();
    restModel.datosPago.mesTarjeta    = $('#mesTarjeta option:selected').text();
    restModel.datosPago.anoTarjeta    = $('#anoTarjeta option:selected').text();
    restModel.datosPago.cvv           = $('#PAGOS_CVV').val();
    restModel.datosPago.cambio        = $('#PAGOS_CAMBIO').val();
    


    // Validation
    if(restModel.datosUsuario.nombre.length<2) { err += '<div class="Errmsg">Introduzca un Nombre válido</div>' ; errFields.push($('#USUARIO_NAME')) }
    if(restModel.datosUsuario.correo.length<2) { err += '<div class="Errmsg">Introduzca un Correo válido</div>' ; errFields.push($('#USUARIO_EMAIL')) }
    if(restModel.datosUsuario.movil.length<2) {  err += '<div class="Errmsg">Introduzca un Teléfono movil válido</div>' ; errFields.push($('#USUARIO_MOVIL')) }

    if(restModel.datosEnvio.direccion.length<2) {  err += '<div class="Errmsg">Introduzca una Dirección válida</div>' ; errFields.push($('#ORDER_DIRECCION'))  }
    if(restModel.datosEnvio.numero.length<1) {  err += '<div class="Errmsg">Introduzca un Número válido</div>' ; errFields.push($('#ORDER_NUMEROINTERIOR'))  }
    if(restModel.datosEnvio.colonia.length<2) {  err += '<div class="Errmsg">Introduzca una Colonia válida</div>' ; errFields.push($('#ORDER_COLONIA')) }
    if(restModel.datosEnvio.cp.length<2) {  err += '<div class="Errmsg">Introduzca un Código postal válido</div>' ; errFields.push($('#ORDER_CP')) }

    if(restModel.factura==1){
      if(restModel.datosFactura.nombre.length<2) {  err += '<div class="Errmsg">Introduzca una Nombre para factura válido</div>' ; errFields.push($('#FACTURA_NOMBRE'))  }
      if(restModel.datosFactura.rfc.length<2) {  err += '<div class="Errmsg">Introduzca un RFC válido</div>' ; errFields.push($('#FACTURA_RFC'))  }
      if(restModel.datosFactura.direccion.length<2) {  err += '<div class="Errmsg">Introduzca una Dirección para factura válido</div>' ; errFields.push($('#FACTURA_DIRECCION')) }
      if(restModel.datosFactura.numero.length<2) {  err += '<div class="Errmsg">Introduzca un Número para factura válido</div>' ; errFields.push($('#FACTURA_NUMERO')) }
      if(restModel.datosFactura.cp.length<2) {  err += '<div class="Errmsg">Introduzca un Código postal para factura válido</div>' ; errFields.push($('#FACTURA_CP')) }
    } 

    if(restModel.datosPago.tipoPago==1){
      if(restModel.datosPago.nombreTarjeta.length<2) {  err += '<div class="Errmsg">Introduzca una Nombre de Tarjeta válido</div>' ; errFields.push($('#PAGOS_NOMBRETARJETA'))  }
      if(restModel.datosPago.numeroTarjeta.length<2) {  err += '<div class="Errmsg">Introduzca un Número de Tarjeta válido</div>' ; errFields.push($('#PAGOS_NUMEROTARJETA'))  }
      if(restModel.datosPago.mesTarjeta=="Mes") {  err += '<div class="Errmsg">Introduzca un Mes válido</div>' ; errFields.push($('#mesTarjeta')) }
      if(restModel.datosPago.anoTarjeta=="Año") {  err += '<div class="Errmsg">Introduzca un Año válido</div>' ; errFields.push($('#anoTarjeta')) }
      if(restModel.datosPago.cvv.length<3) {  err += '<div class="Errmsg">Introduzca un CVV válido</div>' ; errFields.push($('#PAGOS_CVV')) }
    } 
       
    var direccion = {}
    direccion.direccion = restModel.datosEnvio.direccion;
    direccion.numero = restModel.datosEnvio.numero;
    direccion.calles = restModel.datosEnvio.entrecalles;
    direccion.colonia = restModel.datosEnvio.colonia;
    direccion.cp = restModel.datosEnvio.cp;

    
    userInfo.DIRECCIONES[0] = direccion;
    userInfo.EMAIL = restModel.datosUsuario.correo;
    userInfo.MOVIL =  restModel.datosUsuario.movil
    
    var puntosGenerados = parseInt(restModel.total * FBratio);
    userInfo.PUNTOSFACEBOOK = (userInfo.PUNTOSFACEBOOK -  restModel.puntosUsados) + puntosGenerados;
    console.log(puntosGenerados,"puntosGenerados")
    restModel.puntosFacebookGenerados = puntosGenerados;
    

    if(err==""){
        restModel.estatus=2;
        restModel.tsGenerado = serverTime.unix;
      
        var hashids = new Hashids(utils.generateTS())
        var  id = hashids.encode(utils.generateTS())

        var params = {};  
        params._id = id;
        params.values = {
          _id : id,
          noCliente : idRest,
          nombreRest : nombreRest,
          tipo : 4,
          tsGenerado: utils.generateTS(),
          comentarios : idRest,
          monto : restModel.total, 
          comision: comision(restModel.total)
        }

        if(restModel.datosPago.tipoPago==2){
          ctrl_order.updateOrder(restModel,clearCart)    
          updateUserInfo(userInfo)    
          createOperacion(params);
       }else{

          showCreditValidation()
          genCardValidation();
          conekta.init(params)

          tokenParams = {
            "card": {
              "number": restModel.datosPago.numeroTarjeta,
              "name": restModel.datosPago.nombreTarjeta,
              "exp_year":  restModel.datosPago.anoTarjeta,
              "exp_month": restModel.datosPago.mesTarjeta,
              "cvc": restModel.datosPago.cvv
            }}

            $('checkOutDiv').hide();
            /*
              tokenParams = {
            "card": {
              "number": "4242424242424242",
              "name": "Javier Pedreiro",
              "exp_year": "2018",
              "exp_month": "12",
              "cvc": "123",
            }}*/


          conekta.tokenize(tokenParams);
       }
        
    } else{
        for (var i = 0; i < errFields.length; i++) {
            errFields[i].css({'background-color':'rgb(247, 255, 178)'})
        };


        jqm.dialog( {text:err,title:"Error, Datos requeridos."})
    }   
}

function setPago(tipoEnvio){
    if(tipoEnvio==1){
            $('#pagoTarjeta').show();
            $('#pagoEfectivo').hide();
        }
    if(tipoEnvio==2){
            $('#pagoTarjeta').hide();
            $('#pagoEfectivo').show(); 
        }
}
function setFactura(value){
  console.log("factura Value", value)
  if(value==undefined) { value = 1 };
    if(value==1){
      $('#check_Factura').hide();
        }
    if(value==2){
      $('#check_Factura').show();
        }
}


function clearCart(){
  console.log("regreso final mostrar pantalla final")
  restModel.platillo = [];
  $.mobile.changePage( "#finalizado");
  
  //renderCart();
}


function genCardValidation(){
   
}



function updateUserInfo(data){
  $.ajax({
          type: 'POST',
            data: {data:data},
            url: serverURL + '/usuarios/updateUserInfo',
            dataType: 'JSON'
             }).done(function( response ) {
                console.log("información de usuario guardada")
          }).fail(function( response ) {
              alert("Error de conexión, intente nuevamente mas tarde." + response);   
    });
}

function createOperacion(data){
  $.ajax({
          type: 'POST',
            data: data,
            url: serverURL + '/administrador/createOperacion',
            dataType: 'JSON'
             }).done(function( response ) {
                console.log("información de usuario guardada")
          }).fail(function( response ) {
              alert("Error de conexión, intente nuevamente mas tarde." + response);   
    });
}

function showCreditValidation(){
  jqm.showLoader('Validando tarjeta...')
}



