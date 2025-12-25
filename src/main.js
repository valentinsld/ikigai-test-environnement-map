import * as THREE from "three"

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

let controls, camera, scene, renderer
let textureRooftop, textureBureaux
let sphereMesh, sphereMaterial, params

init()

function init() {
  // CAMERAS

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(0, 0, 2.5)

  // SCENE

  scene = new THREE.Scene()

  // Textures

  const textureLoader = new THREE.TextureLoader()

  textureBureaux = textureLoader.load(
    "textures/IKIGAI_VUE_07_BUREAUXAVENUE_V1_opti.jpg"
  )
  textureBureaux.mapping = THREE.EquirectangularReflectionMapping
  textureBureaux.colorSpace = THREE.SRGBColorSpace

  textureRooftop = textureLoader.load(
    "textures/IKIGAI_VUE_10_ROOFTOP_360_V1_opti.jpg"
  )
  textureRooftop.mapping = THREE.EquirectangularReflectionMapping
  textureRooftop.colorSpace = THREE.SRGBColorSpace

  scene.background = textureBureaux

  //

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(animate)
  document.body.appendChild(renderer.domElement)

  //

  controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 1.5
  controls.maxDistance = 6
  controls.rotateSpeed *= -0.35

  //

  params = {
    Bureaux: function () {
      scene.background = textureBureaux
    },
    Rooftop: function () {
      scene.background = textureRooftop
    },
    Refraction: false,
    backgroundRotationX: false,
    backgroundRotationY: false,
    backgroundRotationZ: false,
    syncMaterial: false,
  }

  const gui = new GUI({ width: 300 })
  gui.add(params, "Bureaux")
  gui.add(params, "Rooftop")
  gui.open()

  window.addEventListener("resize", onWindowResize)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

//

function animate() {
  if (params.backgroundRotationX) {
    scene.backgroundRotation.x += 0.001
  }

  if (params.backgroundRotationY) {
    scene.backgroundRotation.y += 0.001
  }

  if (params.backgroundRotationZ) {
    scene.backgroundRotation.z += 0.001
  }

  if (params.syncMaterial) {
    sphereMesh.material.envMapRotation.copy(scene.backgroundRotation)
  }

  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}
