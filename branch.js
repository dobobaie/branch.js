var BRANCH = (function()
{
	//
	var _enum = {
		NONE: 'none',

		CIRCLE: 'circle',
		TRIANGLE: 'triangle',
		CUBE: 'cube',
		
		VECTOR2: 'vector2',
		VECTOR3: 'vector3',
		VECTOR4: 'vector4',

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
	var $getId = function(obj, id)
	{
		if (typeof(id) == 'undefined' && (id = Math.random().toString(36).substring(2, 9)) && $findKey(obj, id) != -1) {
			return $getId(obj);
		}
		return id;
	}

	//
	this.init = function(params, id, forced)
	{
		id = $getId(_engine.branch, id);
		let find = $findKey(_engine.branch, id);
		if (find == -1) {
			let build = new $branch;
			build.init(params);
			_engine.branch.push({
				id: id,
				branch: build,
			});
			return build;
		}
		if (typeof(forced) == 'boolean' && forced == true) {
			let build = new $branch;
			build.init(params);
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
		}

		//
		this.init = function(params)
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
			for (var index in __engine.scene) {
				__engine.scene[index].render();
			}
			return __engine.this;
		}

		//
		this.stop = function()
		{
			return __engine.this;
		}

		//
		this.scene = function(id, forced)
		{
			id = $getId(__engine.scene, id);
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
				build.init();
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
				camera: null,
				mesh: [],
				materialConfig: {},
				cameraConfig: {},
			};

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
			this.init = function()
			{
				___engine.scene = new THREE.Scene();
				$extend(___engine.materialConfig, ___defaultMaterialConfig);
				$extend(___engine.cameraConfig, ___defaultCameraConfig);

				___engine.camera = new THREE.PerspectiveCamera(___engine.cameraConfig.fov, ___engine.cameraConfig.aspect, ___engine.cameraConfig.near, ___engine.cameraConfig.far);
				___engine.camera.position.set(___engine.cameraConfig.vector.x, ___engine.cameraConfig.vector.y, ___engine.cameraConfig.vector.z);
				___engine.scene.add(___engine.camera);

				delete this.init;
				return  ___engine.this;
			}

			//
			this.add = function(mesh, type, id)
			{
				id = $getId(__engine.scene, id);
				let find = $findKey(__engine.scene, id);

				if (find != -1)
				{
					if (typeof(forced) != 'boolean' || forced == false) {
						return null;
					}
					// Supprimer l'objet de la scene et supprimer dans __engine.scene
					return ___engine.this;
				}

				let build = new $mesh;
				build.init(type, mesh);
				___engine.mesh.push({
					id: id,
					type: type,	
					mesh: build,
					inScene: false,
				});
				return build;
			}

			//
			this.circle = function(radius, vector, id, forced)
			{
				id = $getId(__engine.scene, id);
				let find = $findKey(__engine.scene, id);

				if (find != -1)
				{
					if (typeof(forced) != 'boolean' || forced == false) {
						return null;
					}
					// Supprimer l'objet de la scene et supprimer dans __engine.scene
					return ___engine.this;
				}

				let material = new THREE.MeshBasicMaterial(___engine.materialConfig);
				let geometry = new THREE.CircleGeometry(radius, 100);
				let mesh = new THREE.Mesh(geometry, material);
				vector = vector.get(0);
				
				let build = new $mesh;
				build.init(_enum.CIRCLE, mesh);
				___engine.mesh.push({
					id: id,
					type: _enum.CIRCLE,	
					mesh: build,
					inScene: false,
				});
				return build;
			}

			//
			this.triangle = function(vector, id, forced)
			{
				id = $getId(__engine.scene, id);
				let find = $findKey(__engine.scene, id);

				if (find != -1)
				{
					if (typeof(forced) != 'boolean' || forced == false) {
						return null;
					}
					// Supprimer l'objet de la scene et supprimer dans __engine.scene
					return ___engine.this;
				}

				let material = new THREE.MeshBasicMaterial(___engine.materialConfig);
				let geometry = new THREE.Geometry();
				geometry.vertices.push(vector.get(0), vector.get(1), vector.get(2));
				geometry.faces.push(new THREE.Face3(0, 1, 2));
				let mesh = new THREE.Mesh(geometry, material);
				
				let build = new $mesh;
				build.init(_enum.TRIANGLE, mesh);
				___engine.mesh.push({
					id: id,
					type: _enum.TRIANGLE,	
					mesh: build,
					inScene: false,
				});
				return build;
			}

			//
			var $mesh = function()
			{
				var ____engine = {
					this: this,
					type: _enum.NONE,
					mesh: null,
				}

				//
				this.init = function(type, mesh)
				{
					____engine.type = type;
					____engine.mesh = mesh;
					delete ____engine.this.init;
					return ____engine.this;
				}

				//
				this.color = function(value)
				{
					____engine.mesh.material.color.setHex(value);
					return $copy(___engine.this, ____engine.this);
				}

				//
				this.wireframe = function(bool)
				{
					____engine.mesh.material.wireframe = bool;
					return $copy(___engine.this, ____engine.this);
				}

				//
				this.position = function(vector)
				{
					switch (____engine.type)
					{
						case _enum.TRIANGLE:
							let vec1 = vector.get(0);
							let vec2 = vector.get(1);
							let vec3 = vector.get(2);
							____engine.mesh.geometry.vertices[0].set(vec1.x, vec1.y, vec1.z);
							____engine.mesh.geometry.vertices[1].set(vec2.x, vec2.y, vec2.z);
							____engine.mesh.geometry.vertices[2].set(vec3.x, vec3.y, vec3.z);
							____engine.mesh.geometry.verticesNeedUpdate = true;
						break;
						default :
							$extend(____engine.mesh.position, vector.get(0));
					}
					return $copy(___engine.this, ____engine.this);
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
						default:
							return null;
					}
				}

				return $copy(___engine.this, ____engine.this);
			}

			//
			this.remove = function()
			{
				return ___engine.this;
			}

			//
			this.render = function()
			{
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
				return ___engine.this;
			}

			//
			this.get = function(id, type)
			{
				type = (typeof(type) != 'undefined' ? type : _enum.MESH);
				switch (type)
				{
					case _enum.MESH:
						if (typeof(id) == 'undefined') {
							return ___engine.mesh;
						}
						let find = $findKey(___engine.mesh, id);
						if (find == -1) {
							return null;
						}
						return ___engine.mesh[find].mesh;
					break;
					case _enum.CAMERA:
						return ___engine.camera;
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

		this.get = function(id)
		{
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
			let scenes = branch.get();
			for (var index2 in scenes) {
				let scene = scenes[index2].scene;
				let _renderer = branch.get(null, _enum.RENDERER);
				let _scene = scene.get(null, _enum.SCENE);
				let _camera = scene.get(null, _enum.CAMERA);
				_renderer.render(_scene, _camera);
			}
		}
		requestAnimationFrame($draw);
	}

	$draw();

	return $extend(_engine.this, _enum);
})();
