(function(){
	"use strict";

	var npImgSvcMod = angular.module("npImageServices", []);

	npImgSvcMod.service({
		"npImageSvc": npImageService
	});

	npImageService.$inject = ['$log'];
	function npImageService($log) {
		var valmap = {};
		var fnmap = {};
		var event_onmovemap = {};
		var enlarge_objmap = {};

		return {
			Set: function(label, o) {
				valmap[label] = o;
				if (fnmap.hasOwnProperty(label)) {
					var fnarr = fnmap[label];
					for(var i in fnarr) {
						fnarr[i](o);
					}
				}
			},
			SetEnlarger:function(label, o) {
				enlarge_objmap[label] = o;
			},
			GetEnlarger:function(label) {
				return enlarge_objmap[label];
			},
			Watch: function(label, fn) {
				if ( !fnmap.hasOwnProperty(label) ) {
					fnmap[label] = [];
				}
				fnmap[label].push(fn);
			},
			Has:function(label) {
				return valmap.hasOwnProperty(label);
			},
			OnMove:function(label,x,y) {
				if (event_onmovemap.hasOwnProperty(label)) {
					var fnarr = event_onmovemap[label];
					for(var i in fnarr) {
						fnarr[i](x,y,valmap[label]);
					}
				}
			},
			RegisterOnMove:function(label, fn) {
				if ( !event_onmovemap.hasOwnProperty(label) ) {
					event_onmovemap[label] = [];
				}
				event_onmovemap[label].push(fn);
			},
			// use to make diagnosis
			DoctorClass:function() {
				return function(logger) {
					this.log = logger;
					this.valmap = valmap;
					this.fnmap = fnmap;
					this.event_onmovemap = event_onmovemap;
					this.enlarge_objmap = enlarge_objmap;
				};
			}
		};
	}
})();
