const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

// Base camera
const camera = new THREE.PerspectiveCamera(10, sizes.width / sizes.height, 0.1, 1000);
camera.position.x = 50;
camera.position.y = 35;
camera.position.z = 50;
scene.add(camera);

//Controls
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = true;
controls.minDistance = 50;
controls.maxDistance = 80;

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
	alpha: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

// Materials
const bakedTexture = textureLoader.load(
	"https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room09/63b22b78b58af29d8b0d2ca196e241e1e8490fe7/dist/baked.jpg"
);
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

const bakedMaterial = new THREE.MeshBasicMaterial({
	map: bakedTexture,
	// side: THREE.DoubleSide,
});

const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x3c6436 });

//Loader
const loader = new THREE.GLTFLoader();
loader.load(
	"https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room09/2515f48ad0b678bb7e16821ffb1960e01d35c65d/dist/model.glb",
	(gltf) => {
		const model = gltf.scene;
		model.traverse((child) => {
			child.material = bakedMaterial;
			if (child.name === "Pasto") child.material = cubeMaterial;
		});
		scene.add(model);
		ld.style.display = "none";
	},
	(xhr) => {
		console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
	}
);

window.addEventListener("resize", () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// Animation
const tick = () => {
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
