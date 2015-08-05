/**********************************************************
*	CORE CONTROLLER
***********************************************************/

var ctrl_core = {

	path : "",
	id 	 : "",
	init : function(){	
		ctrl_core.routeListeners();
	  	var params = { init : 'ctrl_home.init' }
	    ctrl_core.loadController("./js/controllers/ctrl_home.js",params,null);
	    
	},
	loadController : function(controllerURL,params,callback){
		$.ajax({
	        type: "GET",
	        url: controllerURL,
	        dataType: "script",
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	            console.log('error ', textStatus, errorThrown);
	        },
	        success:function(e){
	        	if(callback) { callback(); }
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

	    $(document).on("pageshow","#listRest", function() {
	      	var params = { init : 'ctrl_listRest.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_listRest.js",params);
	    });
	    $(document).on("pageshow","#listCats", function() {
	      	var params = { init : 'ctrl_listCats.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_listCats.js",params);
	    });
	    
	    $(document).on("pageshow","#listMenu", function() {
	      	var params = { init : 'ctrl_listMenu.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_listMenu.js",params);
	    });

	    $(document).on("pageshow","#platillo", function() {
	      	var params = { init : 'ctrl_platillo.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_platillo.js",params);
	    });

	     $(document).on("pageshow","#cart", function() {
	      	var params = { init : 'ctrl_cart.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_cart.js",params);
	    });

	    $(document).on("pageshow","#resume", function() {
	      	var params = { init : 'ctrl_resume.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_resume.js",params);
	    });

	    $(document).on("pageshow","#finalizado", function() {
	      	var params = { init : 'ctrl_finalizado.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_finalizado.js",params);
	    });

	   
	}

}