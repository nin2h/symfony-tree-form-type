import MrTreeWidget from "@/MrTreeWidget";

test('it can sort by weight', () => {
    const $el = $(`<div class="mrTreeWidget" data-mr-tree-widget='{"id": "tree1"}'><div class="mrTreeWidget__tree"></div></div>`)
        .appendTo($('body'));

    (window as any).tree1 = {
        data: [
            {
                id: 1,
                parent: '#',
                text: 'Item 1',
                weight: 1
            },
            {
                id: 2,
                parent: '#',
                text: 'Item 2',
                weight: 0
            }
        ]
    };

    MrTreeWidget.initByEl($el);
    const $nodes = $el.find('.jstree-node');
    const $node1 = $nodes.first();
    const $node2 = $nodes.last();

    expect($node1.text()).toContain('Item 2');
    expect($node2.text()).toContain('Item 1');
});

test('it can sort alphabetically', () => {
    const $el = $(`<div class="mrTreeWidget" data-mr-tree-widget='{"id": "tree1"}'><div class="mrTreeWidget__tree"></div></div>`)
        .appendTo($('body'));

    (window as any).tree1 = {
        data: [
            {
                id: 1,
                parent: '#',
                text: 'Item 2',
            },
            {
                id: 2,
                parent: '#',
                text: 'Item 1',
            }
        ]
    };

    MrTreeWidget.initByEl($el);
    const $nodes = $el.find('.jstree-node');
    const $node1 = $nodes.first();
    const $node2 = $nodes.last();

    expect($node1.text()).toContain('Item 1');
    expect($node2.text()).toContain('Item 2');
});