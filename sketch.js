let scene,
  renderer,
  camera,
  moon,
  earth,
  orbit_control,
  a_rotation = 0,
  rotation = 0,
  n_images = 0;

function newScene() {
  // Scene
  scene = new THREE.Scene();
  textureLoader(scene, "background", urls.stars);
  let ambientlight = new THREE.AmbientLight(0x404040, 0.2);
  scene.add(ambientlight);

  //  Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 200, 200);

  // OrbitControl
  orbit_control = new THREE.OrbitControls(camera);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Sun
  let sun = new THREE.PointLight(0xffee88, 1, 10000, 1);
  let sun_geometry = new THREE.SphereGeometry(30, 64, 64);
  let sun_material = new THREE.MeshPhongMaterial({
    emissive: 0xffffff,
    emissiveIntensity: 1,
    shininess: 0
  });
  textureLoader(sun_material, "emissiveMap", urls.sun);
  sun.add(new THREE.Mesh(sun_geometry, sun_material));
  sun.castShadow = true;

  // Sun shadow
  let d = 1000;
  sun.shadow.camera.left = -d;
  sun.shadow.camera.right = d;
  sun.shadow.camera.top = d;
  sun.shadow.camera.bottom = -d;
  sun.shadow.camera.far = 1000;
  scene.add(sun);

  // Earth
  let earth_material = new THREE.MeshPhongMaterial();
  textureLoader(earth_material, "map", urls.earth);
  let earth_geometry = new THREE.SphereGeometry(10, 64, 64);
  earth = new THREE.Mesh(earth_geometry, earth_material);

  // Earth Shadow
  earth.castShadow = true;
  earth.receiveShadow = true;
  scene.add(earth);

  // Moon
  let moon_material = new THREE.MeshPhongMaterial();
  textureLoader(moon_material, "map", urls.moon);
  let moon_geometry = new THREE.SphereGeometry(5, 64, 64);
  moon = new THREE.Mesh(moon_geometry, moon_material);

  // Moon Shadow
  moon.castShadow = true;
  moon.receiveShadow = true;
  scene.add(moon);

  document.body.appendChild(renderer.domElement);
}

function textureLoader(target, map, url) {
  n_images++;
  let loader = new THREE.TextureLoader();
  loader.load(url, function(texture) {
    target[map] = texture;
    n_images--;
  });
}

function animateRotation() {
  moon.rotation.y = -rotation;
  earth.rotation.y = rotation * 0.5;
  rotation += 0.03;
  earth.position.x = 240 * Math.cos((a_rotation * Math.PI) / 180);
  earth.position.z = 120 * Math.sin((a_rotation * Math.PI) / 180);
  moon.position.x =
    earth.position.x + 30 * Math.cos((a_rotation * 2 * Math.PI) / 180);
  moon.position.z =
    earth.position.z + 30 * Math.sin((a_rotation * 2 * Math.PI) / 180);
  a_rotation++;
}

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight, true);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}

function animateLoop() {
  if (n_images == 0) {
    resize();
    animateRotation();
    orbit_control.update();
  }
  window.requestAnimationFrame(animateLoop);
}
newScene();
animateLoop();
