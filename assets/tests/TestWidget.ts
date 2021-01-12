import MrTreeWidget from "@/MrTreeWidget";
import Options from "@/Options";

export default class TestWidget {
    public $el: JQuery;

    public instance: MrTreeWidget;

    public $input: JQuery<HTMLElement>;

    public $tree: JQuery<HTMLElement>;

    public static init(options: any): TestWidget {
        return (new TestWidget()).init(options);
    }

    public init(options: any): TestWidget {
        const id = options.id || 'tree1';
        const dataProps = JSON.stringify({
            id: id
        });

        const value = options.value || '';

        this.$el = $(`<div class="mrTreeWidget" data-mr-tree-widget='${dataProps}'>
                <div class="mrTreeWidget__tree"></div>
                <input class="mrTreeWidget__input" type="hidden" name="tree_field" value="${value}">
            </div>`)
            .appendTo($('body'));
        this.$input = this.$el.find('.mrTreeWidget__input');
        this.$tree = this.$el.find('.mrTreeWidget__tree');

        (window as any)[id] = options.globalOptions;

        let finalOptions = {
            $el: this.$el,
            ...options.jstreeOptions
        };
        if (options.callback) {
            finalOptions.callback = options.callback;
        }
        this.instance = MrTreeWidget.init(finalOptions);
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