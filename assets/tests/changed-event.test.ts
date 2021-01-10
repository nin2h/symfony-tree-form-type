import TestWidget from "./TestWidget";
import MrTreeWidget from "@/MrTreeWidget";

test('input field is updated on jstree node select', (cb) => {
    const testWidget = TestWidget.init({
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
            testWidget.getNodes().first().find('.jstree-anchor').trigger('click');
            const value = testWidget.$input.val();
            expect(value).toEqual('1');
            cb();
        }
    });
});