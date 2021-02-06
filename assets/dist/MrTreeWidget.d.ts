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
        associations: {};
        dependencies: {};
        nodeAssociationTriggerHtml: string;
    };
    static init(options: Options): MrTreeWidget;
    getOptions(): Options;
    init(options: Options): void;
    protected initJstree(): void;
    selectDependencies(node: JstreeDataNode): void;
    /**
     * Select/unselect the nodes with the same ids but which are in different folders
     * @param {JstreeDataNode} node
     * @protected
     */
    protected syncDuplicates(node: JstreeDataNode): void;
    protected toggleNode(node: JstreeDataNode, state: boolean): void;
    protected extractRealIdFromNode(node: JstreeDataNode): string;
    protected initRootNodesAssociation(): void;
    protected initNodeAssociation(item: JstreeDataNode): void;
    protected insertTriggerHtml(nodeId: string, associations: Array<string>): void;
    protected getNodeAssociations(nodeId: string): Array<string>;
    protected runUpCascade(node: any): void;
    protected selectFromFieldValue(): void;
    protected getInitialFieldValue(): Array<string>;
    /**
     * Is not used for now
     * @param item
     * @protected
     */
    protected getTrimmedId(item: JstreeDataNode): string;
    /**
     * Returns a node id without a prefix and right-trimmed by an id separator
     * @param id
     * @protected
     */
    protected getTrimmedIdFromId(id: string | bigint): string;
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
