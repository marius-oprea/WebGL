WebGL.Primitives = function()
{   
    this.points = [];
    this.colors = [];
    this.sizes  = [];
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