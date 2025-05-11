import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

import getStarfield from './src/getStarfield.js';
import { getFresnelMat } from './src/getFresnelMat.js';

window.THREE = THREE;

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer ({antialias: true});
renderer.setSize(w, h);

document.body.appendChild(renderer.domElement);

renderer.toneMapping= THREE.ACESFilmicToneMapping.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);


new OrbitControls(camera, renderer.domElement);
const loader = new THREE.TextureLoader();

const geo = new THREE.IcosahedronGeometry(1, 12);
const mat = new THREE.MeshPhongMaterial ({
    map: loader.load('./textures/00_earthmap1k.jpg'),
    specularMap: loader.load('./textures/02_earthspec1k.jpg'),
    bumpMap: loader.load('./textures/01_earthbump1k.jpg'),
    bumpScale: 0.04
});

const earthMesh = new THREE.Mesh(geo, mat);
earthGroup.add(earthMesh);


const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load('./textures/03_earthlights1k.jpg'),
    blending: THREE.AdditiveBlending,
});

const lightsMesh = new THREE.Mesh(geo, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load('./textures/04_earthcloudmap.jpg'),
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8,
    alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg')   
});

const cloudsMesh = new THREE.Mesh(geo, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geo, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({numStars: 5000});
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight) ;


function animate(t = 0) {
    requestAnimationFrame(animate);
    earthMesh.rotation.y += 0.002;
    lightsMesh.rotation.y += 0.002;
    cloudsMesh.rotation.y += 0.0023;
    glowMesh.rotation.y += 0.002;
    stars.rotation.y += 0.0002;        
    renderer.render(scene, camera);
}

animate();