import MrTreeWidget from "@/MrTreeWidget";
import TestWidget from "./TestWidget";

test('"id" option from "data" propeprty is included in instance "options" property"', () => {
    $(`<div class="mrTreeWidget" data-mr-tree-widget='{"id": "tree1"}'><div class="mrTreeWidget__tree"></div></div>`)
        .appendTo($('body'));
    const instance = MrTreeWidget.initByEl($('.mrTreeWidget'));
    expect(instance.getOptions().id).toEqual('tree1');
});

test('"id" option from passed options is included in instance "options" property"', () => {
    $(`<div class="mrTreeWidget"><div class="mrTreeWidget__tree"></div></div>`)
        .appendTo($('body'));
    const instance = MrTreeWidget.init({
        $el: $('.mrTreeWidget'),
        id: 'tree1'
    });
    expect(instance.getOptions().id).toEqual('tree1');
});

test('global option "data" is included in instance options', () => {
    const testWidget = TestWidget.init({
        globalOptions: {
            data: {id: 1}
        }
    });

    expect(testWidget.getOptions().data).toEqual({id: 1});
});