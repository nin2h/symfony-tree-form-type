import TestWidget from "./TestWidget";

test('it can sort by weight', () => {
    const testWidget = TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: 1,
                    parent: '#',
                    text: 'Item 1',
                    weight: 1
                },
                {
                    id: 2,
                    parent: '#',
                    text: 'Item 2',
                    weight: 0
                }
            ]
        }
    });

    const nodesText = testWidget.getNodesText();
    expect(nodesText[0]).toContain('Item 2');
    expect(nodesText[1]).toContain('Item 1');
});

test('it can sort alphabetically', () => {

    const testWidget = TestWidget.init({
        globalOptions: {
            data: [
                {
                    id: 1,
                    parent: '#',
                    text: 'Item 2',
                },
                {
                    id: 2,
                    parent: '#',
                    text: 'Item 1',
                }
            ]
        }
    });

    const nodesText = testWidget.getNodesText();
    expect(nodesText[0]).toContain('Item 1');
    expect(nodesText[1]).toContain('Item 2');
});