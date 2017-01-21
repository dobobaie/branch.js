var BRANCH = (function()
{
	//
	var _enum = {
		NONE: 'none',

		MESH: 'mesh',
		POINT: 'point',
		TEXT: 'text',
		LINE: 'line',
		CIRCLE: 'circle',
		TRIANGLE: 'triangle',
		CUBE: 'cube',
		CYLINDER: 'cylinder',
		CONE: 'cone',
		LIGHT: 'light',
		SQUARE: 'square',
		LINE: 'line',
		PLANE: 'plane',
		
		COLOR: 'color',
		VECTOR2: 'vector2',
		VECTOR3: 'vector3',
		VECTOR4: 'vector4',

		MATH: 'math',
		VECTOR: 'vector',
		MERGE: 'merge',
		STOP: 'stop',
		CAMERA: 'camera',
		SCENE: 'scene',
		RENDERER: 'renderer',
		BRANCH: 'branch',
		UPDATE: 'update',
		DRAW: 'draw',
	}

	//
	var _engine = {
		this: this,
		branch: [],
		config: {
			timeUpdate: 100,
		},
	}

	//
	var $copy = function(obj, obj2)
	{
		let copy = [];
		for (var index in obj) {
			copy[index] = obj[index];
		}
		for (var index in obj2) {
			copy[index] = obj2[index];
		}
		return copy;
	}

	//
	var $extend = function(obj, obj2)
	{
		if (typeof(obj2) != 'object') {
			return obj;
		}
		for (var index in obj2) {
			obj[index] = obj2[index];
		}
		return obj;
	}

	//
	var $findKey = function(obj, id)
	{
		if (typeof(id) == 'undefined') {
			return -1;
		}
		for (var index in obj) {
			if (typeof(obj[index]) == 'object' && id == obj[index].id) {
				return index;
			} 
		}
		return -1;
	}

	//
	var $getId = function(obj, type, id, len)
	{
		len = (typeof(len) == 'undefined' ? 1 : len);
		if ((id == null || typeof(id) == 'undefined') && (id = type+(obj.length + len)) && $findKey(obj, id) != -1) {
			return $getId(obj, type, null, len + 1);
		}
		return id;
	}

	//
	this.init = function(params, id, forced)
	{
		id = $getId(_engine.branch, _enum.BRANCH, id);
		let find = $findKey(_engine.branch, id);
		if (find == -1) {
			let build = new $branch;
			build.init(id, params);
			_engine.branch.push({
				id: id,
				branch: build,
			});
			return build;
		}
		if (typeof(forced) == 'boolean' && forced == true) {
			let build = new $branch;
			build.init(id, params);
			_engine.branch[find].branch = build;
			return build;
		}
		return null;
	}

	//
	var $branch = function()
	{
		//
		var __engine = {
			this: this,
			type: _enum.BRANCH,
			renderer: null,
			scene: [],
			update: [],
			draw: [],
			config: {},
		}

		//
		var __defaultConfig = {
			el: document.body,
			height: window.innerHeight,
			width: window.innerWidth,
			webGL: true,
			renderer: {
				antialias: true,
			},
			stop: false,
		}

		//
		this.init = function(id, params)
		{
			if (typeof(params) == 'function') {
				params = new params();
			}
			$extend(__engine.config, __defaultConfig);
			$extend(__engine.config, params);
			
			let canvas = document.createElement('canvas');
			__engine.renderer = (
				__engine.config.webGL == true && window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) ? 
				new THREE.WebGLRenderer(__engine.config.renderer) :
				new THREE.CanvasRenderer(__engine.config.renderer)
			);
			$extend(__engine.renderer, __engine.config);
			__engine.renderer.setSize(__engine.config.width, __engine.config.height);
			__engine.renderer.name = id;
			__engine.config.el.appendChild(__engine.renderer.domElement);

			delete this.init;
			return __engine.this;
		}

		//
		this.update = function(callback)
		{
			__engine.update.push(callback);
			return __engine.this;
		}

		//
		this.draw = function(callback)
		{
			__engine.draw.push(callback);
			return __engine.this;
		}

		//
		this.render = function()
		{
			__engine.config.stop = false;
			for (var index in __engine.scene) {
				__engine.scene[index].stop();
				__engine.scene[index].render();
			}
			return __engine.this;
		}

		//
		this.stop = function()
		{
			__engine.config.stop = true;
			return __engine.this;
		}

		//
		this.scene = function(id, forced)
		{
			id = $getId(__engine.scene, _enum.SCENE, id);
			let find = $findKey(__engine.scene, id);
			if (find == -1) {
				let build = new $scene;
				build.init(id);
				__engine.scene.push({
					id: id,
					scene: build,
				});
				return build;
			}
			if (typeof(forced) == 'boolean' && forced == true) {
				let build = new $scene;
				build.init(id);
				__engine.scene[find].scene = build;
				return build;
			}
			return null;
		}

		//
		var $scene = function()
		{
			var ___engine = {
				this: this,
				type: _enum.SCENE,
				scene: null,
				camera: [],
				mesh: [],
				merge: [],
				config: {},
				materialConfig: {},
				cameraConfig: {},
				pointMaterialConfig: {},
				lineMaterialConfig: {},
			};

			//
			var ___defaultConfig = {
				stop: false,
				font: 'fonts/helvetiker_regular.typeface.json',
			}

			//
			var ___defaultMaterialConfig = {
				color: 0xffffff,
			}

			//
			var ___defaultCameraConfig = {
				fov: 50,
				aspect: window.innerWidth / window.innerHeight,
				near: 1,
				far: 10000,
				vector: {
					x: 0,
					y: 0,
					z: 1000,
					w: 0,
				},
			}

			//
			var ___pointMaterialConfig = {
				sizeAttenuation: false,
			}

			//
			var ___lineMaterialConfig = {

			}

			//
			this.init = function(id)
			{
				___engine.scene = new THREE.Scene();
				___engine.scene.name = id;
				$extend(___engine.config, ___defaultConfig);
				$extend(___engine.materialConfig, ___defaultMaterialConfig);
				$extend(___engine.cameraConfig, ___defaultCameraConfig);
				$extend(___engine.pointMaterialConfig, ___pointMaterialConfig);
				$extend(___engine.lineMaterialConfig, ___lineMaterialConfig);

				// Make a camera manager (with one to default) and make a camera switcher
				let cameraId = $getId(___engine.camera, _enum.CAMERA);
				let camera = new THREE.PerspectiveCamera(___engine.cameraConfig.fov, ___engine.cameraConfig.aspect, ___engine.cameraConfig.near, ___engine.cameraConfig.far);
				camera.position.set(___engine.cameraConfig.vector.x, ___engine.cameraConfig.vector.y, ___engine.cameraConfig.vector.z, ___engine.cameraConfig.vector.w);
				camera.name = cameraId;
				___engine.scene.add(camera);
				___engine.camera.push({
					id: cameraId,
					camera:	camera,
					enable: true,
				});

				$extend(___engine.this.camera.position, camera.position);
				$extend(___engine.this.camera.rotation, camera.rotation);

				delete this.init;
				return  ___engine.this;
			}

			//
			this.camera = (function() {
				var ____engine = {
					this: this,
					type: _enum.CAMERA,
				}

				//
				this.position = function(vec)
				{
					for (var index in ___engine.camera) {
						if (___engine.camera[index].enable == true)
						{
							if (typeof(vec) == 'object') {
								let vector = vec.get(0);
								___engine.this.camera.position.x = vector.x;
								___engine.this.camera.position.y = vector.y;
								___engine.this.camera.position.z = vector.z;
								___engine.this.camera.position.w = vector.w;
							}
							if (___engine.camera[index].camera.position.x == ___engine.this.camera.position.x && ___engine.camera[index].camera.position.y == ___engine.this.camera.position.y &&
									___engine.camera[index].camera.position.z == ___engine.this.camera.position.z && ___engine.camera[index].camera.position.w == ___engine.this.camera.position.w) {
								return ___engine.this;
							}
							vec = (typeof(vec) == 'undefined' ? _engine.this.vector(___engine.this.camera.position.x, ___engine.this.camera.position.y, ___engine.this.camera.position.z, ___engine.this.camera.position.w) : vec);
							$extend(___engine.camera[index].camera.position, vec.get(0));
							return  ___engine.this;
						}
					}
					return  ___engine.this;
				}

				//
				this.rotation = function(vec)
				{
					for (var index in ___engine.camera) {
						if (___engine.camera[index].enable == true)
						{
							if (typeof(vec) == 'object') {
								let vector = vec.get(0);
								___engine.this.camera.rotation.x = vector.x;
								___engine.this.camera.rotation.y = vector.y;
								___engine.this.camera.rotation.z = vector.z;
								___engine.this.camera.rotation.w = vector.w;
							}
							if (___engine.camera[index].camera.rotation.x == ___engine.this.camera.rotation.x && ___engine.camera[index].camera.rotation.y == ___engine.this.camera.rotation.y &&
									___engine.camera[index].camera.rotation.z == ___engine.this.camera.rotation.z && ___engine.camera[index].camera.rotation.w == ___engine.this.camera.rotation.w) {
								return ___engine.this;
							}
							vec = (typeof(vec) == 'undefined' ? _engine.this.vector(___engine.this.camera.rotation.x, ___engine.this.camera.rotation.y, ___engine.this.camera.rotation.z, ___engine.this.camera.rotation.w) : vec);
							$extend(___engine.camera[index].camera.rotation, vec.get(0));
							return  ___engine.this;
						}
					}
					return  ___engine.this;
				}

				return ____engine.this;
			})();

			//
			var $getMesh = function(callback, id, forced)
			{
				id = $getId(___engine.mesh, _enum.MESH, id);
				let find = $findKey(___engine.mesh, id);

				if (find != -1)
				{
					if (typeof(forced) != 'boolean' || forced == false) {
						return null;
					}
					___engine.scene.remove(___engine.mesh[find].mesh.get(null, _enum.MESH));
					___engine.mesh.splice(find, 1);
				}

				let datas = callback();
				let build = new $mesh;
				build.init(id, datas.type, datas.mesh, datas.callback);
				___engine.mesh.push({
					id: id,
					type: datas.type,	
					mesh: build,
					inScene: false,
					merged: false,
				});
				return build;
			}

			//
			this.add = function(mesh, type, id, forced)
			{
				return $getMesh(function()
				{
					return {
						type: type,
						mesh: mesh,
					}
				}, id, forced);
			}

			//
			this.cone = function(height, id, forced)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshPhongMaterial(___engine.materialConfig);
					let geometry = new THREE.CylinderGeometry(0, 50, height, 32);
					let mesh = new THREE.Mesh(geometry, material);

					return {
						type: _enum.CONE,
						mesh: mesh,
					}
				}, id, forced);
			}

			//
			this.cylinder = function(height, id, forced)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshPhongMaterial(___engine.materialConfig);
					let geometry = new THREE.CylinderGeometry(50, 50, height, 50);
					
					// THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
					
					let mesh = new THREE.Mesh(geometry, material);

					return {
						type: _enum.CYLINDER,
						mesh: mesh,
					}
				}, id, forced);
			}

			//
			this.cube = function(size, vector, id, forced)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshPhongMaterial(___engine.materialConfig);

					let getSize = size.get(0);
					let geometry = new THREE.BoxGeometry(getSize.x, getSize.y, getSize.z);
					let mesh = new THREE.Mesh(geometry, material);
					$extend(mesh.position, vector.get(0));

					return {
						type: _enum.CUBE,
						mesh: mesh,
					}
				}, id, forced);
			}

			//
			this.light = function(vector, id, forced)
			{
				return $getMesh(function()
				{
					let mesh = new THREE.SpotLight();
					$extend(mesh.position, vector.get(0));

					return {
						type: _enum.LIGHT,
						mesh: mesh,
					}
				}, id, forced);
			}

			//
			this.circle = function(radius, vector, id, forced)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshBasicMaterial(___engine.materialConfig);
					let geometry = new THREE.CircleGeometry(radius, 100);
					let mesh = new THREE.Mesh(geometry, material);
					$extend(mesh.position, vector.get(0));

					return {
						type: _enum.CIRCLE,
						mesh: mesh,
					}
				}, id, forced);
			}

			//
			this.square = function(vector, id, forced)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshBasicMaterial(___engine.materialConfig);
					let size = vector.get(0);
					let geometry = new THREE.PlaneGeometry(size.x, size.y);
					let mesh = new THREE.Mesh(geometry, material);

					return {
						type: _enum.SQUARE,
						mesh: mesh,
					}
				}, id, forced);
			}

			//
			this.plane = function(vector, id, forced)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshPhongMaterial(___engine.materialConfig);
					let size = vector.get(0);
					let geometry = new THREE.PlaneGeometry(size.x, size.y);
					let mesh = new THREE.Mesh(geometry, material);

					return {
						type: _enum.PLANE,
						mesh: mesh,
					}
				}, id, forced);
			}

			//
			this.triangle = function(vector, id, forced)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshBasicMaterial(___engine.materialConfig);
					let geometry = new THREE.Geometry();
					geometry.vertices.push(vector.get(0), vector.get(1), vector.get(2));
					geometry.faces.push(new THREE.Face3(0, 1, 2));
					let mesh = new THREE.Mesh(geometry, material);

					return {
						type: _enum.TRIANGLE,
						mesh: mesh,
					}
				}, id, forced);
			}

			//
			this.arc = function(pc, id, forced)
			{
				return $getMesh(function()
				{
					pc = (typeof(pc) == 'undefined' ? 50 : pc);
					let calcul = ((Math.PI * 2) * pc) / 100
					let curve = new THREE.EllipseCurve(
						0, 0,
						7, 15,
						0, calcul
					);
					let points = curve.getSpacedPoints(120);
					let path = new THREE.Path();
					let geometry = path.createGeometry(points);
					let material = new THREE.LineBasicMaterial(___engine.lineMaterialConfig);
					let mesh = new THREE.Line(geometry, material);

					return {
						type: _enum.TRIANGLE,
						mesh: mesh,
					}
				}, id, forced);
			}

			//
			this.line = function(vectors, id, forced)
			{
				return $getMesh(function()
				{
					let material = new THREE.LineBasicMaterial(___engine.lineMaterialConfig);
					let geometry = new THREE.Geometry();
					vectors = vectors.get();
					for (var index in vectors) {
						geometry.vertices.push(vectors[index]);
					}
					let mesh = new THREE.Line(geometry, material);
					
					return {
						type: _enum.LINE,
						mesh: mesh,
					}
				}, id, forced);
			}

			//
			this.point = function(vectors, id, forced)
			{
				return $getMesh(function()
				{
					let material = new THREE.PointsMaterial(___engine.pointMaterialConfig);
					let geometry = new THREE.Geometry();
					vectors = vectors.get();
					for (var index in vectors) {
						geometry.vertices.push(vectors[index]);
					}
					let mesh = new THREE.Points(geometry, material);

					return {
						type: _enum.POINT,
						mesh: mesh,
					}
				}, id, forced);
			}

			//
			this.text = function(text, id, forced)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshBasicMaterial(___engine.materialConfig);
					let geometry = new THREE.Geometry();
					let mesh = new THREE.Mesh(geometry, material);

					let getFont = function(mesh) {
						mesh = mesh.get(null, _enum.MESH);
						let loader = new THREE.FontLoader();
						loader.load(___engine.config.font, function(font) {
							let find = $findKey(___engine.mesh, mesh.name);
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
							mesh.geometry = geometry;
							if (___engine.mesh[find].inScene == true) {
								___engine.scene.add(mesh);
							}
						});
					}

					return {
						type: _enum.TEXT,
						mesh: mesh,
						callback: getFont,
					}
				}, id, forced);
			}

			//
			var $mesh = function()
			{
				var ____engine = {
					this: this,
					type: _enum.MESH,
					mesh: null,
					config: {},
				}

				//
				var ____defaultConfig = {
					stop: false,
				}

				//
				this.init = function(id, type, mesh, callback)
				{
					____engine.mesh = mesh;
					____engine.type = type; 
					____engine.mesh.name = id;
					$extend(___engine.config, ____defaultConfig);
					$extend(____engine.this.position, mesh.position);
					$extend(____engine.this.rotation, mesh.rotation);

					/*** TEST (Black magic) ***/ // I don't know if I keep it or not...
					for (var index in mesh.material) {
						if (typeof(mesh.material[index]) != 'function') {
							this[index] = function (param) {
								let name = arguments.callee.myname;
								switch (name+typeof(param))
								{
									case 'colorstring':
									case 'colornumber':
										____engine.mesh.material[name].setHex(param);
									break;
									default :
										____engine.mesh.material[name] = param;
								}
								____engine.mesh.material.needsUpdate = true;
								return ____engine.this;
							}
							this[index].myname = index;
						}
					}
					$extend(____engine.this, this);
					/*** END ***/

					if (typeof(callback) == 'function') {
						callback(____engine.this);
					}
					delete ____engine.this.init;
					return ____engine.this;
				}

				//
				this.material = function(param)
				{
					//
					return ____engine.this;
				}

				//
				this.geometry = function(param)
				{
					//
					return ____engine.this;
				}

				//
				this.font = function(url)
				{
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
						____engine.this.map(texture);
					});	
					return ____engine.this;
				}

				//
				this.transform = function(vector)
				{
					let points = vector.get();
					for (var index in points) {
						____engine.mesh.geometry.vertices[index].set(points[index].x, points[index].y, points[index].z, points[index].w);
					}
					____engine.mesh.geometry.verticesNeedUpdate = true;
					return ____engine.this;
				}

				//
				this.position = function(vec)
				{
					if (typeof(vec) == 'object') {
						let vector = vec.get(0);
						____engine.this.position.x = vector.x;
						____engine.this.position.y = vector.y;
						____engine.this.position.z = vector.z;
						____engine.this.position.w = vector.w;
					}
					if (____engine.mesh.position.x == ____engine.this.position.x && ____engine.mesh.position.y == ____engine.this.position.y &&
							____engine.mesh.position.z == ____engine.this.position.z && ____engine.mesh.position.w == ____engine.this.position.w) {
						return ____engine.this;
					}
					vec = (typeof(vec) == 'undefined' ? _engine.this.vector(____engine.this.position.x, ____engine.this.position.y, ____engine.this.position.z, ____engine.this.position.w) : vec);
					$extend(____engine.mesh.position, vec.get(0));
					____engine.mesh.geometry.verticesNeedUpdate = true;
					return ____engine.this;
				}

				//
				this.rotation = function(vec)
				{
					if (typeof(vec) == 'object') {
						let vector = vec.get(0);
						____engine.this.rotation.x = vector.x;
						____engine.this.rotation.y = vector.y;
						____engine.this.rotation.z = vector.z;
						____engine.this.rotation.w = vector.w;
					}
					if (____engine.mesh.rotation.x == ____engine.this.rotation.x && ____engine.mesh.rotation.y == ____engine.this.rotation.y &&
							____engine.mesh.rotation.z == ____engine.this.rotation.z && ____engine.mesh.rotation.w == ____engine.this.rotation.w) {
						return ____engine.this;
					}
					vec = (typeof(vec) == 'undefined' ? _engine.this.vector(____engine.this.rotation.x, ____engine.this.rotation.y, ____engine.this.rotation.z, ____engine.this.rotation.w) : vec);
					$extend(____engine.mesh.rotation, vec.get(0));
					____engine.mesh.geometry.verticesNeedUpdate = true;
					return ____engine.this;
				}

				//
				this.stop = function()
				{
					// It does nothing at this moment
					____engine.config.stop = true;
					return ____engine.this;
				}

				//
				this.render = function()
				{
					let find = $findKey(___engine.mesh, ____engine.mesh.name);
					if (find == -1) {
						return null;
					}
					___engine.config.stop = false;
					if (___engine.mesh[find].inScene == false) {
						___engine.scene.add(___engine.mesh[find].mesh.get(null, _enum.MESH));
						___engine.mesh[find].inScene = true;
					}
					return ____engine.this;
				}

				//
				this.remove = function()
				{
					let find = $findKey(___engine.mesh, ____engine.id);
					___engine.scene.remove(____engine.mesh);
					___engine.mesh.splice(find, 1);
					return ___engine.this;
				}

				//
				this.back = function(id, type)
				{
					if (typeof(id) == 'string') {
						type = (typeof(type) == 'undefined' ? _enum.MERGE : type);
						return ___engine.this.get(id, type);
					}
					return ___engine.this;
				}

				//
				this.merge = function(id)
				{
					if (typeof(id) != 'string') {
						return null;
					}
					let find = $findKey(___engine.merge, id);
					let me = $findKey(___engine.mesh, ____engine.mesh.name);
					if (find == -1) {
						let merge = new $merge;
						merge.init(___engine.mesh[me].mesh);
						___engine.merge.push({
							id: id,
							merge: merge,
						});
						___engine.mesh[me].merged = true;
						return merge;
					}
					___engine.merge[find].merge.push(___engine.mesh[me].mesh);
					___engine.mesh[me].merged = true;
					return ___engine.merge[find].merge;
				}

				//
				this.get = function(id, type)
				{
					type = (typeof(type) != 'undefined' ? type : _enum.NONE);
					switch (type)
					{
						case _enum.MESH:
							return ____engine.mesh;
						break;
						case _enum.STOP:
							return __engine.config.stop;
						break;
						default:
							return null;
					}
				}

				return ____engine.this;
			}

			//
			var $merge = function()
			{
				var ____engine = {
					this: this,
					type: _enum.MERGE,
					mesh: [],
				}

				//
				this.init = function(mesh)
				{
					____engine.this.push(mesh);
					$extend(____engine.this.position, {x: 0, y: 0, z: 0, w: 0, lx: 0, ly: 0, lz: 0, lw: 0});
					$extend(____engine.this.rotation, {x: 0, y: 0, z: 0, w: 0, lx: 0, ly: 0, lz: 0, lw: 0});
					return ____engine.this;
				}

				//
				this.push = function(mesh)
				{
					____engine.mesh.push(mesh);

					/*** TEST (Black magic) ***/ // I don't know if I keep it or not...
					let material = mesh.get(null, _enum.MESH).material;
					$extend(material, {
						stop: '',
						remove: '',	
						render: '',
					});
					for (var index in material) {
						if (typeof(material[index]) != 'function') {
							this[index] = function (param) {
								let name = arguments.callee.myname;
								for (var index in ____engine.mesh) {
									____engine.mesh[index][name](param);
								}
								return ____engine.this;
							};
							this[index].myname = index;
						}
					}
					$extend(____engine.this, this);
					/*** END ***/

					delete ____engine.this.init;
					return ____engine.this;
				}

				//
				this.position = function(vec)
				{
					if (typeof(vec) == 'object') {
						let vector = vec.get(0);
						____engine.this.position.x = vector.x;
						____engine.this.position.y = vector.y;
						____engine.this.position.z = vector.z;
						____engine.this.position.w = vector.w;
					}
					vec = (typeof(vec) == 'undefined' ? _engine.this.vector(____engine.this.position.x, ____engine.this.position.y, ____engine.this.position.z, ____engine.this.position.w) : vec);
					vec = vec.get(0);
					for (var index in ____engine.mesh) {
						____engine.mesh[index].position.x += vec.x - ____engine.this.position.lx;
						____engine.mesh[index].position.y += vec.y - ____engine.this.position.ly;
						____engine.mesh[index].position.z += vec.z - ____engine.this.position.lz;
						____engine.mesh[index].position.w += vec.w - ____engine.this.position.lw;
					}
					if (typeof(vac) == 'undefined') {
						____engine.this.position.lx = ____engine.this.position.x;
						____engine.this.position.ly = ____engine.this.position.y;
						____engine.this.position.lz = ____engine.this.position.z;
						____engine.this.position.lw = ____engine.this.position.w;
					}
					return ____engine.this;
				}

				//
				this.rotation = function(vec)
				{
					if (typeof(vec) == 'object') {
						let vector = vec.get(0);
						____engine.this.rotation.x = vector.x;
						____engine.this.rotation.y = vector.y;
						____engine.this.rotation.z = vector.z;
						____engine.this.rotation.w = vector.w;
					}
					vec = (typeof(vec) == 'undefined' ? _engine.this.vector(____engine.this.rotation.x, ____engine.this.rotation.y, ____engine.this.rotation.z, ____engine.this.rotation.w) : vec);
					vec = vec.get(0);
					for (var index in ____engine.mesh) {
						____engine.mesh[index].rotation.x += vec.x - ____engine.this.rotation.lx;
						____engine.mesh[index].rotation.y += vec.y - ____engine.this.rotation.ly;
						____engine.mesh[index].rotation.z += vec.z - ____engine.this.rotation.lz;
						____engine.mesh[index].rotation.w += vec.w - ____engine.this.rotation.lw;
					}
					if (typeof(vac) == 'undefined') {
						____engine.this.rotation.lx = ____engine.this.rotation.x;
						____engine.this.rotation.ly = ____engine.this.rotation.y;
						____engine.this.rotation.lz = ____engine.this.rotation.z;
						____engine.this.rotation.lw = ____engine.this.rotation.w;
					}
					return ____engine.this;
				}

				//
				this.back = function(id, type)
				{
					if (typeof(id) == 'string') {
						type = (typeof(type) == 'undefined' ? _enum.MERGE : type);
						return ___engine.this.get(id, type);
					}
					return ___engine.this;
				}

				return ____engine.this;
			}

			//
			this.remove = function(id)
			{
				let find = $findKey(__engine.scene, ___engine.scene.name);
				__engine.scene.splice(find, 1);
				return __engine.this;
			}

			//
			this.render = function()
			{
				___engine.config.stop = false;
				for (var index in ___engine.mesh) {
					if (___engine.mesh[index].inScene == false) {
						___engine.scene.add(___engine.mesh[index].mesh.get(null, _enum.MESH));
						___engine.mesh[index].inScene = true;
					}
				}
				return ___engine.this;
			}

			//
			this.stop = function()
			{
				__engine.config.stop = true;
				return ___engine.this;
			}

			//
			this.get = function(id, type)
			{
				let find;
				type = (typeof(type) != 'undefined' ? type : _enum.MESH);
				switch (type)
				{
					case _enum.MESH:
						if (typeof(id) == 'undefined' || id == null) {
							return ___engine.mesh;
						}
						find = $findKey(___engine.mesh, id);
						if (find == -1) {
							return null;
						}
						return ___engine.mesh[find].mesh;
					break;
					case _enum.MERGE:
						if (typeof(id) == 'undefined' || id == null) {
							return ___engine.merge;
						}
						find = $findKey(___engine.merge, id);
						if (find == -1) {
							return null;
						}
						return ___engine.merge[find].merge;
					break;
					case _enum.STOP:
						return __engine.config.stop;
					break;
					case _enum.CAMERA:
						for (var index in ___engine.camera) {
							if (___engine.camera[index].enable == true) {
								return ___engine.camera[index].camera;
							}
						}
						return null;
					break;
					case _enum.SCENE:
						return ___engine.scene;
					break;
					default:
						return null;
				}
			}
			
			return ___engine.this;
		}

		//
		this.get = function(id, type)
		{
			type = (typeof(type) != 'undefined' ? type : _enum.SCENE);
			switch (type)
			{
				case _enum.SCENE:
					if (typeof(id) == 'undefined') {
						return __engine.scene;
					}
					let find = $findKey(__engine.scene, id);
					if (find == -1) {
						return null;
					}
					return __engine.scene[find].scene;
				break;
				case _enum.STOP:
					return __engine.config.stop;
				break;
				case _enum.RENDERER:
					return __engine.renderer;
				break;
				case _enum.UPDATE:
					return __engine.update;
				break;
				case _enum.DRAW:
					return __engine.draw;
				break;
				default:
					return null;
			}
		}

		return __engine.this;
	}

	//
	this.random = function(type, vecMin, vecMax)
	{
		if (type == _enum.COLOR) {
			return parseInt(Math.floor(Math.random()*16777215).toString(16), 16);
		}
		let build = new $vector;
		build.random(type, vecMin, vecMax);
		return build;
	}

	//
	this.math = (function()
	{
		var __engine = {
			this: this,
			type: _enum.MATH,
		};

		//
		this.lemniscate = function(vector, precision, overcoat)
		{
			let x, y, scale;
			let vectors = (typeof(vector) == 'undefined' ? _engine.this.vector(0, 0, 0) : vector);
			precision = (typeof(precision) == 'undefined' ? 0.01 : precision);
			overcoat = (typeof(overcoat) == 'undefined' ? 7 : overcoat);
			for (let t = 0; t < overcoat; t += precision)
			{
				scale = 2 / (3  - Math.cos(2 * t));
				x = scale * Math.cos(t);
				y = (scale * Math.sin(2 * t)) / 2;
				vectors.vector(x, y, vectors.get(0).z);
			}
			return vectors;
		}

		return __engine.this;
	})();

	//
	this.vector = function()
	{
		let build = new $vector;
		build.init(arguments);
		return build;
	}

	//
	var $vector = function()
	{
		var __engine = {
			this: this,
			type: _enum.VECTOR,
			vector: [],
		};

		this.init = function(arg)
		{
			__engine.vector.push({
				x: arg[0],
				y: arg[1],
				z: arg[2],
				w: arg[3],
			});
			return __engine.this;
		}

		this.vector = function()
		{
			return __engine.this.init(arguments);
		}

		this.random = function(type, vecMin, vecMax)
		{
			let vector = {
				x: 0,
				y: 0,
				z: 0,
				w: 0,
			};
			
			vecMin = (typeof(vecMin) == 'undefined' ? (new $vector).init([(window.innerWidth / 2) * -1, (window.innerHeight / 2) * -1, 0, 0]) : vecMin);
			vecMax = (typeof(vecMax) == 'undefined' ? (new $vector).init([window.innerWidth / 2, window.innerHeight / 2, 0, 0]) : vecMax);

			var rand = function(min, max)
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

		this.slice = function(id)
		{
			let build = new $vector;
			build.init([__engine.vector[id].x, __engine.vector[id].y, __engine.vector[id].z, __engine.vector[id].w]);
			return build;
		}

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
	this.get = function(id, type)
	{
		type = (typeof(type) != 'undefined' ? type : _enum.BRANCH);
		switch (type)
		{
			case _enum.BRANCH:
				if (typeof(id) == 'undefined' || id == null) {
					return _engine.branch;
				}
				let find = $findKey(_engine.branch, id);
				if (find == -1) {
					return null;
				}
				return _engine.branch[find].branch;
			break;
			default:
				return null;
		}
	}

	//
	var $update = setInterval(function()
	{
		for (var index in _engine.branch)
		{
			let branch = _engine.branch[index].branch;
			
			//
			let update = branch.get(null, _enum.UPDATE);
			for (var index2 in update) {
				update[index2]();
			}

			//
			let scenes = branch.get();
			for (var index2 in scenes)
			{
				let scene = scenes[index2].scene;
			
				//
				scene.camera.position();
				scene.camera.rotation();

				//
				let merges = scene.get(null, _enum.MERGE);
				for (var index3 in merges) {
					merges[index3].merge.position();
					merges[index3].merge.rotation();
				}

				//
				let meshs = scene.get(null, _enum.MESH);
				for (var index3 in meshs) {
					meshs[index3].mesh.position();
					meshs[index3].mesh.rotation();
				}
			}	
		}
	}, _engine.config.timeUpdate);

	//
	var $draw = function()
	{
		for (var index in _engine.branch) {
			let draw = _engine.branch[index].branch.get(null, _enum.DRAW);
			for (var index2 in draw) {
				draw[index2]();
			}
		}

		for (var index in _engine.branch) {
			let branch = _engine.branch[index].branch;
			if (branch.get(null, _enum.STOP) == false) {
				let scenes = branch.get();
				for (var index2 in scenes) {
					let scene = scenes[index2].scene;
					if (scene.get(null, _enum.STOP) == false) {
						let _renderer = branch.get(null, _enum.RENDERER);
						let _scene = scene.get(null, _enum.SCENE);
						let _camera = scene.get(null, _enum.CAMERA);
						_renderer.render(_scene, _camera);
					}
				}
			}
		}
		requestAnimationFrame($draw);
	}

	$draw();

	return $extend(_engine.this, _enum);
})();
