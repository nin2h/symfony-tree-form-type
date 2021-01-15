import TestWidget from "./TestWidget";
import MrTreeWidget from "@/MrTreeWidget";


test('one association is auto selected on the condition attribute select', (cb) => {
    const testWidget = TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: '1',
                    parent: '#',
                    text: 'Item 1 <span data-association-trigger>Select associations</span>',
                    associations: ['2']
                },
                {
                    id: '2',
                    parent: '#',
                    text: 'Item 2'
                },
            ]
        },
        callback: (instance: MrTreeWidget) => {
            testWidget.$tree.find('[data-association-trigger]').trigger('click');
            const selectedNodes = instance.getJstree().get_selected();
            expect(selectedNodes).toEqual(['2', '1']);
            cb();
        }
    });
});