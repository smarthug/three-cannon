import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import * as dat from "dat.gui";
import CameraControls from "camera-controls";

CameraControls.install({ THREE: THREE });

let cube, scene, camera, renderer, cameraControls;
const clock = new THREE.Clock();

export default function Main() {
  const containerRef = useRef();
  useEffect(() => {
    Init();
    Animate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function Init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    var geometry = new THREE.PlaneBufferGeometry(5, 20, 32);
    var material = new THREE.MeshNormalMaterial({side:2});
    cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);
    camera.position.z = 50;

    cameraControls = new CameraControls(camera, renderer.domElement);

    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(-10, 10, 0),
      new THREE.Vector3(10, 10, 0),
      new THREE.Vector3(10, -10, 0),
      new THREE.Vector3(20, -10, 0),
      new THREE.Vector3(20, 10, 0),
      new THREE.Vector3(30, 10, 0),
      new THREE.Vector3(40, 10, 0)
    );

    // var planeGeo = new THREE.PlaneBufferGeometry( 5, 20, 32)
    var planeGeo = new THREE.PlaneBufferGeometry(1, 1, 32);

    var coloredLine = getColoredBufferLine(0.2, 1.5, planeGeo);
    scene.add(coloredLine);

    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);

    // changeColor(coloredLine, { steps: 0.2, phase: 1.5 });

    /* gui */
    var options = {
      steps: 0.2,
      phase: 1.5,
      update: function () {
        changeColor(coloredLine, options);
      },
    };

    var gui = new dat.GUI();
    gui.add(options, "steps").min(0).max(1).onChange(options.update);
    gui
      .add(options, "phase")
      .min(0)
      .max(2 * Math.PI)
      .onChange(options.update);
  }

  function Animate() {
    requestAnimationFrame(Animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    const delta = clock.getDelta();
    // const hasControlsUpdated = cameraControls.update(delta);
    cameraControls.update(delta);

    renderer.render(scene, camera);
  }

  return <div ref={containerRef}></div>;
}

function changeColor(line, options) {
  var colors = line.geometry.attributes.color.array;
  var segments = line.geometry.attributes.color.count * 3;
  var frequency = 1 / (options.steps * segments);
  var color = new THREE.Color();

  for (var i = 0, l = segments; i < l; i++) {
    color.set(makeColorGradient(i, frequency, options.phase));

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  // update
  line.geometry.attributes["color"].needsUpdate = true;
}

// create colored line
// using buffer geometry
function getColoredBufferLine(steps, phase, geometry) {
  var vertices = geometry.attributes.position.array;
  console.log(geometry)
  var segments = geometry.attributes.position.array.length/3;

  // geometry
  var geometry = new THREE.PlaneBufferGeometry(5, 20, 32);
//   var geometry = new THREE.BufferGeometry();

  // material
  var lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors,
  });

  // mesh mat
  var meshMaterial = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    color: 0xf5f5f5,
    vertexColors: true,
  });

  // attributes
  var positions = new Float32Array(segments * 3); // 3 vertices per point
  var colors = new Float32Array(segments * 3);

  var frequency = 1 / (steps * segments);
  var color = new THREE.Color();

  var x, y, z;

  for (var i = 0, l = segments; i < l; i++) {
    x = vertices[i*3 ];
    y = vertices[i*3 + 1];
    z = vertices[i*3 + 2];

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    color.set(makeColorGradient(i, frequency, phase));

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // line
//   var line = new THREE.Line(geometry, lineMaterial);
//   return line;

  // mesh
    var mesh = new THREE.Mesh(geometry, meshMaterial);
    console.log(mesh)

    return mesh;
}

/* COLORS */
function makeColorGradient(i, frequency, phase) {
  var center = 128;
  var width = 127;

  var redFrequency, grnFrequency, bluFrequency;
  grnFrequency = bluFrequency = redFrequency = frequency;

  var phase2 = phase + 2;
  var phase3 = phase + 4;

  var red = Math.sin(redFrequency * i + phase) * width + center;
  var green = Math.sin(grnFrequency * i + phase2) * width + center;
  var blue = Math.sin(bluFrequency * i + phase3) * width + center;

  return parseInt("0x" + _byte2Hex(red) + _byte2Hex(green) + _byte2Hex(blue));
}

function _byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return (
    String(nybHexString.substr((n >> 4) & 0x0f, 1)) +
    nybHexString.substr(n & 0x0f, 1)
  );
}
