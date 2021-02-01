import * as THREE from "three";
import React, { useEffect, useRef } from "react";

import CameraControls from "camera-controls";

import {Button, makeStyles} from '@material-ui/core'
// import {makeStyle} from '@material-ui/styles'

// 을 통한 무한정의 css 변환 기능 ... 
const useStyle = makeStyles(theme => ({
    Button:{

        // "&.MuiButton-root" : {
        //     color:"red"
        // },
        color:"red",
        "& h1:hover" : {
            color:"blue"
        },
        "& h1>h2:hover" : {
            color:"yellow"
        }
    }
}))

CameraControls.install({ THREE: THREE });

let cube, scene, camera, renderer, cameraControls;
const clock = new THREE.Clock();

export default function Main() {
    const classes = useStyle();
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

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;

    cameraControls = new CameraControls(camera, renderer.domElement);
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

  return <div ref={containerRef}><Button className={classes.Button}>fefe<h1>하이하이<h2>fefef</h2></h1></Button></div>;
}
