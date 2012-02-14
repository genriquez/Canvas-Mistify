(function( $ ) {
	var animationCallbacks = $.Callbacks();
	var onFrameUpdate = function(timestamp) {
		animationCallbacks.fire(timestamp);
		webkitRequestAnimationFrame(onFrameUpdate);
	};
	
	onFrameUpdate(0);
	
	$.fn.drawable = function() {
		var self = this;

		this.draw = function( coordinates, color ) {
			//TODO: Implement drawing strategies
			self.each(function() {
				var context = this.getContext("2d");
				context.setStrokeColor("rgb(" + color.join(",") + ")");
				context.beginPath();
				
				$.each(coordinates, function(index, coordinate){
					if(index == 0) { //First coordinate
						context.moveTo(coordinate.x + 0.5, coordinate.y + 0.5);
					} else {
						context.lineTo(coordinate.x + 0.5, coordinate.y + 0.5);
					}
				});
				
				context.lineTo(coordinates[0].x + 0.5, coordinates[0].y + 0.5)
				
				context.stroke();
			});
		};
		
		/**
		 * Attaches a fucntion to the rendering cycle of the element
		 * @param {Function} renderingFunction Function to be executed on each rendering frame
		 * @return {jQuery} Wrapped jQuery element for chaining
		 */
		this.attachRenderer = function( renderingFunction ) {
			animationCallbacks.add(function( timestamp ) {
				renderingFunction(self, timestamp);
			});
			
			return self;
		};
		
		this.clear = function() {
			self.each(function() {
				var context = this.getContext("2d")
				context.clearRect(0,0,this.width, this.height);
			});			
		};
		
		return this;
	};
}(jQuery));