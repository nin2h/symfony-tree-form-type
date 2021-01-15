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
            expect(selectedNodes).toEqual(['1', '2']);
            cb();
        }
    });
});

test('one association is auto selected on the child (hidden) condition attribute select', (cb) => {
    const testWidget = TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: '1',
                    parent: '#',
                    text: 'Item 1',
                },
                {
                    id: '2',
                    parent: '1',
                    text: 'Item 1 <span data-association-trigger>Select associations</span>',
                    associations: ['3']
                },
                {
                    id: '3',
                    parent: '#',
                    text: 'Item 3'
                },
            ]
        },
        callback: (instance: MrTreeWidget) => {
            testWidget.$tree.on('changed.jstree', () => {
                const selectedNodes = instance.getJstree().get_selected();
                expect(selectedNodes).toEqual(['2', '3']);
                cb();
            });

            instance.getJstree().open_node('1');
            testWidget.$tree.find('[data-association-trigger]').trigger('click');
        }
    });
});

test('one association options is taken from app options if it does not exist for a node', (cb) => {
    const testWidget = TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: '1',
                    parent: '#',
                    text: 'Item 1 <span data-association-trigger>Select associations</span>',
                },
                {
                    id: '2',
                    parent: '#',
                    text: 'Item 2'
                },
            ],
            associations: {'1': ['2']}
        },
        callback: (instance: MrTreeWidget) => {
            testWidget.$tree.find('[data-association-trigger]').trigger('click');
            const selectedNodes = instance.getJstree().get_selected();
            expect(selectedNodes).toEqual(['1', '2']);
            cb();
        }
    });
});