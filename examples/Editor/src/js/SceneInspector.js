/**
 * Class Scene inspector to show current selected
 * object informations and allow to modify the object
 * via the inspector interface.
 * --Used by the SceneEditor and
 * --the SceneHierarchy classes.
 *
 * @param scene : Scene to attach the inspector to
 * Created by Charles on 22/02/2017.
 */
function SceneInspector(scene) {
    let _this = this;
    let _configAttribues = {
        _visible: {name: 'Visible', type: 'bool', el: '#objectTab>.content'},
        _name: {name: 'Name', type: 'string', el: '#objectTab>.content'},
        _color: {name: 'Color', type: 'rgb', el: '#materialsTab>.content'},
        _position: {name: 'Position', type: 'vector3D', el: '#objectTab>.content'},
        _rotation: {name: 'Rotation', type: 'vector3D', el: '#objectTab>.content'},
        _scale: {name: 'Scale', type: 'vector3D', el: '#objectTab>.content'},
        _fov: {name: 'Fov', type: 'string', el: '#objectTab>.content'},
        _far: {name: 'Far', type: 'string', el: '#objectTab>.content'},
        _near: {name: 'Near', type: 'string', el: '#objectTab>.content'},
        _aspect: {name: 'Aspect', type: 'string', el: '#objectTab>.content'},
    };

    /**
     * Initialisation
     *
     * @return SceneInspector : this
     * @public
     */
    this.$init = function () {
        return _this;
    };

    /**

     **/
    this.update = function (object, type) {
        //
        $('#objectTab>.content>div').each(function (index, value) {
            if ($(value).attr('attr-attribue') == '_position' || $(value).attr('attr-attribue') == '_rotation' || $(value).attr('attr-attribue') == '_scale') {
                let attribue = $(value).attr('attr-attribue');
                htmlTemplate =
                    '<h6>' + _configAttribues[attribue].name + ':</h6>' +
                    '<div class="input-field col s4"><label>X:</label><input attr-attribue="' + attribue + '" attr-type="x" placeholder="X" class="actionObject center-align ' + _configAttribues[attribue].name + 'X" type="number" value="' + Math.round(parseFloat(object[attribue].x)).toFixed(2) + '"></div>' +
                    '<div class="input-field col s4"><label>Y:</label><input attr-attribue="' + attribue + '" attr-type="y" placeholder="Y" class="actionObject center-align ' + _configAttribues[attribue].name + 'Y" type="number" value="' + Math.round(parseFloat(object[attribue].y)).toFixed(2) + '"></div>' +
                    '<div class="input-field col s4"><label>Z:</label><input attr-attribue="' + attribue + '" attr-type="z" placeholder="Z" class="actionObject center-align ' + _configAttribues[attribue].name + 'Z" type="number" value="' + Math.round(parseFloat(object[attribue].z)).toFixed(2) + '"></div>'
                ;
                $(value).html(htmlTemplate).append(function () {
                    $(value).find('.actionObject').change(changeObjectAttribue);
                });
            }
        });

        return _this;
    }

    /**

     **/
    this.clear = function () {
        $('#objectInspector>.fullObject>#objectTab>.content').html('');
        $('#objectInspector>.fullObject>#geometryTab>.content').html('');
        $('#objectInspector>.fullObject>#materialsTab>.content').html('');
        return _this;
    }

    /**

     **/
    this.loadedClass = function () {
        $('#objectInspector>.loadObject').addClass('hide');
        $('#objectInspector>.emptyObject').addClass('hide');
        $('#objectInspector>.fullObject').removeClass('hide');
        return _this;
    }

    /**

     **/
    this.loadClass = function () {
        $('#objectInspector>.fullObject').addClass('hide');
        $('#objectInspector>.emptyObject').addClass('hide');
        $('#objectInspector>.loadObject').removeClass('hide');
        return _this;
    }

    /**

     **/
    this.selectClass = function () {
        $('#objectInspector>.fullObject').addClass('hide');
        $('#objectInspector>.loadObject').addClass('hide');
        $('#objectInspector>.emptyObject').removeClass('hide');
        return _this;
    }

    /**

     **/
    const _rgbToHex = function (r, g, b) {
        let hexa = (((b * 255) | ((g * 255) << 8) | ((r * 255) << 16)) / 0x1000000).toString(16).substring(2);
        return '#' + (hexa.length != 6 ? hexa + '0' : hexa);
    }

    /**

     **/
    this.add = function (attribue, object) {
        let htmlTemplate = '';
        let callback = function () {
        };

        switch (_configAttribues[attribue].type) {
            case 'bool':
                htmlTemplate =
                    '<div class="col s12" attr-attribue="' + attribue + '">' +
                    '<div class="center-align">' +
                    '<input id="' + attribue + '_checkbox" attr-attribue="' + attribue + '" type="checkbox" class="actionObject filled-in checkbox-blue ' + _configAttribues[attribue].name + '" ' + (object[attribue] == true ? 'checked="checked"' : '') + '/>' +
                    '<label for="' + attribue + '_checkbox">' + _configAttribues[attribue].name + '</label>' +
                    '</div>' +
                    '</div>'
                ;
                break;
            case 'string':
                htmlTemplate =
                    '<div class="col s12" attr-attribue="' + attribue + '">' +
                    '<h6>' + _configAttribues[attribue].name + ':</h6>' +
                    '<div class="input-field"><input attr-attribue="' + attribue + '" class="actionObject center-align ' + _configAttribues[attribue].name + '" placeholder="' + _configAttribues[attribue].name + '" type="text" value="' + object[attribue] + '"></div>' +
                    '</div>'
                ;
                break;
            case 'rgb':
                htmlTemplate =
                    '<div class="col s12" attr-attribue="' + attribue + '">' +
                    '<section>' +
                    '<div class="center">' +
                    '<label for="' + attribue + '_colorpicker">' + _configAttribues[attribue].name + ':</label>' +
                    '<input attr-attribue="' + attribue + '" type="color" id="' + attribue + '_colorpicker" class="actionObject" value="' + _rgbToHex(object[attribue].r, object[attribue].g, object[attribue].b) + '" onclick="return false;">' +
                    '</div>' +
                    '</section>' +
                    '</div>'
                ;
                callback = function () {
                    let first = true;
                    let colorpicker = new CP(document.getElementById(attribue + '_colorpicker'));
                    colorpicker.on('change', function (specular, e) {
                        if (first == false) {
                            $(e.target).val('#' + specular);
                            changeObjectAttribue(e);
                        }
                        first = false;
                    });
                };
                break;
            case 'vector3D':
                htmlTemplate =
                    '<div class="col s12" attr-attribue="' + attribue + '">' +
                    '<h6>' + _configAttribues[attribue].name + ':</h6>' +
                    '<div class="input-field col s4"><label>X:</label><input attr-attribue="' + attribue + '" attr-type="x" placeholder="X" class="actionObject center-align ' + _configAttribues[attribue].name + 'X" type="number" value="' + Math.round(parseFloat(object[attribue].x)).toFixed(2) + '"></div>' +
                    '<div class="input-field col s4"><label>Y:</label><input attr-attribue="' + attribue + '" attr-type="y" placeholder="Y" class="actionObject center-align ' + _configAttribues[attribue].name + 'Y" type="number" value="' + Math.round(parseFloat(object[attribue].y)).toFixed(2) + '"></div>' +
                    '<div class="input-field col s4"><label>Z:</label><input attr-attribue="' + attribue + '" attr-type="z" placeholder="Z" class="actionObject center-align ' + _configAttribues[attribue].name + 'Z" type="number" value="' + Math.round(parseFloat(object[attribue].z)).toFixed(2) + '"></div>' +
                    '</div>'
                ;
                break;
            default:
                console.log('Attribue unknow: ' + attribue);
                return _this;
        }
        $('#objectInspector>.fullObject>' + _configAttribues[attribue].el)
            .append(htmlTemplate)
            .append(callback)
        ;
        return _this;
    }

    /**
     * Set the object to show
     * @param objectID : ID of the object to be showned
     **/
    this.select = function (objectID) {
        //
        _this.clear();
        _this.loadClass();

        //
        _selectedObject = scene.get(BRANCH.OBJECTS).get(BRANCH.OBJECTS, objectID);
        if (_selectedObject == null) {
            _this.selectClass();
            return _this;
        }

        //
        for (var index in _configAttribues) {
            if (typeof(_selectedObject[index]) != 'undefined') {
                _this.add(index, _selectedObject);
            }
        }

        //
        scene.select(objectID);
        currentObject = _selectedObject;

        //
        $('.actionObject').change(changeObjectAttribue);

        //
        _this.loadedClass();

        return _this;
    };


}