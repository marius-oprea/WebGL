WebGL.Renderer = function()
{    
}

WebGL.Renderer.prototype = 
{
    constructor:WebGL.Renderer,
    
    _webGL: null,
    
	initWebGL : function(canvas) 
	{
		var webGL = null;
	  
		try 
		{
			// Try to grab the standard context. If it fails, fallback to experimental.
			webGL = /*canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2") || */canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		}
		catch(e) 
		{
            throw e;
		}
	  
		// If we don't have a GL context, give up now
		if (!webGL) 
		{
			alert("Unable to initialize WebGL. Your browser may not support it.");
			webGL = null;
		}
	  
		return webGL;
	}, 

    init : function()
    {        
        var canvas = document.getElementById(WebGL.CANVAS_ID);
        canvas.width  = WebGL.CANVAS_WIDTH;
        canvas.height = WebGL.CANVAS_HEIGHT;
        
        _webGL = this.initWebGL(canvas); 
        
        if (_webGL) 
        {		
            _webGL.viewport(0, 0, canvas.width, canvas.height);
        
            _webGL.clearColor(WebGL.CANVAS_RGB.R, WebGL.CANVAS_RGB.B, WebGL.CANVAS_RGB.G, WebGL.CANVAS_RGB.ALPHA); // Set clear color to black, fully opaque
            //_webGL.enable(_webGL.DEPTH_TEST);                                                                    // Enable depth testing
            //_webGL.depthFunc(_webGL.LEQUAL);                                                                     // N//ar things obscure far things
            _webGL.clear(_webGL.COLOR_BUFFER_BIT | _webGL.DEPTH_BUFFER_BIT);                                       // Clear the color as well as the depth buffer.
        }        
    }             
}