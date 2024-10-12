// import * as BABYLON from '@babylonjs/core';
// import '@babylonjs/loaders/glTF';
// import { AxesViewer } from '@babylonjs/core/Debug/axesViewer';
// import { STLFileLoader } from '@babylonjs/loaders';


// import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3 } from 'https://cdn.babylonjs.com/babylon.esm.js';
// import { SceneLoader } from 'https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js';
// import { AxesViewer } from 'https://cdn.babylonjs.com/debug/babylonjs.debug.js';


const canvas = document.getElementById("rendercv");
const engine = new BABYLON.Engine(canvas);

var cam;

var otc = "https://beyond-space21.github.io/el_futurix"

var bc_pos={
  home:[-4.959969152717801, 1.7165862446554407, 30, 1],
  category:[-4.265549764990779, 2.591460994113669, 30, 2],
  sub_category:[-7.134515506501033,2.21400182731749,30, 2]
}

const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  const camera = new BABYLON.ArcRotateCamera("camera", -3.909969152718303, 1.7165862446554407, 60, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 0.1;
  camera.upperRadiusLimit = 2000;

  const directionalLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -1, 1), scene);
  directionalLight.intensity = 20;

  const dynamicLight = new BABYLON.PointLight("dynamicLight", new BABYLON.Vector3(0, 5, 20), scene);
  dynamicLight.intensity = 2.0;

  BABYLON.SceneLoader.ImportMesh("", "./model/mountain/", "scene.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
    var importedMesh = newMeshes[0];
    if (importedMesh.rotationQuaternion) {
      importedMesh.rotationQuaternion = null;  // Remove quaternion constraint
    }
    importedMesh.scaling = new BABYLON.Vector3(20, 20, 20);
    importedMesh.position.y = -30
    importedMesh.position.x = -30

    // var customMaterial = new BABYLON.StandardMaterial("customMaterial", scene);
    // customMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0.2);
    // customMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
    // importedMesh.material = customMaterial;

  });

  BABYLON.SceneLoader.ImportMesh("", "./model/logo/", "elfuturix.stl", scene, function (newMeshes) {
    var importedMesh = newMeshes[0];
    importedMesh.rotation.y = dtor(-180)
    importedMesh.rotation.x = dtor(-90)

    importedMesh.position.x = 3
    
    var customMaterial = new BABYLON.StandardMaterial("customMaterial", scene);
    customMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0.2);
    customMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
    importedMesh.material = customMaterial;
    // importedMesh.lightSources = [dynamicLight];

  });


  // setInterval(() => {
  //   console.log(camera.alpha, camera.beta, camera.radius);
  // }, 1000)

  setTimeout(()=>{
    cam = camera
    animateCamera(cam, bc_pos.home)
  },100)
  
  return scene
}


const scene = createScene()
// const axes = new AxesViewer(scene, 5)
engine.runRenderLoop(() => {
  scene.render();
})


window.addEventListener('resize', () => {
  engine.resize();
})

function dtor(a) {
  return a * Math.PI / 180
}

var page_now = "home"
function animateCamera(camera, ip_ar) {

  var newAlpha = ip_ar[0]
  var newBeta = ip_ar[1]
  var newRadius = ip_ar[2]
  var duration = ip_ar[3]

  scene.stopAnimation(camera);

  var animationAlpha = new BABYLON.Animation(
      "alphaAnimation",
      "alpha",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  var animationBeta = new BABYLON.Animation(
      "betaAnimation",
      "beta",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  var animationRadius = new BABYLON.Animation(
      "radiusAnimation",
      "radius",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  // Keyframes for alpha, beta, and radius
  var keysAlpha = [
      { frame: 0, value: camera.alpha },
      { frame: 100, value: newAlpha }
  ];

  var keysBeta = [
      { frame: 0, value: camera.beta },
      { frame: 100, value: newBeta }
  ];

  var keysRadius = [
      { frame: 0, value: camera.radius },
      { frame: 100, value: newRadius }
  ];

  // Set keyframes to animations
  animationAlpha.setKeys(keysAlpha);
  animationBeta.setKeys(keysBeta);
  animationRadius.setKeys(keysRadius);

  // Attach animations to camera
  camera.animations.push(animationAlpha);
  camera.animations.push(animationBeta);
  camera.animations.push(animationRadius);

  // Run the animations
  scene.beginAnimation(camera, 0, 100, false, duration);
}