import * as THREE from "three";
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';




export async function MakeMerge(fn) {

    // const randomizeMatrix = function () {

    //     const position = new THREE.Vector3();
    //     const rotation = new THREE.Euler();
    //     const quaternion = new THREE.Quaternion();
    //     const scale = new THREE.Vector3();

    //     return function (matrix) {

    //         position.x = Math.random() * 40 - 20;
    //         position.y = Math.random() * 40 - 20;
    //         position.z = Math.random() * 40 - 20;

    //         rotation.x = Math.random() * 2 * Math.PI;
    //         rotation.y = Math.random() * 2 * Math.PI;
    //         rotation.z = Math.random() * 2 * Math.PI;

    //         quaternion.setFromEuler(rotation);

    //         scale.x = scale.y = scale.z = Math.random() * 1;

    //         matrix.compose(position, quaternion, scale);

    //     };

    // }();
    // const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    // // geometry.computeBoundingSphere();

    // const geometries = [];
    // const matrix = new THREE.Matrix4();

    // for (let i = 0; i < 200000; i++) {

    //     randomizeMatrix(matrix);

    //     const instanceGeometry = geometry.clone();
    //     instanceGeometry.applyMatrix4(matrix);

    //     geometries.push(instanceGeometry);

    // }

    // // const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);

    // // scene.add(new THREE.Mesh(mergedGeometry, material));

    // return geometries;

    fn()
}