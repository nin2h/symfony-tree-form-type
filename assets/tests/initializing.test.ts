import MrTreeWidget from "@/MrTreeWidget";
import TestWidget from "./TestWidget";

test('boot() initializes all elements with mrTreeWidget class', () => {
    $(`<div class="mrTreeWidget" data-mr-tree-widget='{"id": "tree1"}'><div class="mrTreeWidget__tree"></div></div>`)
        .appendTo($('body'));

    MrTreeWidget.boot();
    const instances = MrTreeWidget.getInstances();
    expect(instances).toHaveLength(1);
    expect(instances[0].getOptions().id).toEqual('tree1');
});

test('it sets "jstree" instance', (cb) => {
    TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: 1,
                    parent: '#',
                    text: 'Item 1',
                    weight: 1
                }
            ]
        },
        callback: (instance: MrTreeWidget) => {
            expect(instance.getJstree()).not.toBeUndefined();
            cb();
        }
    });
});