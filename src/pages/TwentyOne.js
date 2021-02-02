import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";

import CameraControls from "camera-controls";

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { CircularProgress, Fade, Dialog } from '@material-ui/core'

import { useSnackbar } from "notistack";

// import workerize from 'workerize'

// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from "workerize-loader!./worker";

import { useTaskManager } from '../examples/taskManager'
// import { enqueue, close } from '../examples/notify'
// import { notifyAPI } from '../examples/notify/MessageType'

import async from 'async';

import './twenty.css'
import clsx from 'clsx'
import { ArrayCollisionMatrix } from "cannon-es";



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
    // const [value, setValue] = useState(0);
    const [loading, setLoading] = React.useState(false);
    const containerRef = useRef();
    const testRef = useRef();
    const [pushTask, status, unShiftTask] = useTaskManager();


    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // useEffect(() => {

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);



    useEffect(() => {
        Init();
        Animate();

        // setInterval(() => {

        //     // setValue
        //     // console.log("hello")
        //     setValue(v => v + 1);
        // }, 1000)

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
        const canvas = ('OffscreenCanvas' in window) ? containerRef.current.transferControlToOffscreen() : containerRef.current;
        canvas.style = { width: 0, height: 0 }
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        // renderer.setSize(100,100);
        // containerRef.current.appendChild(renderer.domElement);

        geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        material = new THREE.MeshNormalMaterial();
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 5;

        cameraControls = new CameraControls(camera, containerRef.current);


        // makeMerged(geometry);
    }

    function TaskManagerTest() {
        // enqueue();
        unShiftTask(enqueueSnackbar, "holy");
        // setTimeout(() => {

        //     pushTask(makeMerged, geometry);
        //     pushTask(closeSnackbar);
        // }, 100);
        pushTask(TimeBuffer, 100);
        pushTask(makeMerged, geometry);
        pushTask(closeSnackbar);
    }


    // 사용자 디바이스 별로 ?
    function TimeBuffer(time) {
        return new Promise(resolve => {

            setTimeout(() => {

                resolve(time);
            }, time);
        })
    }


    function makeMerged(geometry) {
        console.time('hi')
        const geometries = [];
        const matrix = new THREE.Matrix4();

        for (let i = 0; i < 10000; i++) {

            randomizeMatrix(matrix);

            const instanceGeometry = geometry.clone();
            instanceGeometry.applyMatrix4(matrix);

            geometries.push(instanceGeometry);

        }
        console.timeLog('hi')

        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
        console.log(mergedGeometry)
        scene.add(new THREE.Mesh(mergedGeometry, material));

        //

        console.timeEnd('hi')

    }

    async function promisedMakeMerged() {
        CreateButton();
        // setTimeout(() => {
        //     _promisedMakeMerged()
        // },100)

        setTimeout(() => {
            _promisedMakeMerged()
        },10)
    }

    function _promisedMakeMerged() {
        let key;
        // key = enqueueSnackbar("hello", { persist: true })
        return new Promise((resolve) => {


            const geometries = [];
            const matrix = new THREE.Matrix4();


            for (let i = 0; i < 150000; i++) {

                randomizeMatrix(matrix);

                const instanceGeometry = geometry.clone();
                instanceGeometry.applyMatrix4(matrix);

                geometries.push(instanceGeometry);

            }

            const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);

            resolve(mergedGeometry);


        })
            .then((mergedGeometry) => {

                // return mergedGeometry;

                scene.add(new THREE.Mesh(mergedGeometry, material));
                // closeSnackbar(key)
                // console.log("done");
            })
            .then(mg => {
                console.log("final")
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

    function asyncLibTest() {

        let key = []


        // create a queue object with concurrency 2
        // var q = async.queue(function (task, callback) {
        //     console.log('hello ' + task.name);
        //     key.push( task.fn(task.name, { persist: true }))
        //     callback();
        // }, 1);

        // // add some items to the queue
        // q.push({ name: 'foo', fn: enqueueSnackbar }, function (err) {
        //     console.log('finished processing foo');
        // });

        // q.push({ name: 'mer', fn: promisedMakeMerged }, function (err) {
        //     console.log('finished processing mer');
        //     // closeSnackbar(key)
        // });

        // // assign a callback
        // q.drain(function () {
        //     console.log("end??");
        //     closeSnackbar(key[0])
        // });

        let test;

        var q = async.priorityQueue(function (task, callback) {
            console.log('hello ' + task.name);
            key.push(task.fn(task.name, { persist: true }))
            callback();
        }, 1);

        // add some items to the queue
        q.push({ name: 'foo', fn: enqueueSnackbar }, 1, function (err) {
            console.log('finished processing foo');
        });

        // q.push({ name: 'hi', fn: enqueueSnackbar }, 2, function (err) {
        //     console.log('finished processing foo');
        // })

        //web gpu 가 해결해줄 문제 ...
        // q.push({
        //     name: 'hi', fn: () => {
        //         setTimeout(() => {
        //             test = 999;

        //         }, 5000)
        //         return test;
        //     }
        // }, 2, function (err) {
        //     console.log(test)
        //     console.log('finished processing foo');
        // })

        q.push({ name: 'mer', fn: Test }, 10, function (err) {
            console.log('finished processing mer');
            // closeSnackbar(key)
        });

        // assign a callback
        q.drain(function () {
            console.log("end??");
            closeSnackbar(key[0])
        });
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
        let key;
        // console.log("test");
        setImmediate(enqueueSnackbar)
        const startEvent = new Event('start');
        const mergeEvent = new Event('merge');
        let elem = document.createElement('div');
        elem.addEventListener('start', function () {
            key = enqueueSnackbar("hello", { persist: true })
            setLoading(true)

        })

        elem.addEventListener('merge', function () {
            makeMerged(geometry);

        })

        elem.dispatchEvent(startEvent);
        // setTimeout(() => {

        //     elem.dispatchEvent(mergeEvent);
        // })
        elem.dispatchEvent(mergeEvent);
        // key = enqueueSnackbar("hello", {persist:true})


    }

    return (
        <div>
            <div id={"testRef"} className={clsx({ clsx: loading })} ref={testRef}>works</div>
            {/* <div>{value}</div> */}
            {/* <CircularProgress /> */}
            
            <div>
                <button onClick={Test}>makeMerged</button>
                <button onClick={promisedMakeMerged}>promisedMakeMerged</button>
                <button onClick={workerizedMakeMerge}>workerizedMakeMerge</button>
                <button onClick={TaskManagerTest}>TaskManagerTest</button>
                <button onClick={asyncLibTest}>asyncLibTest</button>
                <button onClick={clean}>Clean</button>
            </div>
            <Dialog open={false}>
                <div>hello Modal</div>
            </Dialog>
            <div >
                <canvas style={{zIndex:1}} ref={containerRef} />

            </div>
        </div>

    )
}



function CreateButton() {
    const a = document.createElement("button");
    a.style.position = "absolute";
    // a.style.top = 400;
    // a.style.left = 400;

    a.style.top = 0;
    a.style.left = 0;
    a.style.width = "200px";
    a.style.height = "200px";
    a.style.zIndex = 2000;
    document.body.appendChild(a);
}