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

test('it does not call callback option if it does not exist', (cb) => {
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
        }
    });

    setTimeout(cb, 1000);
});

test('it trims the right part of id using a separator', (cb) => {
    TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: '1_any',
                    parent: '#',
                    text: 'Item 1',
                    weight: 1
                }
            ]
        },
        jstreeOptions: {
            idSeparator: '_'
        },
        value: '1',
        callback: (instance: MrTreeWidget) => {
            const selected = instance.getJstree().get_selected();
            expect(selected).toEqual(['1_any']);
            cb();
        }
    });
});

test('it works with selected node which has unselected parent', (cb) => {
    const testWidget = TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: '1',
                    parent: '2',
                    text: 'Item 1'
                },

                {
                    id: '2',
                    parent: '#',
                    text: 'Item 2',
                    canBeSelected: false,
                }
            ]
        },
        value: '1',
        callback: (instance: MrTreeWidget) => {
            expect(testWidget.getNodes().length).toEqual(2);
            cb();
        }
    });
});

test.skip('it trims the left part (id_prefix)', (cb) => {
    TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: 'prefix1',
                    parent: '#',
                    text: 'Item 1',
                    weight: 1
                }
            ]
        },
        jstreeOptions: {
            idPrefix: 'prefix'
        },
        value: 'prefix1',
        callback: (instance: MrTreeWidget) => {
            const selected = instance.getJstree().get_selected();
            expect(selected).toEqual(['prefix1']);
            cb();
        }
    });
});