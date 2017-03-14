/**
 * Class offering a public interface for the editing panel
 *
 * -- Exemple usage : ------------------------------------
 *
 *      let SceneEditor = new SceneEditor(scene).$init();
 *
 * -- public methods : -----------------------------------
 *
 *
 * - select : Sets the object to be showned by inspector
 *      sceneEditor.select(objectID);
 *
 * - addAndSelect : Add an object and sets it to be showned by inspector
 *      sceneEditor.addAndSelect(objectID);
 *
 * - add : Add an object to the hierarchy
 *      sceneEditor.add(objectID);
 *
 * - refresh : Forces a refresh on the hierarchy
 *      * Only use this when you have no other option *
 *      sceneEditor.refresh();
 *
 * - storeToHistory : Store an action to the history
 *      sceneEditor.storeToHistory(actionName, sceneObject);
 *
 * - undo : Set the scene how it was before the last modification.
 *      sceneEditor.undo();
 *
 * - redo : Set the scene how it was before the last 'undo' command.
 *      sceneEditor.redo();
 *
 *
 * Created by Charles on 22/02/2017.
 */
function SceneEditor(scene) {
    let _inspector; // Scene inspector
    let _hierarchy; // Scene hierarchy
    let _history; // Scene history
    let _this = this;

    //

    /**
     * Initialisation
     *
     * @return SceneEditor : this
     * @public
     */
    this.$init = function () {
        _inspector = new SceneInspector(scene).$init();
        _hierarchy = new SceneHierarchy(scene, _inspector).$init();
        _history = new SceneHistory().$init();
        return _this;
    };

    /**
     * Add an object to the hierarchy and
     * sets it to be showned by the inspector
     * @param object : Object to add and show
     */
    this.addAndSelect = function (object) {
        _this.add(object);
        _inspector.select(object);
        return _this;
    };

    /**
     * Sets the object to be showned by the inspector
     * @param object : Object to show
     */
    this.select = function (object) {
        _inspector.select(object);
        return _this;
    };

    /**

     **/
    this.update = function (object, type) {
        _inspector.update(object, type);
        return _this;
    }


    /**
     * Add an object to the hierarchy
     * @param object : Object to add
     * @returns {SceneEditor} : this
     */
    this.add = function (object) {
        _hierarchy.add(object);
        return _this;
    };

    /**
     * Store an action to the scene
     * history.
     * @param action : ID (name) of the action (Used for ID at the moment)
     * @param object : Object to serialize.
     * @returns {SceneEditor}
     */
    this.storeToHistory = function (action, object) {
        _history.storeAction(action, object.get(BRANCH.OBJECTS).get(BRANCH.OBJECTS));
        return _this;
    };

    /**
     * Get the next 'undo action' from the scene
     * history and replace the current scene with
     * the result.
     */
    this.undo = function () {
        let action = _history.undoAction();
        if (action == null) return;
        console.log(action.object); // .object est l'ancienne scène.
        //importScene(action.object); // TODO : Ne fonctionne pas
        return _this;
    };

    /**
     * Get the next 'redo action' from the scene
     * history and replace the current scene with
     * the result.
     */
    this.redo = function () {
        let action = _history.redoAction();
        if (action == null) return;
        console.log(action.object); // .object est l'ancienne scène.
        //importScene(action.object); // TODO : Ne fonctionne pas
        return _this;
    }
}