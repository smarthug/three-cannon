import * as THREE from "three";
import React, { useEffect, useRef } from "react";

import CameraControls from "camera-controls";
import * as CANNON from 'cannon-es'
// let CameraControls

CameraControls.install({ THREE: THREE });

let cube, scene, camera, renderer, cameraControls, world, mass, body, shape, timeStep=1/60;
const clock = new THREE.Clock();

export default function Main() {
  const containerRef = useRef();
  useEffect(() => {
    Init();
    initCannon();
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
    camera.position.z = 35;

    cameraControls = new CameraControls(camera, renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    const delta = clock.getDelta();
    // const hasControlsUpdated = cameraControls.update(delta);
    cameraControls.update(delta);

    updatePhysics();
    renderer.render(scene, camera);
  }

  return <div ref={containerRef}></div>;
}



function updatePhysics() {

    // Step the physics world
    world.step(timeStep);

    // Copy coordinates from Cannon.js to Three.js
    cube.position.copy(body.position);
    cube.quaternion.copy(body.quaternion);

}


function initCannon() {

    world = new CANNON.World();
    world.gravity.set(0,-0.98,0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
    mass = 1;
    body = new CANNON.Body({
      mass: 1
    });
    body.addShape(shape);
    body.angularVelocity.set(0,10,0);
    body.angularDamping = 0.5;
    body.position.set(0,20,0)
    world.addBody(body);


     // Create a plane
     var groundShape = new CANNON.Plane();
     var groundBody = new CANNON.Body({ mass: 0 });
     //groundBody.position.set(0,4,0)
     groundBody.addShape(groundShape);
     groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
     world.addBody(groundBody);

}