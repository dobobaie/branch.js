var BRANCH = (function()
{
	//
	var _enum = {
		NONE: 'none',

		TRIANGLE: 'triangle',
		CUBE: 'cube',
		
		CAMERA: 'camera',
		SCENE: 'scene',
		RENDERER: 'renderer',
		BRANCH: 'branch',
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
	var $extend = function(obj, obj2)
	{
		for (var i in obj2) {
			obj[i] = obj2[i];
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
			build.init(params, id);
			_engine._branch.push({
				id: id,
				branch: build,
			});
			return build;
		}
		if (typeof(forced) == 'boolean' && forced == true) {
			let build = new $branch;
			build.init(params, id);
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
			__id: '',
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
		this.init = function(params, id)
		{
			if (typeof(params) == 'function') {
				params = new params();
			}
			$extend(__engine.__config, __defaultConfig);
			$extend(__engine.__config, params);
			__engine.__id = id;

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
				build.init(id);
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
				___id: '',
				___scene: null,
				___camera: null,
				___mesh: [],
				___materialConfig: {},
				___cameraConfig: {},
			};

			//
			var ___defaultMaterialConfig = {
				color: 0xffffff,
				wireframe: true,
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
				___engine.___scene = new THREE.Scene();
				___engine.___id = id;
				$extend(___engine.___materialConfig, ___defaultMaterialConfig);
				$extend(___engine.___cameraConfig, ___defaultCameraConfig);

				___engine.___camera = new THREE.PerspectiveCamera(___engine.___cameraConfig.fov, ___engine.___cameraConfig.aspect, ___engine.___cameraConfig.near, ___engine.___cameraConfig.far);
				___engine.___camera.position.set(___engine.___cameraConfig.vector.x, ___engine.___cameraConfig.vector.y, ___engine.___cameraConfig.vector.z);
				___engine.___scene.add(___engine.___camera);

				delete this.init;
				return  ___engine.___this;
			}

			//
			this.triangle = function(vector, id, forced)
			{
				/*

						if id == undefined

				*/
				let find = $findKey(__engine.__scene, id);
				let material = new THREE.MeshBasicMaterial(___engine.___materialConfig);
				let geometry = new THREE.Geometry();
				geometry.vertices.push(vector.get(0), vector.get(1), vector.get(2));
				geometry.faces.push(new THREE.Face3(0, 1, 2));

				if (find == -1) {
					___engine.___mesh.push({
						id: id,
						type: _enum.TRIANGLE,	
						mesh: new THREE.Mesh(geometry, material),
						inScene: false,
					});
					return ___engine.___this;
				}
				if (typeof(forced) == 'boolean' && forced == true) {
					// Supprimer l'objet de la scene et modifier le tableau
					return ___engine.___this;
				}
				return null;
			}

			//
			this.mesh = function()
			{
				return ___engine.___this;
			}

			//
			var $mesh = function()
			{
				return ___engine.___this;
			}

			//
			this.add = function(type, params, id, forced)
			{
				switch (type)
				{
					case TRIANGLE:
						return ___engine.___this.triangle(params, id, forced);
					break;
				}
				return ___engine.___this;
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
						console.log(___engine.___mesh[index]);
						___engine.___scene.add(___engine.___mesh[index].mesh);
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
				type = (typeof(type) != 'undefined' ? type : _enum.NONE);
				switch (type)
				{
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
				default:
					return null;
			}
		}

		return __engine.__this;
	}

	//
	this.vector = function()
	{
		let build = new $vector;
		build.init(arguments);
		return build;
	}

	//
	var $vector = function(values)
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
		//
	}, _engine._config.timeUpdate);

	//
	var $draw = function()
	{
		for (var index in _engine._branch) {
			if (typeof(_engine._branch[index]) == 'object') {
				let branch = _engine._branch[index].branch;
				let scenes = branch.get();
				for (var index2 in scenes) {
					if (typeof(scenes[index2]) == 'object') {
						let scene = scenes[index2].scene;
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

	return $extend(_engine._this, _enum);
})();
