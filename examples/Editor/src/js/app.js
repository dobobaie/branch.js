let sceneEditor, currentObject, scene;

/**

**/
function appReady()
{
	//
	scene = BRANCH.scene(function () {
		this.el = document.getElementById('canvas');
		this.height = parseInt($('#canvas').css('height').substring(0, $('#canvas').css('height').length - 2)) - 2;
		this.width = parseInt($('#canvas').css('width').substring(0, $('#canvas').css('width').length - 2)) - 2;
	});

	//
	sceneEditor = new SceneEditor(scene).$init();

	//
	scene.change(function (obj, type) {
		sceneEditor.update(obj, type);
	});

	//
	scene.selected(function (obj, type) {
		sceneEditor.select(obj._name);
	});

	//
	let camera2 = scene.camera();
	camera2.position(BRANCH.vector(Math.sqrt(Math.pow(camera2.position.x, 2) + Math.pow(camera2.position.y, 2) + Math.pow(camera2.position.z, 2)), 0, 0));
	scene.render(camera2._name, 'render2', document.getElementById('canvas2'));
	sceneEditor.addAndSelect(camera2._name);

	//
	let camera3 = scene.camera();
	camera3.position(BRANCH.vector(0, Math.sqrt(Math.pow(camera3.position.x, 2) + Math.pow(camera3.position.y, 2) + Math.pow(camera3.position.z, 2)), 0));
	scene.render(camera3._name, 'render3', document.getElementById('canvas3'));
	sceneEditor.addAndSelect(camera3._name);

	//
	let camera4 = scene.camera();
	camera4.position(BRANCH.vector(0, 0, Math.sqrt(Math.pow(camera4.position.x, 2) + Math.pow(camera4.position.y, 2) + Math.pow(camera4.position.z, 2))));
	scene.render(camera4._name, 'render4', document.getElementById('canvas4'));
	sceneEditor.addAndSelect(camera4._name);

	//
	$('#meshActions>li[attr-action=light]').click();
}

/**

**/
function fileActions(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);

	switch (action)
	{
		case 'new':
			delete sceneEditor;
			$('.canvas').html('');
			$('#SceneHierarchy>ul').html('');
			$('#objectInspector>.fullObject>#objectTab').html('');
			$('#objectInspector>.fullObject>#geometryTab').html('');
			$('#objectInspector>.fullObject>#materialsTab').html('');
			$('#objectInspector>.fullObject').addClass('hide');
			$('#objectInspector>.loadObject').addClass('hide');
			$('#objectInspector>.emptyObject').removeClass('hide');
			appReady();
		break;
		case 'import':
			//
		break;
		case 'export':
			//
		break;
		default:
			return ;
	}
}

/**

**/
function impActions(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents().attr('attr-action') : action);

	//
	switch (action)
	{
		case 'asset':
			modal.open('./templates/asset_modal.html', function() {
				$('#modal_btn_import_asset>a').click(modal_btn_import_asset);
			});
		break;
		case 'scene':
			modal.open('./templates/scene_modal.html', function() {
				$('#modal_btn_import_scene>a').click(modal_btn_import_scene);
			});
		break;
		default:
			return ;
	}
}


/**

**/
function modal_btn_import_asset(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents().attr('attr-action') : action);

	//
	switch (action)
	{
		case 'import':
			let tmpObj = currentObject;
			toResizeImage($('#file_upload')[0].files[0], 128, function(file) {
				let formData = new FormData();
				formData.append('file', file);

				$.ajax({
					url: 'http://127.0.0.1:8888/',
					type : 'POST',
					dataType: 'JSON',
					data : formData,
					processData: false,
					contentType: false,
					success : function(data) {
						console.log(data);
						if (tmpObj != null && typeof(tmpObj.texture) != 'undefined') {
							tmpObj.texture(data.files[0].url);
						}
					},
				});

			});
		break;
		default:
			return ;
	}
}

/**

**/
function modal_btn_import_scene(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents().attr('attr-action') : action);

	//
	switch (action)
	{
		case 'import':
			console.log('ici');
		break;
		default:
			return ;
	}

	/*
	let action = $(e.target).attr('attr-action');
		action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);
		switch (action) {
			case 'new':
				console.log("new");
			break;
			case 'import':
				console.log('import');
				var input = $('#file-input');
				console.log(input);
				input.click();
			break;
			case 'export':
				var object = scene.get(BRANCH.OBJECTS);
				var meshs = object.get(BRANCH.OBJECTS);
				var id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
				saveTextAs(JSON.stringify(meshs), "scene_Save_" + id + ".js");
			break;
		}
	*/

}

/**

**/
//inaccessible vu que le bouton "importer" ne réagit plus
function importScene(sceneData)
{
	for (var i = 0 ; i < sceneData.length ; i++)
	{
		var scaleVector = BRANCH.vector(sceneData[i].mesh._scale.x, sceneData[i].mesh._scale.y, sceneData[i].mesh._scale.z);
		var positionVector = BRANCH.vector(sceneData[i].mesh._position.x, sceneData[i].mesh._position.y, sceneData[i].mesh._position.z);
		var rotationVector = BRANCH.vector(sceneData[i].mesh._rotation.x, sceneData[i].mesh._rotation.y, sceneData[i].mesh._rotation.z);

		//see if you can get a ref on last created sceneData[i] for later refactor
		switch (sceneData[i].type)
		{
			case 'text':
				//text hasn't been implemented yet.
				//this.text()
			break;
			case 'obj':
				//currentObject = scene.obj("obj", "mtl").position(positionVector).rotation(rotationVector).scale(scaleVector);
			break;
			case 'arc':
				//same deal
			break;
			case 'mesh':
				//same deal ?
			break;
			case 'point':
				currentObject = scene.circle().position(positionVector).rotation(rotationVector).scale(scaleVector);
				currentObject.color(sceneData[i].mesh._color);
			break;
			case 'circle':
				currentObject = scene.circle().position(positionVector).rotation(rotationVector).scale(scaleVector);
				currentObject.color(sceneData[i].mesh._color);
			break;
			case 'triangle':
				//need 3 pos vectors
				currentObject = scene.triangle().position(positionVector).rotation(rotationVector).scale(scaleVector);
				currentObject.color(sceneData[i].mesh._color);
			break;
			case 'cube':
				currentObject = scene.cube().position(positionVector).rotation(rotationVector).scale(scaleVector);
				currentObject.color(sceneData[i].mesh._color);
			break;
			case 'cylinder':
				currentObject = scene.cylinder().position(positionVector).rotation(rotationVector).scale(scaleVector);
				currentObject.color(sceneData[i].mesh._color);
			break;
			case 'cone':
				currentObject = scene.cone().position(positionVector).rotation(rotationVector).scale(scaleVector);
				currentObject.color(sceneData[i].mesh._color);
			break;
			case 'light':
				currentObject = scene.light().position(positionVector).rotation(rotationVector).scale(scaleVector);
			break;
			case 'line':
				//need 2 pos vectors
				currentObject = scene.line().position(positionVector).rotation(rotationVector).scale(scaleVector);
				currentObject.color(sceneData[i].mesh._color);
			break;
			case 'plane':
				currentObject = scene.plane().position(positionVector).rotation(rotationVector).scale(scaleVector);
				currentObject.color(sceneData[i].mesh._color);
			break;
			case 'ring':
				currentObject = scene.ring().position(positionVector).rotation(rotationVector).scale(scaleVector);
				currentObject.color(sceneData[i].mesh._color);
			break;
			case 'sphere':
				currentObject = scene.sphere().position(positionVector).rotation(rotationVector).scale(scaleVector);
				currentObject.color(sceneData[i].mesh._color);
			break;
		}
		sceneEditor.addAndSelect(currentObject._name);
	}
}

/**

**/
function expActions(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents().attr('attr-action') : action);

	//
	switch (action)
	{
		case 'scene':
			var object = scene.get(BRANCH.OBJECTS);
			var meshs = object.get(BRANCH.OBJECTS);
			var id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
			saveTextAs(JSON.stringify(meshs), "scene_Save_" + id + ".js");
		break;
		case 'rendu':
			scene.get(BRANCH.LANDMARK).disable();
			setTimeout(function() {
				var link = document.createElement("a");
				link.href = $('#canvas').children()[0].toDataURL();
				link.download = 'Rendu graphique.png';
				link.target = 'blank';

				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				scene.get(BRANCH.LANDMARK).enable();
			}, 150);
		break;
		default:
			return ;
	}
}

/**
 Create an object
**/
function meshActions(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);

	// ** Params : Action, SceneToSerialize **
	sceneEditor.storeToHistory("Ajout -> " + action, scene);

	switch (action)
	{
		case 'merge':
			currentObject = scene.merge();
		break;
		case 'plane':
			currentObject = scene.plane().color(0x87cd70);
		break;
		case 'cube':
			currentObject = scene.cube().color(0x87cd70);
		break;
		case 'sphere':
			currentObject = scene.sphere().color(0x87cd70);
		break;
		case 'cylindre':
			currentObject = scene.cylinder().color(0x87cd70);
		break;
		case 'cone':
			currentObject = scene.cone().color(0x87cd70);
		break;
		case 'r2d2':
			currentObject = scene.obj("objs/R2D2/r2-d2.obj", "objs/R2D2/r2-d2.mtl");
		break;
		case 'light':
			currentObject = scene.light().position(BRANCH.vector(0, 400, 1500));
		break;
		case 'camera':
			currentObject = scene.camera();
		break;
		default:
			console.log('Action inconnu : ' + action);
			return ;
	}

	// Ajout à la hierarchie.
	sceneEditor.addAndSelect(currentObject._name);
}

/**

**/
function editionActions(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);
	switch (action) {
		case 'undo': {
			sceneEditor.undo();
			break;
		}

		case 'redo': {
			sceneEditor.redo();
			break;
		}
	}
}

/**

**/
function modalObjAction(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('a').attr('attr-action') : action);

	// ** Params : Action, SceneToSerialize **
	sceneEditor.storeToHistory(action, scene);

	//
	url_obj = $("#url_obj").val();

	switch (action)
	{
		case 'solid':
			url_mtl = $("#url_mtl").val();
			currentObject = scene.obj(url_obj, url_mtl);
		break;
		case 'cloud':
			currentObject = scene.point(BRANCH.math.pointCloudObj(url_obj, 0.01, BRANCH.vector(0, 0, 0)));
		break;
		default:
			console.log('Cancel');
			return ;
	}

	sceneEditor.addAndSelect(currentObject._name);
}

/**

**/
function getFilePath(id_input, id_field)
{
	$('#' + id_input).fileupload({
		dataType: 'json',
		done: function (e, data) {
			$.each(data.result.files, function (index, file) {
				$('#' + id_field).val(file.url);
			});
		}
	});
}

/**

**/
function objActions(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parent().attr('attr-action') : action);

	// ** Params : Action, SceneToSerialize **
	sceneEditor.storeToHistory("Ajout -> " + action, scene);

	//
	modal.open('./templates/test_modal.html', function ()
	{
		$('#modal_btn_obj>a').click(modalObjAction);
		getFilePath('obj_file_upload', 'url_obj');
		switch (action)
		{
			case 'solid':
				$("#div_mtl").css('visibility', 'visible');
				getFilePath('mtl_file_upload', 'url_mtl');
				$("#modal_agree_btn").attr('attr-action', 'solid');
			break;
			case 'cloud':
				$("#div_mtl").css('visibility', 'hidden');
				$("#modal_agree_btn").attr('attr-action', 'cloud');
			break;
			default:
				console.log('Action inconnu : ' + action);
				return;
		}
	});
}


/**

**/
function priActions(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);

	switch (action)
	{
		case 'point':
			modal.open('./templates/primitives/modal_point.html', function () {
				$('#modal_btn_point>a').click(modalPointAction);
			});
		break;
		case 'line':
			modal.open('./templates/primitives/modal_line.html', function () {
				$('#modal_btn_line>a').click(modalLineAction);
			});
		break;
		case 'triangle':
			modal.open('./templates/primitives/modal_triangle.html', function () {
				$('#modal_btn_triangle>a').click(modalTriangleAction);
			});
		break;
		case 'polygon':
			modal.open('./templates/primitives/modal_polygon.html', function () {
				$('#modal_btn_polygon>a').click(modalPolygonAction);
			});
		break;
		default:
			return ;
	}
}

/**

**/
function modalPointAction(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);

	if (action != 'agree') {
		return ;
	}

	//
	let size = parseInt($("#size").val());
	currentObject = scene.circle(BRANCH.vector(size, size, size));

	// ** Params : Action, SceneToSerialize **
	sceneEditor.storeToHistory("Ajout -> " + currentObject._name, scene);
	sceneEditor.addAndSelect(currentObject._name);
}

/**

**/
function modalLineAction(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);

	if (action != 'agree') {
		return ;
	}

	let pos = BRANCH.vector(parseInt($("#pos_x_1").val()), parseInt($("#pos_y_1").val()), parseInt($("#pos_z_1").val()));
	pos = pos.vector(parseInt($("#pos_x_2").val()), parseInt($("#pos_y_2").val()), parseInt($("#pos_z_2").val()));

	currentObject = scene.line(pos);

	// ** Params : Action, SceneToSerialize **
	sceneEditor.storeToHistory("Ajout -> " + currentObject._name, scene);
	sceneEditor.addAndSelect(currentObject._name);
}

/**

**/
function modalTriangleAction(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);

	if (action != 'agree') {
		return ;
	}

	let pos = BRANCH.vector(parseInt($("#pos_x_1").val()), parseInt($("#pos_y_1").val()), parseInt($("#pos_z_1").val()));
	pos = pos.vector(parseInt($("#pos_x_2").val()), parseInt($("#pos_y_2").val()), parseInt($("#pos_z_2").val()));
	pos = pos.vector(parseInt($("#pos_x_3").val()), parseInt($("#pos_y_3").val()), parseInt($("#pos_z_3").val()));

	currentObject = scene.triangle(pos);

	// ** Params : Action, SceneToSerialize **
	sceneEditor.storeToHistory("Ajout -> " + currentObject._name, scene);
	sceneEditor.addAndSelect(currentObject._name);
}

/**

**/
function modalPolygonAction(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);

	if (action != 'agree') {
		return ;
	}

	let diameter = BRANCH.vector(parseInt($("#diameter").val()), parseInt($("#diameter").val()), parseInt($("#diameter").val()));
	let nb_vetices = parseInt($("#nb_vetices").val());

	currentObject = scene.polygon(diameter, nb_vetices);

	// ** Params : Action, SceneToSerialize **
	sceneEditor.storeToHistory("Ajout -> " + currentObject._name, scene);
	sceneEditor.addAndSelect(currentObject._name);
}

/**

**/
function modalStarAction(e) {
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);

	if (action != 'agree') {
		return ;
	}

	let size = parseInt($("#size").val());
	let branch = parseInt($("#nb_branch").val());
	let branch_rot = parseInt($("#nb_branch_rot").val());
	currentObject = scene.line(BRANCH.math.star(size, branch, branch_rot));

	// ** Params : Action, SceneToSerialize **
	sceneEditor.storeToHistory(currentObject._name, scene);
	sceneEditor.addAndSelect(currentObject._name);
}

/**

**/
function formActions(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);

	switch (action) {
		case 'star':
			modal.open('./templates/primitives/modal_star.html', function () {
				$('#modal_btn_star>a').click(modalStarAction);
			});
		break;
		case 'infinity':
			currentObject = scene.point(BRANCH.math.lemniscate(BRANCH.vector(0, 0, 0), 0.01, 7));
			currentObject.scale(BRANCH.vector(50, 50, 50));
		break;
		default:
			return ;
	}

	sceneEditor.addAndSelect(currentObject._name);
}

/**
 Do an action in scene type of media
**/
function mediaPlayer(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);

	switch (action)
	{
		case 'play':
			scene.get(BRANCH.LANDMARK).disable();
		break;
		case 'pause':
			scene.get(BRANCH.LANDMARK).enable();
		break;
		case 'stop':
			scene.get(BRANCH.LANDMARK).enable();
		break;
		default:
			console.log('Action inconnu : ' + action);
			return ;
	}
}

/**
 Do an action on the object landmark
**/
function landmarkObjectAction(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);

	switch (action)
	{
		case 'rotation':
			scene.get(BRANCH.LANDMARK).setMode(BRANCH.ROTATE);
		break;
		case 'translation':
			scene.get(BRANCH.LANDMARK).setMode(BRANCH.TRANSLATE);
		break;
		case 'dimension':
			scene.get(BRANCH.LANDMARK).setMode(BRANCH.SCALE);
		break;
		default:
			console.log('Action inconnu : ' + action);
			return ;
	}
}

/**

**/
function cameraTypeAction(e)
{
	let action = $(e.target).attr('attr-action');
	action = (typeof(action) == 'undefined' ? $(e.target).parents('li').attr('attr-action') : action);
	let camera = scene.get(BRANCH.OBJECTS).get(BRANCH.CAMERA);

	switch (action)
	{
		case 'perspective':
			for (let index in camera) {
				camera[index].mesh.switch(BRANCH.PERSPECTIVE);
			}
		break;
		case 'orthographic':
			for (let index in camera) {
				camera[index].mesh.switch(BRANCH.ORTHOGRAPHIC);
			}
		break;
		default:
			return ;
	}
}

/**

**/
function changeObjectAttribue(e)
{
	let target = (typeof($(e.target).attr('attr-attribue')) == 'undefined' ? $(e.target).parents('li') : $(e.target));
	let attibue = target.attr('attr-attribue');
	let value = target.val();

	//
	sceneEditor.storeToHistory(currentObject._name + " -> " + attibue.substring(1, attibue.length) + " " + [target.attr('attr-type')] + " : " + value, scene);

	switch (attibue)
	{
		case '_name':
			//
		break;
		case '_visible':
			currentObject._visible = (currentObject._visible == true ? false : true);
		break;
		case '_color':
			currentObject._color = parseInt('0x'+value.substring(1));
		break;
		case '_fov':
			currentObject._fov = parseInt(value);
		break;
		case '_far':
			currentObject._far = parseInt(value);
		break;
		case '_near':
			currentObject._near = parseInt(value);
		break;
		case '_aspect':
			currentObject._aspect = parseInt(value);
		break;
		case '_position':
			currentObject.position[target.attr('attr-type')] = parseInt(value);
		break;
		case '_rotation':
			currentObject.rotation[target.attr('attr-type')] = parseInt(value);
		break;
		case '_scale':
			currentObject.scale[target.attr('attr-type')] = parseInt(value);
		break;
		default:
			console.log('Action inconnu : ' + attibue);
			return;
	}
}

/**

**/
function removeObject(e)
{
	let target = $(e.target);
	let name = target.attr('attr-name');

	sceneEditor.storeToHistory("Supression -> " + name, scene);
	scene.get(BRANCH.OBJECTS).get(BRANCH.OBJECTS, name).remove();
	target.parent().remove();
}

/**
 * Changes the editor background color
 * @param color : Color to set
 */
 function changeBackgroundColor(color) {
	$("#backgroundColorPicker").prop('value', "#" + color);
	color = "#" + color;
	scene.background(color);
}
