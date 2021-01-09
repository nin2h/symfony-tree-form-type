import MrTreeWidget from "@/MrTreeWidget";

test('test', () => {
    $(`<div class="mrTreeWidget" data-mr-tree-widget='{"id": "tree1"}'><div class="mrTreeWidget__tree"></div></div>`)
        .appendTo($('body'));
    MrTreeWidget.initByEl($('.mrTreeWidget')[0]);
});