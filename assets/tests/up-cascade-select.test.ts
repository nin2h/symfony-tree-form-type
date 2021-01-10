import TestWidget from "./TestWidget";
import MrTreeWidget from "@/MrTreeWidget";

test('it selected parents on node select', cb => {
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
                    parent: '1',
                    text: 'Item 2',
                },
                {
                    id: 3,
                    parent: '2',
                    text: 'Item 3',
                }
            ]
        },
        jstreeOptions: {
            upCascadeSelect: true
        },
        callback: (instance: MrTreeWidget) => {
            instance.getJstree().select_node(3);
            const value = testWidget.$input.val();
            expect(value).toEqual('3,2,1');
            cb();
        }
    });
});