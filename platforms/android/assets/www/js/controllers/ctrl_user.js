/**********************************************************
*	USER CONTROLLER
***********************************************************/
var ctrl_user = {
	userInfo : {},
	callback : null,
	init : function(callback){
		if(callback) { ctrl_user.callback = callback}
		ctrl_user.checkSession();
	},
	rejectConn: function(){
		ctrl_user.clearCookies();
		window.location = "../login";
	},
	checkSession: function(){
		 $.ajax({
	        type: 'POST',
	        data: {},
	        url: '../api/loginUser',
	        dataType: 'JSON'
	        }).done(function( response ) {
        		if(response.status=="EXPIRED"){
        			ctrl_user.rejectConn();
        		}else{
        			ctrl_user.userInfo = response;
        			ctrl_user.callback();
        		}
	        }).fail(function( response ) {
	           	ctrl_user.rejectConn();
	    }); 
	},
	logOut:function(){
		$.ajax({
	        type: 'POST',
	        data: {},
	        url: 'api/logOut',
	        dataType: 'JSON'
	        }).done(function( response ) {
	        	window.location = "login";

	        }).fail(function( response ) {
	        	window.location = "login";
	    });   
	},
	render:function(){
		var logObj = template.render('#loginT','#loginContainer',{})
		logObj.on( 'loginActivate', function ( event ) {
			var username = $('[name="username"]').val();
			var password = $('[name="password"]').val();
	  		ctrl_user.login(username,password);
		})

	},
	clearCookies: function(){
		var c = document.cookie.split("; ");
		 for (i in c) 
		  document.cookie =/^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"; 
	}

};

