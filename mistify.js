(function($) {
	var FACES_PER_SHAPE = 4	;
	var TRANSITION_AVERAGE_SPEED = 1;
	
	$.MistifyShape = function(domain) {
		var step = 0;
		var stepsForCycle = 200;
		
		var sourcePolygon = new $.Polygon.createRandomPolygon(domain, FACES_PER_SHAPE);
		var targetPolygon = new $.Polygon.createRandomPolygon(domain, FACES_PER_SHAPE);
		
		var shiftPolygon = function() {
			sourcePolygon = targetPolygon;
			targetPolygon = new $.Polygon.createRandomPolygon(domain, FACES_PER_SHAPE);
			stepsForCycle = Math.ceil(100 + Math.random() * 50 / TRANSITION_AVERAGE_SPEED);
		};
		
		var calculateCycleProportion = function() {
			return step / stepsForCycle;
		};
		
		$.extend(this, {
			step: function() {
				step++;
				
				if(step == stepsForCycle) {
					step = 0;
					shiftPolygon();
				}
				
				return this;
			},
			
			getPolygon: function() {
				return sourcePolygon.blend(targetPolygon, calculateCycleProportion());
			}
		})
	};
	
	$.MistifyShape.setup = function(config){
		FACES_PER_SHAPE = config.faceCount;
		TRANSITION_AVERAGE_SPEED = config.speed;
	};
	
}(jQuery));