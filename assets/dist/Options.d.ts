/// <reference types="jquery" />
/// <reference types="jstree" />
import JstreeDataNode from "@/JstreeDataNode";
export default interface Options {
    $el: JQuery;
    data?: Array<JstreeDataNode>;
    cascadeSelect?: boolean;
    id?: string;
    multiple?: boolean;
    name?: string;
    callback?: Function;
    upCascadeSelect?: boolean;
    canBeSelected?: boolean;
    idSeparator?: string;
    idPrefix?: string;
    associations?: {
        [p: string]: Array<string>;
    };
}
