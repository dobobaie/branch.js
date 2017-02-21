/*
	Mettre une sécurité pour ne pas récupérer les scenes root
*/
var BRANCH = (function()
{
	//
	var _enum = {
		NONE: 'none',

		SPHERE: 'sphere',
		ARC: 'arc',
		MESH: 'mesh',
		POINT: 'point',
		TEXT: 'text',
		CIRCLE: 'circle',
		TRIANGLE: 'triangle',
		CUBE: 'cube',
		CYLINDER: 'cylinder',
		CONE: 'cone',
		LIGHT: 'light',
		LINE: 'line',
		PLANE: 'plane',
		
		COLOR: 'color',
		VECTOR2: 'vector2',
		VECTOR3: 'vector3',
		VECTOR4: 'vector4',

		CONTROLS: 'controls',
		ENABLE: 'enable',
		LANDMARK: 'landmark',
		TYPE: 'type',
		MATH: 'math',
		VECTOR: 'vector',
		MERGE: 'merge',
		STOP: 'stop',
		CAMERA: 'camera',
		SCENE: 'scene',
		RENDERER: 'renderer',
		APP: 'branch',
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
	var $extend = function(obj, obj2, replace, inc)
	{
		replace = (typeof(replace) != 'boolean' ? true : replace);
		if (typeof(inc) != 'undefined') {
			for (var index in inc) {
				if (typeof(obj[inc[index]]) == 'undefined' || replace == true) {
					obj[inc[index]] = obj2[inc[index]];
				}
			}
			return obj;
		}
		for (var index in obj2) {
			if (typeof(obj[index]) == 'undefined' || replace == true) {
				obj[index] = obj2[index];
			}
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
	let $getProperty = function(me, type)
	{
		//
	}

	//
	let $copyProperty = function(me, name, value)
	{
		if (typeof(me.this[name]) != 'undefined') {
			return null;
		}
		me.this[name] = value;
		me.this[name].myname = name;
	}

	//
	let $addPrefix = function(me, name, value)
	{
		if (typeof(me.this['_'+name]) != 'undefined') {
			return null;
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
				return value;
			},
		});
	}

	//
	let $addVector = function(me, name, value)
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
	this.init = function(params, id, forced)
	{
		id = $getId(_engine.branch, _enum.APP, id);
		let find = $findKey(_engine.branch, id);
		if (find == -1) {
			let build = new $branch;
			build.init(id, params);
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
			type: _enum.APP,
			renderer: null,
			scene: [],
			update: [],
			draw: [],
			config: {
				el: document.body,
				height: window.innerHeight,
				width: window.innerWidth,
				webGL: true,
				renderer: {
					antialias: true,
					autoClear: false,
				},
				stop: false,
			},
		}

		//
		this.init = function(id, params)
		{
			_engine.branch.push({
				id: id,
				branch: __engine.this,
			});
			
			if (typeof(params) == 'function') {
				params = new params();
			}
			$extend(__engine.config, params);
			
			let canvas = document.createElement('canvas');
			__engine.renderer = (
				__engine.config.webGL == true && window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) ? 
				new THREE.WebGLRenderer(__engine.config.renderer) :
				new THREE.CanvasRenderer(__engine.config.renderer)
			);
			$extend(__engine.renderer, __engine.config.renderer);
			__engine.renderer.setSize(__engine.config.width, __engine.config.height);
			__engine.renderer.name = id;
			__engine.config.el.appendChild(__engine.renderer.domElement);

			delete __engine.this.init;
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
				__engine.scene[index].render();
			}
			return __engine.this;
		}

		//
		this.stop = function()
		{
			__engine.config.stop = true;
			for (var index in __engine.scene) {
				__engine.scene[index].stop();
			}
			return __engine.this;
		}

		//
		this.scene = function(id)
		{
			id = $getId(__engine.scene, _enum.SCENE, id);
			let find = $findKey(__engine.scene, id);
			if (find == -1) {
				let build = new $scene;
				build.init(id);
				return build;
			}
			return null;
		}

		//
		var $scene = function(root)
		{
			var ___engine = {
				this: this,
				type: _enum.SCENE,
				scene: null,
				render: false,

				camera: null,
				controls: null,
				landmark: null,

				mesh: [],
				merge: [],
			
				config: {},
				materialConfig: {},
				cameraConfig: {},
				pointMaterialConfig: {},
				lineMaterialConfig: {},
				landmarkConfig: {},
				controlsConfig: {},
			};

			//
			var ___defaultConfig = {
				stop: false,
				font: 'fonts/helvetiker_regular.typeface.json',
			}

			//
			var ___defaultMaterialConfig = {
				overdraw: true,
				side: THREE.DoubleSide,
			}

			//
			var ___defaultCameraConfig = {
				fov: 53,
				aspect: 1,
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
			var ___defaultLandmarkConfig = {
				enable: false,
				margin: 100,
			}

			//
			var ___defaultControlsConfig = {
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
				__engine.scene.push({
					id: id,
					root: (typeof(root) != 'boolean' ? false : root),
					scene: ___engine.this,
				});

				___engine.scene = new THREE.Scene();
				___engine.scene.name = id;

				$extend(___engine.config, ___defaultConfig);
				$extend(___engine.materialConfig, ___defaultMaterialConfig);
				$extend(___engine.cameraConfig, ___defaultCameraConfig);
				$extend(___engine.pointMaterialConfig, ___pointMaterialConfig);
				$extend(___engine.lineMaterialConfig, ___lineMaterialConfig);
				$extend(___engine.landmarkConfig, ___defaultLandmarkConfig);
				$extend(___engine.controlsConfig, ___defaultControlsConfig);

				___engine.landmark = new $landmark;
				if ((typeof(root) != 'boolean' ? false : root) == false) {
					___engine.landmark.init();
					___engine.landmarkConfig.enable = false;
				}
				___engine.camera = new $camera;
				___engine.camera.init(_engine.this.vector(___engine.cameraConfig.vector.x, ___engine.cameraConfig.vector.y, ___engine.cameraConfig.vector.z, ___engine.cameraConfig.vector.w));
				___engine.controls = new $controls;
				___engine.controls.init();

				delete ___engine.this.init;
				return  ___engine.this;
			}

			//
			this.config = function()
			{
				// À Faire
				// Ajouter les prefixes également
			}

			//
			this.color = function(color)
			{
				___engine.scene.background = new THREE.Color(color);
				return  ___engine.this;
			}

			//
			var $landmark = function()
			{
				var ____engine = {
					this: this,
					type: _enum.LANDMARK,
					mesh: [],
					scene: null,
				}

				//
				this.init = function()
				{
					let id = $getId(__engine.scene, _enum.SCENE);
					____engine.scene = new $scene(true);
					____engine.scene.init(id);

					delete ____engine.this.init;
					return ____engine.this;
				}

				//
				this.remove = function()
				{
					// Supprimer les object de ____engine.mesh
					return  ____engine.this;
				}

				//
				this.update = function(obj, id)
				{
					if (___engine.landmarkConfig.enable == false) {
						return  ____engine.this;
					}
					this.remove();
					return  ____engine.this;
				}
				
				//
				this.get = function(type, id)
				{
					let find;
					switch (type)
					{
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
			var $getMesh = function(callback, id, forced, landmark)
			{
				id = $getId(___engine.mesh, _enum.MESH, id);
				let find = $findKey(___engine.mesh, id);

				if (find != -1)
				{
					if (typeof(forced) != 'boolean' || forced == false) {
						return null;
					}
					___engine.scene.remove(___engine.mesh[find].mesh.get(_enum.MESH));
					___engine.mesh.splice(find, 1);
				}

				let datas = callback();
				let build = new $mesh;
				build.init(id, landmark, datas.type, datas.mesh, datas.callback);
				return build;
			}

			//
			this.add = function(mesh, type, id, forced, landmark)
			{
				return $getMesh(function()
				{
					return {
						type: type,
						mesh: mesh,
					}
				}, id, forced, landmark);
			}

			//
			this.merge = function(id, forced, landmark)
			{
				let find = $findKey(___engine.merge, id);
				if (find == -1) {
					let merge = new $merge;
					return merge.init(id, null, landmark);
				}
				if (typeof(forced) == 'boolean' && forced == true) {

				}
				return null;
			}

			//
			this.camera = function(id, forced, landmark)
			{
				//
			}

			//
			this.cone = function(vector, id, forced, landmark)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshPhongMaterial(___engine.materialConfig);
					let geometry = new THREE.CylinderGeometry(0, 1, 1, 50);
					let mesh = new THREE.Mesh(geometry, material);

					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 100, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						type: _enum.CONE,
						mesh: mesh,
					}
				}, id, forced, landmark);
			}

			//
			this.cylinder = function(vector, id, forced, landmark)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshPhongMaterial(___engine.materialConfig);
					let geometry = new THREE.CylinderGeometry(1, 1, 1, 50);
					let mesh = new THREE.Mesh(geometry, material);

					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 100, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						type: _enum.CYLINDER,
						mesh: mesh,
					}
				}, id, forced, landmark);
			}

			//
			this.sphere = function(vector, id, forced, landmark)
			{
				return $getMesh(function() {
					let material = new THREE.MeshPhongMaterial(___engine.materialConfig);
					let geometry = new THREE.SphereGeometry(1, 35, 35);
					let mesh = new THREE.Mesh(geometry, material);

					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						type: _enum.SPHERE,
						mesh: mesh,
					}
				}, id, forced, landmark);
			}

			//
			this.cube = function(vector, id, forced, landmark)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshPhongMaterial(___engine.materialConfig);
					let geometry = new THREE.BoxGeometry(1, 1, 1);
					let mesh = new THREE.Mesh(geometry, material);
					
					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						type: _enum.CUBE,
						mesh: mesh,
					}
				}, id, forced, landmark);
			}

			//
			this.light = function(id, forced, landmark)
			{
				return $getMesh(function()
				{
					let mesh = new THREE.SpotLight();
					
					return {
						type: _enum.LIGHT,
						mesh: mesh,
					}
				}, id, forced, landmark);
			}

			//
			this.plane = function(vector, id, forced, landmark)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshBasicMaterial(___engine.materialConfig);
					let geometry = new THREE.PlaneGeometry(1, 1);
					let mesh = new THREE.Mesh(geometry, material);

					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						type: _enum.PLANE,
						mesh: mesh,
					}
				}, id, forced, landmark);
			}

			//
			this.circle = function(vector, id, forced, landmark)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshBasicMaterial(___engine.materialConfig);
					let geometry = new THREE.CircleGeometry(1, 100);
					let mesh = new THREE.Mesh(geometry, material);
					
					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						type: _enum.CIRCLE,
						mesh: mesh,
					}
				}, id, forced, landmark);
			}

			//
			this.point = function(vectors, id, forced, landmark)
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
				}, id, forced, landmark);
			}

			//
			this.arc = function(pc, ratio, id, forced, landmark)
			{
				return $getMesh(function()
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
					let material = new THREE.LineBasicMaterial(___engine.lineMaterialConfig);
					let mesh = new THREE.Line(geometry, material);

					return {
						type: _enum.ARC,
						mesh: mesh,
					}
				}, id, forced, landmark);
			}

			//
			this.triangle = function(vector, id, forced, landmark)
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
				}, id, forced, landmark);
			}

			//
			this.line = function(vectors, id, forced, landmark)
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
				}, id, forced, landmark);
			}

			//
			this.text = function(text, id, forced, landmark)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshBasicMaterial(___engine.materialConfig);
					let geometry = new THREE.Geometry();
					let mesh = new THREE.Mesh(geometry, material);

					let getFont = function(mesh) {

						// Mettre un système pour charger la font en dehors de cette fonction ou entrer l'url pour le charger ici

						mesh = mesh.get(_enum.MESH);
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
				}, id, forced, landmark);
			}

			//
			var $mesh = function()
			{
				var ____engine = {
					this: this,
					type: _enum.MESH,
					landmark: true,
					mesh: null,
					config: {
						stop: false,
					},
				}

				//
				this.init = function(id, landmark, type, mesh, callback)
				{
					___engine.mesh.push({
						id: id,
						type: type,	
						mesh: ____engine.this,
						inScene: false,
						merged: false,
					});

					____engine.landmark = (typeof(landmark) != 'boolean' ? true : landmark);
					____engine.mesh = mesh;
					____engine.type = type; 
					____engine.mesh.name = id;

					/*** Black magic 2 ***/
					$addPrefix(____engine, 'name', ____engine.mesh.name);
					//$addPrefix(____engine, 'font', ____engine.mesh.geometry.font);
					//$addPrefix(____engine, 'texture', ____engine.this.map);
					//$addPrefix(____engine, 'transform', ____engine.mesh.position);
					$addPrefix(____engine, 'scale', ____engine.mesh.scale);
					$addPrefix(____engine, 'position', ____engine.mesh.position);
					$addPrefix(____engine, 'rotation', ____engine.mesh.rotation);
					/*** END ***/

					/*** Black magic 3 ***/
					$addVector(____engine, 'scale', ____engine.mesh.scale);
					$addVector(____engine, 'position', ____engine.mesh.position);
					$addVector(____engine, 'rotation', ____engine.mesh.rotation);
					/*** END ***/

					/*** Black magic ***/
					for (var index in mesh.material) {
						if (typeof(mesh.material[index]) != 'function' && typeof(____engine.this[index]) == 'undefined' && index[0] != '_') {
							$copyProperty(____engine, index, function (param) {
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
							});
							$addPrefix(____engine, index, mesh.material[index]);
						}
					}
					/*** END ***/

					if (____engine.landmark == true) {
						___engine.landmark.update(____engine.mesh.name, ____engine.type);
					}

					if (___engine.render == true) {
						____engine.this.render();
					}

					if (typeof(callback) == 'function') {
						callback(____engine.this);
					}

					delete ____engine.this.init;
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
					// À TESTER
					// Mettre un système pour charcher la texture en externe ou entrer l'url pour le charger ici
					let loader = new THREE.TextureLoader();
					loader.load(url, function(texture) {
						____engine.this.map(texture);
					});	
					return ____engine.this;
				}

				//
				this.transform = function(vector)
				{
					// À Modifier
					let points = vector.get();
					for (var index in points) {
						____engine.mesh.geometry.vertices[index].set(points[index].x, points[index].y, points[index].z, points[index].w);
					}
					if (typeof(____engine.mesh.geometry) != 'undefined') {
						____engine.mesh.geometry.verticesNeedUpdate = true;
					}
					if (____engine.landmark == true) {
						___engine.landmark.update(____engine.mesh.name, ____engine.type);
					}
					return ____engine.this;
				}

				//
				this.scale = function(vec, update)
				{
					if (typeof(vec) != 'object') {
						return null;
					}
					let vector = vec.get(0);
					$extend(____engine.mesh.scale, vector);
					if (typeof(____engine.mesh.geometry) != 'undefined') {
						____engine.mesh.geometry.verticesNeedUpdate = true;
					}
					if (____engine.landmark == true && (typeof(update) != 'boolean' || update == true)) {
						___engine.landmark.update(____engine.mesh.name, ____engine.type);
					}
					return  ____engine.this;
				}
				
				//
				this.position = function(vec, update)
				{
					if (typeof(vec) != 'object') {
						return null;
					}
					let vector = vec.get(0);
					$extend(____engine.mesh.position, vector);
					if (typeof(____engine.mesh.geometry) != 'undefined') {
						____engine.mesh.geometry.verticesNeedUpdate = true;
					}
					if (____engine.landmark == true && (typeof(update) != 'boolean' || update == true)) {
						___engine.landmark.update(____engine.mesh.name, ____engine.type);
					}
					return  ____engine.this;
				}

				//
				this.rotation = function(vec, update)
				{
					if (typeof(vec) != 'object') {
						return null;
					}
					let vector = vec.get(0);
					$extend(____engine.mesh.rotation, vector);
					if (typeof(____engine.mesh.geometry) != 'undefined') {
						____engine.mesh.geometry.verticesNeedUpdate = true;
					}
					if (____engine.landmark == true && (typeof(update) != 'boolean' || update == true)) {
						___engine.landmark.update(____engine.mesh.name, ____engine.type);
					}
					return  ____engine.this;
				}

				//
				this.render = function()
				{
					let find = $findKey(___engine.mesh, ____engine.mesh.name);
					if (find == -1) {
						return null;
					}
					___engine.config.stop = false;
					____engine.config.stop = false;
					if (___engine.mesh[find].inScene == false) {
						___engine.scene.add(___engine.mesh[find].mesh.get(_enum.MESH));
						___engine.mesh[find].inScene = true;
					}
					return ____engine.this;
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
					___engine.scene.remove(____engine.mesh);
					return ____engine.this;
				}

				//
				this.remove = function(update)
				{
					let find = $findKey(___engine.mesh, ____engine.mesh.name);
					if (find == -1) {
						return null;
					}
					___engine.scene.remove(____engine.mesh);
					___engine.mesh.splice(find, 1);
					if (____engine.landmark == true && (typeof(update) != 'boolean' || update == true)) {
						___engine.landmark.update(null, ____engine.type);
					}
					return ___engine.this;
				}

				//
				this.back = function(id, type)
				{
					if (typeof(id) == 'string') {
						type = (typeof(type) == 'undefined' ? _enum.MERGE : type);
						return ___engine.this.get(type, id);
					}
					return ___engine.this;
				}

				//
				this.merge = function(id, forced)
				{
					if (typeof(id) != 'string') {
						return null;
					}
					let me = $findKey(___engine.mesh, ____engine.mesh.name);
					if (me == -1) {
						return null;
					}
					let find = $findKey(___engine.merge, id);
					if (find == -1) {
						___engine.mesh[me].merged = true;
						let merge = new $merge;
						return merge.init(id, ___engine.mesh[me].mesh, ____engine.landmark);
					}
					___engine.mesh[me].merged = true;
					return ___engine.merge[find].merge.push(___engine.mesh[me].mesh, forced, ____engine.landmark);
				}

				//
				this.get = function(type, id)
				{
					let find;
					switch (type)
					{
						case _enum.MESH:
							return ____engine.mesh;
						break;
						case _enum.STOP:
							return __engine.config.stop;
						break;
						case _enum.TYPE:
							return ____engine.type;
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
					id: '',
					landmark: false,
					type: _enum.MERGE,
					merged: [],
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
				this.init = function(id, mesh, landmark)
				{
					___engine.merge.push({
						id: id,
						merge: ____engine.this,
						merged: false,
					});

					____engine.id = id;

					/*** Black magic 2 ***/
					$addPrefix(____engine, 'name', ____engine.id);
					$addPrefix(____engine, 'scale', ____engine.property.scale);
					$addPrefix(____engine, 'position', ____engine.property.position);
					$addPrefix(____engine, 'rotation', ____engine.property.rotation);
					/*** END ***/

					/*** Black magic 3 ***/
					$addVector(____engine, 'scale', ____engine.property.scale);
					$addVector(____engine, 'position', ____engine.property.position);
					$addVector(____engine, 'rotation', ____engine.property.rotation);
					/*** END ***/

					____engine.this.rotation.z = -10;
					____engine.this.rotation.y = -10;
					____engine.this.rotation.z = -10;

					if (mesh != null) {
						____engine.this.push(mesh, false, landmark);
					}

					delete ____engine.this.init;
					return ____engine.this;
				}

				//
				this.push = function(mesh, forced, landmark)
				{
					/*** Black magic ***/
					for (var index in mesh) {
						if (index[0] == '_' && typeof(____engine.this[index.substring(1)]) == 'undefined') {
							$copyProperty(____engine, index.substring(1), function (param) {
								let name = arguments.callee.myname;
								for (var key in ____engine.merged) {
									if (typeof(____engine.merged[key].merge[name]) == 'function') {
										____engine.merged[key].merge[name](param);
									}
								}
							});
							$addPrefix(____engine, index.substring(1), mesh[index]);
						}
					}
					/*** END ***/

					if (____engine.landmark == false) {
						____engine.landmark = (typeof(landmark) != 'boolean' ? true : landmark);
					}

					if (____engine.landmark == true) {
						___engine.landmark.update(____engine.id, ____engine.type);
					}
					
					____engine.merged.push({
						id: mesh._name,
						merge: mesh,
					});

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
						return ____engine.id;
					}
					find = $findKey(___engine.merge, ____engine.id);
					___engine.merge[find].id = id;
					____engine.id = id;
					return ____engine.this;
				}

				//
				this.scale = function(vec, update)
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
					if (____engine.landmark == true && (typeof(update) != 'boolean' || update == true)) {
						___engine.landmark.update(____engine.id, ____engine.type);
					}
					return  ____engine.this;
				}

				//
				this.position = function(vec, update)
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
					if (____engine.landmark == true && (typeof(update) != 'boolean' || update == true)) {
						___engine.landmark.update(____engine.id, ____engine.type);
					}
					return  ____engine.this;
				}

				//
				this.rotation = function(vec, update)
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
					if (____engine.landmark == true && (typeof(update) != 'boolean' || update == true)) {
						___engine.landmark.update(____engine.id, ____engine.type);
					}
					return  ____engine.this;
				}

				//
				this.merge = function(id)
				{
					if (typeof(id) != 'string') {
						return null;
					}
					let me = $findKey(___engine.merge, ____engine.id);
					if (me == -1) {
						return null;
					}
					let find = $findKey(___engine.merge, id);
					if (find != -1) {
						let me2 = ___engine.merge[find].merge.get(____engine.id, _enum.MERGE);
						if (me2 != null) {
							return me2;
						}
						___engine.merge[find].merge.push(id, ___engine.merge[me].merge);
						___engine.merge[me].merged = true;
						return ___engine.merge[find].merge;
					}
					let merge = new $merge;
					merge.init(id, ___engine.merge[me].merge);
					___engine.merge[me].merged = true;
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
						me = $findKey(___engine.merge, id);
						if (me == -1) {
							return null;
						}
						___engine.merge[me].merged = false;
					} else {
						me = $findKey(___engine.mesh, id);
						if (me == -1) {
							return null;
						}
						___engine.mesh[me].merged = false;
					}
					____engine.merged.splice(find, 1);
					if (____engine.landmark == true) {
						___engine.landmark.update(____engine.id, ____engine.type);
					}
					return ____engine.this;
				}

				//
				this.render = function()
				{
					for (var index in ____engine.merged) {
						____engine.merged[index].merge.render();
					}
					____engine.config.stop = false;
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
				this.remove = function(update)
				{
					let find = $findKey(____engine.merged, ____engine.id);
					if (find == -1) {
						return null;
					}
					for (var index in ____engine.merged) {
						____engine.merged[index].merge.remove(false);
					}
					___engine.merge.slice(find, 1);
					if (____engine.landmark == true && (typeof(update) != 'boolean' || update == true)) {
						___engine.landmark.update(null, ____engine.type);
					}
					return ___engine.this;
				}

				//
				this.back = function(id, type)
				{
					if (typeof(id) == 'string') {
						type = (typeof(type) == 'undefined' ? _enum.MERGE : type);
						return ___engine.this.get(type, id);
					}
					return ___engine.this;
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
						default:
							return null;
					}
				}

				return ____engine.this;
			}

			//
			var $controls = function()
			{
				var ____engine = {
					this: this,
					type: _enum.CONTROLS,
					controls: null,
				}

				//
				this.init = function()
				{
					____engine.this.update();

					delete ____engine.this.init;
					return ____engine.this;
				}

				//
				this.update = function()
				{
					let camera = ___engine.this.get(_enum.CAMERA).get(_enum.ENABLE, _enum.CAMERA);
					if (camera == null || ___engine.controlsConfig.enable == false) {
						____engine.controls = null;
						return ____engine.this;
					}
					____engine.controls = new THREE.TrackballControls(camera);
					$extend(____engine.controls, ___engine.controlsConfig.property, true);
					return ____engine.this;
				}

				//
				this.get = function(type, id)
				{
					let find;
					switch (type)
					{
						case _enum.CONTROLS:
							return ____engine.controls;
						break;
						default:
							return null;
					}
				}

				return ____engine.this;
			}

			//
			var $camera = function()
			{
				var ____engine = {
					this: this,
					type: _enum.CAMERA,
					camera: [],
				}

				//
				this.init = function(vector)
				{
					$extend(____engine.this.position, {x: 0, y: 0, z: 0, w: 0}, true, ['x', 'y', 'z', 'w']);
					$extend(____engine.this.rotation, {x: 0, y: 0, z: 0, w: 0}, true, ['x', 'y', 'z', 'w']);

					____engine.this.add(vector, 'camera1');
					____engine.this.switch('camera1')

					delete ____engine.this.init;
					return ____engine.this;
				}

				//
				this.add = function(vector, id, forced)
				{
					vector = vector.get(0);
					id = (typeof(id) == 'undefined' ? $getId(____engine.camera, _enum.CAMERA) : id);
					let camera = new THREE.PerspectiveCamera(___engine.cameraConfig.fov, ___engine.cameraConfig.aspect, ___engine.cameraConfig.near, ___engine.cameraConfig.far);
					camera.position.set(vector.x, vector.y, vector.z, vector.w);
					camera.name = id;
					____engine.camera.push({
						id: id,
						camera:	camera,
						enable: false,
					});
					return  ____engine.this;
				}

				//
				this.fov = function(val)
				{
					let find = ____engine.this.get(_enum.ENABLE);
					if (find == -1) {
						return null;
					}
					____engine.camera[find].camera.fov = val;
					____engine.camera[find].camera.updateProjectionMatrix();
					return  ____engine.this;
				}
				
				//
				this.aspect = function(val)
				{
					let find = ____engine.this.get(_enum.ENABLE);
					if (find == -1) {
						return null;
					}
					____engine.camera[find].camera.aspect = val;
					____engine.camera[find].camera.updateProjectionMatrix();
					return  ____engine.this;
				}
				
				//
				this.near = function(val)
				{
					let find = ____engine.this.get(_enum.ENABLE);
					if (find == -1) {
						return null;
					}
					____engine.camera[find].camera.near = val;
					____engine.camera[find].camera.updateProjectionMatrix();
					return  ____engine.this;
				}
				
				//
				this.far = function(val)
				{
					let find = ____engine.this.get(_enum.ENABLE);
					if (find == -1) {
						return null;
					}
					____engine.camera[find].camera.far = val;
					____engine.camera[find].camera.updateProjectionMatrix();
					return  ____engine.this;
				}
	
				//
				this.switch = function(id)
				{
					let find = $findKey(____engine.camera, id);
					if (find == -1) {
						return null;
					}
					let camera = ____engine.this.get(_enum.ENABLE, _enum.CAMERA);
					if (camera != null) {
						$extend(camera.position, ____engine.this.position, true, ['x', 'y', 'z', 'w']);
						$extend(camera.rotation, ____engine.this.rotation, true, ['x', 'y', 'z', 'w']);
						___engine.scene.remove(camera.camera);
					}
					____engine.camera[find].enable = true;
					___engine.scene.add(____engine.camera[find].camera);
					$extend(____engine.this.position, ____engine.camera[find].camera.position, true, ['x', 'y', 'z', 'w']);
					$extend(____engine.this.rotation, ____engine.camera[find].camera.rotation, true, ['x', 'y', 'z', 'w']);
					return  ____engine.this;
				}
				
				//
				this.position = function(vec)
				{
					let find = ____engine.this.get(_enum.ENABLE);
					if (find == -1) {
						return null;
					}
					if (typeof(vec) == 'object') {
						let vector = vec.get(0);
						$extend(____engine.this.position, vector);
					}
					$extend(____engine.camera[find].camera.position, ____engine.this.position, true, ['x', 'y', 'z', 'w']);
					if (typeof(vec) == 'undefined') {
						return ____engine.camera[find].camera.position;
					}
					return  ___engine.this;
				}

				//
				this.rotation = function(vec)
				{
					let find = ____engine.this.get(_enum.ENABLE);
					if (find == -1) {
						return null;
					}
					if (typeof(vec) == 'object') {
						let vector = vec.get(0);
						$extend(____engine.this.rotation, vector);
					}
					$extend(____engine.camera[find].camera.rotation, ____engine.this.rotation, true, ['x', 'y', 'z', 'w']);
					if (typeof(vec) == 'undefined') {
						return ____engine.camera[find].camera.rotation;
					}
					return  ___engine.this;
				}

				//
				this.remove = function(id)
				{
					let find = $findKey(____engine.camera, id);
					if (find == -1 && (find = ____engine.this.get(_enum.ENABLE)) == -1) {
						return null;
					}
					___engine.scene.remove(____engine.camera[find].camera);
					____engine.camera.splice(find, 1);
					return  ___engine.this;
				}

				//
				this.get = function(type, id, full)
				{
					let find;
					switch (type)
					{
						case _enum.CAMERA:
							return ____engine.camera;
						break;
						case _enum.ENABLE:
							for (var index in ____engine.camera) {
								if (____engine.camera[index].enable == true) {
									if (typeof(id) == 'string' && id == _enum.CAMERA) {
										if (typeof(full) == 'boolean' && full == true) {
											return ____engine.camera[index];
										}
										return ____engine.camera[index].camera;
									}
									return index;
									break;
								}
							}
							return null;
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
			this.render = function()
			{
				___engine.render = true;
				___engine.config.stop = false;
				for (var index in ___engine.mesh) {
					if (___engine.mesh[index].inScene == false) {
						___engine.scene.add(___engine.mesh[index].mesh.get(_enum.MESH));
						___engine.mesh[index].inScene = true;
					}
				}
				return ___engine.this;
			}

			//
			this.stop = function()
			{
				___engine.render = false;
				__engine.config.stop = true;
				for (var index in ___engine.mesh) {
					if (___engine.mesh[index].inScene == true) {
						___engine.mesh[index].remove();
						___engine.mesh[index].inScene = false;
					}
				}
				return ___engine.this;
			}

			//
			this.get = function(type, id, full)
			{
				let find;
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
						if (typeof(full) == 'boolean' && full == true) {
							return ___engine.mesh[find];
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
						if (typeof(full) == 'boolean' && full == true) {
							return ___engine.merge[find];
						}
						return ___engine.merge[find].merge;
					break;
					case _enum.STOP:
						return __engine.config.stop;
					break;
					case _enum.CAMERA:
						return ___engine.camera;
					break;
					case _enum.SCENE:
						return ___engine.scene;
					break;
					case _enum.CONTROLS:
						return ___engine.controls;
					break;
					default:
						return null;
				}
			}
			
			return ___engine.this;
		}

		//
		this.get = function(type, id, full)
		{
			let find;
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
					if (typeof(full) == 'boolean' && full == true) {
						return __engine.scene[find];
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
		var __engine = {
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
	this.get = function(type, id, full)
	{
		let find;
		switch (type)
		{
			case _enum.APP:
				if (typeof(id) == 'undefined' || id == null) {
					return _engine.branch;
				}
				let find = $findKey(_engine.branch, id);
				if (find == -1) {
					return null;
				}
				if (typeof(full) == 'boolean' && full == true) {
						return _engine.branch[find];
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
			let update = branch.get(_enum.UPDATE);
			for (var index2 in update) {
				update[index2]();
			}

			//
			let scenes = branch.get(_enum.SCENE);
			for (var index2 in scenes)
			{
				let scene = scenes[index2].scene;
			
				//
				let camera = scene.get(_enum.CAMERA);
				//camera.position();
				//camera.rotation();
			}	
		}
	}, _engine.config.timeUpdate);

	//
	var $draw = function()
	{
		for (var index in _engine.branch) {
			let draw = _engine.branch[index].branch.get(_enum.DRAW);
			for (var index2 in draw) {
				draw[index2]();
			}
		}

		for (var index in _engine.branch) {
			let branch = _engine.branch[index].branch;
			if (branch.get(_enum.STOP) == false)
			{
				let scenesRoot = [];
				let scenes = branch.get(_enum.SCENE);

				let renderScene = function(scene) {
					let _renderer = branch.get(_enum.RENDERER);
					let _scene = scene.get(_enum.SCENE);
					let _cameraObj = scene.get(_enum.CAMERA);

					let _controls = scene.get(_enum.CONTROLS).get(_enum.CONTROLS);
					if (_controls != null) {
						_controls.update();
					}

					_renderer.clearDepth();

					let _camera = _cameraObj.get(_enum.CAMERA);
					for (var index3 in _camera) {
						if (_camera[index3].enable == true) {
							_renderer.render(_scene, _camera[index3].camera);
						}
					}
				}

				for (var index2 in scenes) {
					let infosScene = scenes[index2];
					let scene = infosScene.scene;	
					if (scene.get(_enum.STOP) == false && infosScene.root == false) {
						renderScene(scene);
					}
					if (scene.get(_enum.STOP) == false && infosScene.root == true) {
						scenesRoot.push(infosScene.scene);
					}
				}

				for (var index2 in scenesRoot) {
					renderScene(scenesRoot[index2]);
				}

			}
		}
		requestAnimationFrame($draw);
	}

	$draw();

	return $extend(_engine.this, _enum);
})();
