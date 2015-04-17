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
(function(){
	"use strict";

	var npImageWidgetsMod = angular.module("npImageWidgets.Enlarger", ['npImageServices'])

	npImageWidgetsMod.directive({
		"npImage": npImageDirective,
		"npImageEnlarge": npImageEnlargeDirective
	});

	npImageDirective.$inject = ['$log','npImageSvc'];
	function npImageDirective($log, npImageSvc) {
		return {
			restrict:'E',
			scope: {
				label:'@',
				src:'@',
				width:'@',
				height:'@',
				click:'&npOnclick',
				enter:'&npOnenter',
				leave:'&npOnleave'
			},
			template:'<div style="z-index:1000"></div>',
			replace:true,
			controller:['$log','$scope','$element',function($log,$scope,$element) {
				var indiv = false;
				this.Move = function(x, y) {
					var scale;
					var indivW;
					var indivH;
					$scope.$applyAsync(function(){
						$scope.enter();
					})
					if (!indiv) {
						indiv = angular.element("<div></div>");
						indiv.on("click", function(e){
							$scope.$applyAsync(function(){
								$scope.click();
							});
						});

						$element.prepend(indiv);
						indiv.css({
							backgroundColor:"rgb(84, 84, 224)",
							zIndex:1000,
							opacity:0.25
						});
						indiv.on("mousemove", function(e){
							var left = parseInt(indiv.css("left"));
							var top = parseInt(indiv.css("top"));
							if (isNaN(left)) {
								left = 0;
							}
							if (isNaN(top)) {
								top = 0;
							}
							var w2 = (parseInt(indiv.css("width"))/2);
							var h2 = (parseInt(indiv.css("height"))/2);
							var w = parseInt($scope.width);
							var h = parseInt($scope.height);
							var offsetX = e.offsetX==undefined?e.layerX:e.offsetX;
							var offsetY = e.offsetY==undefined?e.layerY:e.offsetY;
							var dx = offsetX - w2;
							var dy = offsetY - h2;
							var nuleft = left+dx;
							var nutop = top+dy;
							var tol = 5;
							if (nuleft<=(w+tol) && (-indivW-tol)<=nuleft) {
								indiv.css({left:nuleft+"px"});
							} else {
								indiv.css({display:'none'})
								$scope.$applyAsync(function(){
									$scope.leave();
								});
							}
							if (nutop<=(h+tol) && (-indivH-tol)<=nutop) {
								indiv.css({top:nutop+"px"});
							} else {
								indiv.css({display:'none'})
								$scope.$applyAsync(function(){
									$scope.leave();
								});
							}

							npImageSvc.OnMove($scope.label, nuleft, nutop);

						});
					} else {
						indiv.css('display', '');
					}
					var enlargerObj = npImageSvc.GetEnlarger($scope.label);
					if (!angular.isDefined(enlargerObj)) {
						return;
					}
					scale = enlargerObj.scale;
					var indivW = enlargerObj.width/scale;
					var indivH = enlargerObj.height/scale;
					var indivLeft = x-(indivW/2);
					var indivTop = y-(indivH/2);
					//$log.debug("x=", x, "y=", y)
					indiv.css({
						width:indivW+"px",
						height:indivH+"px",
						left:indivLeft+"px",
						top:indivTop+"px",
						position:"absolute"
					});

				}
			}],
			link: {
				post:  function(scope, el, attrs, ctrl) {
					var imgsrcEl = angular.element("<img src='"+scope.src+"'>");
					el.append(imgsrcEl);
					if (angular.isString(scope.width) &&  0<scope.width.length) {
						imgsrcEl.css("width", scope.width);
					}
					if (angular.isString(scope.height) && 0<scope.height.length) {
						imgsrcEl.css("height", scope.height);
					}
					imgsrcEl.css("zIndex", 1000);

					npImageSvc.Set(scope.label, {
							w: scope.width,
							h: scope.height,
							label:scope.label,
							src:scope.src
					})
					imgsrcEl.on("mousemove", function(e){
						var isChanged = false;
						if (angular.isUndefined(scope.height)) {
							scope.height = imgsrcEl.prop("height");
							isChanged = true;
						}
						if (angular.isUndefined(scope.width)) {
							scope.width = imgsrcEl.prop("width");
							isChanged = true;
						}
						if (isChanged) {
							npImageSvc.Set(scope.label, {
								w: scope.width,
								h: scope.height,
								label:scope.label,
								src:scope.src
							})
						}
						var offsetX = e.offsetX==undefined?e.layerX:e.offsetX;
						var offsetY = e.offsetY==undefined?e.layerY:e.offsetY;
						ctrl.Move(offsetX, offsetY);
						npImageSvc.OnMove(scope.label, offsetX, offsetY);
					});

				}
			}
		}
	}

	npImageEnlargeDirective.$inject = ['$log', 'npImageSvc'];
	function npImageEnlargeDirective($log, npImageSvc) {
		return {
			restrict:'E',
			scope:{
				width:'@npWidth',
				height:'@npHeight',
				label:'@',
				zoomperc:'@',
				srcEnlarged:'@'
			},
			controller: ['$scope','$element',function($scope,$element){
				var label = $scope.label;
				var imgEl = false;
				this.Move = function(x,y,o) {
					var enlargerObj = npImageSvc.GetEnlarger($scope.label);
					if (!imgEl) {
						var src =  (angular.isString($scope.srcEnlarged) && 0<$scope.srcEnlarged.length) ? $scope.srcEnlarged : o.src;
						imgEl = angular.element("<img src='"+src+"'/>");
						imgEl.css({
							width:(o.w*enlargerObj.scale)+"px",
							height:(o.h*enlargerObj.scale)+"px",
							position:"absolute"
						})
						$element.append(imgEl);
					}
					var csso = {
						left:(-(x*enlargerObj.scale))+"px",
						top:(-(y*enlargerObj.scale))+"px"
					}
					imgEl.css(csso);
				}
			}],
			link: {
				post: function(scope, el, attrs, ctrl) {
					if ( !(0<parseInt(scope.width)) ) {
						scope.width = 200;
					}
					if ( !(0<parseInt(scope.height)) ) {
						scope.height = 200;
					}
					//$log.debug("attrs style", attrs['style']);
					if ( !npImageSvc.Has(scope.label) ) {
						throw "cannot find label="+scope.label;
					}
					el.css({
						width:scope.width+"px",
						height:scope.height+"px",
						position:"absolute",
						overflow:"hidden"
					});
					npImageSvc.SetEnlarger(scope.label, {
						width: scope.width,
						height: scope.height,
						zoomperc:scope.zoomperc,
						scale: 1+(scope.zoomperc/100)
					});
					npImageSvc.RegisterOnMove(scope.label, ctrl.Move)
				}
			}
		};
	}

})();
