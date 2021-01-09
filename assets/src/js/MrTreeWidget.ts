import Options from './Options';
require('jstree');

export default class MrTreeWidget {
    protected options: Options;

    protected $el: JQuery;

    protected static instances: Array<MrTreeWidget>;

    protected jstree: JSTree;

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
        this.initJstree();
    }

    protected initJstree() {
        const $tree = this.$el.find(`.${this.options.name}__tree`);

        $tree.on('ready.jstree', (e, data) => {
            this.jstree = data.instance;
            this.options.callback(this);
        });
        $tree.jstree(this.getJsTreeOptions());
    }

    public getJstree() {
        return this.jstree;
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
            plugins: ['sort']
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