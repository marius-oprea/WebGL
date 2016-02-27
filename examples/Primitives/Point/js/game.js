function Game()
{	
    var _webGL  = null;
	var _drawGL = null;
	
	this.init = function()
	{		
		if (window.addEventListener) 
		{
			window.addEventListener('load', onLoad, false);
		}
		else if (window.attachEvent) 
		{
			window.attachEvent('onload', onLoad );
		}
	}
	
	function onLoad()
	{
        loadScript("../../../bin/webgl.js" , onLoadWebGLScript);
	}
	
	function onLoadWebGLScript()
	{
        WebGL.CANVAS_ID = 'canvasId';
        WebGL.CANVAS_RGB = { R :255, G: 0, B:255, ALPHA:1.0};
		WebGL.CANVAS_HEIGHT = 400;
		WebGL.CANVAS_WIDTH = 600;
        
		var renderer = new WebGL.Renderer();
                
        renderer.init();
        
		drawPoint();
	}
	
	function drawPoint()
	{
        var primitives = new WebGL.Primitives();



        // 100 random points of random sizes, colors and positions
        var i = 0;
        var len = 100;
        for (; i < len; i++)        
        {
        	primitives.addSize(random(1, 10));
			primitives.addColor(Math.random(), Math.random(), Math.random(), 1);
            primitives.addPoint(random(-1, 1), random(-1, 1), 0.0);
        }


		// center
    	primitives.addSize(10);
		primitives.addColor(0, 0, 0, 1);
        primitives.addPoint(0, 0, 0.0);

        // right center
    	primitives.addSize(10);
		primitives.addColor(0, 0, 0, 1);
        primitives.addPoint(1, 0, 0.0);

        // right up
    	primitives.addSize(10);
		primitives.addColor(0, 0, 0, 1);
        primitives.addPoint(1, 1, 0.0);    

        // top center
        primitives.addSize(10);
		primitives.addColor(0, 0, 0, 1);
        primitives.addPoint(0, 1, 0.0); 

       	// left center
        primitives.addSize(10);
		primitives.addColor(0, 0, 0, 1);
        primitives.addPoint(-1, 0, 0.0);        

        // bottom center
        primitives.addSize(10);
		primitives.addColor(0, 0, 0, 1);
        primitives.addPoint(0, -1, 0.0);    

        // bottom left
        primitives.addSize(10);
		primitives.addColor(0, 0, 0, 1);
        primitives.addPoint(-1, -1, 0.0); 

        // top left
        primitives.addSize(10);
		primitives.addColor(0, 0, 0, 1);
        primitives.addPoint(-1, 1, 0.0); 

        // bottom right
        primitives.addSize(10);
		primitives.addColor(0, 0, 0, 1);
        primitives.addPoint(1, -1, 0.0);             


        // render the points on screen
        primitives.drawPoints();
	}
    
    function random(min, max)
    {
         return (Math.random() * (max - min + 1)) + min; 
    }
}