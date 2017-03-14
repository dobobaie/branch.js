/**
 * Class that handle scene hierarchy structure and view.
 * --Used by the SceneEditor class
 *
 * @param scene : Scene to attach the SceneHierarchy to
 * @param inspector : SceneInspector that listens to the hierarchy
 * Created by Charles on 20/02/2017.
 */
function SceneHierarchy(scene, inspector) {

    let _el; // DOM element of the list

    //

    /**
     * Initialisation
     *
     * @return SceneHieararchy : this
     * @public
     */
    this.$init = function () {
        _initView();
        return this;
    };

    /**
     * Initialise the view and the events handlers
     * attached to it.
     *
     * @private
     */
    const _initView = function () {
        _el = $("#SceneHierarchy ul")[0];

        // Returns a list of id from the list item HTML.
        const __getObjectsFromHTML = function (htmlItem) {
            let r = htmlItem.replace(/<(?:.|\n)*?>/gm, ' ').split(' ').filter(function (n) {
                return n != '';
            });
            return r;
        };

        // Events handlers
        $('#SceneHierarchy').find('ul').on('click', 'li', function (e) {
            _deselectedViewItems();
            e.target.classList.add("active");
            const object = __getObjectsFromHTML(e.target.innerHTML);
            _selectObjectFromView(object);
        });

        //
        let _oldContainer;
        let fromDrag = null;

        $("#SceneHierarchy>ul").sortable({
            delay: 100,
            group: 'nested',
            isValidTarget: function ($item, container) {
                if ($item.is(".mesh") && container.el.context.parentElement.className != "mesh")
                    return true;
                else
                    return $item.parent("ul")[0] == container.el[0];
            },
            afterMove: function (placeholder, container) {
                if (_oldContainer != container) {
                    if (_oldContainer) {
                        _oldContainer.el.removeClass("active");
                    }
                    container.el.addClass("active");
                    oldContainer = container;
                }
            },
            onDragStart: function ($item, container, _super) {
                fromDrag = __getObjectsFromHTML(container.el.parent().html());
                _super($item, container);
            },
            onDrop: function ($item, container, _super) {
                let parent = __getObjectsFromHTML(container.el.parent().html());
                let childs = __getObjectsFromHTML($item.html());

                _super($item, container);

                //
                if (fromDrag[0] == parent[0]) {
                    return;
                }

                //
                let getOldMerge = scene.get(BRANCH.OBJECTS).get(BRANCH.MERGE, fromDrag[0]);
                if (getOldMerge != null) {
                    getOldMerge.unmerge(childs[0]);
                }

                //
                sceneEditor.storeToHistory("Groupement -> " + $item[0].innerText + " dans " + parent + " avant " + (getOldMerge == null ? 'à la racine' : getOldMerge._name));

                //
                let getMerge = scene.get(BRANCH.OBJECTS).get(BRANCH.MERGE, parent[0]);
                if (getMerge != null) {
                    getMerge.push(childs[0]);
                }

                //
                container.el.removeClass("active");
            },
        });

    };

    /**
     * Force a refresh on the view. Clears the
     * view and then replenish it from the scene informations
     *
     * @public
     */
    const _setViews = function (objects, allowMerge) {
        for (let index in objects) {
            if (objects[index].merged == false || (typeof(allowMerge) == 'boolean' && allowMerge == true)) {
                if (objects[index].mesh.get(BRANCH.TYPE) == BRANCH.MERGE) {
                    addObject(objects[index].mesh);
                    console.log(objects[index].mesh);
                    // Ajouter la liste des objets dans le merge ici en récursion
                    return;
                }
                addObject(objects[index].mesh);
            }
        }
    };

    /**
     * Add an object to the hierarchy
     *
     * @param object : Object to add
     * @returns SceneHierarchy
     * @private
     */
    this.add = function (object) {
        addObject(object);
        return this;
    };

    /**
     * Add an object to the hierarchy
     *
     * @param object : Object to add
     * @returns SceneHierarchy
     * @private
     */
    let addObject = function (object) {
        _deselectedViewItems();
        _el.innerHTML += _createLIFromObject(object);
        $(_el).find('.removeObject').click(removeObject);
        return this;
    };

    /**
     * Helper method to create a list item element then return it
     *
     * @param object : Object to create the element with
     * @private
     */
    const _createLIFromObject = function (object) {
        let type = "mesh";
        if (object.startsWith("merge")) {
            type = "merge";
        }
        return '<li class="' + type + ' active">' + object + '<i class="pull-right material-icons dp48 removeObject" attr-name="'+object+'">delete</i>' + (type == 'merge' ? '<ul></ul>' : '') + '</li>';
    };

    /**
     * Clear the view. Removes all of the list
     *
     * item from the DOM element.
     * @private
     */
    const _clearView = function () {
        _el.innerHTML = "";
    };

    /**
     * Deselected all of the items in the list.
     *
     * @private
     */
    const _deselectedViewItems = function () {
        let items = $("#SceneHierarchy ul li");
        items.each(function () {
            $(this)[0].classList.remove("active");
        });
    };

    /**
     * Select an object from the list and store the
     * content into _selection
     *
     * @param object : object selected
     * @private
     */
    const _selectObjectFromView = function (object) {
        inspector.select(object[0]);
    };
}
