/**********************************************************
*	GLOBAL VARS
***********************************************************/
  //USERDATA
  var pedidosUser = [];
  var puntosFB=0;
  var direcciones = [];
  var loc = {};
  var logued = false;
  var userInfo = {}

var ctrl_login = {
	userInfo : {},
	callback : null,
	init: function(callback){
		ctrl_login.callback = callback;
		faceLogin.checkFacebook();
	},
	loginUser: function(dataLogin){
	    $.ajax({
	            type: 'POST',
	            data: dataLogin,
	            url: serverURL + '/usuarios/loginUser',
	            dataType: 'JSON'
	            }).done(function( data ) {
	            	if (data!=0) {
		                userInfo = data;
		                ctrl_login.userInfo = data;
		                ctrl_login.setUserData(data);
		                ctrl_login.setUserCookie(data);
		                if(ctrl_login.callback) { ctrl_login.callback() };
	            	}	
	            });
	            
	},
	/**********************************************************
	*	Set User Data
	***********************************************************/
	setUserData : function(data){
		pedidosUser	=	data.PEDIDOS;   
		puntosFB 	= 	data.PUNTOSFACEBOOK;
		pagos 		=	data.PAGOS;
		direcciones = 	data.DIRECCIONES;

		$('#username').text(data.NAME)
		$('#fbPoints').text(data.PUNTOSFACEBOOK + " puntos facebook")

	},
	setUserCookie : function(data){
		 window.localStorage.setItem("username", data.USERNAME);
		 window.localStorage.setItem("type", data.TYPE);
	},
	genLogin : function(){
	var loginHtml = '<div id="login" class="login">'
	loginHtml +='	 <a style="text-decoration:none;" href="javascript:void(0)" onclick="faceLogin.loginFacebook();"><div class="facebookButton">Entrar con Facebook</div></a>'
  	loginHtml +='</div>'
	$('#logInfo').append(loginHtml);
	},
	/**********************************************************
	*	Update User Info   (used to change temporal user for facebook user)
	***********************************************************/
	updateUserInfo : function(data){
		var dataLogin = { 'USERNAME' : ctrl_login.getActiveUser().username , data : data}
		$.ajax({
	    type: 'POST',
	    data: dataLogin,
	    url: serverURL + '/usuarios/updateUserInfo',
	    dataType: 'JSON'
	    }).done(function( data ) {
	        console.log('data del USUARIO fb actualizado', data);
	    });
	},
	/**********************************************************
	*	Get Active User
	***********************************************************/
	getActiveUser : function(){
		var username 	= window.localStorage.getItem('username')
		var type 		= window.localStorage.getItem('type')
		var lat 		= window.localStorage.getItem('lat')
		var lng 		= window.localStorage.getItem('lng')
		return {username : username, type : type, lat : lat, lng : lng} ; 
	},
	checkActiveUser : function(){
		 if( ctrl_login.getActiveUser().type == "invitado"){
	    	var dataLoginIns = {
	        'USERNAME'	: ctrl_login.getActiveUser().username,
	        'TYPE'		: 'invitado',
	        'NAME' 		: 'invitado',
	        'loc'		: ctrl_login.getActiveUser().loc
		    };
	        	ctrl_login.loginUser(dataLoginIns);
		} else {

		var dataLoginIns = {
	        'USERNAME'	: utils.guid(),
	        'TYPE'		: 'invitado',
	        'NAME' 		: 'Invitado',
	        'loc'		: loc
		    };
	 		
	 		ctrl_login.createUser(dataLoginIns)
	    }
	},
	createUser : function(datalogin){
		ctrl_login.checkExistantUser(datalogin);
	},
	checkExistantUser : function(dataLogin){
		$.ajax({
	            type: 'POST',
	            data: dataLogin,
	            url: serverURL+'/usuarios/checkUser',
	            dataType: 'JSON'
	            }).done(function( data ) {
	               if(data==null){
	               	    ctrl_login.insertUser(dataLogin);
	               }else {
	               		ctrl_login.loginUser(dataLogin)
	               }
	    });
	},
	insertUser : function(dataLogin){
		$.ajax({
	            type: 'POST',
	            data: dataLogin,
	            url: serverURL + '/usuarios/createUser',
	            dataType: 'JSON'
	            }).done(function( data ) {
	              ctrl_login.loginUser(data[0])     
	    });
	}

}


var faceLogin = {
	checkFacebook : function(){
		  $.ajax({
			    url: 'https://connect.facebook.net/es_LA/sdk.js',
			    dataType: 'script',
			    cache: true,
			     error: function (xhr, ajaxOptions, thrownError) {
			       faceUser = false;
			      },
			    success: function() {
			      FB.init({
			        appId      : '301914963325646',
          			xfbml      : true,
          			version    : 'v2.3'
			      });
			      // INIT LOGIN
			      FB.getLoginStatus(function(response) {
					  if (response.status === 'connected') {
					   		faceLogin.meFacebook();
					  } else if (response.status === 'not_authorized') {
					    	ctrl_login.genLogin();
							ctrl_login.checkActiveUser();
					  } else {
				       		ctrl_login.genLogin();
							ctrl_login.checkActiveUser();
					  }

				      },true);
			   		}
			    });
	},
	loginFacebook :function(){
		FB.login(function(response) {
			if (response.authResponse) {
				faceLogin.meFacebook();
			} else {
			console.log('User cancelled login or did not fully authorize.');
			}
			}, {scope: 'publish_actions'});
	},
	meFacebook :function(){
		FB.api('/me?fields=name,email', function(data) {			          	
       	faceLogin.getProfileImage();
        logued = true;

        var dataLoginIns = {
        'USERNAME'	: data.id,
        'TYPE'		: 'facebook',
        'NAME' 		: data.name,
        'loc'		: loc
	    };
        ctrl_login.loginUser(dataLoginIns);
      });
	},
	getProfileImage :function() {
	 	var $photo = $('#logInfo');
	 	$photo.empty();
		    FB.api("/me/picture?width=100&height=100",  function(response) {
	   		    profileImage =  response.data.url.split('https://')[1], //remove https to avoid any cert issues
			    randomNumber =  ""
				$photo.append('<img id="fotito" class=\"fb-photo img-polaroid\" src=\"https://' + profileImage + '&' + randomNumber + '\">');
		});  
	},	

}