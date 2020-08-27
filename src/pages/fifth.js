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


    var singleGeo = new THREE.Geometry();


    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshNormalMaterial({wireframe:true});
    var tcube1 = new THREE.Mesh(geometry, material);
    //scene.add(cube);

    var geometry2 = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshNormalMaterial({wireframe:true});
    // var geo3 = geometry2.mergeMesh(cube)
    var tcube2 = new THREE.Mesh(geometry2, material);
    tcube2.position.set(0.5,0,0)

      tcube1.updateMatrix();
      singleGeo.mergeMesh(tcube1)
      tcube2.updateMatrix();
      singleGeo.mergeMesh(tcube2)
      singleGeo.mergeVertices();

      scene.add(new THREE.Mesh(singleGeo, material))


    
    //scene.add(cube);

    var x = 0,
      y = 0,
      z=0
    var heartShape = new THREE.Shape();

    heartShape.moveTo(x + 5, y + 5, z+5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    console.log(heartShape)
    console.log(heartShape[0])

    // 이함수를 사용하는것이외에 선택지는 없다 ..... 
    console.log(heartShape.extractPoints(16))

    var geometry = new THREE.ShapeGeometry(heartShape, 16);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe:true });
    var mesh = new THREE.Mesh(geometry, material);
    //scene.add(mesh);

    //cube.mergeMesh(mesh)

    camera.position.z = 5;

    cameraControls = new CameraControls(camera, renderer.domElement);
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
