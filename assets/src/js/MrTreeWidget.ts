import Options from './Options';
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
            data: {}
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
        });

        this.$tree.on('ready.jstree', (e, data) => {
            this.jstree = data.instance;
            this.selectFromFieldValue();
            this.options.callback(this);
        });
        this.$tree.jstree(this.getJsTreeOptions());
    }

    protected selectFromFieldValue() {
        const fieldValue = this.$input.val();
        this.jstree.select_node(fieldValue)
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
            plugins: ['sort', 'checkbox'],
            checkbox: {
                three_state: false
            }
        }
    }

    protected sort(a: any, b: any) {
        if (a.original.weight !== undefined && b.original.weight !== undefined) {
            return this.compareByWeight(a, b);
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

    public static getInstances() {
        return this.instances;
    }
}