WebGL.Program = function()
{    
}

WebGL.Program.prototype = 
{
    constructor: WebGL.Program,
    
	createProgram: function(vertexString, fragmentString) 
	{
		var program = _webGL.createProgram();
		
        var s = new WebGL.Shader();
		var vshader = s.createShader(vertexString, _webGL.VERTEX_SHADER);		
		var fshader = s.createShader(fragmentString, _webGL.FRAGMENT_SHADER);
		
		_webGL.attachShader(program, vshader);
		_webGL.attachShader(program, fshader);
		
		_webGL.linkProgram(program);
		
		if (!_webGL.getProgramParameter(program, _webGL.LINK_STATUS)) 
		{
			throw _webGL.getProgramInfoLog(program);
		}
		
		return program;
	}    
}