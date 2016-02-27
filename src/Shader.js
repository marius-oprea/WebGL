WebGL.Shader = function()
{    
}

WebGL.Shader.prototype = 
{
    constructor: WebGL.Shader,
    
	createShader: function(str, type) 
	{
		var shader = _webGL.createShader(type);
		
		_webGL.shaderSource(shader, str);
		_webGL.compileShader(shader);
		
		var compiled = _webGL.getShaderParameter(shader, _webGL.COMPILE_STATUS);
		
		if (!compiled) 
		{
			throw _webGL.getShaderInfoLog(shader);
			return null;			
		}
		
		return shader;
	}    
}