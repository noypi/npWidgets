(function(){
	"use strict";

	var npGoogMapServicesMod = angular.module("npGoogMapServices", []);

	function InsertGoogMap(key,ver) {
		var headEl = angular.element(document.getElementsByTagName('head')[0]);
		var scr = document.createElement('script');
		scr.setAttribute('type', 'text/javascript');
		if (angular.isUndefined(ver) {
			ver = "3.19";
		}
		scr.setAttribute('src', "https://maps.googleapis.com/maps/api/js?key="+key+"&v="+ver);
		headEl.append(scr)
	}

	alert("ok")
	
	/*
	var loadjQuery = function(cb){
   if(typeof(jQuery) == 'undefined'){
     var scr = document.createElement('script');
     scr.setAttribute('type', 'text/javascript');
     scr.setAttribute('src', 'http://code.jquery.com/jquery-latest.js');

     if(scr.readyState){
        scr.onreadystatechange = function(){
            if(scr.readyState === 'complete' || scr.readyState === 'loaded'){
               scr.onreadystatechange = null;
               if(cb === 'function'){
                  args = [].slice.call(arguments, 1);
                  cb.apply(this, args);
               }
            }
        };
     }
     else {
        scr.onload = function(){
           if(cb === 'function'){
              args = [].slice.call(arguments, 1);
              cb.apply(this, args);
           }
        };
     }

     var head = document.getElementsByTagName('head')[0];
     head.insertBefore(scr, head.firstChild);  
   }
}
	*/

})();
