import TestWidget from "./TestWidget";
import MrTreeWidget from "@/MrTreeWidget";

test('showByParent() shows only children of passed parent', cb => {
    const testWidget = TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: '1',
                    parent: '#',
                    text: 'Item 1',
                },
                {
                    id: 2,
                    parent: '1',
                    text: 'Item 2',
                }
            ]
        },
        callback: (instance: MrTreeWidget) => {
            testWidget.$tree.on('refresh.jstree', (e, data) => {
                expect(testWidget.getNodes()).toHaveLength(1);
                cb();
            });

            instance.showByParent('1');
        }
    });
});