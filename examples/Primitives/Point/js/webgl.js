/////////////////
// WebGL class //
/////////////////
var WebGL = WebGL || {};

var WebGL = function()
{	
	this._webGL;
	this._canvas;
	this.canvasColor = [255,255,255];
	this.canvasOpacity = 1;
	this.canvasX = 0;
	this.canvasY = 0;
	this.canvasWidth = 300;
	this.canvasHeight = 150;
	this.canvasId = "canvasId";
		/*
	this.canvasColor = function(value)
	{
		this._canvasColor = value;
	}		
		*/
	this.init = function()
	{
		_canvas = document.getElementById(this._canvasId);
		
		if (!_canvas)
		{
			_canvas = document.createElement( 'canvas' );
			document.body.appendChild( _canvas );
		}
		
		_canvas.x = this.canvasX;
		_canvas.y = this.canvasY;
		_canvas.width  = this.canvasWidth;
		_canvas.height = this.canvasHeight;
		
		_webGL = initWebGL(_canvas); 
		
		if (_webGL) 
		{		
			_webGL.viewport( this.canvasX, this.canvasY, this.canvasWidth, this.canvasHeight);
		
			_webGL.clearColor(this.canvasColor[0], this.canvasColor[1], this.canvasColor[2], this.canvasOpacity); // Set clear color to black, fully opaque
			//_webGL.enable(_webGL.DEPTH_TEST);                                            // Enable depth testing
			//_webGL.depthFunc(_webGL.LEQUAL);                                             // N//ar things obscure far things
			_webGL.clear(_webGL.COLOR_BUFFER_BIT | _webGL.DEPTH_BUFFER_BIT);               // Clear the color as well as the depth buffer.
		}		
	}		
	
	function initWebGL(canvas) 
	{
		var webGL = null;
	  
		try 
		{
			// Try to grab the standard context. If it fails, fallback to experimental.
			webGL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		}
		catch(e) 
		{
		}
	  
		// If we don't have a GL context, give up now
		if (!webGL) 
		{
			alert("Unable to initialize WebGL. Your browser may not support it.");
			webGL = null;
		}
	  
		return webGL;
	}						
};

///////////////////////
// WebGL.Utils class //
///////////////////////
WebGL.Utils = 
{
	createShader: function(str, type) 
	{
		var shader = _webGL.createShader(type);
		
		_webGL.shaderSource(shader, str);
		_webGL.compileShader(shader);
		
		var compiled = _webGL.getShaderParameter(shader, _webGL.COMPILE_STATUS);
		
		if (!compiled) 
		{
			//throw _webGL.getShaderInfoLog(shader);
			window.console.log(_webGL.getShaderInfoLog(shader));
			return null;			
		}
		
		return shader;
	},
	createProgram : function(vertexString, fragmentString) 
	{
		var program = _webGL.createProgram();
		
		var vshader = this.createShader(vertexString, _webGL.VERTEX_SHADER);		
		var fshader = this.createShader(fragmentString, _webGL.FRAGMENT_SHADER);
		
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

/////////////////////////////
// WebGL.display namespace //
/////////////////////////////
WebGL.display = function(){}

//////////////////////////////////
// WebGL.display.Graphics class //
//////////////////////////////////
WebGL.display.Graphics = function()
{
    this.fillColor = [0,0,0];
	this.fillTransparency = 1;
	this.pointSize = 1;
    this.drawPoint = function(x, y)
	{		
		var vertexString =   'attribute vec2 aVertexPosition;' +
							 'uniform vec2 uVertexResolution;' +
							 '' +
							 'void main() ' +
							 '{ ' +
							 '    vec2 zeroToOne = aVertexPosition / uVertexResolution;' +
							 '    vec2 zeroToTwo = zeroToOne * 2.0;' +
							 '    vec2 clipSpace = zeroToTwo - 1.0;' +
							 '' +
							 '    gl_PointSize = ' + this.pointSize + '.0;' +
							 '    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);' +
							 '}';
		
		var fragmentString = 'precision mediump float;' +
							 '' +
							 'void main()' +
							 '{' +
                             '    gl_FragColor = vec4(' + this.fillColor[0] + ',' + this.fillColor[1] + ',' + this.fillColor[2] + ',' + this.fillTransparency + ');' +
							 '}';
		
		var program = WebGL.Utils.createProgram(vertexString, fragmentString);
		_webGL.useProgram(program);
		
		var positionLocation = _webGL.getAttribLocation(program, 'aVertexPosition');
        // set the resolution
        var resolutionLocation = _webGL.getUniformLocation(program, "uVertexResolution");
        _webGL.uniform2f(resolutionLocation, _canvas.width, _canvas.height);

		var vertexPosBuffer = _webGL.createBuffer();
		_webGL.bindBuffer(_webGL.ARRAY_BUFFER, vertexPosBuffer);	

		var vertices = [x, y];					   
					   
		_webGL.bufferData(_webGL.ARRAY_BUFFER, new Float32Array(vertices), _webGL.STATIC_DRAW);	  
  
		_webGL.enableVertexAttribArray(positionLocation);
		  
		_webGL.vertexAttribPointer(positionLocation, 2, _webGL.FLOAT, false, 0, 0);

		_webGL.drawArrays(_webGL.POINTS, 0, 1);		
	}	
		
	this.drawRect = function(x, y, width, height)
	{	
	    // ATTENTION do not embed comments into the vertex and shaders programs
		var vertexString =   'attribute vec2 aVertexPosition;' +
							 'uniform vec2 uVertexResolution;' +
							 '' +
							 'void main() ' +
							 '{ ' +
							 '    vec2 zeroToOne = aVertexPosition / uVertexResolution;' +
							 '' +
							 '    vec2 zeroToTwo = zeroToOne * 2.0;' +
							 '' +
							 '    vec2 clipSpace = zeroToTwo - 1.0;' +
							 '' +
							 '' +
							 '    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);' +
							 '}';
							 			 
		var fragmentString = 'precision mediump float;' +
							 '' +
							 'void main()' +
							 '{' +
                             '    gl_FragColor = vec4(' + this.fillColor[0] + ',' + this.fillColor[1] + ',' + this.fillColor[2] + ',' + this.fillTransparency + ');' +
							 '}';							 
							 
		var program = WebGL.Utils.createProgram(vertexString, fragmentString);
				
		_webGL.useProgram(program);
		var positionLocation = _webGL.getAttribLocation(program, 'aVertexPosition');	

        // set the resolution
        var resolutionLocation = _webGL.getUniformLocation(program, "uVertexResolution");
        _webGL.uniform2f(resolutionLocation, _canvas.width, _canvas.height);		

		var vertexPosBuffer = _webGL.createBuffer();
		
		_webGL.bindBuffer(_webGL.ARRAY_BUFFER, vertexPosBuffer);
					
		var x1 = x;
		var x2 = x + width;
		var y1 = y;
		var y2 = y + height;
					
		var vertices = [			   
						 x1, y1,
						 x2, y1,
						 x1, y2,
						 x1, y2,
						 x2, y1,
						 x2, y2
					   ];					  	  
					   
		_webGL.bufferData(_webGL.ARRAY_BUFFER, new Float32Array(vertices), _webGL.STATIC_DRAW);	  
  
		_webGL.enableVertexAttribArray(positionLocation);
		  
		_webGL.vertexAttribPointer(positionLocation, 2, _webGL.FLOAT, false, 0, 0);

		_webGL.drawArrays(_webGL.TRIANGLES, 0, 6);	
	};
}
/*

//////////////////////
// WebGL.Draw class //
//////////////////////
WebGL.Draw = function()
{
	this.gradientTriangle = function(points)
	{
		var vertexPosBuffer = _webGL.createBuffer();
		_webGL.bindBuffer(_webGL.ARRAY_BUFFER, vertexPosBuffer);
		
		var vertices = [points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y];
		_webGL.bufferData(_webGL.ARRAY_BUFFER, new Float32Array(vertices), _webGL.STATIC_DRAW);
		
		var vertexString =   'attribute vec2 pos;' +
							 'varying vec2 vTexCoord;' +
							 '' +
							 'void main() ' +
							 '{ ' +
							 '	  vTexCoord = pos ;' +							 
							 '    gl_Position = vec4(pos, 0, 1);' +
							 '}';
				 
		var fragmentString = 'precision mediump float;' +
							 'varying vec2 vTexCoord;' +
							 '' +
							 'void main()' +
							 '{' +
							 '    gl_FragColor = vec4(vTexCoord, 0, 1);' +
							 '}';	
							 
		var program = WebGL.Utils.createProgram(vertexString, fragmentString);		

		_webGL.useProgram(program);
		program.vertexPosAttrib = _webGL.getAttribLocation(program, 'pos');
		_webGL.enableVertexAttribArray(program.vertexPosAttrib);
		_webGL.vertexAttribPointer(program.vertexPosAttrib, 2, _webGL.FLOAT, false, 0, 0);
		_webGL.drawArrays(_webGL.TRIANGLES, 0, points.length);
	}	
	
	this.triangle = function(points, color)
	{
		var vertexPosBuffer = _webGL.createBuffer();
		_webGL.bindBuffer(_webGL.ARRAY_BUFFER, vertexPosBuffer);
		
		var vertices = [points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y];
		_webGL.bufferData(_webGL.ARRAY_BUFFER, new Float32Array(vertices), _webGL.STATIC_DRAW);
		
		var vertexString =   'attribute vec2 pos;' +
							 '' +
							 'void main() ' +
							 '{ ' +							 
							 '    gl_Position = vec4(pos, 0, 1);' +
							 '}';
				 
		var fragmentString = 'precision mediump float;' +
							 '' +
							 'void main()' +
							 '{' +
							 '    gl_FragColor = vec4(' + color.R + ',' + color.G + ',' + color.B + ',' + color.A + ');' +
							 '}';	
							 
		var program = WebGL.Utils.createProgram(vertexString, fragmentString);		

		_webGL.useProgram(program);
		program.vertexPosAttrib = _webGL.getAttribLocation(program, 'pos');
		_webGL.enableVertexAttribArray(program.vertexPosAttrib);
		_webGL.vertexAttribPointer(program.vertexPosAttrib, 2, _webGL.FLOAT, false, 0, 0);
		_webGL.drawArrays(_webGL.TRIANGLES, 0, 3);
	}
	
	this.gradientQuad = function(points)
	{
		var vertexPosBuffer = _webGL.createBuffer();		
		_webGL.bindBuffer(_webGL.ARRAY_BUFFER, vertexPosBuffer);
		
		var vertices = [points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y];		
		_webGL.bufferData(_webGL.ARRAY_BUFFER, new Float32Array(vertices), _webGL.STATIC_DRAW);
	
		var vertexString =   'attribute vec2 aVertexPosition;' +
							 'varying vec2 vTexCoord;' +
							 '' +
							 'void main() ' +
							 '{ ' +
							 '	  vTexCoord = aVertexPosition;' +
							 '    gl_Position = vec4(aVertexPosition, 0, 1);' +
							 '}';
				 
		var fragmentString = 'precision mediump float;' +
							 'varying vec2 vTexCoord;' +
							 '' +
							 'void main()' +
							 '{' +
							 '    gl_FragColor = vec4(vTexCoord, 0, 1);' +
							 '}';	
							 
		var program = WebGL.Utils.createProgram(vertexString, fragmentString);
		
		_webGL.useProgram(program);
		program.vertexPosAttrib = _webGL.getAttribLocation(program, 'aVertexPosition');	
		_webGL.enableVertexAttribArray(program.vertexPosAttrib);
		_webGL.vertexAttribPointer(program.vertexPosAttrib, 2, _webGL.FLOAT, false, 0, 0);

		// 4 is the number of points
		_webGL.drawArrays(_webGL.TRIANGLE_STRIP, 0, points.length);	
	}
	
	this.rectangle = function(x, y, width, height, color)
	{
		var vertexPosBuffer = _webGL.createBuffer();
		
		_webGL.bindBuffer(_webGL.ARRAY_BUFFER, vertexPosBuffer);
		
		var vertices = [
		                 points[0].x, points[0].y, 
						 points[1].x, points[1].y, 
						 points[2].x, points[2].y, 
						 points[3].x, points[3].y,
						 points[4].x, points[4].y,
						 points[5].x, points[5].y
					   ];	
					   
		_webGL.bufferData(_webGL.ARRAY_BUFFER, new Float32Array(vertices), _webGL.STATIC_DRAW);	
		
		var vertexString =   'attribute vec2 aVertexPosition;' +
		                     'uniform vec2 uVertexResolution;' +
							 '' +
							 'void main() ' +
							 '{ ' +
							 '    // convert the rectangle from pixels to 0.0 to 1.0' +
                             '    vec2 zeroToOne = aVertexPosition / uVertexResolution;' +
							 '' +
							 '    // convert from 0->1 to 0->2' +
                             '    vec2 zeroToTwo = zeroToOne * 2.0;' +
							 '' +
							 '    // convert from 0->2 to -1->+1 (clipspace)' +
                             '    vec2 clipSpace = zeroToTwo - 1.0;' +
							 '' +
							 '    // coordinates for 3D graphics' +
							 '    //gl_Position = vec4(clipSpace, 0, 1);' +
							 '' +
							 '    // coordinates for 2D graphics' +
							 '    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);' +
							 '}';
				 
		var fragmentString = 'precision mediump float;' +
							 '' +
							 'void main()' +
							 '{' +
							 '    gl_FragColor = vec4(' + color.R + ',' + color.G + ',' + color.B + ',' + color.A + ');' +
							 '}';	
							 
		var program = WebGL.Utils.createProgram(vertexString, fragmentString);
		
		_webGL.useProgram(program);
		program.vertexPosAttrib = _webGL.getAttribLocation(program, 'aVertexPosition');		

		_webGL.enableVertexAttribArray(program.vertexPosAttrib);
		  
		_webGL.vertexAttribPointer(program.vertexPosAttrib, 2, _webGL.FLOAT, false, 0, 0);

        _webGL.drawArrays(_webGL.TRIANGLES, 0, points.length);	
	}	
	
	this.quad1 = function(points, color)
	{
		var vertexPosBuffer = _webGL.createBuffer();
		
		_webGL.bindBuffer(_webGL.ARRAY_BUFFER, vertexPosBuffer);
		
		var vertices = [
		                 points[0].x, points[0].y, 
						 points[1].x, points[1].y, 
						 points[2].x, points[2].y, 
						 points[3].x, points[3].y,
						 points[4].x, points[4].y,
						 points[5].x, points[5].y
					   ];	
					   
		_webGL.bufferData(_webGL.ARRAY_BUFFER, new Float32Array(vertices), _webGL.STATIC_DRAW);	
		
		var vertexString =   'attribute vec2 aVertexPosition;' +
							 '' +
							 'void main() ' +
							 '{ ' +
							 '    gl_Position = vec4(aVertexPosition, 0, 1);' +
							 '}';
				 
		var fragmentString = 'precision mediump float;' +
							 '' +
							 'void main()' +
							 '{' +
							 '    gl_FragColor = vec4(' + color.R + ',' + color.G + ',' + color.B + ',' + color.A + ');' +
							 '}';	
							 
		var program = WebGL.Utils.createProgram(vertexString, fragmentString);
		
		_webGL.useProgram(program);
		program.vertexPosAttrib = _webGL.getAttribLocation(program, 'aVertexPosition');		

		_webGL.enableVertexAttribArray(program.vertexPosAttrib);
		  
		_webGL.vertexAttribPointer(program.vertexPosAttrib, 2, _webGL.FLOAT, false, 0, 0);

        _webGL.drawArrays(_webGL.TRIANGLES, 0, points.length);	
	}
	
	this.quad = function(points, color)
	{
		var vertexPosBuffer = _webGL.createBuffer();		
		_webGL.bindBuffer(_webGL.ARRAY_BUFFER, vertexPosBuffer);
		
		var vertices = [points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y];		
		_webGL.bufferData(_webGL.ARRAY_BUFFER, new Float32Array(vertices), _webGL.STATIC_DRAW);
	
		var vertexString =   'attribute vec2 aVertexPosition;' +
							 '' +
							 'void main() ' +
							 '{ ' +
							 '    gl_Position = vec4(aVertexPosition, 0, 1);' +
							 '}';
				 
		var fragmentString = 'precision mediump float;' +
							 '' +
							 'void main()' +
							 '{' +
							 '    gl_FragColor = vec4(' + color.R + ',' + color.G + ',' + color.B + ',' + color.A + ');' +
							 '}';	
							 
		var program = WebGL.Utils.createProgram(vertexString, fragmentString);
		
		_webGL.useProgram(program);
		program.vertexPosAttrib = _webGL.getAttribLocation(program, 'aVertexPosition');
		_webGL.enableVertexAttribArray(program.vertexPosAttrib);
		_webGL.vertexAttribPointer(program.vertexPosAttrib, 2, _webGL.FLOAT, false, 0, 0);
		// 4 is the number of points
		_webGL.drawArrays(_webGL.TRIANGLE_STRIP, 0, points.length);	
	}	
	
	this.texturedQuad = function(points, texturePath)
	{			
		var vertexString =   'attribute vec2 aVertexPosition;' +
							 'varying vec2 vTexCoord;' +
							 '' +
							 'void main() ' +
							 '{ ' +
							 '    vTexCoord = aVertexPosition;' +
							 '    gl_Position = vec4(aVertexPosition, 0, 1);' +
							 '}';
				 
		var fragmentString = 'precision mediump float;' +
							 'varying vec2 vTexCoord;' +
							 'uniform sampler2D uSampler;' +
							 '' +
							 'void main()' +
							 '{' +
							 '    gl_FragColor = texture2D(uSampler, vTexCoord);' +
							 '}';		
	
		
		var vertexPosBuffer = _webGL.createBuffer();
		_webGL.bindBuffer(_webGL.ARRAY_BUFFER, vertexPosBuffer);
		var vertices = [points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y];
		_webGL.bufferData(_webGL.ARRAY_BUFFER, new Float32Array(vertices), _webGL.STATIC_DRAW);
		vertexPosBuffer.itemSize = 2;
		vertexPosBuffer.numItems = points.length;		
		
		var program = WebGL.Utils.createProgram(vertexString,fragmentString);
		_webGL.useProgram(program);
		program.vertexPosAttrib = _webGL.getAttribLocation(program, 'aVertexPosition');
		program.samplerUniform = _webGL.getUniformLocation(program, 'uSampler');
		_webGL.enableVertexAttribArray(program.vertexPosArray);
		_webGL.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, _webGL.FLOAT, false, 0, 0);	
	
		var texture = _webGL.createTexture();
		var img = new Image();
		
		img.onload = function() 
		{
		  _webGL.activeTexture(_webGL.TEXTURE0);
		  _webGL.bindTexture(_webGL.TEXTURE_2D, texture);
		  _webGL.pixelStorei(_webGL.UNPACK_FLIP_Y_WEBGL, true);
		  _webGL.texImage2D(_webGL.TEXTURE_2D, 0, _webGL.RGBA, _webGL.RGBA, _webGL.UNSIGNED_BYTE, img);
		  _webGL.texParameteri(_webGL.TEXTURE_2D, _webGL.TEXTURE_MAG_FILTER, _webGL.LINEAR);
          _webGL.texParameteri(_webGL.TEXTURE_2D, _webGL.TEXTURE_MIN_FILTER, _webGL.LINEAR);
          _webGL.texParameteri(_webGL.TEXTURE_2D, _webGL.TEXTURE_WRAP_S, _webGL.CLAMP_TO_EDGE);
          _webGL.texParameteri(_webGL.TEXTURE_2D, _webGL.TEXTURE_WRAP_T, _webGL.CLAMP_TO_EDGE);
		  _webGL.uniform1i(program.samplerUniform, 0);
		  _webGL.drawArrays(_webGL.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
		}
		
		img.src = texturePath;
	}
}
*/