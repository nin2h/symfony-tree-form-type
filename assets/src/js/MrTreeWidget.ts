import Options from './Options';
import JstreeDataNode from "@/JstreeDataNode";
require('jstree');

export default class MrTreeWidget {
    protected options: Options;

    protected $el: JQuery;

    protected static instances: Array<MrTreeWidget>;

    protected jstree: JSTree;

    protected $input: JQuery<HTMLElement>;

    protected $tree: JQuery<HTMLElement>;

    protected static getDefaults() {
        return {
            name: 'mrTreeWidget',
            data: {},
            associations: {},
            dependencies: {},
            nodeAssociationTriggerHtml: '<span data-association-trigger>Select associations</span>'
        };
    }

    public static init(options: Options) {
        const instance = new MrTreeWidget();
        instance.init(options);
        return instance;
    }

    public getOptions() {
        return this.options;
    }

    public init(options: Options) {
        this.$el = options.$el;

        const defaults = MrTreeWidget.getDefaults();
        const elementOptions = this.$el.data('mrTreeWidget');
        const globalOptions = this.getGlobalOptions({...elementOptions, ...options});
        this.options = {...defaults, ...options, ...globalOptions, ...elementOptions};

        this.$input = this.$el.find(`.${this.options.name}__input`);
        this.$tree = this.$el.find(`.${this.options.name}__tree`);
        this.initJstree();
    }

    protected initJstree() {
        this.$tree.on('changed.jstree', (e, data) => {
            this.onChanged(data);

            if (data.node) {
                this.runUpCascade(data.node);
                this.syncDuplicates(data.node);
                this.selectDependencies(data.node);
            }
        });

        this.$tree.on('open_node.jstree', (e, data) => {
            this.initNodeAssociation(data.node);
        });

        this.$tree.on('ready.jstree', (e, data) => {
            this.jstree = data.instance;
            this.selectFromFieldValue();
            this.initRootNodesAssociation();
            this.options.callback && this.options.callback(this);
        });

        this.$tree.on('refresh.jstree', (e, data) => {
            this.jstree = data.instance;
        });

        this.$tree.jstree(this.getJsTreeOptions());
    }

    selectDependencies(node: JstreeDataNode) {
        if (!node.state.selected) {
            return;
        }

        const dependencies = this.options.dependencies[this.getTrimmedId(node)];
        if (!dependencies) {
            return;
        }

        const nodes = this.jstree.get_json('#', {flat: true});
        nodes.forEach((listNode: JstreeDataNode) => {
            dependencies.forEach((dependencyId: bigint | string) => {
                if (this.getTrimmedIdFromId(dependencyId) === this.getTrimmedId(listNode)) {
                    this.jstree.select_node(listNode.id);
                }
            });
        });
    }

    /**
     * Select/unselect the nodes with the same ids but which are in different folders
     * @param {JstreeDataNode} node
     * @protected
     */
    protected syncDuplicates(node: JstreeDataNode) {
        const realId = this.extractRealIdFromNode(node);
        if (!realId) {
            return;
        }

        const nodes = this.jstree.get_json('#', {flat: true});
        nodes.forEach((listNode: JstreeDataNode) => {
            if (this.extractRealIdFromNode(listNode) === realId) {
                this.toggleNode(listNode, node.state.selected);
            }
        })
    }

    protected toggleNode(node: JstreeDataNode, state: boolean) {
        if (state) {
            this.jstree.select_node(node, false);
        } else {
            this.jstree.deselect_node(node, false);
        }
    }

    protected extractRealIdFromNode(node: JstreeDataNode) {
        const parts = node.id.split(this.options.idSeparator);
        if (parts.length !== 2) {
            return node.id;
        }
        return parts[0];
    }

    protected initRootNodesAssociation() {
        this.initNodeAssociation(this.jstree.get_node('#'));
    }

    protected initNodeAssociation(item: JstreeDataNode) {
        item.children.forEach(child => {
            const associations = this.getNodeAssociations(child);
            if (!associations.length) {
                return;
            }

            this.insertTriggerHtml(child, associations);
        });
    }

    protected insertTriggerHtml(nodeId: string, associations: Array<string>) {
        const $nodeLink = this.jstree.get_node(nodeId, true).find('> .jstree-anchor');
        $(this.options.nodeAssociationTriggerHtml)
            .insertAfter($nodeLink)
            .on('click', (e, event) => {
                e.preventDefault();
                this.jstree.select_node(associations);
            });
    }

    protected getNodeAssociations(nodeId: string): Array<string> {
        const item = this.jstree.get_node(nodeId);
        if (item.original.associations) {
            return item.original.associations;
        }

        return this.options.associations[item.id] || [];
    }

    protected runUpCascade(node: any) {
        if (!node.state.selected || !this.options.upCascadeSelect) {
            return;
        }

        node.parents.forEach((parent: any) => {
            const parentNode = this.jstree.get_node(parent);
            if (parentNode.original) {
                if (parentNode.original.canBeSelected === false) {
                    return;
                }
            }

            this.jstree.select_node(parent);
        });
    }

    protected selectFromFieldValue() {
        const formattedValue = this.getInitialFieldValue();
        this.jstree.select_node(formattedValue)
    }

    protected getInitialFieldValue(): Array<string> {
        const fieldValue = this.$input.val() as string;
        const arrayValue = fieldValue.split(',');
        return this.options.data.filter(item => {
            return arrayValue.indexOf(this.getSeparatedId(item.id)) !== -1;
        })
            .map(item => item.id);
    }

    /**
     * Is not used for now
     * @param item
     * @protected
     */
    protected getTrimmedId(item: JstreeDataNode): string {
        return this.getTrimmedIdFromId(item.id);
    }

    /**
     * Returns a node id without a prefix and right-trimmed by an id separator
     * @param id
     * @protected
     */
    protected getTrimmedIdFromId(id: string | bigint) {
        const withoutPrefix = (''+ id).replace(this.options.idPrefix, '');
        return this.getSeparatedId(withoutPrefix);
    }

    protected getSeparatedId(id: string): string {
        if (this.options.idSeparator !== '') {
            return ('' + id).split(this.options.idSeparator)[0];
        }

        return id;
    }

    protected onChanged(data: any) {
        if (this.jstree) {
            this.setSelectedToInput();
        }
    }

    protected setSelectedToInput() {
        const selected = this.jstree.get_selected();
        this.$input.val(selected);
    }

    public getJstree() {
        return this.jstree;
    }

    public getJstreeEl() {
        return this.$tree;
    }

    protected getGlobalOptions(options: Options) {
        const id: string = options.id;
        if (id) {
            return (window as any)[id];
        }

        return {};
    }

    protected getJsTreeOptions() {
        const self = this;

        return {
            core: {
                data: this.options.data,
                multiple: this.options.multiple
            },
            sort: function (a: string, b: string) {
                return self.sort(this.get_node(a), this.get_node(b));
            },
            plugins: ['sort', 'checkbox', 'conditional_select'],
            checkbox: {
                three_state: false
            },
            conditional_select: (node: any): boolean => {
                if (typeof node.original.canBeSelected !== 'undefined') {
                    return node.original.canBeSelected;
                }

                return true;
            }
        }
    }

    public showByParent(parent: string) {
        const newData = this.getDataForParent(parent);

        if (!this.jstree) {
            this.options.data = newData;
        } else {
            this.jstree.settings.core.data = newData;
            this.jstree.refresh();
        }
    }

    protected getDataForParent(parent: string) {
        let data: Array<JstreeDataNode>;

        if (parent) {
            data = [];
            this.options.data.forEach(item => {
                if (item.parent === parent) {
                    item.parent = '#';
                    data.push(item);
                }
            });
        } else {
            data = this.options.data;
        }
        return data;
    }

    protected sort(a: any, b: any) {
        if (a.original.weight !== undefined && b.original.weight !== undefined) {
            if (a.original.weight !== false && b.original.weight !== false) {
                return this.compareByWeight(a, b);
            }
        }

        return this.compareAlphabetically(a, b);
    }

    protected compareByWeight(a: any, b: any) {
        if (a.original.weight > b.original.weight) {
            return 1;
        } else if (a.original.weight < b.original.weight) {
            return -1;
        }
        return 0;
    }

    protected compareAlphabetically(a: any, b: any) {
        const text1 = a.original.text;
        const text2 = b.original.text;

        if (isNaN(+text1) || isNaN(+text2)) {
            return text1 < text2 ? -1 : 1;
        }

        return +text1 < +text2 ? -1 : 1;
    }

    public static initByEl(el: HTMLElement | JQuery) {
        if (el instanceof HTMLElement) {
            el = $(el);
        }

        return this.init({
            $el: el
        });
    }

    public static boot() {
        const name = this.getDefaults().name;
        this.instances = $(`.${name}`)
            .map((index: number, el: HTMLElement): MrTreeWidget => {
                return this.initByEl(el);
            })
            .get();
    }

    public static register() {
        this.addConditionalSelectPlugin();
    }

    protected static addConditionalSelectPlugin() {
        ($.jstree.plugins as any).conditional_select = function (options: any, parent: any) {
            this.activate_node = function (obj: any, e: any) {
                const node = this.get_node(obj);
                if (this.settings.conditional_select.call(this, node)) {
                    parent.activate_node.call(this, obj, e);
                }
            }
        };
    }

    public static getInstances() {
        return this.instances;
    }
}