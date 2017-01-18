Triangle with Three.js

```
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 1, 10000);
camera.position.set(0, 0, 1000);
scene.add(camera);

var geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
geometry.faces.push(new THREE.Face3(0, 1, 2));
var material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
 });
        
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function animate()
{
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

Triangle with Branch.js

```
app = BRANCH.init();
scene = app.scene();
scene.triangle(BRANCH.vector(0, 0, 0).vector(0, 0, 0).vector(0, 0, 0));
scene.render();
```
