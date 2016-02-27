// File:src/WebGL.js

var WebGL = window.WebGL || {};

WebGL = function()
{    
}

WebGL.prototype =
{
    constructor: WebGL
}

WebGL.CANVAS_ID     ='canvasId',
WebGL.CANVAS_WIDTH  = 600,
WebGL.CANVAS_HEIGHT = 400,
	
WebGL.CANVAS_RGB    = { R :255, G: 0, B:255, ALPHA:1.0}
// File:src/Renderer.js

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
// File:src/Program.js

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
// File:src/Shader.js

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
// File:src/Primitives.js

WebGL.Primitives = function()
{   
    this.points = [];
    this.colors = [];
    this.sizes  = [];
 
	this.pointSize = 4;   
}

WebGL.Primitives.prototype = 
{
    constructor: WebGL.Primitives,
    
    addColor: function(r, g, b, u)
    {        
        this.colors.push(r);
        this.colors.push(g);
        this.colors.push(b);
        this.colors.push(u);        
    },
    
    addPoint: function(x, y, z)
    {
        this.points.push(x);
        this.points.push(y);
        this.points.push(z);
    },

    addSize: function(size)
    {
        this.sizes.push(size);
    },
   
    drawPoints: function()
	{                            
		var vertexString =   'attribute vec3 aVertexPosition;' +
                             'attribute vec4 aVertexColor;' +   
                             'attribute float aVertexSize;' +                           
                             'varying vec4 vColor;' + 
							 '' +
							 'void main() ' +
							 '{ ' +
							 '' +                            
                             '    gl_PointSize = aVertexSize;'+
                             '    gl_Position = vec4(aVertexPosition, 1.0);' +
                             '    vColor = aVertexColor;' +
							 '}';                             


		var fragmentString = 'precision mediump float;' +
                             'varying vec4 vColor;'+
                             '' +
                             'void main(void)' +
							 '{' +
                             '    gl_FragColor = vColor;' + 
							 '}';
    
        // setup GLSL program
		var p = new WebGL.Program();
		var program = p.createProgram(vertexString, fragmentString);
        
		_webGL.useProgram(program);


		// look up where the vertex data needs to go.
		var vertexPositionAttribute = _webGL.getAttribLocation(program, 'aVertexPosition');               
        var vertexColorAttribute    = _webGL.getAttribLocation(program, 'aVertexColor');
        var vertexSizeAttribute     = _webGL.getAttribLocation(program, 'aVertexSize');

        // position                
		var vertexPosBuffer = _webGL.createBuffer();
		_webGL.bindBuffer(_webGL.ARRAY_BUFFER, vertexPosBuffer);
        _webGL.enableVertexAttribArray(vertexPositionAttribute);
        _webGL.vertexAttribPointer(vertexPositionAttribute, 3, _webGL.FLOAT, false, 0, 0);  

        var vertices = this.points;
		_webGL.bufferData(_webGL.ARRAY_BUFFER, new Float32Array(vertices), _webGL.STATIC_DRAW);	

                    
        // colors
        var vertexColorBuffer = _webGL.createBuffer();
        _webGL.bindBuffer(_webGL.ARRAY_BUFFER, vertexColorBuffer);
        _webGL.enableVertexAttribArray(vertexColorAttribute);
        _webGL.vertexAttribPointer(vertexColorAttribute, 4, _webGL.FLOAT, false, 0, 0);

        var colors = this.colors;
        _webGL.bufferData(_webGL.ARRAY_BUFFER, new Float32Array(colors), _webGL.STATIC_DRAW);
   
        // size
        var vertexSizeBuffer = _webGL.createBuffer();
        _webGL.bindBuffer(_webGL.ARRAY_BUFFER, vertexSizeBuffer);
        _webGL.enableVertexAttribArray(vertexSizeAttribute);
        _webGL.vertexAttribPointer(vertexSizeAttribute, 1, _webGL.FLOAT, false, 0, 0);

        var sizes = this.sizes;
        _webGL.bufferData(_webGL.ARRAY_BUFFER, new Float32Array(sizes), _webGL.STATIC_DRAW);

        // draw points
        _webGL.drawArrays(_webGL.POINTS, 0, vertices.length / 3);			
	}    
}
