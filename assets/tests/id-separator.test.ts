import TestWidget from "./TestWidget";
import MrTreeWidget from "@/MrTreeWidget";

test('the option "id_separator" is ignored if it is empty', cb => {
    const testWidget = TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: 1,
                    parent: '#',
                    text: 'Item 1',
                    weight: 0
                },
                {
                    id: 12,
                    parent: '#',
                    text: 'Item 2',
                    weight: 0
                }
            ],
            idSeparator: '',
        },
        callback: (instance: MrTreeWidget) => {
            testWidget.getNodes().first().find('.jstree-anchor').trigger('click');
            const value = testWidget.$input.val();
            expect(value).toEqual('1');
            cb();
        }
    });
});