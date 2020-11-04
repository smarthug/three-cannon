import * as THREE from "three";
import React, { useEffect, useRef } from "react";

import CameraControls from "camera-controls";

CameraControls.install({ THREE: THREE });

let cube, scene, camera, renderer, cameraControls;
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
    // scene.background = new THREE.Color(0xf0f0f0); // UPDATED
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    var geometry = new THREE.PlaneBufferGeometry(2, 2);

    let uniforms = {
      u_resolution: { type: "v2", value: new THREE.Vector2() },
    };

    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;

    // uniforms.u_resolution.value.x = 500;
    // uniforms.u_resolution.value.y = 500;

    let vertexShader = `
    varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
  `;

    let fragmentShader = `

    float square(float s) { return s * s; }
    vec3 square(vec3 s) { return s * s; }
    uniform vec2 u_resolution;
    
  

    vec3 heatmapGradient(float t) {
      return clamp((pow(t, 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0)), 0.0, 1.0);
    }

    vec3 rainbowGradient(float t) {
      vec3 c = 1.0 - pow(abs(vec3(t) - vec3(0.65, 0.5, 0.2)) * vec3(3.0, 3.0, 5.0), vec3(1.5, 1.3, 1.7));
      c.r = max((0.15 - square(abs(t - 0.04) * 5.0)), c.r);
      c.g = (t < 0.5) ? smoothstep(0.04, 0.45, t) : c.g;
      return clamp(c, 0.0, 0.8);
    }
    
    varying vec2 vUv;

    void main() {
      
      // vec2 st = vUv/u_resolution.xy;
      // float t = vUv.y / u_resolution.y;

      // float j = t + (fract(sin(u_resolution.y * 7.5e2 + vUv.x * 6.4) * 1e2) - 0.5) * 0.005;


      gl_FragColor = vec4(rainbowGradient(0.2+0.6*vUv.y),0) ;
      // gl_FragColor = vec4(rainbowGradient(vUv.x),0) ;
    //   gl_FragColor = vec4(heatmapGradient(vUv.y),0) ;

      
        
    }
    `;

    //gl_FragColor=vec4(st.y,st.y,st.y,   1.0);
    //float v = abs(st.y - 1.);
    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      // transparent: true,
      side: THREE.DoubleSide,
    });

    // var material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    
    var box = new THREE.PlaneBufferGeometry(0.04,0.1)
    
    var colorBoard = new THREE.Mesh(box, material);
   
    var colorGeo = new THREE.PlaneBufferGeometry(0.03,0.1)
    
    var legend = new THREE.Mesh(colorGeo, new THREE.MeshBasicMaterial());
    legend.add(colorBoard)
    colorBoard.position.set(0,0,0)
    legend.position.set(0.1,0.02,-0.1)


    scene.add(camera)
    camera.add(legend)

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
