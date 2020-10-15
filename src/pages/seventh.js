import * as THREE from "three";
import React, { useEffect, useRef } from "react";

import CameraControls from "camera-controls";
import { Lut } from "three/examples/jsm/math/Lut.js";
// let CameraControls

//heatmap test with lookup table ... 

CameraControls.install({ THREE: THREE });

let cube, scene, camera, renderer, cameraControls, lut;
var params
const clock = new THREE.Clock();

export default function Main() {
  const containerRef = useRef();
  useEffect(() => {
    Init();
    Animate();
  }, []);

  function Init() {
    params = {
        colorMap: "rainbow",
      };
    lut = new Lut();
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

    var pointLight = new THREE.PointLight(0xffffff, 1);
    camera.add(pointLight);

    var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    geometry.center();
    geometry.computeVertexNormals();

    // default color attribute
    var colors = [];
    for (var i = 0, n = geometry.attributes.position.count; i < n; ++i) {
      colors.push(1, 1, 1);
    }
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    var pressure = [];
    for (var i = 0, n = geometry.attributes.position.count; i < n; ++i) {
      pressure.push(2000);
    }
    geometry.setAttribute("pressure", new THREE.Float32BufferAttribute(pressure, 3))
    var material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: 0xf5f5f5,
        vertexColors: true,
      }));
      updateColors();
    scene.add(cube);
    camera.position.z = 5;

    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

    // renderer.render(scene, camera);

    // import("camera-controls").then((module) => {
    //   console.log(module);
    //   // CameraControls = module.default();
    //   module.default().install({ THREE: THREE });
    //   cameraControls = new module.default()(camera, renderer.domElement);
    // });

    cameraControls = new CameraControls(camera, renderer.domElement);
  }


  function updateColors() {
    lut.setColorMap(params.colorMap);
  
    lut.setMax(2000);
    lut.setMin(0);
  
    var geometry = cube.geometry;
    var pressures = geometry.attributes.pressure;
    var colors = geometry.attributes.color;
    for (var i = 0; i < pressures.array.length; i++) {
      var colorValue = pressures.array[i];
  
      var color = lut.getColor(colorValue);
  
      if (color === undefined) {
        console.log("Unable to determine color for value:", colorValue);
      } else {
        colors.setXYZ(i, color.r, color.g, color.b);
      }
    }
  
    colors.needsUpdate = true;
  
    // var map = sprite.material.map;
    // lut.updateCanvas(map.image);
    // map.needsUpdate = true;
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
