import MrTreeWidget from "@/MrTreeWidget";

test('boot() initializes all elements with mrTreeWidget class', () => {
    $(`<div class="mrTreeWidget" data-mr-tree-widget='{"id": "tree1"}'><div class="mrTreeWidget__tree"></div></div>`)
        .appendTo($('body'));

    MrTreeWidget.boot();
    const instances = MrTreeWidget.getInstances();
    expect(instances).toHaveLength(1);
    expect(instances[0].getOptions().id).toEqual('tree1');
});