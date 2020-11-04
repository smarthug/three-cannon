import * as THREE from "three";
import React, { useEffect, useRef } from "react";

import CameraControls from "camera-controls";

CameraControls.install({ THREE: THREE });

let cube, scene, camera, renderer, cameraControls;
const clock = new THREE.Clock();


let vertexShader = `
uniform float m
varying vec2 vUv;
void main() {
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;


let fragmentShader = `

// varing float m
float square(float s) { return s * s; }
vec3 square(vec3 s) { return s * s; }


vec3 rainbowGradient(float t) {
  vec3 c = 1.0 - pow(abs(vec3(t) - vec3(0.65, 0.5, 0.2)) * vec3(3.0, 3.0, 5.0), vec3(1.5, 1.3, 1.7));
  c.r = max((0.15 - square(abs(t - 0.04) * 5.0)), c.r);
  c.g = (t < 0.5) ? smoothstep(0.04, 0.45, t) : c.g;
  return clamp(c, 0.0, 1.0);
}

// varying vec2 vUv;

void main() {
  gl_FragColor = vec4(rainbowGradient(${0.5}),0) ;
}
`;

function createMomentumShader(momentum){

    return `

    float square(float s) { return s * s; }
    vec3 square(vec3 s) { return s * s; }
    
    
    vec3 rainbowGradient(float t) {
      vec3 c = 1.0 - pow(abs(vec3(t) - vec3(0.65, 0.5, 0.2)) * vec3(3.0, 3.0, 5.0), vec3(1.5, 1.3, 1.7));
      c.r = max((0.15 - square(abs(t - 0.01) * 5.0)), c.r);
      c.g = (t < 0.5) ? smoothstep(0.04, 0.45, t) : c.g;
      return clamp(c, 0.0, 1.0);
    }
    
    void main() {
    //   gl_FragColor = vec4(rainbowGradient(${momentum}),0) ;
      gl_FragColor = vec4(rainbowGradient(0.8),0) ;
    //   gl_FragColor = vec4(mix(rainbowGradient(0.1), rainbowGradient(0.5), vUv.x), 1.0);
    }
    `
}

let uniforms = {
    u_resolution: { type: "v2", value: new THREE.Vector2() },
    m: { value:0.5}
  };

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
    var geometry = new THREE.PlaneBufferGeometry(5,5);

    // float input , rgb output . [] => ...
    // console.log(rainbowGradient(0.87))
    // var c = rainbowGradient(0.8)
    // var material = new THREE.MeshBasicMaterial({
    //     color: new THREE.Color(c.r,c.g, c.b),
    // });
    // material.side = THREE.DoubleSide
        // uniform 으로 모멘텀 값을 넣자 ... 
    var material = new THREE.ShaderMaterial({
        // vertexShader: vertexShader,
        fragmentShader: createMomentumShader(0.2485),
        side: THREE.DoubleSide,
      });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
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
