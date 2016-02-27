WebGL.Scene = function () 
{
	WebGL.Object3D.call( this );

	this.type = 'Scene';

	this.fog = null;
	this.overrideMaterial = null;

	this.autoUpdate = true; // checked by the renderer

};

WebGL.Scene.prototype = Object.create( WebGL.Object3D.prototype );
WebGL.Scene.prototype.constructor = WebGL.Scene;

WebGL.Scene.prototype.copy = function ( source, recursive ) 
{
	WebGL.Object3D.prototype.copy.call( this, source, recursive );

	if ( source.fog !== null ) this.fog = source.fog.clone();
	if ( source.overrideMaterial !== null ) this.overrideMaterial = source.overrideMaterial.clone();

	this.autoUpdate = source.autoUpdate;
	this.matrixAutoUpdate = source.matrixAutoUpdate;

	return this;
};
