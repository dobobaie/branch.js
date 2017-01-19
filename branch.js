var BRANCH = (function()
{
	//
	var _enum = {
		NONE: 'none',

		TEXT: 'text',
		LINE: 'line',
		CIRCLE: 'circle',
		TRIANGLE: 'triangle',
		CUBE: 'cube',
		CYLINDER: 'cylinder',
		CONE: 'cone',
		LIGHT: 'light',
		
		COLOR: 'color',
		VECTOR2: 'vector2',
		VECTOR3: 'vector3',
		VECTOR4: 'vector4',

		STOP: 'stop',
		CAMERA: 'camera',
		SCENE: 'scene',
		RENDERER: 'renderer',
		BRANCH: 'branch',
		MESH: 'mesh',
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
		len = (typeof(len) == 'undefined' ? 0 : len);
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
				scene: null,
				camera: [],
				mesh: [],
				config: {},
				materialConfig: {},
				cameraConfig: {},
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
				},
			}

			//
			this.init = function(id)
			{
				___engine.scene = new THREE.Scene();
				___engine.scene.name = id;
				$extend(___engine.config, ___defaultConfig);
				$extend(___engine.materialConfig, ___defaultMaterialConfig);
				$extend(___engine.cameraConfig, ___defaultCameraConfig);

				// Make a camera manager (with one to default) and make a camera switcher
				let cameraId = $getId(___engine.camera, _enum.CAMERA);
				let camera = new THREE.PerspectiveCamera(___engine.cameraConfig.fov, ___engine.cameraConfig.aspect, ___engine.cameraConfig.near, ___engine.cameraConfig.far);
				camera.position.set(___engine.cameraConfig.vector.x, ___engine.cameraConfig.vector.y, ___engine.cameraConfig.vector.z);
				camera.name = cameraId;
				___engine.scene.add(camera);
				___engine.camera.push({
					id: cameraId,
					camera:	camera,
					enable: true,
				});

				delete this.init;
				return  ___engine.this;
			}

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
					let material = new THREE.MeshBasicMaterial(___engine.materialConfig);
					let geometry = new THREE.CylinderGeometry(0, 50, height, 4, 1);
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
					let material = new THREE.MeshBasicMaterial(___engine.materialConfig);
					let geometry = new THREE.CylinderGeometry(50, 50, height);
					
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
					//let material = new THREE.MeshBasicMaterial(___engine.materialConfig);
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
			this.line = function(vector, id, forced)
			{
				return $getMesh(function()
				{
					let material = new THREE.LineBasicMaterial(___engine.materialConfig);
					let geometry = new THREE.Geometry();
					let points = vector.get();
					for (var index in points) {
						geometry.vertices.push(points[index]);
					}
					let mesh = new THREE.Line(geometry, material);
					
					return {
						type: _enum.LINE,
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
			this.text = function(text, id, forced)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshBasicMaterial(___engine.materialConfig);
					let geometry = new THREE.Geometry();
					let mesh = new THREE.Mesh(geometry, material);

					let getFont = function(mesh) {
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
							let oldMesh = ___engine.mesh[find].mesh.get(null, _enum.MESH);
							oldMesh.geometry = geometry;
							___engine.mesh[find].mesh = mesh;
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
					type: _enum.NONE,
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
					____engine.type = type;
					____engine.mesh = mesh;
					____engine.mesh.name = id;
					$extend(___engine.config, ____defaultConfig);
					$extend(____engine.this.position, mesh.position);
					$extend(____engine.this.rotation, mesh.rotation);
					if (typeof(callback) == 'function') {
						callback(mesh);
					}

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
								return ____engine.this;
							}
							this[index].myname = index;
						}
					}
					____engine.this = this;
					/*** END ***/

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
					} else if (____engine.mesh.position.x == ____engine.this.position.x && ____engine.mesh.position.y == ____engine.this.position.y &&
							____engine.mesh.position.z == ____engine.this.position.z && ____engine.mesh.position.w == ____engine.this.position.w) {
						return $copy(___engine.this, ____engine.this);
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
					} else if (____engine.mesh.rotation.x == ____engine.this.rotation.x && ____engine.mesh.rotation.y == ____engine.this.rotation.y &&
							____engine.mesh.rotation.z == ____engine.this.rotation.z && ____engine.mesh.rotation.w == ____engine.this.rotation.w) {
						return $copy(___engine.this, ____engine.this);
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
					___engine.this.render(____engine.id);
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
			this.remove = function(id)
			{
				let find = $findKey(__engine.scene, ___engine.scene.name);
				__engine.scene.splice(find, 1);
				return __engine.this;
			}

			//
			this.render = function(id)
			{
				___engine.config.stop = false;
				let find = $findKey(___engine.mesh, id);
				if (find != -1) {
					if (___engine.mesh[find].inScene == false) {
						___engine.scene.add(___engine.mesh[find].mesh.get(null, _enum.MESH));
						___engine.mesh[find].inScene = true;
					}
					return ___engine.this;
				}
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
				type = (typeof(type) != 'undefined' ? type : _enum.MESH);
				switch (type)
				{
					case _enum.MESH:
						if (typeof(id) == 'undefined' || id == null) {
							return ___engine.mesh;
						}
						let find = $findKey(___engine.mesh, id);
						if (find == -1) {
							return null;
						}
						return ___engine.mesh[find].mesh;
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
				if (typeof(id) == 'undefined') {
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
		for (var index in _engine.branch) {
			let update = _engine.branch[index].branch.get(null, _enum.UPDATE);
			for (var index2 in update) {
				update[index2]();
			}
		}

		for (var index in _engine.branch) {
			let branch = _engine.branch[index].branch;
			let scenes = branch.get();
			for (var index2 in scenes) {
				let scene = scenes[index2].scene;
				let meshs = scene.get(null, _enum.MESH);
				for (var index3 in meshs) {
					if (typeof(meshs[index3].mesh.position) == 'function') {
						meshs[index3].mesh.position();
					}
					if (typeof(meshs[index3].mesh.rotation) == 'function') {
						meshs[index3].mesh.rotation();
					}
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
