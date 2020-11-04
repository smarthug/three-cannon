import * as THREE from "three";
import React, { useEffect, useRef } from "react";

import CameraControls from "camera-controls";

import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
console.log(BufferGeometryUtils);

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

    var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    var material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);
    camera.position.z = 5;

    cameraControls = new CameraControls(camera, renderer.domElement);

    // test code
    var geometry2 = new THREE.CylinderBufferGeometry(1, 1, 5, 32);
    geometry2.translate(0,3,0)
    var material2 = new THREE.MeshNormalMaterial({ color: 0xffff00 });
    const cylinder = new THREE.Mesh(geometry2, material2);
    // cylinder.position.set(0,3,0)
    // scene.add(cylinder);
    let mGeo =  BufferGeometryUtils.mergeBufferGeometries([geometry,geometry2])
    let mMesh = new THREE.Mesh(mGeo, material);
    scene.add(mMesh)
  }

  function Animate() {
    requestAnimationFrame(Animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    const delta = clock.getDelta();
    // const hasControlsUpdated = cameraControls.update(delta);
    cameraControls.update(delta);

    renderer.render(scene, camera);
  }

  return <div ref={containerRef}></div>;
}

function BufferGeometryUtilsTest() {}
