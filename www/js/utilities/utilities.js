// ADDO UTILS 2015  rlm.com.mx

var utils = {
/*--------------------------------------------------------------------
* GUID GENERATOR 
-------------------------------------------------------------------*/
    guid:function() {
        function _p8(s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
            return _p8() + _p8(true) + _p8(true) + _p8();
        },

    generateUUID: function() {
            var S4 = function() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (new Date().getTime() + '-' + S4() + S4() + S4());
        },

/* ----------------------------------------------------------------------
*   COOKIE READER
*  --------------------------------------------------------------------*/
    setCookie :function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "Expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; "  + expires;
    },

    getCookie : function(cname,defaultVal) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
        }
        if(defaultVal){
            return defaultVal;
        }else {
        return ""; } 
    },
/* --------------------------------------------------------------------------
 *   BASE 58 GEN
 *  ------------------------------------------------------------------------*/
    base58 : function(alpha) {
        var alphabet = alpha || '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
            base = alphabet.length;
        return {
            encode: function(enc) {
                if (typeof enc !== 'number' || enc !== parseInt(enc))
                    throw '"encode" only accepts integers.';
                var encoded = '';
                while (enc) {
                    var remainder = enc % base;
                    enc = Math.floor(enc / base);
                    encoded = alphabet[remainder].toString() + encoded;
                }
                return encoded;
            },
            decode: function(dec) {
                if (typeof dec !== 'string')
                    throw '"decode" only accepts strings.';
                var decoded = 0;
                while (dec) {
                    var alphabetPosition = alphabet.indexOf(dec[0]);
                    if (alphabetPosition < 0)
                        throw '"decode" can\'t find "' + dec[0] + '" in the alphabet: "' + alphabet + '"';
                    var powerOf = dec.length - 1;
                    decoded += alphabetPosition * (Math.pow(base, powerOf));
                    dec = dec.substring(1);
                }
                return decoded;
            }
        };
    },
/* ----------------------------------------------------------------------
*   TIME UTILS
*  --------------------------------------------------------------------*/
    generateTS: function() {
    return Math.round(+new Date() / 1000);
    },

    timeConverter : function(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    if(Object.prototype.toString.call(a)  === '[object Date]' && isFinite(a)){
    var months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = utils.pad(a.getHours(),2);
    var min = utils.pad(a.getMinutes(),2);
    var sec = utils.pad(a.getSeconds(),2);
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
    } else { return ""}
    
    },
    // Zero Pad
    pad : function(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
},
/* ----------------------------------------------------------------------
*   URL STRING
*  --------------------------------------------------------------------*/

    getURLparams: function(){
        var obj = {};
        var str = location.search.substring(1); 
        str.replace(/([^=&]+)=([^&]*)/g, function(m, key, value) {
            obj[decodeURIComponent(key)] = decodeURIComponent(value);
        }); 
        return obj;
     },   
    setURL:function(key,value){
        var url = new Url;
        url.query[key] = value;
        return url;
    },
    removeParam:function(key){
        var url = new Url;
        delete url.query[key];
        return url;
    },
    changeURL : function(url){
        window.location = url
    },
    removeObjArr : function(arr, prop, value) {
    for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        if (obj[prop] == value) {
                arr.splice(i, 1);
        }
    }
}
/* ----------------------------------------------------------------------
*   
*  --------------------------------------------------------------------*/
    



}
/* ----------------------------------------------------------------------
*   System UTILS
*  --------------------------------------------------------------------*/
