/// <reference types="jquery" />
/// <reference types="jstree" />
import Options from './Options';
import JstreeDataNode from "@/JstreeDataNode";
export default class MrTreeWidget {
    protected options: Options;
    protected $el: JQuery;
    protected static instances: Array<MrTreeWidget>;
    protected jstree: JSTree;
    protected $input: JQuery<HTMLElement>;
    protected $tree: JQuery<HTMLElement>;
    protected static getDefaults(): {
        name: string;
        data: {};
    };
    static init(options: Options): MrTreeWidget;
    getOptions(): Options;
    init(options: Options): void;
    protected initJstree(): void;
    protected runUpCascade(node: any): void;
    protected selectFromFieldValue(): void;
    protected getInitialFieldValue(): Array<string>;
    protected getTrimmedId(item: JstreeDataNode): string;
    protected getSeparatedId(id: string): string;
    protected onChanged(data: any): void;
    protected setSelectedToInput(): void;
    getJstree(): JSTree;
    getJstreeEl(): JQuery<HTMLElement>;
    protected getGlobalOptions(options: Options): any;
    protected getJsTreeOptions(): {
        core: {
            data: JstreeDataNode[];
            multiple: boolean;
        };
        sort: (a: string, b: string) => 1 | 0 | -1;
        plugins: string[];
        checkbox: {
            three_state: boolean;
        };
        conditional_select: (node: any) => boolean;
    };
    showByParent(parent: string): void;
    protected getDataForParent(parent: string): JstreeDataNode[];
    protected sort(a: any, b: any): 1 | 0 | -1;
    protected compareByWeight(a: any, b: any): 1 | 0 | -1;
    protected compareAlphabetically(a: any, b: any): 1 | -1;
    static initByEl(el: HTMLElement | JQuery): MrTreeWidget;
    static boot(): void;
    static register(): void;
    protected static addConditionalSelectPlugin(): void;
    static getInstances(): MrTreeWidget[];
}
