import TestWidget from "./TestWidget";
import MrTreeWidget from "@/MrTreeWidget";

test('a node is not selected if it has "canBeSelected" false', cb => {
    const testWidget = TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: 1,
                    parent: '#',
                    text: 'Item 1',
                },
                {
                    id: 2,
                    parent: '#',
                    text: 'Item 2',
                    canBeSelected: false
                }
            ]
        },
        callback: (instance: MrTreeWidget) => {
            testWidget.getNodes().last().find('.jstree-anchor').trigger('click');
            const value = testWidget.$input.val();
            expect(value).toEqual('');
            cb();
        }
    });
});

test('a node is not selected on child select if it has "canBeSelected" false', cb => {
    const testWidget = TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: 1,
                    parent: '#',
                    text: 'Item 1',
                    canBeSelected: false
                },
                {
                    id: 2,
                    parent: '1',
                    text: 'Item 2'
                }
            ]
        },
        jstreeOptions: {
            upCascadeSelect: true
        },
        callback: (instance: MrTreeWidget) => {
            instance.getJstree().select_node('2');
            const value = testWidget.$input.val();
            expect(value).toEqual('2');
            cb();
        }
    });
});