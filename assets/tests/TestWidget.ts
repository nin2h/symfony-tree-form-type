import MrTreeWidget from "@/MrTreeWidget";
import Options from "@/Options";

export default class TestWidget {
    public $el: JQuery;

    public instance: MrTreeWidget;

    public static init(options: any): TestWidget {
        return (new TestWidget()).init(options);
    }

    public init(options: any): TestWidget {
        const id = options.id || 'tree1';
        const dataProps = JSON.stringify({
            id: id
        });

        this.$el = $(`<div class="mrTreeWidget" data-mr-tree-widget='${dataProps}'><div class="mrTreeWidget__tree"></div></div>`)
            .appendTo($('body'));

        (window as any)[id] = options.globalOptions;

        this.instance = MrTreeWidget.initByEl(this.$el);
        return this;
    }

    public getNodes(): JQuery {
        return this.$el.find('.jstree-node');
    }

    public getNodesText(): Array<string> {
        return this.getNodes().map((index, el) => {
            return el.textContent;
        }).get();
    }

    public getOptions(): Options {
        return this.instance.getOptions();
    }
}