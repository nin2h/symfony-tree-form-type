import MrTreeWidget from "@/MrTreeWidget";

test('test', () => {
    $(`<div class="mrTreeWidget" data-mr-tree-widget='{"id": "tree1"}'><div class="mrTreeWidget__tree"></div></div>`)
        .appendTo($('body'));
    const instance = MrTreeWidget.initByEl($('.mrTreeWidget')[0]);
    expect(instance.getOptions().id).toEqual('tree1');
});