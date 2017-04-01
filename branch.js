var BRANCH = (function()
{
	//
	let _enum = {
		NONE: 'none',

		TEXT: 'text',
		BVH: 'bvh',
		OBJ: 'obj',
		SPHERE: 'sphere',
		ARC: 'arc',
		POINT: 'point',
		CIRCLE: 'circle',
		TRIANGLE: 'triangle',
		CUBE: 'cube',
		CYLINDER: 'cylinder',
		CONE: 'cone',
		
		LIGHT: 'light',
		POINTLIGHT: 'pointlight',
		SPOTLIGHT: 'spotlight',
		AMBIENTLIGHT: 'ambientlight',
		DIRECTIONALLIGHT: 'directionallight',

		CURVE: 'curve',
		SPLINE: 'spline',
		SURFACE: 'surface',
		
		LINE: 'line',
		PLANE: 'plane',
		RING: 'ring',
		
		LIST: 'list',
		MATERIALS: 'materials',
		MATERIAL: 'material',
		DASHED: 'dashed',
		DEPTH: 'depth',
		LAMBERT: 'lambert',
		NORMAL: 'normal',
		PHYSICAL: 'physical',
		TOON: 'toon',
		PHONG: 'phong',
		STANDARD: 'standard',
		MIRROR: 'mirror',

		COLOR: 'color',
		VECTOR2: 'vector2',
		VECTOR3: 'vector3',
		VECTOR4: 'vector4',
		SCALE: 'scale',
		ROTATE: 'rotate',
		TRANSLATE: 'translate',
		ORIGIN: 'origin',
		AXIS: 'axis',

		CURRENT: 'current',
		IDOBJECT: 'idobject',
		IDLAYER: 'idlayer',
		OBJECTS: 'objects',
		OBJECT: 'object',
		MESH: 'mesh',
		MESHS: 'meshs',
		
		PERSPECTIVE: 'perspective',
		ORTHOGRAPHIC: 'orthographic',
		CONTROLS: 'controls',
		LANDMARK: 'landmark',
		TYPE: 'type',
		COMPOSER: 'composer',
		MATH: 'math',
		VECTOR: 'vector',
		MERGE: 'merge',
		
		STOP: 'stop',
		PAUSE: 'pause',
		PLAY: 'play',

		SCREEN: 'screen',
		CAMERA: 'camera',
		SCENE: 'scene',
		RENDERER: 'renderer',
		LAYER: 'layer',
		UPDATE: 'update',
		DRAW: 'draw',
		ROOT: 'root',
		CALCULATION: 'calculation',
	}

	//
	let _engine = {
		this: this,
		scene: [],
		draw: [],
		update: [],
		config: {
			timeUpdate: 100,
		},
	}

	//
	this.scene = function(params, id)
	{
		id = (typeof(id) != 'string' ? $getId(_engine.scene, _enum.SCENE) : id);
		let find = $findKey(_engine.scene, id);
		if (find != -1) {
			return null;
		}

		//
		let build = new $layer;
		build.init(id, params);
		return build;
	}

	//
	this.vector = function()
	{
		let build = new $vector;
		build.init(arguments);
		return build;
	}

	//
	this.update = function(callback)
	{
		_engine.update.push(callback);
		return _engine.this;
	}

	//
	this.draw = function(callback)
	{
		_engine.draw.push(callback);
		return _engine.this;
	}

	//
	this.random = function(type, vecMin, vecMax, len)
	{
		if (type == _enum.COLOR) {
			return parseInt(Math.floor(Math.random() * 0xffffff).toString(16), 16);
		}
		let build = new $vector;
		for (let i = 0; i < (typeof(len) != 'number' ? 1 : len); i++) {
			build.random(type, vecMin, vecMax);
		}
		return build;
	}

	//
	this.math = (function()
	{
		let __engine = {
			this: this,
			type: _enum.MATH,
		};

		//
		this.lemniscate = function(vector, precision, overcoat)
		{
			let x, y, scale;
			let vectors = _engine.this;
			vector = (typeof(vector) == 'undefined' ? _engine.this.vector(0, 0, 0) : vector);
			precision = (typeof(precision) == 'undefined' ? 0.01 : precision);
			overcoat = (typeof(overcoat) == 'undefined' ? 7 : overcoat);
			for (let t = 0; t < overcoat; t += precision)
			{
				scale = 2 / (3  - Math.cos(2 * t));
				x = scale * Math.cos(t);
				y = (scale * Math.sin(2 * t)) / 2;
				vectors = vectors.vector(x + vector.get(0).x, y + vector.get(0).y, vector.get(0).z);
			}
			return vectors;
		}

		this.star = function(size, branch, branch_rot)
		{
			branch = (typeof(branch) == 'undefined' ? 5 : branch);
			branch_rot = (typeof(branch) == 'undefined' ? 2 : branch_rot);
			let rot = (360 / branch) * branch_rot;
			let angle = 90 + rot;

			let lines = undefined;

			for (let index = 0; index <= branch; ++index)
			{
				angle = (angle + rot) % 360;
				let x = size * Math.cos(angle * Math.PI / 180);
				let y = size * Math.sin(angle * Math.PI / 180);

				if (lines == undefined)
					lines = BRANCH.vector(x, y, 0);
				else
					lines.vector(x, y, 0);
			}
			return (lines);
		}

		this.pointCloudObj = function(path, scale, position)
		{
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('GET', path, false);
			xmlhttp.send(null);
			let lines = xmlhttp.responseText.split('\n');
			let vector = BRANCH.vector();
			for (let i = 0; i < lines.length; ++i)
			{
				let infos = lines[i].split(' ');
				if (infos[0] == 'v')
				{
					vector.vector(parseFloat(infos[1]) * scale + position.get(0).x, parseFloat(infos[2])  * scale + position.get(0).y, parseFloat(infos[3])  * scale + position.get(0).z);
				}
			}
			return vector;
		}

		//
		this.pointCloudPicture = function(path, size, vector)
		{
			return null;
		}

		return __engine.this;
	})();

	//
	this.get = function(type, id, full)
	{
		let find;
		switch (type)
		{
			case _enum.SCENE:
				if (id == null || typeof(id) == 'undefined') {
					return _engine.scene;
				}
				let find = $findKey(_engine.scene, id);
				if (find == -1) {
					return null;
				}
				if (typeof(full) == 'boolean' && full == true) {
					return _engine.scene[find];
				}
				return _engine.scene[find].scene;
			break;
			default:
				return null;
		}
	}

	//
	const $layer = function()
	{
		let __engine = {
			this: this,
			id: null,
			currentLayer: null,
			currentObject: null,
			type: _enum.LAYER,
			layer: [],
			root: [],
			change: [],
			selected: [],
			renderer: [],
			landmark: null,
			tracking: {
				mouse: {
					type: _enum.NONE,
				},
			},
			config: {
				timeUpdate: 100,
				scene: {
					el: document.body, //document.getElementById('canvas'),
					height: window.innerHeight,
					width: window.innerWidth,
					webGL: true,
					renderer: {
						preserveDrawingBuffer: true,
						antialias: true,
						autoClear: false,
					},
					camera: {
						top: window.innerHeight / 2,
						left: window.innerWidth / -2,
						bottom: window.innerHeight / -2,
						right: window.innerWidth / 2,
						fov: 53,
						aspect: 1,
						near: 1,
						far: 10000,
						position: {x: 0, y: 0, z: 1000},
						rotation: {x: 0, y: 0, z: 0},
					},
					font: 'fonts/helvetiker_regular.typeface.json',
					material: {
						transparent: true,
						overdraw: true,
						side: THREE.DoubleSide, // Ne pas l'activé lors d'un rendu
					},
					pointMaterial: {
						sizeAttenuation: false,
					},
					lineMaterial: {

					},
					controls: {
						scene: {
							enable: true,
							property: {
								rotateSpeed: 1.0,
								zoomSpeed: 1.2,
								panSpeed: 0.8,
								noZoom: false,
								noPan: false,
								staticMoving: true,
								dynamicDampingFactor: 0.3,
							},
						},
						object: {
							enable: true,
							property: { },
						},
					},
					landmark: {
						enable: true,
						margin: 100,
					},
				},
			},
		}

		//
		this.init = function(id, params)
		{
			//
			if (typeof(params) == 'function') {
				params = new params();
			}
			$extend(__engine.config.scene, params);
			
			//
			__engine.config.scene.camera.aspect = __engine.config.scene.width / __engine.config.scene.height;
			__engine.config.scene.camera.top = __engine.config.scene.height / 2;
			__engine.config.scene.camera.left = __engine.config.scene.width / -2;
			__engine.config.scene.camera.bottom = __engine.config.scene.height / -2;
			__engine.config.scene.camera.right = __engine.config.scene.width / 2;

			//
			let canvas = document.createElement('canvas');
			__engine.config.scene.webGL = (__engine.config.scene.webGL == true && window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));

			//
			__engine.id = id;
			_engine.scene.push({
				id: id,
				runned: true,
				scene: __engine.this,
			});

			//
			__engine.currentLayer = $getId(__engine.layer, _enum.LAYER);
			__engine.this.switch(__engine.currentLayer);

			//
			$addPrefix(__engine, 'background', __engine.this);

			//
			__engine.landmark = new $landmark;
			__engine.landmark.init();

			//
			__engine.this.camera(_enum.CAMERA);
			__engine.this.render(_enum.CAMERA, _enum.RENDERER);

			delete __engine.this.init;
			return __engine.this;
		}

		//
		this.render = function(idCamera, idRender, el)
		{
			let cameras = __engine.this.get(_enum.OBJECTS).get(_enum.CAMERA);
			let findCamera = $findKey(cameras, idCamera);
			if (findCamera == -1 || idRender == null || typeof(idRender) == 'undefined') {
				return null;
			}
			let findRender = $findKey(__engine.renderer, idRender);
			el = (typeof(el) == 'undefined' ? __engine.config.scene.el : el);
			if (findRender == -1)
			{
				//
				let renderer = (__engine.config.scene.webGL ? new THREE.WebGLRenderer(__engine.config.scene.renderer) : new THREE.CanvasRenderer(__engine.config.scene.renderer));
				$extend(renderer, __engine.config.scene.renderer);
				renderer.setSize(__engine.config.scene.width, __engine.config.scene.height);
				el.appendChild(renderer.domElement);
				
				//
				renderer.shadowMap.enabled = true;
				renderer.shadowMap.type = THREE.PCFSoftShadowMap;

				//
				renderer.domElement.addEventListener('contextmenu', function(e) {
					__engine.this.select(null);
				});
				renderer.domElement.addEventListener('mousedown', function(e)
				{
					__engine.tracking.mouse.type = _enum.LAYER;	
					
					//
					setTimeout(function()
					{
						//
						if (__engine.tracking.mouse.type != _enum.LAYER) {
							return ;
						}

						//
						let rect = e.target.getBoundingClientRect();
						let mouse = new THREE.Vector2();
						mouse.x = ((e.clientX - rect.left) / renderer.domElement.width) * 2 - 1;
						mouse.y = -((e.clientY - rect.top) / renderer.domElement.height) * 2 + 1;
					
						//
						let raycaster = new THREE.Raycaster();
						raycaster.setFromCamera(mouse, cameras[findCamera].mesh.get(_enum.CAMERA));

						//
						let meshs = __engine.this.get(_enum.OBJECTS).get(_enum.MESHS);
						let intersects = raycaster.intersectObjects(meshs);
						
						//
						if (intersects.length > 0)
						{
							//
							let mesh = __engine.this.get(_enum.OBJECTS).get(_enum.OBJECTS, intersects[0].object.name);

							__engine.this.select(mesh._name);

							//
							for (let index2 in __engine.selected) {
								__engine.selected[index2](mesh, mesh.get(_enum.TYPE));
							}
							return ;
						}
					}, 10);

				}, false);

				//
				let rendererObject = {
					id: idRender,
					idCamera: idCamera,
					renderer: renderer,
					el: el,
					layer: new THREE.Scene(),
				};

				cameras[findCamera].mesh.addControls(rendererObject);
				
				//
				__engine.renderer.push(rendererObject);

				return __engine.this;
			}
			cameras[findCamera].mesh.removeControls();
			__engine.renderer[findRender].idCamera = idCamera;
			return __engine.this;
		}

		//
		this.change = function(callback)
		{
			if (typeof(callback) == 'function') {
				__engine.change.push(callback);
			}
			return __engine.this;
		}

		//
		this.selected = function(callback)
		{
			if (typeof(callback) == 'function') {
				__engine.selected.push(callback);
			}
			return __engine.this;
		}

		//
		this.switch = function(id)
		{
			if (id == null || typeof(id) != 'string') {
				return null;
			}
			let find = $findKey(__engine.layer, id);
			if (find == -1) {
				let objects = new $object;
				__engine.layer.push({
					id: id,
					layer: new THREE.Scene(),
					objects: objects.init(id),
				});
				find = __engine.layer.length - 1;
			}
		    __engine.currentLayer = id;
			__engine.currentObject = null;
			$extend(__engine.this, __engine.layer[find].objects, true, ['get']);
			return __engine.this;
		}

		//
		this.background = function(color)
		{
			if (typeof(__engine.layer[0]) != 'undefined' && typeof(__engine.layer[0].layer) != 'undefined') {
				__engine.layer[0].layer.background = new THREE.Color(color);
			}
			return  __engine.this;
		}

		//
		this.select = function(id, update)
		{
			if (typeof(update) != 'boolean' || update == true) {
				__engine.landmark.update(id);
			}
			__engine.currentObject = id;
			return  __engine.this;
		}

		//
		this.remove = function(id)
		{
			let find = $findKey(__engine.layer, id);
			if (find == -1) {
				return null;
			}
			let objects = __engine.layer[find].objects.get(_enum.OBJECTS);
			for (let index in objects) {
				objects.mesh.remove();
			}
			__engine.layer.splice(find, 1);
			return __engine.this;
		}

		//
		this.unset = function(id)
		{
			let current = __engine.this.get(_enum.CURRENT, null, true);
			if (current == null) {
				return null;
			}
			let objects = current.objects.get(_enum.OBJECTS);
			let find = $findKey(objects, id);
			if (find == -1) {
				return null;
			}
			current.remove(objects);
			return __engine.this;
		}

		//
		this.get = function(type, id, full)
		{
			let find;
			switch (type)
			{
				case _enum.RENDERER:
					return __engine.renderer;
				break;
				case _enum.IDLAYER:
				return __engine.currentLayer;
				break;
				case _enum.IDOBJECT:
					return __engine.currentObject;
				break;
				case _enum.CURRENT:
					find = $findKey(__engine.layer, __engine.currentLayer);
					if (find == -1) {
						return null;
					}
					if (typeof(full) == 'boolean' && full == true) {
						return __engine.layer[find];
					}
					return __engine.layer[find].layer;
				break;
				case _enum.OBJECTS:
					if (id == null || typeof(id) == 'undefined') {
						id = __engine.currentLayer;
					}
					find = $findKey(__engine.layer, id);
					if (find == -1) {
						return null;
					}
					return __engine.layer[find].objects;
				break;
				case _enum.LAYER:
					if (id == null || typeof(id) == 'undefined') {
						return __engine.layer;
					}
					find = $findKey(__engine.layer, id);
					if (find == -1) {
						return null;
					}
					if (typeof(full) == 'boolean' && full == true) {
						return __engine.layer[find];
					}
					return __engine.layer[find].layer;
				break;
				case _enum.ROOT:
					if (id == null || typeof(id) == 'undefined') {
						return __engine.root;
					}
					find = $findKey(__engine.root, id);
					if (find == -1) {
						return null;
					}
					if (typeof(full) == 'boolean' && full == true) {
						return __engine.root[find];
					}
					return __engine.root[find].layer;
				break;
				case _enum.LANDMARK:
					return __engine.landmark;
				break;
				default:
					return null;
			}
		}

		//
		const $landmark = function()
		{
			let ____engine = {
				this: this,
				type: _enum.LANDMARK,
				calculation: null,
				grid: {
					id: '',
					object: null,
				},
				marker: {
					id: '',
					object: null,
				}
			}

			//
			this.init = function()
			{
				//
				____engine.calculation = new $calculation;

				// Grid
				____engine.grid.id = $getId(__engine.root, _enum.LANDMARK);
				____engine.grid.object = new $object;
				__engine.root.push({
					id: ____engine.grid.id,
					layer: new THREE.Scene(),
					objects: ____engine.grid.object.init(____engine.grid.id, true),
				});

				// Marker
				____engine.marker.id = $getId(__engine.root, _enum.LANDMARK);
				____engine.marker.object = new $object;
				__engine.root.push({
					id: ____engine.marker.id,
					layer: new THREE.Scene(),
					objects: ____engine.marker.object.init(____engine.marker.id, true),
				});

				delete ____engine.this.init;
				return ____engine.this;
			}

			//
			this.clearGrid = function()
			{
				let grid = ____engine.grid.object.get(_enum.OBJECTS);
				while (grid.length > 0) {
					grid[0].mesh.remove();
				}
				return ____engine.this;
			}

			//
			this.grid = function()
			{
				let draw_grid = function(size, space)
				{
					size = size - (size % space);

					let vec = _engine.this.vector(size * -1, 0, size * -1);

					let dir = 0;
					for (let i = size * - 1; i <= size; i += space)
					{
						if (dir % 2 == 0) {
							vec.vector(i, 0, (size * -1)).vector(i, 0, size);
						} else {
							vec.vector(i, 0, size).vector(i, 0, size * -1);							
						}
						dir += 1;
					}

					dir = 0;
					for (let i = size; i >= size * -1; i -= space)
					{
						if (dir % 2 == 0) {
							vec.vector(size, 0, i).vector(size * -1, 0, i);
						} else {
							vec.vector(size * -1, 0, i).vector(size, 0, i);
						}
						dir += 1;
					}

					____engine.grid.object
						.line(vec)
						.color(0x555555)
					;					
				}

				let layer = __engine.this.get(_enum.OBJECTS); // À REMPLACER PAR LAYER
				let objects = layer.get(_enum.OBJECTS);
				let toGeometry = {
					min: { x: 0, z: 0 },
					max: { x: 0, z: 0 },
				};

				for (var index in objects) {
					if (objects[index].merged == false) {
						let geometry = ____engine.this.getGeometry(objects[index]);
						if (geometry != null)
						{
							//
							toGeometry.min.x = (toGeometry.min.x == 0 || toGeometry.min.x > geometry.min.x ? geometry.min.x : toGeometry.min.x);
							toGeometry.min.z = (toGeometry.min.z == 0 || toGeometry.min.z > geometry.min.z ? geometry.min.z : toGeometry.min.z);

							//
							toGeometry.max.x = (toGeometry.max.x == 0 || toGeometry.max.x < geometry.max.x ? geometry.max.x : toGeometry.max.x);
							toGeometry.max.z = (toGeometry.max.z == 0 || toGeometry.max.z < geometry.max.z ? geometry.max.z : toGeometry.max.z);
						}
					}
				}


				let min = toGeometry.min.x < toGeometry.min.z ? toGeometry.min.x : toGeometry.min.z;
				let max = toGeometry.max.x > toGeometry.max.z ? toGeometry.max.x : toGeometry.max.z;

				let abs = min < 1 ? min * -1 : min;
				let max_obj = abs > max ? abs : max;

				let minGrid = (((__engine.config.scene.width > __engine.config.scene.height ? __engine.config.scene.height : __engine.config.scene.width) * 80) / 100) / 2;

				let size_grid = 50;

				if (max_obj + __engine.config.scene.landmark.margin < minGrid) {
					draw_grid(minGrid, size_grid);
				} else {
					draw_grid(max_obj + __engine.config.scene.landmark.margin, size_grid);
				}
				return ____engine.this;
			}

			//
			this.clearMarker = function()
			{
				let marker = ____engine.marker.object.get(_enum.OBJECTS);
				while (marker.length > 0) {
					marker[0].mesh.remove();
				}
				return ____engine.this;
			}

			//
			this.marker = function(geometry)
			{
				____engine.marker.object.line(_engine.this
					.vector(geometry.min.x, geometry.max.y, geometry.min.z)
					.vector(geometry.min.x, geometry.min.y, geometry.min.z)
					.vector(geometry.max.x, geometry.min.y, geometry.min.z)
					.vector(geometry.max.x, geometry.max.y, geometry.min.z)
					.vector(geometry.min.x, geometry.max.y, geometry.min.z)
					.vector(geometry.min.x, geometry.max.y, geometry.max.z)
					.vector(geometry.min.x, geometry.min.y, geometry.max.z)
					.vector(geometry.max.x, geometry.min.y, geometry.max.z)
					.vector(geometry.max.x, geometry.max.y, geometry.max.z)
					.vector(geometry.min.x, geometry.max.y, geometry.max.z)
					.vector(geometry.max.x, geometry.max.y, geometry.max.z)
					.vector(geometry.max.x, geometry.max.y, geometry.min.z)
					.vector(geometry.max.x, geometry.min.y, geometry.min.z)
					.vector(geometry.max.x, geometry.min.y, geometry.max.z)
					.vector(geometry.min.x, geometry.min.y, geometry.max.z)
					.vector(geometry.min.x, geometry.min.y, geometry.min.z)
				).color(0xFCDC12);

				return ____engine.this;
			}

			//
			this.update = function(id)
			{
				// Clear
				____engine.this.clearGrid();
				____engine.this.clearMarker();
				
				//
				if (__engine.config.scene.landmark.enable == false) {
					return ____engine.this;
				}

				//
				this.grid();

				//
				let layer = __engine.this.get(_enum.OBJECTS);
				let objects = layer.get(_enum.OBJECTS);
				let find = $findKey(objects, id);
				if (find == -1) {
					for (let index in __engine.renderer) {
						let camera = layer.get(_enum.CAMERA);
						for (let index2 in camera) {
							if (__engine.renderer[index].idCamera == camera[index2].id) {
								camera[index2].mesh.disableObject();
							}
						}
					}
					return ____engine.this;
				}
				
				//
				for (let index in __engine.renderer) {
					let camera = layer.get(_enum.CAMERA);
					for (let index2 in camera) {
						if (__engine.renderer[index].idCamera == camera[index2].id) {
							if (objects[find].type != _enum.CAMERA) {
								camera[index2].mesh.enableObject(objects[find].mesh.get(_enum.MESH));
							} else {
								camera[index2].mesh.disableObject();
							}
						}
					}
				}
				
				//
				let geometry = ____engine.this.getGeometry(objects[find]);
				if (geometry != null) {
					this.marker(geometry);
				}
				
				return ____engine.this;
			}

			//
			this.enable = function()
			{
				__engine.config.scene.landmark.enable = true;
				____engine.this.update(__engine.currentObject);
				return ____engine.this;
			}
			
			//
			this.disable = function()
			{
				let tmp = __engine.currentObject;
				____engine.this.clearGrid();
				____engine.this.clearMarker();
				let camera = __engine.this.get(_enum.OBJECTS).get(_enum.CAMERA);
				for (let index in camera) {
					camera[index].mesh.disableObject();
				}
				__engine.currentObject = tmp;
				__engine.config.scene.landmark.enable = false;
				return ____engine.this;
			}

			//
			this.setMode = function(mode)
			{
				let camera = __engine.this.get(_enum.OBJECTS).get(_enum.CAMERA);
				for (let index in camera) {
					camera[index].mesh.setMode(mode);
				}
				return ____engine.this;
			}

			//
			this.getGeometry = function(objects)
			{
				if (objects.type == _enum.MERGE) {
					let toGeometry = {
						min: { x: 0, y: 0, z: 0 },
						max: { x: 0, y: 0, z: 0 },
					}
					let merge = objects.mesh.get(_enum.MERGE);
					for (var index in merge) {
						let geometry = ____engine.this.getGeometry({
							mesh: merge[index].merge,
							type: merge[index].merge.get(_enum.TYPE),
						});
						if (geometry != null)
						{
							//
							toGeometry.min.x = (toGeometry.min.x == 0 || toGeometry.min.x > geometry.min.x ? geometry.min.x : toGeometry.min.x);
							toGeometry.min.y = (toGeometry.min.y == 0 || toGeometry.min.y > geometry.min.y ? geometry.min.y : toGeometry.min.y);
							toGeometry.min.z = (toGeometry.min.z == 0 || toGeometry.min.z > geometry.min.z ? geometry.min.z : toGeometry.min.z);

							//
							toGeometry.max.x = (toGeometry.max.x == 0 || toGeometry.max.x < geometry.max.x ? geometry.max.x : toGeometry.max.x);
							toGeometry.max.y = (toGeometry.max.y == 0 || toGeometry.max.y < geometry.max.y ? geometry.max.y : toGeometry.max.y);
							toGeometry.max.z = (toGeometry.max.z == 0 || toGeometry.max.z < geometry.max.z ? geometry.max.z : toGeometry.max.z);
						}
					}
					return toGeometry;
				}
				return ____engine.calculation.getBorder3dObject(objects.mesh, objects.type);
			};

			//
			const $calculation = function()
			{
				let _____engine = {
					this: this,
					type: _enum.CALCULATION,
				}

				//
				this.getGeometryObject = function(object, type)
				{
					let geometry = { x: 0, y: 0, z: 0 }
					switch (type)
					{
						case _enum.SPHERE:
							geometry.x = object.scale.x;
							geometry.y = object.scale.y;
							geometry.z = object.scale.z;
						break;
						case _enum.CYLINDER:
							geometry.x = object.scale.x;
							geometry.y = object.scale.y / 2;
							geometry.z = object.scale.z;

						break;
						case _enum.CONE:
							geometry.x = object.scale.x;
							geometry.y = object.scale.y / 2;
							geometry.z = object.scale.z;
						break;
						case _enum.CUBE:
							geometry.x = object.scale.x / 2;
							geometry.y = object.scale.y / 2;
							geometry.z = object.scale.z / 2;
						break;
						case _enum.PLANE:
							geometry.x = object.scale.x / 2;
							geometry.y = object.scale.y / 2;
							geometry.z = object.scale.z / 2;
						break;
						default:
							return null;
					}
					return geometry;
				}

				//
				this.getBorder2dObject = function(object, angle)
				{
					let border = {
						min: { x: -1, y: -1 },
						max: { x: -1, y: -1 },
					}
					let point_face = [
						{ x: 0 - object.scale.x, y: 0 - object.scale.y },
						{ x: 0 + object.scale.x, y: 0 - object.scale.y },
						{ x: 0 + object.scale.x, y: 0 + object.scale.y },
						{ x: 0 - object.scale.x, y: 0 + object.scale.y },
					];
					angle = (typeof(angle) == 'undefined' ? 0 : angle);
					
					//
					for (let i = 0; i < point_face.length; i += 1)
					{
						let x = object.position.x + ((point_face[i].x) * Math.cos(angle)) - ((point_face[i].y) * Math.sin(angle));
						let y = object.position.y + ((point_face[i].x) * Math.sin(angle)) + ((point_face[i].y) * Math.cos(angle));
						
						border.max.x = (border.max.x == -1 || x > border.max.x ? x : border.max.x);
						border.min.x = (border.min.x == -1 || x < border.min.x ? x : border.min.x);
						
						border.max.y = (border.max.y == -1 || y > border.max.y ? y : border.max.y);
						border.min.y = (border.min.y == -1 || y < border.min.y ? y : border.min.y);
					}
					return border;
				}

				//
				this.getBorder3dObject = function(object, type)
				{
					let border = {
						min: { x: 0, y: 0, z: 0 },
						max: { x: 0, y: 0, z: 0 },
					}

					//
					let geometry = _____engine.this.getGeometryObject(object, type);
					if (geometry == null) {
						return null;
					}

					//
					let border2d_1 = _____engine.this.getBorder2dObject({
						position: { x: object.position.x, y: object.position.y },
						scale: { x: geometry.x, y: geometry.y },
					}, object.rotation.z);
					let border2d_2 = _____engine.this.getBorder2dObject({
						position: { x: object.position.x, y: object.position.z },
						scale: { x: geometry.x, y: geometry.z },
					}, object.rotation.y);
					let border2d_3 = _____engine.this.getBorder2dObject({
						position: { x: object.position.y, y: object.position.z },
						scale: { x: geometry.y, y: geometry.z },
					}, object.rotation.x);

					//
					border.min.x = (border2d_1.min.x < border2d_2.min.x ? border2d_1.min.x : border2d_2.min.x);
					border.min.y = (border2d_1.min.y < border2d_3.min.x ? border2d_1.min.y : border2d_3.min.x);
					border.min.z = (border2d_2.min.y < border2d_3.min.y ? border2d_2.min.y : border2d_3.min.y);

					//
					border.max.x = (border2d_1.max.x > border2d_2.max.x ? border2d_1.max.x : border2d_2.max.x);
					border.max.y = (border2d_1.max.y > border2d_3.max.x ? border2d_1.max.y : border2d_3.max.x);
					border.max.z = (border2d_2.max.y > border2d_3.max.y ? border2d_2.max.y : border2d_3.max.y);

					return border;
				}
			}
		}

		//
		const $object = function()
		{
			let ___engine = {
				this: this,
				type: _enum.OBJECTS,
				layer: '',
				root: false,
				mesh: [],
			}

			//
			this.init = function(id, root)
			{
				___engine.layer = id;
				___engine.root = (typeof(root) == 'boolean' ? root : false);

				delete ___engine.this.init;
				return ___engine.this;
			}

			//
			this.camera = function(id)
			{
				id = (typeof(id) != 'string' ? $getId(___engine.mesh, _enum.CAMERA) : id);
				let find = $findKey(___engine.mesh, id);
				if (find != -1) {
					return null;
				}
				let camera = new $camera;
				return camera.init(id);
			}

			//
			this.merge = function(id)
			{
				id = (typeof(id) != 'string' ? $getId(___engine.mesh, _enum.MERGE) : id);
				let find = $findKey(___engine.mesh, id);
				if (find != -1) {
					return null;
				}
				let merge = new $merge;
				return merge.init(id, null);
			}

			//
			this.add = function(id, type, mesh)
			{
				return $getMesh(id, type, function()
				{
					return {
						mesh: mesh,
					}
				});
			}

			//
			this.cone = function(vector, id)
			{
				return $getMesh(id, _enum.CONE, function()
				{
					let material = $getMaterial(_enum.MESH, _enum.PHONG);
					let geometry = new THREE.CylinderGeometry(0, 1, 1, 50);
					let mesh = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));

					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 100, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						mesh: mesh,
						material: material,
					}
				});
			}

			//
			this.cylinder = function(vector, id)
			{
				return $getMesh(id, _enum.CYLINDER, function()
				{
					let material = $getMaterial(_enum.MESH, _enum.PHONG);
					let geometry = new THREE.CylinderGeometry(1, 1, 1, 50);
					let mesh = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));

					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 100, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						mesh: mesh,
						material: material,
					}
				});
			}

			//
			this.sphere = function(vector, id)
			{
				return $getMesh(id, _enum.SPHERE, function()
				{
					let material = $getMaterial(_enum.MESH, _enum.PHONG);
					let geometry = new THREE.SphereGeometry(1, 35, 35);
					let mesh = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));

					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						mesh: mesh,
						material: material,
					}
				});
			}

			//
			this.cube = function(vector, id)
			{
				return $getMesh(id, _enum.CUBE, function()
				{
					let material = $getMaterial(_enum.MESH, _enum.STANDARD);
					let geometry = new THREE.BoxGeometry(1, 1, 1);
					let mesh = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));
					
					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						mesh: mesh,
						material: material,
					}
				});
			}

			//
			this.pointLight = function(id)
			{
				return $getMesh(id, _enum.POINTLIGHT, function()
				{
					let mesh = new THREE.PointLight();
				
					mesh.shadow.camera.near = 0.5;
					mesh.shadow.camera.far = 500;

					return {
						mesh: mesh,
					}
				});
			}

			//
			this.spotLight = function(id)
			{
				return $getMesh(id, _enum.SPOTLIGHT, function()
				{
					let mesh = new THREE.SpotLight();			
					
					mesh.shadow.camera.near = 0.5;
					mesh.shadow.camera.far = 500;

					return {
						mesh: mesh,
					}
				});
			}
			
			//
			this.ambientLight = function(id)
			{
				return $getMesh(id, _enum.AMBIENTLIGHT, function()
				{
					let mesh = new THREE.AmbientLight();

					return {
						mesh: mesh,
					}
				});
			}

			//
			this.directionalLight = function(id)
			{
				return $getMesh(id, _enum.DIRECTIONALLIGHT, function()
				{
					let mesh = new THREE.DirectionalLight();

					return {
						mesh: mesh,
					}
				});
			}
			
			//
			this.mirror = function(vector, id)
			{
				let groundMirror = new THREE.Mirror({ clipBias: 0.003, color: 0x777777 });

				return $getMesh(id, _enum.MIRROR, function()
				{
					let geometry = new THREE.PlaneGeometry(1, 1);
					let mesh = new THREE.Mesh(geometry, groundMirror.material);

					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						mesh: mesh,
					}
				}, function(mesh) {

					mesh.set(_enum.OBJECT, groundMirror);
					mesh.set(_enum.UPDATE, {
						update: function(param)
						{
							groundMirror.render(param.renderer.renderer, param.camera.get(_enum.CAMERA));
						}
					}, function(renderer, scene, camera) {
						return {
							renderer: renderer,
							scene: scene,
							camera: camera,
						}
					});
			
				});
			}

			//
			this.plane = function(vector, id)
			{
				return $getMesh(id, _enum.PLANE, function()
				{
					let material = $getMaterial(_enum.MESH, _enum.STANDARD);
					let geometry = new THREE.PlaneGeometry(1, 1);
					let mesh = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));

					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						mesh: mesh,
						material: material,
					}
				});
			}

			//
			this.circle = function(vector, id)
			{
				return $getMesh(id, _enum.CIRCLE, function()
				{
					let material = $getMaterial(_enum.MESH, _enum.BASIC);
					let geometry = new THREE.CircleGeometry(1, 100);
					let mesh = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));
					
					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						mesh: mesh,
						material: material,
					}
				});
			}

			//
			this.polygon = function(vector, vetices, id)
			{
				return $getMesh(id, _enum.CIRCLE, function()
				{
					let material = $getMaterial(_enum.MESH, _enum.BASIC);
					let geometry = new THREE.CircleGeometry(1, vetices);
					let mesh = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));
					
					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						mesh: mesh,
						material: material,
					}
				});
			}

			//
			this.ring = function(vector, id)
			{
				return $getMesh(id, _enum.RING, function()
				{
					let material = $getMaterial(_enum.MESH, _enum.BASIC);
					let geometry = new THREE.TorusGeometry(3, 0.3, 16, 50);
					let mesh = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));
					
					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						mesh: mesh,
						material: material,
					}
				});
			}

			//
			this.point = function(vectors, id)
			{
				return $getMesh(id, _enum.POINT, function()
				{
					let material = $getMaterial(_enum.POINT, _enum.NONE);
					let geometry = new THREE.Geometry();
					vectors = vectors.get();
					for (var index in vectors) {
						geometry.vertices.push(vectors[index]);
					}
					let mesh = new THREE.Points(geometry, material.get(_enum.MATERIAL));

					return {
						mesh: mesh,
						material: material,
					}
				});
			}

			//
			this.arc = function(pc, ratio, id)
			{
				return $getMesh(id, _enum.ARC, function()
				{
					ratio = (typeof(ratio) == 'undefined' ? 10 : ratio);
					pc = (typeof(pc) == 'undefined' ? 50 : pc);
					let calcul = ((Math.PI * 2) * pc) / 100
					let curve = new THREE.EllipseCurve(
						0, 0,
						ratio, ratio,
						0, calcul
					);
					let points = curve.getSpacedPoints(60);
					let path = new THREE.Path();
					let geometry = path.createGeometry(points);
					let material = $getMaterial(_enum.LINE, _enum.BASIC);
					let mesh = new THREE.Line(geometry, material.get(_enum.MATERIAL));

					return {
						mesh: mesh,
						material: material,
					}
				});
			}

			//
			this.triangle = function(vector, id)
			{
				return $getMesh(id, _enum.TRIANGLE, function()
				{
					let material = $getMaterial(_enum.MESH, _enum.BASIC);
					let geometry = new THREE.Geometry();
					geometry.vertices.push(vector.get(0), vector.get(1), vector.get(2));
					geometry.faces.push(new THREE.Face3(0, 1, 2));
					let mesh = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));

					return {
						mesh: mesh,
						material: material,
					}
				});
			}

			//
			this.line = function(vectors, id)
			{
				return $getMesh(id, _enum.LINE, function()
				{
					let material = $getMaterial(_enum.LINE, _enum.BASIC);
					let geometry = new THREE.Geometry();
					vectors = vectors.get();
					for (var index in vectors) {
						geometry.vertices.push(vectors[index]);
					}
					let mesh = new THREE.Line(geometry, material.get(_enum.MATERIAL));
					
					return {
						mesh: mesh,
						material: material,
					}
				});
			}

			//
			this.curve = function(vectors, id)
			{
				return $getMesh(id, _enum.CURVE, function()
				{
					let curve = new THREE.CubicBezierCurve3(vectors.get(0), vectors.get(1), vectors.get(2), vectors.get(3));
					let material = $getMaterial(_enum.LINE, _enum.BASIC);
					let geometry = new THREE.Geometry();
					geometry.vertices = curve.getPoints(50);
					let mesh = new THREE.Line(geometry, material.get(_enum.MATERIAL));
					
					return {
						mesh: mesh,
						material: material,
					}
				});
			}
			
			//
			this.spline = function(vectors, id)
			{
				return $getMesh(id, _enum.SPLINE, function()
				{
					let spline = new THREE.CatmullRomCurve3([vectors.get(0), vectors.get(1), vectors.get(2), vectors.get(3),vectors.get(4)]);
					let material = $getMaterial(_enum.LINE, _enum.BASIC);
					let geometry = new THREE.Geometry();
					geometry.vertices = spline.getPoints(50);
					let mesh = new THREE.Line(geometry, material.get(_enum.MATERIAL));
					
					return {
						mesh: mesh,
						material: material,
					}
				});
			}
			
			//
			this.surface = function(vectors, id)
			{
				return $getMesh(id, _enum.SURFACE, function()
				{
					var degree1 = 2;
					var degree2 = 3;
					var knots1 = [0, 0, 0, 1, 1, 1];
					var knots2 = [0, 0, 0, 0, 1, 1, 1, 1];
					
					let controlPoints = (function(vectors) {
						let points = [];
						for (let index in vectors) {
							points.push([vectors[index].get(0), vectors[index].get(1), vectors[index].get(2), vectors[index].get(3)]);
						}
						return points;
					})(vectors);

					let surface = new THREE.NURBSSurface(degree1, degree2, knots1, knots2, controlPoints);
													 
					getSurfacePoint = function(u, v) {
						return surface.getPoint(u, v);
					};
					
					let material = $getMaterial(_enum.MESH, _enum.PHONG);
					let geometry = new THREE.ParametricBufferGeometry( getSurfacePoint, 20, 20 );
					
					let mesh = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));
					
					return {
						mesh: mesh,
						material: material,
					}
				});
			}
			
			//
			this.text = function(text, id)
			{
				return $getMesh(id, _enum.TEXT, function()
				{
					let material = $getMaterial(_enum.MESH, _enum.BASIC);
					let geometry = new THREE.Geometry();
					let mesh = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));

					return {
						mesh: mesh,
						material: material,
					}
				}, function(mesh)
				{
					let loader = new THREE.FontLoader();
					loader.load(__engine.config.font, function(font) {
						let name = mesh._name;
					 	mesh.remove();
					 	
					 	let material = $getMaterial(_enum.MESH, _enum.BASIC);
						let geometry = new THREE.TextGeometry(text, {
							material: 0,
							extrudeMaterial: 1,
							bevelEnabled: false,
							bevelThickness: 8,
							bevelSize: 4,
							font: font,
							weight: "normal",
							style: "normal",
							height: 0,
							size: 30,
							curveSegments: 4
						});
						let mesh2 = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));
						___engine.this.add(name, _enum.TEXT, mesh2);
					});
				});
			}

			//
			this.obj = function(urlObj, urlMtl, id)
			{
				return $getMesh(id, _enum.OBJ, function()
				{
					let material = $getMaterial(_enum.MESH, _enum.BASIC);
					let geometry = new THREE.Geometry();
					let mesh = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));

					return {
						mesh: mesh,
						material: material,
					}
				}, function(mesh)
				{
					let mtlLoad = function() {
						var mtlLoader = new THREE.MTLLoader();
						mtlLoader.load(urlMtl, objLoad);
					}
					let objLoad = function(materials) {
						let objLoader = new THREE.OBJLoader();
						if (typeof(materials) != 'undefined') {
							objLoader.setMaterials(materials);
						}
						objLoader.load(urlObj, function(obj) {
							let name = mesh._name;
							mesh.remove();
							___engine.this.add(name, _enum.OBJ, obj);
						});
					}
					if (urlMtl != null && typeof(urlMtl) == 'string') {
						mtlLoad();
						return ;
					}
					objLoad();
				});
			}

			//
			this.bvh = function(urlBvh, id)
			{
				return $getMesh(id, _enum.BVH, function()
				{
					let material = $getMaterial(_enum.MESH, _enum.BASIC);
					let geometry = new THREE.Geometry();
					let mesh = new THREE.Mesh(geometry, material.get(_enum.MATERIAL));

					return {
						mesh: mesh,
						material: material,
					}
				}, function(mesh)
				{
					let loader = new THREE.BVHLoader();
					loader.load(urlBvh, function(result) {

						let skeletonHelper = new THREE.SkeletonHelper(result.skeleton.bones[0]);
						skeletonHelper.skeleton = result.skeleton;

						let boneContainer = new THREE.Group();
						boneContainer.add(result.skeleton.bones[0]);

						//
						let name = mesh._name;
						mesh.remove();
					 	let obj = ___engine.this.add(name, _enum.BVH, boneContainer);
					 	obj.set(_enum.OBJECT, skeletonHelper);

						//
						let mixer = new THREE.AnimationMixer(skeletonHelper);
						mixer.clipAction(result.clip).setEffectiveWeight(1.0).play();

						//
						var clock = new THREE.Clock();
						obj.set(_enum.UPDATE, mixer, function() {
							return clock.getDelta();
						});
						obj.set(_enum.UPDATE, skeletonHelper);
						
					});
				});
			}

			//
			this.set = function(object)
			{
				find = $findKey(___engine.mesh, object._name);
				if (find == -1) {
					return null;
				}
				for (let index in object) {
					if (index[0] == '_') {
						let datas = object[index];
						if (index == '_scale' || index == '_rotation' || index == '_position') {
							datas = _engine.this.vector(datas.x, datas.y, datas.z);
						}
						___engine.mesh[find].mesh[index] = datas;
					}
				}
				return ___engine.mesh[find].mesh;
			}

			//
			this.get = function(type, id, full)
			{
				let find;
				let ret = [];
				switch (type)
				{
					case _enum.OBJECTS:
						if (id == null || typeof(id) == 'undefined') {
							return ___engine.mesh;
						}
						find = $findKey(___engine.mesh, id);
						if (find == -1) {
							return null;
						}
						if (typeof(full) == 'boolean' && full == true) {
							return ___engine.mesh[find];
						}
						return ___engine.mesh[find].mesh;
					break;
					case _enum.CAMERA:
						for (let index in ___engine.mesh) {
							if (___engine.mesh[index].originalType == type) {
								if (id != null && ___engine.mesh[index].id == id) {
									if (typeof(full) == 'boolean' && full == true) {
										return ___engine.mesh[index];
									}
									return ___engine.mesh[index].mesh;
								}
								ret.push(___engine.mesh[index]);
							}
						}
						if (id != null) {
							return null;
						}
						return ret;
					break;
					case _enum.MERGE:
						for (let index in ___engine.mesh) {
							if (___engine.mesh[index].originalType == type) {
								if (id != null && ___engine.mesh[index].id == id) {
									if (typeof(full) == 'boolean' && full == true) {
										return ___engine.mesh[index];
									}
									return ___engine.mesh[index].mesh;
								}
								ret.push(___engine.mesh[index]);
							}
						}
						if (id != null) {
							return null;
						}
						return ret;
					break;
					case _enum.MESH:
						for (let index in ___engine.mesh) {
							if (___engine.mesh[index].originalType == type) {
								if (id != null && ___engine.mesh[index].id == id) {
									if (typeof(full) == 'boolean' && full == true) {
										return ___engine.mesh[index];
									}
									return ___engine.mesh[index].mesh;
								}
								ret.push(___engine.mesh[index]);
							}
						}
						if (id != null) {
							return null;
						}
						return ret;
					break;
					case _enum.MESHS:
						for (let index in ___engine.mesh) {
							if (id != null && ___engine.mesh[index].id == id) {
								if (typeof(full) == 'boolean' && full == true) {
									return ___engine.mesh[index];
								}
								return ___engine.mesh[index].mesh.get(_enum.MESH);
							}
							if (___engine.mesh[index].mesh.get(_enum.MESH) != null) {
								ret.push(___engine.mesh[index].mesh.get(_enum.MESH));
							}
						}
						if (id != null) {
							return null;
						}
						return ret;
					break;
					default:
						return null;
				}
			}

			//
			const $getMesh = function(id, type, infosMesh, meshLoaded)
			{
				if (typeof(infosMesh) != 'function') {
					return null;
				}
				id = (typeof(id) != 'string' ? $getId(___engine.mesh, type, id) : id);
				let find = $findKey(___engine.mesh, id);
				if (find != -1) {
					return null;
				}
				let build = new $mesh;
				let datas = infosMesh();
				build.init(id, type, datas.mesh, datas.material, meshLoaded);
				return build;
			}

			//
			const $getMaterial = function(type, typeMaterial)
			{
				let build = new $material;
				build.init(type, typeMaterial);
				return build;
			}

			//
			const $material = function()
			{
				let ____engine = {
					this: this,
					type: _enum.MATERIAL,
					materials: {},
					current: {
						type: _enum.NONE,
						typeMaterial: _enum.NONE,
						materials: {},
					},
				};

				//
				(function()
				{
					// mesh
					____engine.materials[_enum.MESH] = {};
					____engine.materials[_enum.MESH][_enum.PHONG] = {
						name: 'MeshPhongMaterial',
						func: THREE.MeshPhongMaterial,
						config: __engine.config.scene.material,
					};
					____engine.materials[_enum.MESH][_enum.STANDARD] = {
						name: 'MeshStandardMaterial',
						func: THREE.MeshStandardMaterial,
						config: __engine.config.scene.material,
					};
					____engine.materials[_enum.MESH][_enum.BASIC] = {
						name: 'MeshBasicMaterial',
						func: THREE.MeshBasicMaterial,
						config: __engine.config.scene.material,
					};
					____engine.materials[_enum.MESH][_enum.DEPTH] = {
						name: 'MeshDepthMaterial',
						func: THREE.MeshDepthMaterial,
						config: __engine.config.scene.material,
					};
					____engine.materials[_enum.MESH][_enum.LAMBERT] = {
						name: 'MeshLambertMaterial',
						func: THREE.MeshLambertMaterial,
						config: __engine.config.scene.material,
					};
					____engine.materials[_enum.MESH][_enum.NORMAL] = {
						name: 'MeshNormalMaterial',
						func: THREE.MeshNormalMaterial,
						config: __engine.config.scene.material,
					};
					____engine.materials[_enum.MESH][_enum.PHYSICAL] = {
						name: 'MeshPhysicalMaterial',
						func: THREE.MeshPhysicalMaterial,
						config: __engine.config.scene.material,
					};
					____engine.materials[_enum.MESH][_enum.TOON] = {
						name: 'MeshToonMaterial',
						func: THREE.MeshToonMaterial,
						config: __engine.config.scene.material,
					};

					// point
					____engine.materials[_enum.POINT] = {};
					____engine.materials[_enum.POINT][_enum.NONE] = {
						name: 'PointsMaterial',
						func: THREE.PointsMaterial,
						config: __engine.config.scene.pointMaterial,
					};

					// line
					____engine.materials[_enum.LINE] = {};
					____engine.materials[_enum.LINE][_enum.BASIC] = {
						name: 'LineBasicMaterial',
						func: THREE.LineBasicMaterial,
						config: __engine.config.scene.lineMaterial,
					};
					____engine.materials[_enum.LINE][_enum.DASHED] = {
						name: 'LineDashedMaterial',
						func: THREE.LineDashedMaterial,
						config: __engine.config.scene.lineMaterial,
					};
				})();

				//
				this.init = function(type, typeMaterial)
				{
					//
					____engine.current.type = type;
					____engine.current.typeMaterial = typeMaterial;

					//
					for (var index in ____engine.materials[____engine.current.type]) {
						____engine.current.materials[index] = {
							name: ____engine.materials[____engine.current.type][index].name,
							material: new ____engine.materials[____engine.current.type][index].func(____engine.materials[____engine.current.type][index].config),
						};
					}

					//
					$updateProperty();

					delete ____engine.this.init;
					return ____engine.this;
				}

				//
				this.isValid = function(typeMaterial)
				{
					//if (typeof(____engine.materials[type]) == 'undefined' || typeof(____engine.materials[type][typeMaterial]) == 'undefined') {
					if (typeof(____engine.current.materials[typeMaterial]) == 'undefined') {
						return false;
					}
					return true;
				}

				//
				this.change = function(typeMaterial)
				{
					if (this.isValid(typeMaterial) == false) {
						return false;
					}
					____engine.current.typeMaterial = typeMaterial;
					$updateProperty();
					return true;
				}

				//
				this.get = function(type, id, full)
				{
					let find;
					switch (type)
					{
						case _enum.MATERIAL:
							return ____engine.current.materials[____engine.current.typeMaterial].material;
						break;
						case _enum.LIST:
							let list = [];
							for (let index in ____engine.current.materials) {
								list.push({
									name: ____engine.current.materials[index].name,
									type: index,
								});
							}
							return list;
						break;
						default:
							return null;
					}
				}
			
				//
				let $updateProperty = function()
				{
					//
					for (let index in ____engine.this) {
						if (index[0] == '_') {
							let name = index.substring(1);
							if (____engine.this[name].removable == true) {
								delete ____engine.this[name];
								delete ____engine.this[index];
							}
						}
					}

					//
					let material = ____engine.current.materials[____engine.current.typeMaterial].material;
					for (let index in material) {
						if (typeof(material[index]) != 'function' && index[0] != '_') {
							$copyProperty(____engine, index, function (param) {
								let name = arguments.callee.myname;
								for (let index2 in ____engine.current.materials)
								{
									if (typeof(____engine.current.materials[index2].material[name]) == 'undefined') {
										continue ;
									}		
									switch (name+typeof(param))
									{
										case 'colorstring':
										case 'colornumber':
											____engine.current.materials[index2].material[name].setHex(param);
										break;
										default :
											____engine.current.materials[index2].material[name] = param;
									}
									____engine.current.materials[index2].material.needsUpdate = true;
								}
								return ____engine.this;
							}, true);
							$addPrefix(____engine, index, material);
						}
					}
					return ____engine.this;
				}

				return ____engine.this;
			}

			//
			const $mesh = function()
			{
				let ____engine = {
					this: this,
					type: _enum.MESH,
					update: [],
					objects: [],
					mesh: null,
					material: null,
					config: {
						stop: false,
					},
				}

				//
				this.init = function(id, type, mesh, material, callback)
				{
					___engine.mesh.push({
						id: id,
						type: type,
						originalType: _enum.MESH,
						mesh: ____engine.this,
						inScene: false,
						merged: false,
					});

					____engine.material = material;
					____engine.mesh = mesh;
					____engine.type = type; 
					____engine.mesh.name = id;

					//
					$addPrefix(____engine, 'name', ____engine.mesh);
					$addPrefix(____engine, 'material', ____engine.mesh);
					$addPrefix(____engine, 'scale', ____engine.mesh);
					$addPrefix(____engine, 'position', ____engine.mesh);
					$addPrefix(____engine, 'rotation', ____engine.mesh);

					//
					$addVector(____engine, 'scale', ____engine.mesh.scale);
					$addVector(____engine, 'position', ____engine.mesh.position);
					$addVector(____engine, 'rotation', ____engine.mesh.rotation);

					//
					$updateProperty();
					$toScene(mesh);
					
					//
					__engine.this.select(____engine.mesh.name, !___engine.root);

					//
					if (typeof(callback) == 'function') {
						callback(____engine.this);
					}

					//
					if (typeof(____engine.this._castShadow) != 'undefined') {
						____engine.this._castShadow = true;
					}
					if (typeof(____engine.this._receiveShadow) != 'undefined') {
						____engine.this._receiveShadow = true;
					}

					delete ____engine.this.init;
					return ____engine.this;
				}

				//
				this.material = function(type)
				{
					//
					____engine.material.change(type);
					____engine.mesh.material = ____engine.material.get(_enum.MATERIAL);

					//
					$updateProperty();

					return ____engine.this;
				}

				//
				this.name = function(id)
				{
					let find = $findKey(___engine.mesh, id);
					if (typeof(id) == 'string') {
						return null;
					}
					if (find == -1) {
						return ____engine.mesh.name;
					}
					find = $findKey(___engine.mesh, ____engine.mesh.name);
					___engine.mesh[find].id = id;
					____engine.mesh.name = id;
					return ____engine.this;
				}

				//
				this.font = function(url)
				{
					// À TESTER
					let loader = new THREE.FontLoader();
					loader.load(url, function(font) {
						____engine.mesh.geometry.font = font;
						____engine.mesh.geometry.verticesNeedUpdate = true;
					});
					return ____engine.this;
				}

				//
				this.texture = function(url)
				{
					let loader = new THREE.TextureLoader();
					loader.load(url, function(texture) {
						let material = new THREE.MeshPhongMaterial({
							map: texture,
						});
						____engine.mesh.material = material;
					});	
					return ____engine.this;
				}

				//
				this.transform = function(vector)
				{
					// À TESTER
					// À Modifier
					let points = vector.get();
					for (var index in points) {
						____engine.mesh.geometry.vertices[index].set(points[index].x, points[index].y, points[index].z, points[index].w);
					}
					if (typeof(____engine.mesh.geometry) != 'undefined') {
						____engine.mesh.geometry.verticesNeedUpdate = true;
					}
					return ____engine.this;
				}

				//
				this.scale = function(vec)
				{
					if (typeof(vec) != 'object') {
						return null;
					}
					let vector = vec.get(0);
					$extend(____engine.mesh.scale, vector);
					if (typeof(____engine.mesh.geometry) != 'undefined') {
						____engine.mesh.geometry.verticesNeedUpdate = true;
					}
					__engine.this.select(____engine.mesh.name, !___engine.root);
					return  ____engine.this;
				}
				
				//
				this.position = function(vec)
				{
					if (typeof(vec) != 'object') {
						return null;
					}
					let vector = vec.get(0);
					$extend(____engine.mesh.position, vector);
					if (typeof(____engine.mesh.geometry) != 'undefined') {
						____engine.mesh.geometry.verticesNeedUpdate = true;
					}
					__engine.this.select(____engine.mesh.name, !___engine.root);
					return  ____engine.this;
				}

				//
				this.rotation = function(vec)
				{
					if (typeof(vec) != 'object') {
						return null;
					}
					let vector = vec.get(0);
					$extend(____engine.mesh.rotation, vector);
					if (typeof(____engine.mesh.geometry) != 'undefined') {
						____engine.mesh.geometry.verticesNeedUpdate = true;
					}
					__engine.this.select(____engine.mesh.name, !___engine.root);
					return  ____engine.this;
				}

				//
				this.stop = function()
				{
					let find = $findKey(___engine.mesh, ____engine.mesh.name);
					if (find == -1) {
						return null;
					}
					____engine.config.stop = true;
					___engine.mesh[find].inScene = false;
					__engine.this.unset(____engine.this);
					__engine.this.select(____engine.mesh.name, !___engine.root);
					return ____engine.this;
				}

				//
				this.remove = function()
				{
					let find2 = (___engine.root == true ? $findKey(__engine.root, ___engine.layer) : $findKey(__engine.layer, ___engine.layer));
					let find = $findKey(___engine.mesh, ____engine.mesh.name);
					if (find == -1 || find2 == -1) {
						return null;
					}

					//
					___engine.mesh.splice(find, 1);
					
					//
					if (___engine.root == true) {
						__engine.root[find2].layer.remove(____engine.mesh);
					} else {
						__engine.layer[find2].layer.remove(____engine.mesh);
					}

					//
					for (let index in ____engine.objects) {
						if (___engine.root == true) {
							__engine.root[find2].layer.remove(____engine.objects[index]);
						} else {
							__engine.layer[find2].layer.remove(____engine.objects[index]);
						}
					}

					//
					__engine.this.select(null, !___engine.root);
					return ___engine.this;
				}

				//
				this.back = function()
				{
					return __engine.this;
				}

				//
				this.merge = function(id)
				{
					if (typeof(id) != 'string') {
						return null;
					}
					let find = $findKey(___engine.mesh, id);
					if (find == -1) {
						let merge = new $merge;
						return merge.init(id, ____engine.mesh.name);
					}
					return ___engine.mesh[find].mesh.push(____engine.mesh.name);
				}

				//
				this.set = function(type, object, param)
				{
					switch (type)
					{
						case _enum.UPDATE:
							____engine.update.push({
								object: object,
								param: param,
							});
						break;
						case _enum.OBJECT:
							____engine.objects.push(object);
							$toScene(object);
						break;
						default:
							return null;
					}
				}

				//
				this.get = function(type, id)
				{
					let find;
					switch (type)
					{
						case _enum.UPDATE:
							return ____engine.update;
						break;
						case _enum.MESH:
							return ____engine.mesh;
						break;
						case _enum.STOP:
							return __engine.config.stop;
						break;
						case _enum.TYPE:
							return ____engine.type;
						break;
						case _enum.MATERIAL:
							return ____engine.material;
						break;
						default:
							return null;
					}
				}

				//
				let $toScene = function(object)
				{
					if (___engine.root == true) {
						let find = $findKey(__engine.root, ___engine.layer);
						if (find == -1) {
							return null;
						}
						__engine.root[find].layer.add(object);
					} else {
						let find = $findKey(__engine.layer, ___engine.layer);
						if (find == -1) {
							return null;
						}
						__engine.layer[find].layer.add(object);
					}

					return ____engine.this;
				}

				//
				let $updateProperty = function()
				{
					//
					for (let index in ____engine.this)
					{
						if (index[0] == '_') {
							let name = index.substring(1);
							if (____engine.this[name].removable == true) {
								delete ____engine.this[name];
								delete ____engine.this[index];
							}
						}
					}

					//
					let material = ____engine.material;
					for (let index in material)
					{
						if (index[0] != '_' && ____engine.material[index].removable == true) {
							$copyProperty(____engine, index, function (param) {
								let name = arguments.callee.myname;
								____engine.material[name](param);
								return ____engine.this;
							}, true);
							$addPrefix(____engine, index, ____engine.material, true);
						}
					}

					/* VALEUR MANUELLE ... PAS TERRIBLE */
					//
					for (let index in ____engine.mesh)
					{
						if (index == 'color' || index == 'intensity' ||
							index == 'distance' || index == 'angle' ||
							index == 'penumbra' || index == 'decay' ||
							index == 'receiveShadow' || index == 'castShadow')
						{
							$copyProperty(____engine, index, function (param) {
								let name = arguments.callee.myname;
								switch (name+typeof(param))
								{
									case 'colorstring':
									case 'colornumber':
										____engine.mesh[name].setHex(param);
									break;
									default :
										____engine.mesh[name] = param;
								}
								// ____engine.mesh[name]
								return ____engine.this;
							}, true);
							$addPrefix(____engine, index, ____engine.mesh);
						}
					}

					return ____engine.this;
				}

				return ____engine.this;
			}

			//
			var $merge = function()
			{
				var ____engine = {
					this: this,
					type: _enum.MERGE,
					merged: [],
					mesh: null,
					property: {
						scale: _engine.this.vector(0, 0, 0, 0).get(0),
						position: _engine.this.vector(0, 0, 0, 0).get(0),
						rotation: _engine.this.vector(0, 0, 0, 0).get(0),
					},
					config: {
						stop: false,
					},
				}

				//
				this.init = function(id, meshId)
				{
					___engine.mesh.push({
						id: id,
						type: ____engine.type,
						originalType: _enum.MERGE,
						mesh: ____engine.this,
						merged: false,
					});

					//
					let material = new THREE.MeshBasicMaterial(__engine.config.scene.material);
					let geometry = new THREE.Geometry();
					____engine.mesh = new THREE.Mesh(geometry, material);
					____engine.mesh.name = id;

					//
					if (___engine.root == true) {
						let find = $findKey(__engine.root, ___engine.layer);
						if (find == -1) {
							return null;
						}
						__engine.root[find].layer.add(____engine.mesh);
					} else {
						let find = $findKey(__engine.layer, ___engine.layer);
						if (find == -1) {
							return null;
						}
						__engine.layer[find].layer.add(____engine.mesh);
					}

					//
					$addPrefix(____engine, 'name', ____engine.mesh);
					$addPrefix(____engine, 'scale', ____engine.property);
					$addPrefix(____engine, 'position', ____engine.property);
					$addPrefix(____engine, 'rotation', ____engine.property);

					//
					$addVector(____engine, 'scale', ____engine.property.scale);
					$addVector(____engine, 'position', ____engine.property.position);
					$addVector(____engine, 'rotation', ____engine.property.rotation);

					//
					if (meshId != null && typeof(meshId) == 'string') {
						____engine.this.push(meshId);
					}

					delete ____engine.this.init;
					return ____engine.this;
				}

				//
				this.push = function(id)
				{
					//
					let find = $findKey(___engine.mesh, id);
					if (find == -1) {
						return null;
					}
					let _mesh = ___engine.mesh[find];
					_mesh.merged = true;
					let mesh = _mesh.mesh;

					//
					____engine.merged.push({
						id: id,
						merge: mesh,
					});

					// NOTE: COPY MATERIAL PROPRETY

					//
					__engine.this.select(____engine.mesh.name, !___engine.root);
					
					return ____engine.this;
				}

				//
				this.name = function(id)
				{
					if (id == null || typeof(id) == 'undefined') {
						return ____engine.mesh.name;
					}
					let find = $findKey(___engine.mesh, id);
					if (find != -1) {
						return null;
					}
					find = $findKey(___engine.mesh, ____engine.mesh.name);
					___engine.mesh[find].id = id;
					____engine.mesh.name = id;
					return ____engine.this;
				}

				//
				this.scale = function(vec)
				{
					if (typeof(vec) != 'object') {
						return null;
					}
					let vector = vec.get(0);
					for (var index in ____engine.merged) {
						____engine.merged[index].merge.scale(_engine.this.vector(
							____engine.merged[index].merge.scale.x + (vector.x - ____engine.property.scale.x),
							____engine.merged[index].merge.scale.y + (vector.y - ____engine.property.scale.y),
							____engine.merged[index].merge.scale.z + (vector.z - ____engine.property.scale.z),
							____engine.merged[index].merge.scale.w + (vector.w - ____engine.property.scale.w)
						), false);
					}
					$extend(____engine.property.scale, vector);
					$extend(____engine.mesh.scale, vector);
					__engine.this.select(____engine.mesh.name, !___engine.root);
					return  ____engine.this;
				}

				//
				this.position = function(vec)
				{
					if (typeof(vec) != 'object') {
						return null;
					}
					let vector = vec.get(0);
					for (var index in ____engine.merged) {
						____engine.merged[index].merge.position(_engine.this.vector(
							____engine.merged[index].merge.position.x + (vector.x - ____engine.property.position.x),
							____engine.merged[index].merge.position.y + (vector.y - ____engine.property.position.y),
							____engine.merged[index].merge.position.z + (vector.z - ____engine.property.position.z),
							____engine.merged[index].merge.position.w + (vector.w - ____engine.property.position.w)
						), false);
					}
					$extend(____engine.property.position, vector);
					$extend(____engine.mesh.position, vector);
					__engine.this.select(____engine.mesh.name, !___engine.root);
					return  ____engine.this;
				}

				//
				this.rotation = function(vec)
				{
					if (typeof(vec) != 'object') {
						return null;
					}
					let vector = vec.get(0);
					for (var index in ____engine.merged) {
						____engine.merged[index].merge.rotation(_engine.this.vector(
							____engine.merged[index].merge.rotation.x + (vector.x - ____engine.property.rotation.x),
							____engine.merged[index].merge.rotation.y + (vector.y - ____engine.property.rotation.y),
							____engine.merged[index].merge.rotation.z + (vector.z - ____engine.property.rotation.z),
							____engine.merged[index].merge.rotation.w + (vector.w - ____engine.property.rotation.w)
						), false);
					}
					$extend(____engine.property.rotation, vector);
					$extend(____engine.mesh.rotation, vector);
					__engine.this.select(____engine.mesh.name, !___engine.root);
					return  ____engine.this;
				}

				//
				this.merge = function(id)
				{
					if (typeof(id) != 'string') {
						return null;
					}
					let me = $findKey(___engine.mesh, ____engine.mesh.name);
					if (me == -1) {
						return null;
					}
					let find = $findKey(___engine.mesh, id);
					if (find != -1) {
						if (___engine.mesh[find].type != _enum.MERGE) {
							return null;
						}
						let me2 = ___engine.mesh[find].mesh.get(_enum.MERGE, ____engine.mesh.name);
						if (me2 != null) {
							return me2;
						}
						___engine.mesh[find].mesh.push(id, ___engine.mesh[me].mesh);
						___engine.mesh[me].merged = true;
						return ___engine.mesh[find].mesh;
					}
					let merge = new $merge;
					merge.init(id, ___engine.mesh[me].mesh);
					___engine.mesh[me].merged = true;
					return merge;
				}

				//
				this.unmerge = function(id)
				{
					let find = $findKey(____engine.merged, id);
					if (find == -1) {
						return null;
					}
					let me;
					if (____engine.merged[find].merge.get(_enum.TYPE) == _enum.MERGE) {
						me = $findKey(___engine.mesh, id);
						if (me == -1 || ___engine.mesh[me].type != _enum.MERGE) {
							return null;
						}
						___engine.mesh[me].merged = false;
					} else {
						me = $findKey(___engine.mesh, id);
						if (me == -1) {
							return null;
						}
						___engine.mesh[me].merged = false;
					}
					____engine.merged.splice(find, 1);
					__engine.this.select(____engine.mesh.name, !___engine.root);
					return ____engine.this;
				}

				//
				this.stop = function()
				{
					for (var index in ____engine.merged) {
						____engine.merged[index].merge.stop();
					}
					____engine.config.stop = true;
					return ____engine.this;
				}

				//
				this.remove = function()
				{
					let find = $findKey(___engine.mesh, ____engine.mesh.name);
					if (find == -1) {
						return null;
					}
					for (var index in ____engine.merged) {
						____engine.merged[index].merge.remove();
					}
					___engine.mesh.slice(find, 1);
					__engine.this.select(null, !___engine.root);
					return ___engine.this;
				}

				//
				this.back = function()
				{
					return __engine.this;
				}

				//
				this.get = function(type, id, full)
				{
					let find;
					switch (type)
					{
						case _enum.MERGE:
							if (typeof(id) == 'undefined' || id == null) {
								return ____engine.merged;
							}
							find = $findKey(____engine.merged, id);
							if (find == -1) {
								return null;
							}
							if (typeof(full) == 'boolean' && full == true) {
								return ____engine.merged[find];
							}
							return ____engine.merged[find].merge;
						break;
						case _enum.TYPE:
							return ____engine.type;
						break;
						case _enum.MESH:
							return ____engine.mesh;
						break;
						default:
							return null;
					}
				}



				return ____engine.this;
			}

			//
			const $camera = function()
			{
				let ____engine = {
					id: '',
					this: this,
					type: _enum.CAMERA,
					idRender: '',
					perspective: {
						camera: null,
						controls: {
							scene: null,
							object: null,
						},
					},
					orthographic: {
						camera: null,
						controls: {
							scene: null,
							object: null,
						},
					},
					currentType: null,
					composer: null,
				}

				//
				this.init = function(id)
				{
					let initCamera = function(type)
					{
						//
						____engine[type].camera.name = id;				

						//
						$extend(____engine[type].camera.position, __engine.config.scene.camera.position);
						$extend(____engine[type].camera.rotation, __engine.config.scene.camera.rotation);

						/*** Black magic ***/
						for (let index in ____engine[type].camera) {
							if (typeof(____engine[type].camera[index]) != 'function' && typeof(____engine.this[index]) == 'undefined' && index[0] != '_') {
								$copyProperty(____engine, index, function (param) {
									let name = arguments.callee.myname;
									if (typeof(____engine.orthographic.camera[name]) != 'undefined') {
										____engine.orthographic.camera[name] = param;
										____engine.orthographic.camera.updateProjectionMatrix();
									}
									if (typeof(____engine.perspective.camera[name]) != 'undefined') {
										____engine.perspective.camera[name] = param;
										____engine.perspective.camera.updateProjectionMatrix();
									}
									return ____engine.this;
								});
								$addPrefix(____engine, index, ____engine[type].camera);
							}
						}
						/*** END ***/
					}

					//
					____engine.id = id;
					____engine.currentType = _enum.PERSPECTIVE;
					
					//
					___engine.mesh.push({
						id: id,
						type: ____engine.type,
						originalType: _enum.CAMERA,
						mesh: ____engine.this,
						merged: false,
					});

					//
					____engine.orthographic.camera = new THREE.OrthographicCamera(__engine.config.scene.camera.left, __engine.config.scene.camera.right, __engine.config.scene.camera.top, __engine.config.scene.camera.bottom, __engine.config.scene.camera.near, __engine.config.scene.camera.far);
					____engine.perspective.camera = new THREE.PerspectiveCamera(__engine.config.scene.camera.fov, __engine.config.scene.camera.aspect, __engine.config.scene.camera.near, __engine.config.scene.camera.far);
					
					//
					if (___engine.root == true) {
						let find = $findKey(__engine.root, ___engine.layer);
						if (find == -1) {
							return null;
						}
						__engine.root[find].layer.add(____engine.orthographic.camera);
						__engine.root[find].layer.add(____engine.perspective.camera);
					} else {
						let find = $findKey(__engine.layer, ___engine.layer);
						if (find == -1) {
							return null;
						}
						__engine.layer[find].layer.add(____engine.orthographic.camera);
						__engine.layer[find].layer.add(____engine.perspective.camera);
					}

					//
					initCamera(_enum.PERSPECTIVE);
					initCamera(_enum.ORTHOGRAPHIC);

					//
					$addPrefix(____engine, 'name', ____engine.perspective.camera);
					$addPrefix(____engine, 'position', ____engine.perspective.camera);
					$addPrefix(____engine, 'rotation', ____engine.perspective.camera);
					
					//
					$addVector(____engine, 'position', ____engine.perspective.camera.position);
					$addVector(____engine, 'rotation', ____engine.perspective.camera.rotation);

					delete ____engine.this.init;
					return ____engine.this;
				}

				//
				this.addControls = function(rendererObject)
				{
					let initControls = function(type)
					{
						//
						____engine[type].controls.scene = new THREE.TrackballControls(____engine[type].camera, rendererObject.renderer.domElement);
						$extend(____engine[type].controls.scene, __engine.config.scene.controls.scene.property, true);
						____engine[type].controls.scene.addEventListener('change', function(e)
						{
							//
							____engine.this.position(_engine.this.vector(e.target.object.position.x, e.target.object.position.y, e.target.object.position.z));

							//
							for (let index in __engine.change) {
								__engine.change[index](____engine.this, _enum.CAMERA);
							}
						});

						//
						____engine[type].controls.object = new THREE.TransformControls(____engine[type].camera, rendererObject.renderer.domElement);
						$extend(____engine[type].controls.object, __engine.config.scene.controls.object.property, true);
						____engine[type].controls.object.addEventListener('mouseDown', function(e)
						{
							__engine.tracking.mouse.type = _enum.OBJECT;
						});
						____engine[type].controls.object.addEventListener('change', function(e)
						{
							//
							let mesh = __engine.this.get(_enum.OBJECTS).get(_enum.OBJECTS, e.target.object.name);
							mesh.position(BRANCH.vector(e.target.object.position.x, e.target.object.position.y, e.target.object.position.z));
							mesh.rotation(BRANCH.vector(e.target.object.rotation.x, e.target.object.rotation.y, e.target.object.rotation.z));
							mesh.scale(BRANCH.vector(e.target.object.scale.x, e.target.object.scale.y, e.target.object.scale.z));
						
							//
							for (let index in __engine.change) {
								__engine.change[index](mesh, mesh.get(_enum.TYPE));
							}
						});
					}
					initControls(_enum.PERSPECTIVE);
					initControls(_enum.ORTHOGRAPHIC);



					/* NOTE: Ne gère pas le multi layer MAIS ne pas toucher !! */
					//
					____engine.composer = new THREE.EffectComposer(rendererObject.renderer);

					____engine.composer.addPass(new THREE.RenderPass(__engine.this.get(_enum.CURRENT), ____engine[____engine.currentType].camera));

					var effect = new THREE.ShaderPass( THREE.DotScreenShader );
					effect.uniforms[ 'scale' ].value = 4;
					____engine.composer.addPass( effect );

					var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
					effect.uniforms[ 'amount' ].value = 0.0015;
					effect.renderToScreen = true;
					____engine.composer.addPass( effect );




					return ____engine.this;
				}

				//
				this.name = function(id)
				{
					if (id == null || typeof(id) == 'undefined') {
						return ____engine.id;
					}
					let find = $findKey(___engine.mesh, id);
					if (find != -1) {
						return null;
					}
					find = $findKey(___engine.mesh, ____engine.id);
					___engine.mesh[find].id = id;
					____engine.perspective.camera.name = id;
					____engine.orthographic.camera.name = id;
					for (let index in __engine.renderer) {
						if (__engine.renderer[index].idCamera == ____engine.id) {
							__engine.renderer[index].idCamera = id;
						}
					}
					____engine.id = id;
					return ____engine.this;
				}

				//
				this.removeControls = function()
				{
					delete ____engine[_enum.PERSPECTIVE].controls.scene;
					delete ____engine[_enum.PERSPECTIVE].controls.object;
					delete ____engine[_enum.ORTHOGRAPHIC].controls.scene;
					delete ____engine[_enum.ORTHOGRAPHIC].controls.object;
					return ____engine.this;
				}

				//
				this.setMode = function(mode)
				{
					if (mode == _enum.ORIGIN) {
						____engine[_enum.PERSPECTIVE].controls.object.setSpace('local');
						____engine[_enum.ORTHOGRAPHIC].controls.object.setSpace('local');
					}
					if (mode == _enum.AXIS) {
						____engine[_enum.PERSPECTIVE].controls.object.setSpace('world');
						____engine[_enum.ORTHOGRAPHIC].controls.object.setSpace('world');
					}
					if (mode == _enum.SCALE || mode == _enum.ROTATE || mode == _enum.TRANSLATE) {
						____engine[_enum.PERSPECTIVE].controls.object.setMode(mode);
						____engine[_enum.ORTHOGRAPHIC].controls.object.setMode(mode);
					}
					return ____engine.this;
				}

				//
				this.disableObject = function()
				{
					____engine.orthographic.controls.object.detach();
					____engine.perspective.controls.object.detach();
					return ____engine.this;
				}

				//
				this.enableObject = function(object)
				{
					if (____engine.orthographic.controls.object == null) {
						return ;
					}
					____engine.orthographic.controls.object.attach(object);
					____engine.perspective.controls.object.attach(object);
					return ____engine.this;
				}

				//
				this.switch = function(type)
				{
					____engine.currentType = type;
					return ____engine.this;
				}

				//
				this.position = function(vector)
				{
					if (typeof(vector) != 'object') {
						return null;
					}
					vector = vector.get(0);
					$extend(____engine.perspective.camera.position, vector);
					$extend(____engine.orthographic.camera.position, vector);
					____engine.perspective.camera.updateProjectionMatrix();
					____engine.orthographic.camera.updateProjectionMatrix();
					return  ____engine.this;
				}

				//
				this.rotation = function(vector)
				{
					if (typeof(vector) != 'object') {
						return null;
					}
					vector = vector.get(0);

					//
					let pos_rot = ____engine.perspective.camera.position;
					
					//Rot Angle X
					// Point Y, Z

					pos_rot.z = pos_rot.z * Math.cos(vector.x) - pos_rot.y * Math.sin(vector.x)
					pos_rot.y = pos_rot.z * Math.sin(vector.x) + pos_rot.y * Math.cos(vector.x)

					//Rot Angle Y
					// Point X, Z

					pos_rot.x = pos_rot.x * Math.cos(vector.y) - pos_rot.z * Math.sin(vector.y)
					pos_rot.z = pos_rot.x * Math.sin(vector.y) + pos_rot.z * Math.cos(vector.y)

					//Rot Angle Z
					// Point X, Y

					pos_rot.x = pos_rot.x * Math.cos(vector.z) - pos_rot.y * Math.sin(vector.z)
					pos_rot.y = pos_rot.x * Math.sin(vector.z) + pos_rot.y * Math.cos(vector.z)

					$extend(____engine.perspective.camera.position, pos_rot);
					$extend(____engine.orthographic.camera.position, pos_rot);
					____engine.perspective.camera.updateProjectionMatrix();
					____engine.orthographic.camera.updateProjectionMatrix();
					return  ____engine.this;
				}

				//
				this.back = function()
				{
					return __engine.this;
				}

				//
				this.remove = function()
				{
					let find2 = (___engine.root == true ? $findKey(__engine.root, ___engine.layer) : $findKey(__engine.layer, ___engine.layer));
					let find = $findKey(___engine.mesh, ____engine.id);
					if (find == -1 || find2 == -1) {
						return null;
					}
					___engine.mesh.splice(find, 1);
					if (___engine.root == true) {
						__engine.root[find2].layer.remove(____engine.mesh);
					} else {
						__engine.layer[find2].layer.remove(____engine.mesh);
					}
					__engine.this.select(null, !___engine.root);
					return ___engine.this;
				}

				//
				this.get = function(type, id, full)
				{
					let find;
					switch (type)
					{
						case _enum.COMPOSER:
							return ____engine.composer;
						break;
						case _enum.CAMERA:
							return ____engine[____engine.currentType].camera;
						break;
						case _enum.CONTROLS:
							return ____engine[____engine.currentType].controls;
						break;
						case _enum.TYPE:
							return ____engine.currentType;
						break;
						case _enum.ORTHOGRAPHIC:
							return ____engine[_enum.ORTHOGRAPHIC].camera;
						break;
						case _enum.PERSPECTIVE:
							return ____engine[_enum.PERSPECTIVE].camera;
						break;
						case _enum.TYPE:
							return ____engine.type;
						break;
						default:
							return null;
					}
				}
			}
		}
	}
	
	//
	const $vector = function()
	{
		let __engine = {
			this: this,
			type: _enum.VECTOR,
			vector: [],
		};

		//
		this.init = function(arg)
		{
			if (arg.length > 0) {
				__engine.vector.push({
					x: arg[0],
					y: arg[1],
					z: arg[2],
					w: arg[3],
				});
			}
			return __engine.this;
		}

		//
		this.vector = function()
		{
			return __engine.this.init(arguments);
		}

		//
		this.random = function(type, vecMin, vecMax)
		{
			let vector = {
				x: 0,
				y: 0,
				z: 0,
				w: 0,
			};
			
			vecMin = (vecMin == null || typeof(vecMin) == 'undefined' ? (new $vector).init([(window.innerWidth / 2) * -1, (window.innerHeight / 2) * -1, 0, 0]) : vecMin);
			vecMax = (vecMax == null || typeof(vecMax) == 'undefined' ? (new $vector).init([window.innerWidth / 2, window.innerHeight / 2, 0, 0]) : vecMax);

			let rand = function(min, max)
			{
				let valMax = Math.floor(Math.random() * max);
				let valMin = Math.floor(Math.random() * min);
				valMax = (valMax > max ? max : valMax);
				valMin = (valMin > max ? max : valMin);
				return ((valMax + valMin) / 2);
			}
			
			if (type == _enum.VECTOR4) {
				vector.w = rand(vecMin.get(0).w, vecMax.get(0).w);
			}
			if (type == _enum.VECTOR3) {
				vector.z = rand(vecMin.get(0).z, vecMax.get(0).z);
			}
			vector.x = rand(vecMin.get(0).x, vecMax.get(0).x);
			vector.y = rand(vecMin.get(0).y, vecMax.get(0).y);
			__engine.vector.push(vector);
			return __engine.this;
		}

		//
		this.push = function(vector)
		{
			vector = vector.get(0);
			return __engine.this.init([vector.x, vector.y, vector.z, vector.w]);
		}

		//
		this.slice = function(id)
		{
			let build = new $vector;
			build.init([__engine.vector[id].x, __engine.vector[id].y, __engine.vector[id].z, __engine.vector[id].w]);
			return build;
		}

		//
		this.get = function(id)
		{
			if (typeof(id) == 'undefined') {
				let vectors = [];
				for (var index in __engine.vector) {
					vectors.push(__engine.this.get(index));
				}
				return vectors;
			}
			if (typeof(__engine.vector[id].z) == 'undefined') {
				return new THREE.Vector2(__engine.vector[id].x, __engine.vector[id].y);
			}
			if (typeof(__engine.vector[id].w) == 'undefined') {
				return new THREE.Vector3(__engine.vector[id].x, __engine.vector[id].y, __engine.vector[id].z);
			}
			return new THREE.Vector4(__engine.vector[id].x, __engine.vector[id].y, __engine.vector[id].z, __engine.vector[id].w);
		}

		return __engine.this;
	}

	//
	const $copy = function(obj, obj2)
	{
		let copy = [];
		for (let index in obj) {
			copy[index] = obj[index];
		}
		for (let index in obj2) {
			copy[index] = obj2[index];
		}
		return copy;
	}

	//
	const $extend = function(obj, obj2, replace, excluded)
	{
		replace = (typeof(replace) != 'boolean' ? true : replace);
		for (let index in obj2) {
			let find = false;
			if (Array.isArray(excluded) == true) {
				for (let index2 in excluded) {
					if (excluded[index2] == index) {
						find = true;
						break;
					}
				}
			}
			if ((typeof(obj[index]) == 'undefined' && find == false) || (replace == true && find == false)) {
				obj[index] = obj2[index];
			}
		}
		return obj;
	}

	//
	const $findKey = function(obj, id)
	{
		if (id == null || typeof(id) != 'string') {
			return -1;
		}
		for (let index in obj) {
			if (typeof(obj[index]) == 'object' && id == obj[index].id) {
				return index;
			} 
		}
		return -1;
	}

	//
	const $getId = function(obj, type, len)
	{
		len = (typeof(len) == 'undefined' ? 1 : len);
		let id = type+(obj.length + len);
		if ($findKey(obj, id) != -1) {
			return $getId(obj, type, len + 1);
		}
		return id;
	}

	//
	const $copyProperty = function(me, name, value, removable)
	{
		if (typeof(me.this[name]) != 'undefined') {
			return false;
		}
		me.this[name] = value;
		me.this[name].myname = name;
		me.this[name].removable = (typeof(removable) == 'boolean' ? removable : false);
		return true;
	}

	//
	const $addPrefix = function(me, name, object, inception)
	{
		if (typeof(me.this['_'+name]) != 'undefined') {
			return false;
		}
		me.this['_'+name] = () => {};
		Object.defineProperty(me.this, '_'+name, {
			set: function(value2) {
				if (typeof(value2) == 'undefined') {
					return ;
				}
				me.this[name](value2);
			},
			get: function() {
				if (typeof(inception) == 'boolean' && inception == true) {
					return object['_'+name];
				}
				return object[name];
			},
		});
		return true;
	}

	//
	const $addVector = function(me, name, value)
	{
		if (typeof(me.this[name].x) != 'undefined') {
			return null;
		}
		Object.defineProperty(me.this[name], 'x', {
			set: function(value2) {
				if (typeof(value2) == 'undefined') {
					return ;
				}
				me.this[name](_engine.this.vector(value2, value.y, value.z, value.w));
			},
			get: function() {
				return value.x;
			},
		});
		Object.defineProperty(me.this[name], 'y', {
			set: function(value2) {
				if (typeof(value2) == 'undefined') {
					return ;
				}
				me.this[name](_engine.this.vector(value.x, value2, value.z, value.w));
			},
			get: function() {
				return value.y;
			},
		});
		Object.defineProperty(me.this[name], 'z', {
			set: function(value2) {
				if (typeof(value2) == 'undefined') {
					return ;
				}
				me.this[name](_engine.this.vector(value.x, value.y, value2, value.w));
			},
			get: function() {
				return value.z;
			},
		});
		Object.defineProperty(me.this[name], 'w', {
			set: function(value2) {
				if (typeof(value2) == 'undefined') {
					return ;
				}
				me.this[name](_engine.this.vector(value.x, value.y, value.z, value2));
			},
			get: function() {
				return value.w;
			},
		});
	}

	//
	const $update = setInterval(function()
	{
		let update = _engine.update;
		for (let index in update) {
			update[index]();
		}
	}, _engine.config.timeUpdate);

	//
	const $draw = function()
	{
		let draw = _engine.draw;
		for (let index in draw) {
			draw[index]();
		}
		
		for (let index in _engine.scene)
		{
			let scene = _engine.scene[index].scene;
			let renderer = scene.get(_enum.RENDERER);
			let objects = scene.get(_enum.OBJECTS).get(_enum.CAMERA);
			let layer = scene.get(_enum.LAYER);
			let root = scene.get(_enum.ROOT);

			for (var index2 in renderer)
			{
				let find = $findKey(objects, renderer[index2].idCamera);
				if (find != -1)
				{
					let camera = objects[find].mesh;
				
					//
					let controls = camera.get(_enum.CONTROLS)
					if (controls.scene != null) {
						controls.scene.update();
					}
					if (controls.object != null) {
						controls.object.update();
					}

					//
					for (let index3 in layer)
					{
						let meshs = layer[index3].objects.get(_enum.MESH);
						for (let index4 in meshs) {
							let update = meshs[index4].mesh.get(_enum.UPDATE);
							for (let index5 in update) {
								let param = (typeof(update[index5].param) == 'function' ? update[index5].param(renderer[index2], layer[index3], camera) : update[index5].param);
								update[index5].object.update(param);
							}
						}

						//
						renderer[index2].renderer.clearDepth();
						renderer[index2].renderer.render(layer[index3].layer, camera.get(_enum.CAMERA));
						// camera.get(_enum.COMPOSER).render();
					}

					//
					renderer[index2].layer.children.forEach(function(object) {
						object.remove();
					});
					renderer[index2].layer.children = [];
					renderer[index2].layer.add(camera.get(_enum.CONTROLS).object);
					renderer[index2].renderer.clearDepth();
					renderer[index2].renderer.render(renderer[index2].layer, camera.get(_enum.CAMERA));

					//
					for (let index3 in root) {
						renderer[index2].renderer.clearDepth();
						renderer[index2].renderer.render(root[index3].layer, camera.get(_enum.CAMERA));
					}
				}
			}
		}

		requestAnimationFrame($draw);
	}

	$draw();

	return $extend(_engine.this, _enum);
})();
