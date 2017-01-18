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
	}

	//
	var _engine = {
		_this: this,
		_branch: [],
		_config: {
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
	this.init = function(params, id, forced)
	{
		/*

				IF ID == UNDEFINED

		*/
		let find = $findKey(_engine._branch, id);
		if (find == -1) {
			let build = new $branch;
			build.init(params);
			_engine._branch.push({
				id: id,
				branch: build,
			});
			return build;
		}
		if (typeof(forced) == 'boolean' && forced == true) {
			let build = new $branch;
			build.init(params);
			_engine._branch[find].branch = build;
			return build;
		}
		return null;
	}

	//
	var $branch = function()
	{
		//
		var __engine = {
			__this: this,
			__renderer: null,
			__scene: [],
			__update: [],
			__draw: [],
			__config: {},
		}

		//
		var __defaultConfig = {
			el: document.body,
			height: window.innerHeight,
			width: window.innerWidth,
			webGL: true,
		}

		//
		this.init = function(params)
		{
			if (typeof(params) == 'function') {
				params = new params();
			}
			$extend(__engine.__config, __defaultConfig);
			$extend(__engine.__config, params);
			
			let canvas = document.createElement('canvas');
			__engine.__renderer = (
				__engine.__config.webGL == true && window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) ? 
				new THREE.WebGLRenderer() :
				new THREE.CanvasRenderer()
			);
			$extend(__engine.__renderer, __engine.__config);
			__engine.__renderer.setSize(__engine.__config.width, __engine.__config.height);
			__engine.__config.el.appendChild(__engine.__renderer.domElement);

			delete this.init;
			return __engine.__this;
		}

		//
		this.stop = function()
		{
			return __engine.__this;
		}

		//
		this.update = function(callback)
		{
			__engine.__update.push(callback);
			return __engine.__this;
		}

		//
		this.draw = function(callback)
		{
			__engine.__draw.push(callback);
			return __engine.__this;
		}

		//
		this.scene = function(id, forced)
		{
			/*
	
					IF ID == UNDEFINED

			*/
			let find = $findKey(__engine.__scene, id);
			if (find == -1) {
				let build = new $scene;
				build.init(id);
				__engine.__scene.push({
					id: id,
					scene: build,
				});
				return build;
			}
			if (typeof(forced) == 'boolean' && forced == true) {
				let build = new $scene;
				build.init();
				__engine.__scene[find].scene = build;
				return build;
			}
			return null;
		}

		//
		var $scene = function()
		{
			var ___engine = {
				___this: this,
				___scene: null,
				___camera: null,
				___mesh: [],
				___materialConfig: {},
				___cameraConfig: {},
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
				___engine.___scene = new THREE.Scene();
				$extend(___engine.___materialConfig, ___defaultMaterialConfig);
				$extend(___engine.___cameraConfig, ___defaultCameraConfig);

				___engine.___camera = new THREE.PerspectiveCamera(___engine.___cameraConfig.fov, ___engine.___cameraConfig.aspect, ___engine.___cameraConfig.near, ___engine.___cameraConfig.far);
				___engine.___camera.position.set(___engine.___cameraConfig.vector.x, ___engine.___cameraConfig.vector.y, ___engine.___cameraConfig.vector.z);
				___engine.___scene.add(___engine.___camera);

				delete this.init;
				return  ___engine.___this;
			}

			//
			this.add = function(type, params, id, forced)
			{
				switch (type)
				{
					case _enum.TRIANGLE:
						return ___engine.___this.triangle(params, id, forced);
					break;
					case _enum.CIRCLE:
						return ___engine.___this.circle(params, id, forced);
					break;
				}
				return ___engine.___this;
			}

			//
			this.mesh = function()
			{
				return ___engine.___this;
			}

			//
			this.circle = function(radius, vector, id, forced)
			{
				/*

						if id == undefined

				*/
				let find = $findKey(__engine.__scene, id);

				if (find != -1)
				{
					if (typeof(forced) != 'boolean' || forced == false) {
						return null;
					}
					// Supprimer l'objet de la scene et supprimer dans __engine.__scene
					return ___engine.___this;
				}

				let material = new THREE.MeshBasicMaterial(___engine.___materialConfig);
				let geometry = new THREE.CircleGeometry(radius);
				let mesh = new THREE.Mesh(geometry, material);
				vector = vector.get(0);
				
				let build = new $mesh;
				build.init(_enum.CIRCLE, mesh);
				___engine.___mesh.push({
					id: id,
					type: _enum.TRIANGLE,	
					mesh: build,
					inScene: false,
				});
				return build;
			}

			//
			this.triangle = function(vector, id, forced)
			{
				/*

						if id == undefined

				*/
				let find = $findKey(__engine.__scene, id);

				if (find != -1)
				{
					if (typeof(forced) != 'boolean' || forced == false) {
						return null;
					}
					// Supprimer l'objet de la scene et supprimer dans __engine.__scene
					return ___engine.___this;
				}

				let material = new THREE.MeshBasicMaterial(___engine.___materialConfig);
				let geometry = new THREE.Geometry();
				geometry.vertices.push(vector.get(0), vector.get(1), vector.get(2));
				geometry.faces.push(new THREE.Face3(0, 1, 2));
				let mesh = new THREE.Mesh(geometry, material);
				
				let build = new $mesh;
				build.init(_enum.TRIANGLE, mesh);
				___engine.___mesh.push({
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
					____this: this,
					____type: _enum.NONE,
					____mesh: null,
				}

				//
				this.init = function(type, mesh)
				{
					____engine.____type = type;
					____engine.____mesh = mesh;
					delete ____engine.____this.init;
					return ____engine.____this;
				}

				//
				this.color = function(value)
				{
					____engine.____mesh.material.color.setHex(value);
					return $copy(___engine.___this, ____engine.____this);
				}

				//
				this.wireframe = function(bool)
				{
					____engine.____mesh.material.wireframe = bool;
					return $copy(___engine.___this, ____engine.____this);
				}

				//
				this.position = function(vector)
				{
					switch (____engine.____type)
					{
						case _enum.TRIANGLE:
							let vec1 = vector.get(0);
							let vec2 = vector.get(1);
							let vec3 = vector.get(2);
							____engine.____mesh.geometry.vertices[0].set(vec1.x, vec1.y, vec1.z);
							____engine.____mesh.geometry.vertices[1].set(vec2.x, vec2.y, vec2.z);
							____engine.____mesh.geometry.vertices[2].set(vec3.x, vec3.y, vec3.z);
							____engine.____mesh.geometry.verticesNeedUpdate = true;
						break;
						default :
							$extend(____engine.____mesh.position, vector.get(0));
					}
					return $copy(___engine.___this, ____engine.____this);
				}

				//
				this.get = function(id, type)
				{
					type = (typeof(type) != 'undefined' ? type : _enum.NONE);
					switch (type)
					{
						case _enum.MESH:
							return ____engine.____mesh;
						break;
						default:
							return null;
					}
				}

				return $copy(___engine.___this, ____engine.____this);
			}

			//
			this.remove = function()
			{
				return ___engine.___this;
			}

			//
			this.render = function()
			{
				for (var index in ___engine.___mesh) {
					if (___engine.___mesh[index].inScene == false) {
						___engine.___scene.add(___engine.___mesh[index].mesh.get(null, _enum.MESH));
						___engine.___mesh[index].inScene = true;
					}
				}
				return ___engine.___this;
			}

			//
			this.stop = function()
			{
				return ___engine.___this;
			}

			//
			this.get = function(id, type)
			{
				type = (typeof(type) != 'undefined' ? type : _enum.MESH);
				switch (type)
				{
					case _enum.MESH:
						if (typeof(id) == 'undefined') {
							return ___engine.___mesh;
						}
						let find = $findKey(___engine.___mesh, id);
						if (find == -1) {
							return null;
						}
						return ___engine.___mesh[find].mesh;
					break;
					case _enum.CAMERA:
						return ___engine.___camera;
					break;
					case _enum.SCENE:
						return ___engine.___scene;
					break;
					default:
						return null;
				}
			}
			
			return ___engine.___this;
		}

		//
		this.get = function(id, type)
		{
			type = (typeof(type) != 'undefined' ? type : _enum.SCENE);
			switch (type)
			{
				case _enum.SCENE:
					if (typeof(id) == 'undefined') {
						return __engine.__scene;
					}
					let find = $findKey(__engine.__scene, id);
					if (find == -1) {
						return null;
					}
					return __engine.__scene[find].scene;
				break;
				case _enum.RENDERER:
					return __engine.__renderer;
				break;
				case _enum.UPDATE:
					let update = __engine.__update;
					return update;
				break;
				default:
					return null;
			}
		}

		return __engine.__this;
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
			__this: this,
			__vector: [],
		};

		this.init = function(arg)
		{
			__engine.__vector.push({
				x: arg[0],
				y: arg[1],
				z: arg[2],
				w: arg[3],
			});
			return __engine.__this;
		}

		this.vector = function()
		{
			return __engine.__this.init(arguments);
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
			__engine.__vector.push(vector);
			return __engine.__this;
		}

		this.get = function(id)
		{
			if (typeof(__engine.__vector[id].z) == 'undefined') {
				return new THREE.Vector2(__engine.__vector[id].x, __engine.__vector[id].y);
			}
			if (typeof(__engine.__vector[id].w) == 'undefined') {
				return new THREE.Vector3(__engine.__vector[id].x, __engine.__vector[id].y, __engine.__vector[id].z);
			}
			return new THREE.Vector4(__engine.__vector[id].x, __engine.__vector[id].y, __engine.__vector[id].z, __engine.__vector[id].w);
		}

		return __engine.__this;
	}

	//
	this.get = function(id, type)
	{
		type = (typeof(type) != 'undefined' ? type : _enum.BRANCH);
		switch (type)
		{
			case _enum.BRANCH:
				if (typeof(id) == 'undefined') {
					return _engine._branch;
				}
				let find = $findKey(_engine._branch, id);
				if (find == -1) {
					return null;
				}
				return _engine._branch[find].branch;
			break;
			default:
				return null;
		}
	}

	//
	var $update = setInterval(function()
	{
		for (var index in _engine._branch) {
			let update = _engine._branch[index].branch.get(null, _enum.UPDATE);
			for (var index2 in update) {
				update[index2]();
			}
		}
	}, _engine._config.timeUpdate);

	//
	var $draw = function()
	{
		for (var index in _engine._branch) {
			let branch = _engine._branch[index].branch;
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

	return $extend(_engine._this, _enum);
})();
