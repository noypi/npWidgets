(function(){
	"use strict";

	var npDiagnosisMod = angular.module("npDiagnosis", ['npImageServices']);

	npDiagnosisMod.factory({
		"newDoctor":newDoctorService
	});

	function diagnoseImagSvc() {
		var dbg = this.log.debug;
		var enlargers = document.getElementsByTagName('np-image-enlarge');
		for (var i=0; i<enlargers.length; ++i) {
			var e = angular.element(enlargers[i]);
			dbg("checking label=", e.attr('label'));
			if (! this.valmap.hasOwnProperty(e.attr('label')) ) {
				throw "np-image with label="+e.attr('label')+ " was not registered properly.";
			}
		}
	}

	function diagnoseCommon() {

	}

	newDoctorService.$inject = ['$log', 'npImageSvc'];
	function newDoctorService($log, npImageSvc) {
		var cImagSvc = npImageSvc.DoctorClass();
		cImagSvc.prototype.diagnose = diagnoseImagSvc;

		return new function(){
			this.diagnose = function() {
				try {
					diagnoseCommon();
					(new cImagSvc($log)).diagnose();
					$log.debug("[OK] everything's ok");

				} catch(e) {
					throw "[FAIL] " + e;
				}
			};
		}();
	}

})();
