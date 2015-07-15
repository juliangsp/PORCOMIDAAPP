/**********************************************************
*	CORE CONTROLLER
***********************************************************/

var ctrl_core = {

	path : "",
	id 	 : "",
	init : function(){	
		ctrl_core.routeListeners();
	  		var params = { init : 'ctrl_first.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_first.js",params);
	},
	loadController : function(controllerURL,params){
		$.ajax({
	        type: "GET",
	        url: controllerURL,
	        dataType: "script",
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	            console.log('error ', textStatus, errorThrown);
	        },
	        success:function(e){
	         	eval(params.init)(params);
	        }
    	});
	},
	routeListeners : function(){

		$(document).on("pageshow","#firstP", function() {
	        var params = { init : 'ctrl_first.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_first.js",params);
	    });

		$(document).on("pageshow","#login", function() {
	        var params = { init : 'ctrl_loginS.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_loginS.js",params);
	    });

		$(document).on("pageshow","#registro", function() {
	        var params = { init : 'ctrl_registro.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_registro.js",params);
	    });

	    $(document).on("pageshow","#recuperar", function() {
	        var params = { init : 'ctrl_recuperar.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_recuperar.js",params);
	    });

	     $(document).on("pageshow","#recuperarListo", function() {
	        var params = { init : 'ctrl_recuperarListo.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_recuperarListo.js",params);
	    });
		
		$(document).on("pageshow","#mainScreen", function() {
	        var params = { init : 'ctrl_home.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_home.js",params);
	    });

	    $(document).on("pageshow","#list", function() {
	      	var params = { init : 'ctrl_list.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_list.js",params);
	    });

	     $(document).on("pageshow","#especialidad", function() {
	      	var params = { init : 'ctrl_espec.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_especialidad.js",params);
	    });

	    $(document).on("pageshow","#descuento", function() {
	      	var params = { init : 'ctrl_descuento.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_descuento.js",params);
	    });


	    $(document).on("pageshow","#mapa", function() {
	      	var params = { init : 'ctrl_mapa.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_mapa.js",params);
	    });

	    $(document).on("pageshow","#infoSuc", function() {
	      	var params = { init : 'ctrl_info.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_info.js",params);
	    });

	    $(document).on("pageshow","#contacto", function() {
	      	var params = { init : 'ctrl_contacto.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_contacto.js",params);
	    });
	}

}