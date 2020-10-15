var scene, renderer, camera, controls;

init();
animate();

function init()
{	
    
  // basic scene
  renderer = new THREE.WebGLRenderer( {antialias:true} );
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize (width, height);
  renderer.setClearColor( 0x222244, 1);
  document.body.appendChild (renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera (45, width/height, 1, 10000);
  camera.position.y = 16;
  camera.position.z = 100;

  controls = new THREE.OrbitControls (camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  
  // line
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices.push(
    new THREE.Vector3( -10, 0, 0 ),
    new THREE.Vector3( -10, 10, 0 ),
    new THREE.Vector3( 10, 10, 0 ),
    new THREE.Vector3( 10, -10, 0 ),
    new THREE.Vector3( 20, -10, 0 ),
    new THREE.Vector3( 20, 10, 0 ),
    new THREE.Vector3( 30, 10, 0 ),
    new THREE.Vector3( 40, 10, 0 )
  );
  
  var standardLine = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial() );
  //scene.add( standardLine );
  
  var coloredLine = getColoredBufferLine( 0.2, 1.5, lineGeometry );
  scene.add( coloredLine );
  
  /* gui */  
  var options = {
  	steps: 0.2,
    phase: 1.5,
    update: function() {
      changeColor( coloredLine, options );
    }
  };
  
  var gui = new dat.GUI();
  gui.add( options, "steps" ).min( 0 ).max( 1 ).onChange( options.update );
  gui.add( options, "phase" ).min( 0 ).max( 2 * Math.PI ).onChange( options.update );
    
}
// end init

function changeColor( line, options ) {

  var colors = line.geometry.attributes.color.array;
  var segments = line.geometry.attributes.color.count * 3;
  var frequency = 1 /  ( options.steps * segments );
  var color = new THREE.Color();

  for ( var i = 0, l = segments; i < l; i ++ ) {
    color.set ( makeColorGradient( i, frequency, options.phase ) );

    colors[ i * 3 ] = color.r;
    colors[ i * 3 + 1 ] = color.g;
    colors[ i * 3 + 2 ] = color.b;

  }
  
  // update
	line.geometry.attributes[ "color" ].needsUpdate = true;
  
}

// create colored line
// using buffer geometry
function getColoredBufferLine ( steps, phase, geometry ) {

  var vertices = geometry.vertices;
  var segments = geometry.vertices.length;

  // geometry
  var geometry = new THREE.BufferGeometry();

  // material
  var lineMaterial = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

  // attributes
  var positions = new Float32Array( segments * 3 ); // 3 vertices per point
  var colors = new Float32Array( segments * 3 );

  var frequency = 1 /  ( steps * segments );
  var color = new THREE.Color();

  var x, y, z;

  for ( var i = 0, l = segments; i < l; i ++ ) {

    x = vertices[ i ].x;
    y = vertices[ i ].y;
    z = vertices[ i ].z;

    positions[ i * 3 ] = x;
    positions[ i * 3 + 1 ] = y;
    positions[ i * 3 + 2 ] = z;

    color.set ( makeColorGradient( i, frequency, phase ) );

    colors[ i * 3 ] = color.r;
    colors[ i * 3 + 1 ] = color.g;
    colors[ i * 3 + 2 ] = color.b;

	}

  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

  // line
  var line = new THREE.Line( geometry, lineMaterial );

  return line;

}

/* COLORS */			 
function makeColorGradient ( i, frequency, phase ) {  

  var center = 128;
  var width = 127;
	
  var redFrequency, grnFrequency, bluFrequency;
 	grnFrequency = bluFrequency = redFrequency = frequency;
  
  var phase2 = phase + 2;
  var phase3 = phase + 4;

  var red   = Math.sin( redFrequency * i + phase ) * width + center;
  var green = Math.sin( grnFrequency * i + phase2 ) * width + center;
  var blue  = Math.sin( bluFrequency * i + phase3 ) * width + center;

  return parseInt( '0x' + _byte2Hex( red ) + _byte2Hex( green ) + _byte2Hex( blue ) );
}

function _byte2Hex (n) {
  var nybHexString = "0123456789ABCDEF";
  return String( nybHexString.substr( ( n >> 4 ) & 0x0F, 1 ) ) + nybHexString.substr( n & 0x0F, 1 );
}

function animate() {
  requestAnimationFrame ( animate );  
  controls.update();
  renderer.render (scene, camera);
}