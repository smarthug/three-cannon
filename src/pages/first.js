import * as THREE from "three";
import React, { useEffect, useRef } from "react";

import CameraControls from "camera-controls";
// let CameraControls

CameraControls.install({ THREE: THREE });

let cube, scene, camera, renderer, cameraControls;
const clock = new THREE.Clock();

export default function Main() {
  const containerRef = useRef();
  useEffect(() => {
    Init();
    animate();
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

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;

    // renderer.render(scene, camera);

    // import("camera-controls").then((module) => {
    //   console.log(module);
    //   // CameraControls = module.default();
    //   module.default().install({ THREE: THREE });
    //   cameraControls = new module.default()(camera, renderer.domElement);
    // });

    cameraControls = new CameraControls(camera, renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // snip
    const delta = clock.getDelta();
    // const hasControlsUpdated = cameraControls.update(delta);
    cameraControls.update(delta);

    // requestAnimationFrame(animate);

    // // you can skip this condition to render though
    // // if (hasControlsUpdated) {
    // //   renderer.render(scene, camera);
    // // }

    renderer.render(scene, camera);
  }

  return <div ref={containerRef}>이호형과 공부</div>;
}
