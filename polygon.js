(function($) {

	var PolygonClass = function( vertexes, color ) {
		this.getVertexes = function() {
			return vertexes;
		};
		
		this.getColor = function() {
			return color;
		};
		
		this.blend = function( polygon, proportion ) {
			var blendVertexes = [];
			var targetVertexes = polygon.getVertexes();
			
			if(vertexes.length != targetVertexes.length) {
				throw "Polygon blending requires source and target polygons to have the same amount of vertexes.";
			}
			
			$.each(vertexes, function(i, sourceVertex) {
				var targetVertex = targetVertexes[i];
				blendVertexes.push({
					x: sourceVertex.x * (1 - proportion) + targetVertex.x * proportion,
					y: sourceVertex.y * (1 - proportion) + targetVertex.y * proportion
				});
			});
			
			var blendColor = [];
			var targetColor = polygon.getColor();
			$.each(color, function(i,channel) {
				blendColor.push(Math.ceil(channel * (1 - proportion) + targetColor[i] * proportion));
			});
			
			return new PolygonClass(blendVertexes, blendColor);
		};
	};
	
	$.Polygon = $.extend(PolygonClass,{
		createRandomPolygon: function( domain, numFaces ) {
			var vertexes = [];
			for(var i = 0; i < numFaces; i++) {
				vertexes.push({
					x: Math.random() * domain.x,
					y: Math.random() * domain.y
				});
			}
			
			var color = [];
			for(var i = 0; i < 3; i++) {
				color.push(Math.random() * 255);
			}
			
			return new PolygonClass(vertexes, color);
		}
	});
}(jQuery))