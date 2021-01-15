export default interface JstreeDataNode {
    readonly id: string;
    parent: string;
    associations?: Array<string>;
    original?: JstreeDataNode;
    children?: Array<string>;
}
