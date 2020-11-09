import * as THREE from "three";
import React, { useEffect, useRef } from "react";

import CameraControls from "camera-controls";

// Testing , npm link , and camera controls fitTo customization ...

CameraControls.install({ THREE: THREE });

let cube, cone, scene, camera, renderer, cameraControls;
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
    camera.up.fromArray([0, 0, 1]);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshNormalMaterial({ wireframe: true });
    cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);
    var geometry = new THREE.ConeBufferGeometry(5, 20, 32);
    // var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    cone = new THREE.Mesh(geometry, material);
    scene.add(cone);
    camera.position.z = 5;

    const axesHelper = new THREE.AxesHelper(30);
    scene.add(axesHelper);

    cameraControls = new CameraControls(camera, renderer.domElement);

    // cameraControls.minPolarAngle = -Math.PI * 2;
    // cameraControls.maxPolarAngle = Math.PI * 2;

    // cameraControls.minPolarAngle = -Math.PI * 2;
    // cameraControls.maxPolarAngle = Math.PI *2;
    cameraControls.maxPolarAngle = Infinity;

    cameraControls.minAzimuthAngle = -Infinity;
    cameraControls.maxAzimuthAngle = Infinity;

    cameraControls.updateCameraUp();
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

  return (
    <div ref={containerRef}>
      <button onClick={MyFitTo}>FitToBox</button>
      <button onClick={MyFitTo2}>FitToSphere</button>
      <button onClick={Rotator}>Rotate</button>
    </div>
  );
}

function MyFitTo() {
  console.log("FitTo");

  cameraControls.fitToBox(cone, false);
  // 1단계 성공!
  //   cameraControls.fitToBox(cone, false, {
  //     nearAxis: false,
  //     theta: 0,
  //     phi: 0,
  //   });

  //   cameraControls.fitToBox(cone, false , {
  //     nearAxis:false,
  //     theta:0,
  //     phi: Math.PI/2
  // });
  // 2단계 성공 , npm build 만으로 변화 주기 ....
  //   cameraControls.fitToSphere(cone, false);
}

function MyFitTo2() {
  console.log("FitTo");

  // 1단계 성공!
  //   cameraControls.fitToBox(cone, false);
  // 2단계 성공 , npm build 만으로 변화 주기 ....
  cameraControls.fitToSphere(cone, false);
}

function Rotator() {
  console.log("Rotator");

  // 1단계 성공!
  cameraControls.rotate(0, Math.PI * 4, true);
  // 2단계 성공 , npm build 만으로 변화 주기 ....
}


