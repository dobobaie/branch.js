/**
 * Class SceneHistory. Contains a 'undo' actions list,
 * a 'redo' actions list and use them as stacks.
 * --Used by the SceneEditor class
 *
 *
 * Created by Charles on 05/03/2017.
 */
function SceneHistory() {

    let _el; // DOM element
    let _previous = []; // 'Undo' list
    let _next = []; // 'Redo' list

    //

    /**
     * Initialisation
     *
     * @return SceneHistory : this
     * @public
     */
    this.$init = function () {
        _initView();
        return this;
    };

    /**
     * Initialise the view.
     *
     * @private
     */
    const _initView = function () {
        _el = $("#SceneHistory ul")[0];
    };

    /**
     * Store the action to the history and
     * adds it to the view.
     * @param action : ID (name) of the action to store.
     * @param object : Object to store
     */
    this.storeAction = function (action, object) {
        _previous.push(new Action(action, _objectstoJSON(object)));
        _addItemToView(action);
    };

    /**
     * Add the visual representation to the
     * scene history (view).
     * @param action : Object to add in list.
     * @private
     */
    const _addItemToView = function (action) {
        _el.innerHTML += "<li class='collection-item'>" + action + "</li>";
    };

    /**
     * Returns the last action done by the user
     * and removes it from the view.
     * @returns Last action done by user.
     */
    this.undoAction = function () {
        let undoAction = _previous.pop();
        if (undoAction == null) return; // Return if no action availaible.
        _next.push(undoAction);
        _removeLastItemFromView(undoAction);
        return undoAction;
    };

    /**
     * Returns the next action done by the user
     * (if possible) and removes it from the view.
     * @returns Last action returned by UNDO.
     */
    this.redoAction = function () {
        let redoAction = _next.pop();
        if (redoAction == null) return; // Return if no action availaible.
        _previous.push(redoAction);
        _addItemToView(redoAction.action);
        return redoAction;
    };

    /**
     * Remove the last item from
     * the scene history (view).
     * @private
     */
    const _removeLastItemFromView = function () {
        $("#SceneHistory ul li:last").remove();
    };

    const _objectstoJSON = function (sceneObjects) {
        //return JSON.stringify(sceneObjects, null, 2);
        return sceneObjects;

    };

}

// Struct to store actions informations.
function Action(action, object) {

    this.action = action;
    this.object = object;

}