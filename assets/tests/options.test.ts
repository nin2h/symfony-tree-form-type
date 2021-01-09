import MrTreeWidget from "@/MrTreeWidget";

test('"id" option is included in instance "options" property"', () => {
    $(`<div class="mrTreeWidget" data-mr-tree-widget='{"id": "tree1"}'><div class="mrTreeWidget__tree"></div></div>`)
        .appendTo($('body'));
    const instance = MrTreeWidget.initByEl($('.mrTreeWidget')[0]);
    expect(instance.getOptions().id).toEqual('tree1');
});

test('global option "data" is included in instance options', () => {
    $(`<div class="mrTreeWidget" data-mr-tree-widget='{"id": "tree1"}'><div class="mrTreeWidget__tree"></div></div>`)
        .appendTo($('body'));

    (window as any).tree1 = {
        data: {id: 1}
    };

    const instance = MrTreeWidget.initByEl($('.mrTreeWidget')[0]);
    expect(instance.getOptions().data).toEqual({id: 1});
});