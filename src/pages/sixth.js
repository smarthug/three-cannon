import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";

import CameraControls from "camera-controls";

CameraControls.install({ THREE: THREE });

let cube, scene, camera, renderer, cameraControls;
const clock = new THREE.Clock();

let textureLoader = new THREE.TextureLoader();
let lightMatCap = textureLoader.load("lightMatCap.png");

export default function Main() {
  const containerRef = useRef();
  useEffect(() => {
    Init();
    Animate();
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

    var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial();
    cube = new THREE.Mesh(geometry, material);
    //scene.add(cube);

    camera.position.z = 5;

    cameraControls = new CameraControls(camera, renderer.domElement);

    var geometry = new THREE.BufferGeometry();
    var numPoints = 100;
    var positions = new Float32Array(numPoints * 3);

    for (var i = 0; i < numPoints; i++) {
      positions[i * 3] = i;
      positions[i * 3 + 1] = Math.sin(i / 2) * 20;
      positions[i * 3 + 2] = 0;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    let mesh = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: 0xffff00 })
    );
    mesh.position.set(-50, 0, -200);
    scene.add(mesh);

    var geometry = new THREE.BoxBufferGeometry(3, 1, 1);
    var material = new THREE.MeshBasicMaterial();
    let sp = new THREE.Mesh(geometry, material);
    sp.position.set(5, 0, 0);
    scene.add(sp);

    // const points = [];
    // for (let j = 0; j < Math.PI; j += (2 * Math.PI) / 100) {
    //   points.push(Math.cos(j), Math.sin(j), 0);
    // }

    const line = new MeshLine();
    line.setPoints(positions);
    console.log(line)

    material = new MeshLineMaterial({
      //   map: lightMatCap,
      //   useMap: true,
      //   sizeAttenuation: true,
      lineWidth: 4,
      //   transparent: true,
    });

       = new THREE.Mesh(line, material);
    scene.add(mesh);

    // var mergedGeo = new THREE.Geometry();

    // mergedGeo.mergeMesh(mesh);

    // scene.add(new THREE.Mesh(mergedGeo, new THREE.MeshBasicMaterial()));
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

  async function  Export() {
    console.log("export");

    // var a = new Blob(["b"])
    // var test = await a.arrayBuffer();

    // console.log(test)
    // const typedArr = new Int8Array(1);

    // console.log(typedArr)


    // var exporter = new OBJExporter();
    // let result = exporter.parse(scene);
    // console.log(result);

    // const url = window.URL.createObjectURL(result);
    // let a = document.createElement("a");
    // a.style.display = "none";
    // a.href = url;
    // // the filename you want
    // a.download = "meshlineTest.obj";
    // document.body.appendChild(a);
    // a.click();
    // window.URL.revokeObjectURL(url);

    var exporter = new OBJExporter();
 
    const result = exporter.parse(scene);
 
    console.log(result);
 
    var element = document.createElement("a");
    element.setAttribute(
        "href",
        "data:text/obj;charset=utf-8," + encodeURIComponent(result)
    );
    element.setAttribute("download", "model.obj");
 
    element.style.display = "none";
    document.body.appendChild(element);
 
    element.click();
 
    document.body.removeChild(element);

    // Instantiate a exporter
    // var exporter = new GLTFExporter();

    // // // Parse the input and generate the glTF output
    // exporter.parse(
    //   scene,
    //   function (gltf) {
    //     console.log(gltf);
    //     //downloadJSON( gltf );
    //     var blob = new Blob([gltf]);

    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     a.style.display = "none";
    //     a.href = url;
    //     // the filename you want
    //     a.download = "test.glb";
    //     document.body.appendChild(a);
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //   },
    //   { includeCustomExtensions: true, binary: true }
    // );
  }

  return (
    <div ref={containerRef}>
      <button onClick={Export}>TEST</button>
    </div>
  );
}
