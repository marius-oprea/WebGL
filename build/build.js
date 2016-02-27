var fs = require("fs");
var path = require("path");
var argparse =  require( "argparse" );
var uglify = require("uglify-js");
var spawn = require('child_process').spawn;

function main() {

	"use strict";

	var parser = new argparse.ArgumentParser();
	parser.addArgument( ['--include'], { action: 'append', required: true } );
	//parser.addArgument( ['--externs'], { action: 'append', defaultValue: ['./externs/common.js'] } );
	parser.addArgument( ['--amd'], { action: 'storeTrue', defaultValue: false } );
	parser.addArgument( ['--minify'], { action: 'storeTrue', defaultValue: false } );
	parser.addArgument( ['--output'], { defaultValue: '../bin/webgl.js' } );
	parser.addArgument( ['--sourcemaps'], { action: 'storeTrue', defaultValue: true } );

	
	var args = parser.parseArgs();
	
	var output = args.output;
	console.log(' * Building ' + output);
	
	var sourcemap = '';
	var sourcemapping = '';

	var buffer = [];
	var sources = []; // used for source maps with minification
    	
	for ( var i = 0; i < args.include.length; i ++ ){
		
		var contents = fs.readFileSync( './includes/' + args.include[i] + '.json', 'utf8' );
                
		var files = JSON.parse( contents );

		for ( var j = 0; j < files.length; j ++ ){

			//var file = '../../' + files[ j ];
            var file = '../' + files[ j ];
            
            console.log('file: ' + file);
			
			buffer.push('// File:' + files[ j ]);
			buffer.push('\n\n');

			contents = fs.readFileSync( file, 'utf8' );

			sources.push( { file: file, contents: contents } );
			buffer.push( contents );
			buffer.push( '\n' );
		}

	}
	
	var temp = buffer.join( '' );
	

	fs.writeFileSync( output, temp, 'utf8' );
}

main();
