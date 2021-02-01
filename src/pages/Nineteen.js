import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";

import CameraControls from "camera-controls";

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { CircularProgress } from '@material-ui/core'

// import workerize from 'workerize'

// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from "workerize-loader!./worker";


var stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

CameraControls.install({ THREE: THREE });

let cube, scene, camera, renderer, cameraControls, geometry, material;
const clock = new THREE.Clock();

// let counter = 0

const randomizeMatrix = function () {

    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    return function (matrix) {

        position.x = Math.random() * 40 - 20;
        position.y = Math.random() * 40 - 20;
        position.z = Math.random() * 40 - 20;

        rotation.x = Math.random() * 2 * Math.PI;
        rotation.y = Math.random() * 2 * Math.PI;
        rotation.z = Math.random() * 2 * Math.PI;

        quaternion.setFromEuler(rotation);

        scale.x = scale.y = scale.z = Math.random() * 1;

        matrix.compose(position, quaternion, scale);

    };

}();



export default function Main() {
    const [value, setValue] = useState(0);
    const containerRef = useRef();
    useEffect(() => {
        Init();
        Animate();

        setInterval(() => {

            // setValue
            // console.log("hello")
            setValue(v => v + 1);
        }, 1000)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function Init() {

        // clean();


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

        geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        material = new THREE.MeshNormalMaterial();
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 5;

        cameraControls = new CameraControls(camera, renderer.domElement);


        // makeMerged(geometry);
    }


    function makeMerged(geometry) {

        const geometries = [];
        const matrix = new THREE.Matrix4();

        for (let i = 0; i < 200000; i++) {

            randomizeMatrix(matrix);

            const instanceGeometry = geometry.clone();
            instanceGeometry.applyMatrix4(matrix);

            geometries.push(instanceGeometry);

        }

        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
        console.log(mergedGeometry)
        scene.add(new THREE.Mesh(mergedGeometry, material));

        //



    }

    function promisedMakeMerged() {
        return new Promise((resolve) => {
            const geometries = [];
            const matrix = new THREE.Matrix4();

            for (let i = 0; i < 200000; i++) {

                randomizeMatrix(matrix);

                const instanceGeometry = geometry.clone();
                instanceGeometry.applyMatrix4(matrix);

                geometries.push(instanceGeometry);

            }

            const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
            resolve(mergedGeometry);
        }).then(mg => {
            console.log("done")
            scene.add(new THREE.Mesh(mg, material));
        })
    }

    function workerizedMakeMerge() {
        // const myWorker = new Worker("worker.js");

        // myWorker.postMessage("hi");

        // myWorker.onmessage = function (e) {
        //     // result.textContent = e.data;
        //     scene.add(new THREE.Mesh(e.data, material));
        //     console.log('Message received from worker');
        // }

        let instance = worker();

        // instance.MakeMerge().then(resp => {
        //     console.log(resp);
        //     // resp.bounding
        //     // resp.boundingSphere =new THREE.Sphere(new THREE.Vector3(0,0,0), 35.06572026630569)

        //     const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(resp);


        //     scene.add(new THREE.Mesh(mergedGeometry, material));
        // })


        instance.MakeMerge(promisedMakeMerged)


    }




    function clean() {

        const meshes = [];

        scene.traverse(function (object) {

            if (object.isMesh) meshes.push(object);

        });

        for (let i = 0; i < meshes.length; i++) {

            const mesh = meshes[i];
            mesh.material.dispose();
            mesh.geometry.dispose();

            scene.remove(mesh);

        }

    }

    function Animate() {

        stats.begin();

        // monitored code goes here

        requestAnimationFrame(Animate);
        // cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        const delta = clock.getDelta();
        // const hasControlsUpdated = cameraControls.update(delta);
        cameraControls.update(delta);

        renderer.render(scene, camera);
        stats.end();
    }

    function Test() {
        console.log("test");
        makeMerged(geometry);
    }

    return <div>
        <div>{value}</div>
        <CircularProgress />
        <div>

            <button onClick={Test}>makeMerged</button>
            <button onClick={promisedMakeMerged}>promisedMakeMerged</button>
            <button onClick={workerizedMakeMerge}>workerizedMakeMerge</button>
            <button onClick={clean}>Clean</button>
        </div>
        <div ref={containerRef}><canvas>
        </canvas></div>
    </div>
}
