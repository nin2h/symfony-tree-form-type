import TestWidget from "./TestWidget";
import MrTreeWidget from "@/MrTreeWidget";

test('the node dependencies are auto-selected on the primary node click', cb => {
    TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: '1',
                    parent: '#',
                    text: 'Item 1',
                },
                {
                    id: '2',
                    parent: '#',
                    text: 'Item 2'
                },
            ],
            dependencies: {
                '1': ['2']
            }
        },
        callback: (instance: MrTreeWidget) => {
            instance.getJstree().select_node('1');
            const selectedNodes = instance.getJstree().get_selected();
            expect(selectedNodes).toEqual(['1', '2']);
            cb();
        }
    });
});

test('the node dependencies are auto-selected on the primary node click if node ids contain prefixes and separators', cb => {
    TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: 'prefix1_postfix',
                    parent: '#',
                    text: 'Item 1',
                },
                {
                    id: 'prefix2_postfix',
                    parent: '#',
                    text: 'Item 2'
                },
            ],
            dependencies: {
                '1': ['2']
            },
            idPrefix: 'prefix',
            idSeparator: '_',
        },
        callback: (instance: MrTreeWidget) => {
            instance.getJstree().select_node('prefix1_postfix');
            const selectedNodes = instance.getJstree().get_selected();
            expect(selectedNodes).toEqual(['prefix1_postfix', 'prefix2_postfix']);
            cb();
        }
    });
});