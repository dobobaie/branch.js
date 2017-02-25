var BRANCH = (function()
{
	//
	let _enum = {
		NONE: 'none',

		TEXT: 'text',
		OBJ: 'obj',
		SPHERE: 'sphere',
		ARC: 'arc',
		MESH: 'mesh',
		POINT: 'point',
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
		CURRENT: 'current',
		LANDMARK: 'landmark',
		TYPE: 'type',
		MATH: 'math',
		VECTOR: 'vector',
		MERGE: 'merge',
		OBJECTS: 'objects',
		STOP: 'stop',
		CAMERA: 'camera',
		SCENE: 'scene',
		RENDERER: 'renderer',
		LAYER: 'layer',
		UPDATE: 'update',
		DRAW: 'draw',
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
			id: '',
			current: '',
			type: _enum.LAYER,
			layer: [],
			root: [],
			camera: null,
			renderer: null,
			config: {
				timeUpdate: 100,
				scene: {
					el: document.body, //document.getElementById('canvas'),
					height: window.innerHeight,
					width: window.innerWidth,
					webGL: true,
					renderer: {
						antialias: true,
						autoClear: false,
					},
					camera: {
						fov: 53,
						aspect: 1,
						near: 1,
						far: 10000,
						position: {x: 0, y: 0, z: 1000},
						rotation: {x: 0, y: 0, z: 0},
					},
					font: 'fonts/helvetiker_regular.typeface.json',
					material: {
						overdraw: true,
						side: THREE.DoubleSide,
					},
					pointMaterial: {
						sizeAttenuation: false,
					},
					lineMaterial: {

					},
					controls: {
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
					landmark: {
						enable: false,
						margin: 100,
					}
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
			let canvas = document.createElement('canvas');
			__engine.config.scene.webGL = (__engine.config.scene.webGL == true && window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
			__engine.renderer = (__engine.config.scene.webGL ? new THREE.WebGLRenderer(__engine.config.scene.renderer) : new THREE.CanvasRenderer(__engine.config.scene.renderer));
			$extend(__engine.renderer, __engine.config.scene.renderer);
			__engine.renderer.setSize(__engine.config.scene.width, __engine.config.scene.height);
			__engine.config.scene.el.appendChild(__engine.renderer.domElement);

			//
			__engine.id = id;

			//
			_engine.scene.push({
				id: id,
				runned: true,
				scene: __engine.this,
			});

			//
			__engine.current = $getId(__engine.layer, _enum.LAYER);
			__engine.this.switch(__engine.current);

			//
			__engine.camera = new $camera;
			__engine.camera.init();

			//
			$addPrefix(__engine, 'background', __engine.this.background);

			delete __engine.this.init;
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
			__engine.current = id;
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
			// console.log(id);
		}

		//
		this.render = function(mesh, type)
		{
			//
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
				case _enum.CURRENT:
					find = $findKey(__engine.layer, __engine.current);
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
						id = __engine.current;
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
				case _enum.CAMERA:
					return __engine.camera;
				break;
				default:
					return null;
			}
		}
	
		//
		const $camera = function()
		{
			let ___engine = {
				this: this,
				type: _enum.CAMERA,
				camera: null,
				controls: null,
			}

			//
			this.init = function()
			{
				//
				___engine.camera = new THREE.PerspectiveCamera(__engine.config.scene.camera.fov, __engine.config.scene.camera.aspect, __engine.config.scene.camera.near, __engine.config.scene.camera.far);
				$extend(___engine.camera.position, __engine.config.scene.camera.position);
				$extend(___engine.camera.rotation, __engine.config.scene.camera.rotation);

				//
				___engine.controls = new THREE.TrackballControls(___engine.camera);
				$extend(___engine.controls, __engine.config.scene.controls.property, true);

				//
				$addPrefix(___engine, 'position', ___engine.camera.position);
				$addPrefix(___engine, 'rotation', ___engine.camera.rotation);
				
				//
				$addVector(___engine, 'position', ___engine.camera.position);
				$addVector(___engine, 'rotation', ___engine.camera.rotation);
				
				delete ___engine.this.init;
				return ___engine.this;
			}

			//
			this.position = function(vector)
			{
				if (typeof(vector) != 'object') {
					return null;
				}
				vector = vector.get(0);
				$extend(___engine.camera.position, vector);
				return  ___engine.this;
			}

			//
			this.rotation = function(vector)
			{
				if (typeof(vec) != 'object') {
					return null;
				}
				vector = vector.get(0);
				$extend(___engine.camera.rotation, vector);
				return  ___engine.this;
			}

			//
			this.get = function(type, id, full)
			{
				let find;
				switch (type)
				{
					case _enum.CAMERA:
						return ___engine.camera;
					break;
					case _enum.CONTROLS:
						return ___engine.controls;
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
				}

				//
				this.init = function()
				{

				}

				//
				this.grid = function()
				{

				}

				//
				this.origin = function()
				{
					let scale = function() {

					}

					let position = function() {

					}

					let rotation = function() {

					}
				}

				//
				this.update = function()
				{

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
				mesh: [],
			}

			//
			this.init = function(id)
			{
				___engine.layer = id;

				delete ___engine.this.init;
				return ___engine.this;
			}

			//
			this.add = function(mesh, type, id)
			{
				return $getMesh(function()
				{
					return {
						type: type,
						mesh: mesh,
					}
				}, id);
			}

			//
			this.merge = function(id)
			{
				id = (typeof(id) != 'string' ? $getId(__engine.layer, _enum.LAYER) : id);
				let find = $findKey(___engine.mesh, id);
				if (find != -1) {
					return null;
				}
				let merge = new $merge;
				return merge.init(id, null);
			}

			//
			this.camera = function(id)
			{
				//
			}

			//
			this.cone = function(vector, id)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshPhongMaterial(__engine.config.scene.material);
					let geometry = new THREE.CylinderGeometry(0, 1, 1, 50);
					let mesh = new THREE.Mesh(geometry, material);

					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 100, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						type: _enum.CONE,
						mesh: mesh,
					}
				}, id);
			}

			//
			this.cylinder = function(vector, id)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshPhongMaterial(__engine.config.scene.material);
					let geometry = new THREE.CylinderGeometry(1, 1, 1, 50);
					let mesh = new THREE.Mesh(geometry, material);

					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 100, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						type: _enum.CYLINDER,
						mesh: mesh,
					}
				}, id);
			}

			//
			this.sphere = function(vector, id)
			{
				return $getMesh(function() {
					let material = new THREE.MeshPhongMaterial(__engine.config.scene.material);
					let geometry = new THREE.SphereGeometry(1, 35, 35);
					let mesh = new THREE.Mesh(geometry, material);

					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						type: _enum.SPHERE,
						mesh: mesh,
					}
				}, id);
			}

			//
			this.cube = function(vector, id)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshPhongMaterial(__engine.config.scene.material);
					let geometry = new THREE.BoxGeometry(1, 1, 1);
					let mesh = new THREE.Mesh(geometry, material);
					
					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						type: _enum.CUBE,
						mesh: mesh,
					}
				}, id);
			}

			//
			this.light = function(id)
			{
				return $getMesh(function()
				{
					let mesh = new THREE.SpotLight();
					
					return {
						type: _enum.LIGHT,
						mesh: mesh,
					}
				}, id);
			}

			//
			this.plane = function(vector, id)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshBasicMaterial(__engine.config.scene.material);
					let geometry = new THREE.PlaneGeometry(1, 1);
					let mesh = new THREE.Mesh(geometry, material);

					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						type: _enum.PLANE,
						mesh: mesh,
					}
				}, id);
			}

			//
			this.circle = function(vector, id)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshBasicMaterial(__engine.config.scene.material);
					let geometry = new THREE.CircleGeometry(1, 100);
					let mesh = new THREE.Mesh(geometry, material);
					
					vector = (vector == null || typeof(vector) != 'object' ? _engine.this.vector(50, 50, 50) : vector);
					$extend(mesh.scale, vector.get(0));

					return {
						type: _enum.CIRCLE,
						mesh: mesh,
					}
				}, id);
			}

			//
			this.point = function(vectors, id)
			{
				return $getMesh(function()
				{
					let material = new THREE.PointsMaterial(__engine.config.scene.pointMaterial);
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
				}, id);
			}

			//
			this.arc = function(pc, ratio, id)
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
					let material = new THREE.LineBasicMaterial(__engine.config.scene.lineMaterial);
					let mesh = new THREE.Line(geometry, material);

					return {
						type: _enum.ARC,
						mesh: mesh,
					}
				}, id);
			}

			//
			this.triangle = function(vector, id)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshBasicMaterial(__engine.config.scene.material);
					let geometry = new THREE.Geometry();
					geometry.vertices.push(vector.get(0), vector.get(1), vector.get(2));
					geometry.faces.push(new THREE.Face3(0, 1, 2));
					let mesh = new THREE.Mesh(geometry, material);

					return {
						type: _enum.TRIANGLE,
						mesh: mesh,
					}
				}, id);
			}

			//
			this.line = function(vectors, id)
			{
				return $getMesh(function()
				{
					let material = new THREE.LineBasicMaterial(__engine.config.scene.lineMaterial);
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
				}, id);
			}

			//
			this.text = function(text, id)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshBasicMaterial(__engine.config.scene.material);
					let geometry = new THREE.Geometry();
					let mesh = new THREE.Mesh(geometry, material);

					let getLoad = function(mesh) {


						let loader = new THREE.FontLoader();
						loader.load(__engine.config.font, function(font) {
							let name = mesh._name;
						 	mesh.remove();
						 	
						 	let material = new THREE.MeshBasicMaterial(__engine.config.scene.material);
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
							let mesh2 = new THREE.Mesh(geometry, material);
							___engine.this.add(mesh2, _enum.TEXT, name);
						});
					}

					return {
						type: _enum.NONE,
						mesh: mesh,
						callback: getLoad,
					}
				}, id);
			}

			//
			this.obj = function(url, id)
			{
				return $getMesh(function()
				{
					let material = new THREE.MeshBasicMaterial(__engine.config.scene.material);
					let geometry = new THREE.Geometry();
					let mesh = new THREE.Mesh(geometry, material);

					let getLoad = function(mesh) {
						let loader = new THREE.OBJLoader();
						loader.load(url, function(obj) {
							let name = mesh._name;
						 	mesh.remove();
						 	___engine.this.add(obj, _enum.OBJ, name);
						});
					}

					return {
						type: _enum.NONE,
						mesh: mesh,
						callback: getLoad,
					}
				}, id);
			}

			//
			this.get = function(type, id, full)
			{
				let find;
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
					default:
						return null;
				}
			}

			//
			const $getMesh = function(callback, id)
			{
				id = (typeof(id) != 'string' ? $getId(___engine.mesh, _enum.MESH, id) : id);
				let find = $findKey(___engine.mesh, id);
				if (find != -1) {
					return null;
				}
				let datas = callback();
				let build = new $mesh;
				build.init(id, datas.type, datas.mesh, datas.callback);
				return build;
			}

			//
			const $mesh = function()
			{
				let ____engine = {
					this: this,
					type: _enum.MESH,
					mesh: null,
					config: {
						stop: false,
					},
				}

				//
				this.init = function(id, type, mesh, callback)
				{
					___engine.mesh.push({
						id: id,
						type: type,	
						mesh: ____engine.this,
						inScene: false,
						merged: false,
					});

					____engine.mesh = mesh;
					____engine.type = type; 
					____engine.mesh.name = id;

					/*** Black magic 2 ***/
					$addPrefix(____engine, 'name', ____engine.mesh.name);
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
					for (let index in mesh.material) {
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

					//
					__engine.this.select(____engine.mesh.name, true);

					//
					let find = $findKey(__engine.layer, ___engine.layer);
					if (find == -1) {
						return null;
					}
					__engine.layer[find].layer.add(mesh);

					//
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
					__engine.this.select(____engine.mesh.name, true);
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
					__engine.this.select(____engine.mesh.name, true);
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
					__engine.this.select(____engine.mesh.name, true);
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
					__engine.this.select(____engine.mesh.name, true);
					return ____engine.this;
				}

				//
				this.remove = function()
				{
					let find = $findKey(___engine.mesh, ____engine.mesh.name);
					let find2 = $findKey(__engine.layer, ___engine.layer);
					if (find == -1 || find == -1) {
						return null;
					}
					___engine.mesh.splice(find, 1);
					__engine.layer[find2].layer.remove(____engine.mesh);
					__engine.this.select(____engine.mesh.name, true);
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
					let find = $findKey(___engine.merge, id);
					if (find == -1) {
						let merge = new $merge;
						return merge.init(id, ____engine.mesh.name);
					}
					return ___engine.mesh[find].merge.push(____engine.mesh.name);
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
				this.init = function(id, meshId)
				{
					___engine.mesh.push({
						id: id,
						type: ____engine.type,	
						mesh: ____engine.this,
						merged: false,
					});

					//
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

					//
					__engine.this.select(____engine.id, true);
					
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
					find = $findKey(___engine.mesh, ____engine.id);
					___engine.mesh[find].id = id;
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
					__engine.this.select(____engine.id, true);
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
					__engine.this.select(____engine.id, true);
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
					__engine.this.select(____engine.id, true);
					return  ____engine.this;
				}

				//
				this.merge = function(id)
				{
					if (typeof(id) != 'string') {
						return null;
					}
					let me = $findKey(___engine.mesh, ____engine.id);
					if (me == -1) {
						return null;
					}
					let find = $findKey(___engine.mesh, id);
					if (find != -1) {
						if (___engine.mesh[find].type != _enum.MERGE) {
							return null;
						}
						let me2 = ___engine.mesh[find].mesh.get(_enum.MERGE, ____engine.id);
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
					__engine.this.select(____engine.id, true);
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
				this.remove = function()
				{
					let find = $findKey(____engine.merged, ____engine.id);
					if (find == -1) {
						return null;
					}
					for (var index in ____engine.merged) {
						____engine.merged[index].merge.remove();
					}
					___engine.mesh.slice(find, 1);
					__engine.this.select(____engine.id, true);
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
						default:
							return null;
					}
				}

				return ____engine.this;
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
		if (typeof(id) == 'undefined') {
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
	const $copyProperty = function(me, name, value)
	{
		if (typeof(me.this[name]) != 'undefined') {
			return null;
		}
		me.this[name] = value;
		me.this[name].myname = name;
	}

	//
	const $addPrefix = function(me, name, value)
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
			
			let controls = scene.get(_enum.CAMERA).get(_enum.CONTROLS);
			if (controls != null) {
				controls.update();
			}

			let camera = scene.get(_enum.CAMERA).get(_enum.CAMERA);
			let layer = scene.get(_enum.LAYER);
			let renderer = scene.get(_enum.RENDERER);
			for (let index2 in layer) {
				renderer.clearDepth();
				renderer.render(layer[index2].layer, camera);
			}
		
		}

		requestAnimationFrame($draw);
	}

	$draw();

	return $extend(_engine.this, _enum);
})();
