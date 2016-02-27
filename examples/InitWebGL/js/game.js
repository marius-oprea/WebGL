function Game()
{	
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
		loadScript("../../bin/webgl.js" , onLoadWebGLScript);
	}
	
	function onLoadWebGLScript()
	{
        WebGL.CANVAS_ID = 'canvasId';
        WebGL.CANVAS_RGB = { R :255, G: 0, B:0, ALPHA:1.0};
		WebGL.CANVAS_HEIGHT = 400;
		WebGL.CANVAS_WIDTH = 600;
        
		var renderer = new WebGL.Renderer();
                
        renderer.init();
	}	
}