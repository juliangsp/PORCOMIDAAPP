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

		$(document).on("pagebeforeshow","#firstP", function() {
	        var params = { init : 'ctrl_first.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_first.js",params);
	    });

		$(document).on("pagebeforeshow","#login", function() {
	        var params = { init : 'ctrl_loginS.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_loginS.js",params);
	    });

	    $(document).on("pagebeforeshow","#listRest", function() {
	      	var params = { init : 'ctrl_listRest.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_listRest.js",params);
	    });
	    $(document).on("pagebeforeshow","#listCats", function() {
	      	var params = { init : 'ctrl_listCats.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_listCats.js",params);
	    });
	    
	    $(document).on("pagebeforeshow","#listMenu", function() {
	      	var params = { init : 'ctrl_listMenu.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_listMenu.js",params);
	    });

	    $(document).on("pagebeforeshow","#platillo", function() {
	      	var params = { init : 'ctrl_platillo.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_platillo.js",params);
	    });

	     $(document).on("pagebeforeshow","#cart", function() {
	      	var params = { init : 'ctrl_cart.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_cart.js",params);
	    });

	    $(document).on("pagebeforeshow","#resume", function() {
	      	var params = { init : 'ctrl_resume.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_resume.js",params);
	    });

	    $(document).on("pagebeforeshow","#finalizado", function() {
	      	var params = { init : 'ctrl_finalizado.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_finalizado.js",params);
	    });

	   
	}

}