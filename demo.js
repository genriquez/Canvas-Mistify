(function($){
	var Application = {
		domain: {x:100,y:100},	//Initial domain
		
		_domainChangeHandlers: $.Callbacks(),
		
		_activeShapes: [],
		
		_activePolygons: [],
		
		_frameToggle: false,
	
		updateDomain: function( x, y ){
			if(this.domain.x != x || this.domain.y != y) {
				$.extend(this.domain, {x:x, y:y});
				this._domainChangeHandlers.fire(this.domain);
			}
		},
		
		onDomainChange: function( callback ) {
			this._domainChangeHandlers.add(callback);
		},
		
		doRender: function( canvas ) {
			var self = this;
			this._frameToggle = !this._frameToggle;
			
			//Update polygons to render in this pass
			$.each(this._activeShapes, function(i, shape){
				var polygon = shape.step().getPolygon();
				if(self._frameToggle){	//Only one another polygon generated
					self._activePolygons.push(polygon);
				}
			});

			//Remove old trail polygons
			var maxTrail = 4 * this._activeShapes.length;
			if(this._activePolygons.length > maxTrail){
				this._activePolygons.splice(0, this._activePolygons.length - maxTrail);
			}

			//Render active polygons to canvas			
			$.each(this._activePolygons, function(i, polygon){
				canvas.draw(polygon.getVertexes(), polygon.getColor());
			});
		}
	};
	
	$(document).ready(function(){
		var $body = $("body");
		var $window =$(window);
		var $canvas = $("canvas").drawable(); 
		
		//On window resize readjust the size of the animation
		$window.bind("resize", function() {
			Application.updateDomain($body.innerWidth(), $window.height());
		});
		
		//Canvas must be resized each time the domain is changed
		Application.onDomainChange(function( domain ) {
			$canvas.attr("height", domain.y).attr("width", domain.x);
		})

		//Clear screen after each frame
		$canvas.attachRenderer( function(){
			$canvas.clear();
		});

		//Update shapes and render polygons
		$canvas.attachRenderer(function(canvas){
			Application.doRender(canvas);
		});
		
		//Initialize domain with size of screen
		$window.resize();

		//Add shapes to be rendered
		Application._activeShapes.push(new $.MistifyShape(Application.domain));
		Application._activeShapes.push(new $.MistifyShape(Application.domain));
	});
}(jQuery))