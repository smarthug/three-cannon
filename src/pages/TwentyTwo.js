import * as THREE from "three";
import React, { useEffect, useRef } from "react";

import CameraControls from "camera-controls";

// import {FlyControls} from 'three/examples/jsm/controls/FlyControls'
import FlyControls from '../examples/FlyControl'
import InputManager from '../examples/InputManager'

import { threejsKeyboard } from '../examples/keyboardControl'
import Sky from '../examples/Sky'

CameraControls.install({ THREE: THREE });

let cube, scene, camera, renderer, cameraControls, flyControls, inputManager, keyboardBinder, sky;
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

        // var geometry = new THREE.BoxGeometry(1, 1, 1);
        var geometry = new THREE.SphereBufferGeometry(1000, 1000, 1000);
        var material = new THREE.MeshNormalMaterial();
        camera.position.z = 5;
        sky = new Sky();
        console.log(sky)
        // console.log(sky.sky)
        // scene.add(sky.sky)
        
        cube = new THREE.Mesh(geometry, sky.material);
        // cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        const light = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(light);

        cameraControls = new CameraControls(camera, renderer.domElement);
        keyboardBinder = threejsKeyboard(cameraControls);
        keyboardBinder.keyboardBind();
        // inputManager = new InputManager(renderer.domElement)
        // flyControls = new FlyControls(camera, inputManager);

        // spokeControls = new SpokeControls(this.camera, this, this.inputManager, this.flyControls);
        // playModeControls = new PlayModeControls(this.inputManager, this.spokeControls, this.flyControls);
        // spokeControls.enable();
    }

    function Animate() {
        requestAnimationFrame(Animate);
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;

        const delta = clock.getDelta();
        // const hasControlsUpdated = cameraControls.update(delta);
        cameraControls.update(delta);
        // flyControls.update(delta);

        renderer.render(sky, camera);
        // inputManager.reset();
    }

    return <div ref={containerRef}></div>;
}
