var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
require('jstree');
var MrTreeWidget = /** @class */ (function () {
    function MrTreeWidget() {
    }
    MrTreeWidget.getDefaults = function () {
        return {
            name: 'mrTreeWidget',
            data: {},
            associations: {},
            nodeAssociationTriggerHtml: '<span data-association-trigger>Select associations</span>'
        };
    };
    MrTreeWidget.init = function (options) {
        var instance = new MrTreeWidget();
        instance.init(options);
        return instance;
    };
    MrTreeWidget.prototype.getOptions = function () {
        return this.options;
    };
    MrTreeWidget.prototype.init = function (options) {
        this.$el = options.$el;
        var defaults = MrTreeWidget.getDefaults();
        var elementOptions = this.$el.data('mrTreeWidget');
        var globalOptions = this.getGlobalOptions(__assign(__assign({}, elementOptions), options));
        this.options = __assign(__assign(__assign(__assign({}, defaults), options), globalOptions), elementOptions);
        this.$input = this.$el.find("." + this.options.name + "__input");
        this.$tree = this.$el.find("." + this.options.name + "__tree");
        this.initJstree();
    };
    MrTreeWidget.prototype.initJstree = function () {
        var _this = this;
        this.$tree.on('changed.jstree', function (e, data) {
            _this.onChanged(data);
            if (data.node) {
                _this.runUpCascade(data.node);
                _this.syncDuplicates(data.node);
            }
        });
        this.$tree.on('open_node.jstree', function (e, data) {
            _this.initNodeAssociation(data.node);
        });
        this.$tree.on('ready.jstree', function (e, data) {
            _this.jstree = data.instance;
            _this.selectFromFieldValue();
            _this.initRootNodesAssociation();
            _this.options.callback && _this.options.callback(_this);
        });
        this.$tree.on('refresh.jstree', function (e, data) {
            _this.jstree = data.instance;
        });
        this.$tree.jstree(this.getJsTreeOptions());
    };
    /**
     * Select/unselect the nodes with the same ids but which are in different folders
     * @param {JstreeDataNode} node
     * @protected
     */
    MrTreeWidget.prototype.syncDuplicates = function (node) {
        var _this = this;
        var realId = this.extractRealIdFromNode(node);
        if (!realId) {
            return;
        }
        var nodes = this.jstree.get_json('#', { flat: true });
        nodes.forEach(function (listNode) {
            if (_this.extractRealIdFromNode(listNode) === realId) {
                _this.toggleNode(listNode, node.state.selected);
            }
        });
    };
    MrTreeWidget.prototype.toggleNode = function (node, state) {
        if (state) {
            this.jstree.select_node(node, false);
        }
        else {
            this.jstree.deselect_node(node, false);
        }
    };
    MrTreeWidget.prototype.extractRealIdFromNode = function (node) {
        var parts = node.id.split('_');
        if (parts.length !== 2) {
            return null;
        }
        return parts[0];
    };
    MrTreeWidget.prototype.initRootNodesAssociation = function () {
        this.initNodeAssociation(this.jstree.get_node('#'));
    };
    MrTreeWidget.prototype.initNodeAssociation = function (item) {
        var _this = this;
        item.children.forEach(function (child) {
            var associations = _this.getNodeAssociations(child);
            if (!associations.length) {
                return;
            }
            _this.insertTriggerHtml(child, associations);
        });
    };
    MrTreeWidget.prototype.insertTriggerHtml = function (nodeId, associations) {
        var _this = this;
        var $nodeLink = this.jstree.get_node(nodeId, true).find('> .jstree-anchor');
        $(this.options.nodeAssociationTriggerHtml)
            .insertAfter($nodeLink)
            .on('click', function (e, event) {
            e.preventDefault();
            _this.jstree.select_node(associations);
        });
    };
    MrTreeWidget.prototype.getNodeAssociations = function (nodeId) {
        var item = this.jstree.get_node(nodeId);
        if (item.original.associations) {
            return item.original.associations;
        }
        return this.options.associations[item.id] || [];
    };
    MrTreeWidget.prototype.runUpCascade = function (node) {
        var _this = this;
        if (!node.state.selected || !this.options.upCascadeSelect) {
            return;
        }
        node.parents.forEach(function (parent) {
            var parentNode = _this.jstree.get_node(parent);
            if (parentNode.original) {
                if (parentNode.original.canBeSelected === false) {
                    return;
                }
            }
            _this.jstree.select_node(parent);
        });
    };
    MrTreeWidget.prototype.selectFromFieldValue = function () {
        var formattedValue = this.getInitialFieldValue();
        this.jstree.select_node(formattedValue);
    };
    MrTreeWidget.prototype.getInitialFieldValue = function () {
        var _this = this;
        var fieldValue = this.$input.val();
        var arrayValue = fieldValue.split(',');
        return this.options.data.filter(function (item) {
            return arrayValue.indexOf(_this.getSeparatedId(item.id)) !== -1;
        })
            .map(function (item) { return item.id; });
    };
    /**
     * Is not used for now
     * @deprecated
     * @param item
     * @protected
     */
    MrTreeWidget.prototype.getTrimmedId = function (item) {
        var withoutPrefix = ('' + item.id).replace(this.options.idPrefix, '');
        return this.getSeparatedId(withoutPrefix);
    };
    MrTreeWidget.prototype.getSeparatedId = function (id) {
        if (this.options.idSeparator !== '') {
            return ('' + id).split(this.options.idSeparator)[0];
        }
        return id;
    };
    MrTreeWidget.prototype.onChanged = function (data) {
        if (this.jstree) {
            this.setSelectedToInput();
        }
    };
    MrTreeWidget.prototype.setSelectedToInput = function () {
        var selected = this.jstree.get_selected();
        this.$input.val(selected);
    };
    MrTreeWidget.prototype.getJstree = function () {
        return this.jstree;
    };
    MrTreeWidget.prototype.getJstreeEl = function () {
        return this.$tree;
    };
    MrTreeWidget.prototype.getGlobalOptions = function (options) {
        var id = options.id;
        if (id) {
            return window[id];
        }
        return {};
    };
    MrTreeWidget.prototype.getJsTreeOptions = function () {
        var self = this;
        return {
            core: {
                data: this.options.data,
                multiple: this.options.multiple
            },
            sort: function (a, b) {
                return self.sort(this.get_node(a), this.get_node(b));
            },
            plugins: ['sort', 'checkbox', 'conditional_select'],
            checkbox: {
                three_state: false
            },
            conditional_select: function (node) {
                if (typeof node.original.canBeSelected !== 'undefined') {
                    return node.original.canBeSelected;
                }
                return true;
            }
        };
    };
    MrTreeWidget.prototype.showByParent = function (parent) {
        var newData = this.getDataForParent(parent);
        if (!this.jstree) {
            this.options.data = newData;
        }
        else {
            this.jstree.settings.core.data = newData;
            this.jstree.refresh();
        }
    };
    MrTreeWidget.prototype.getDataForParent = function (parent) {
        var data;
        if (parent) {
            data = [];
            this.options.data.forEach(function (item) {
                if (item.parent === parent) {
                    item.parent = '#';
                    data.push(item);
                }
            });
        }
        else {
            data = this.options.data;
        }
        return data;
    };
    MrTreeWidget.prototype.sort = function (a, b) {
        if (a.original.weight !== undefined && b.original.weight !== undefined) {
            if (a.original.weight !== false && b.original.weight !== false) {
                return this.compareByWeight(a, b);
            }
        }
        return this.compareAlphabetically(a, b);
    };
    MrTreeWidget.prototype.compareByWeight = function (a, b) {
        if (a.original.weight > b.original.weight) {
            return 1;
        }
        else if (a.original.weight < b.original.weight) {
            return -1;
        }
        return 0;
    };
    MrTreeWidget.prototype.compareAlphabetically = function (a, b) {
        var text1 = a.original.text;
        var text2 = b.original.text;
        if (isNaN(+text1) || isNaN(+text2)) {
            return text1 < text2 ? -1 : 1;
        }
        return +text1 < +text2 ? -1 : 1;
    };
    MrTreeWidget.initByEl = function (el) {
        if (el instanceof HTMLElement) {
            el = $(el);
        }
        return this.init({
            $el: el
        });
    };
    MrTreeWidget.boot = function () {
        var _this = this;
        var name = this.getDefaults().name;
        this.instances = $("." + name)
            .map(function (index, el) {
            return _this.initByEl(el);
        })
            .get();
    };
    MrTreeWidget.register = function () {
        this.addConditionalSelectPlugin();
    };
    MrTreeWidget.addConditionalSelectPlugin = function () {
        $.jstree.plugins.conditional_select = function (options, parent) {
            this.activate_node = function (obj, e) {
                var node = this.get_node(obj);
                if (this.settings.conditional_select.call(this, node)) {
                    parent.activate_node.call(this, obj, e);
                }
            };
        };
    };
    MrTreeWidget.getInstances = function () {
        return this.instances;
    };
    return MrTreeWidget;
}());
export default MrTreeWidget;
//# sourceMappingURL=MrTreeWidget.js.map