import * as THREE from "three"

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

let controls, camera, scene, renderer
let textureRooftop, textureBureaux
let sphereMesh, sphereMaterial, params
let backgroundMesh

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
  textureBureaux.colorSpace = THREE.SRGBColorSpace

  textureRooftop = textureLoader.load(
    "textures/IKIGAI_VUE_10_ROOFTOP_360_V1_opti.jpg"
  )
  textureRooftop.colorSpace = THREE.SRGBColorSpace

  // Workaround for Safari crash: Use inverted sphere instead of scene.background
  const geometry = new THREE.SphereGeometry(50, 60, 40)
  geometry.scale(-1, 1, 1) // Invert geometry to view from inside
  const material = new THREE.MeshBasicMaterial({ map: textureBureaux })
  material.side = THREE.DoubleSide
  backgroundMesh = new THREE.Mesh(geometry, material)
  scene.add(backgroundMesh)

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
      console.log("Bureaux", scene)
      backgroundMesh.material.map = textureBureaux
      backgroundMesh.material.needsUpdate = true
    },
    Rooftop: function () {
      console.log("Rooftop", scene)
      backgroundMesh.material.map = textureRooftop
      backgroundMesh.material.needsUpdate = true
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
    backgroundMesh.rotation.x += 0.001
  }

  if (params.backgroundRotationY) {
    backgroundMesh.rotation.y += 0.001
  }

  if (params.backgroundRotationZ) {
    backgroundMesh.rotation.z += 0.001
  }

  if (params.syncMaterial && sphereMesh) {
    sphereMesh.material.envMapRotation.copy(backgroundMesh.rotation)
  }

  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}
