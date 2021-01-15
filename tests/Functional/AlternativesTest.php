<?php declare(strict_types=1);

namespace Functional;

use Mrself\TreeTypeBundle\Tests\Functional\KernelTestCase;
use Mrself\TreeTypeBundle\Tests\Functional\TestTrait;

class AlternativesTest extends KernelTestCase
{
    use TestTrait;

    public function testDefaultAlternativesOptionIsPassedToTemplate()
    {
        $form = $this->makeForm([
            'data' => null,
            'tree' => [
                [
                    'id' => 1,
                    'parent' => '#',
                    'text' => 'Item 1'
                ]
            ]
        ]);

        $html = $this->renderForm($form);
        $this->assertStringContainsString('alternatives: []', $html);
    }

    public function testEmptyAlternativesOptionIsPassedToTemplate()
    {
        $form = $this->makeForm([
            'data' => null,
            'tree' => [
                [
                    'id' => 1,
                    'parent' => '#',
                    'text' => 'Item 1'
                ]
            ],
            'formOptions' => ['alternatives' => []]
        ]);

        $html = $this->renderForm($form);
        $this->assertStringContainsString('alternatives: []', $html);
    }

    public function testAlternativesOptionIsPassedToTemplate()
    {
        $form = $this->makeForm([
            'data' => null,
            'tree' => [
                [
                    'id' => 1,
                    'parent' => '#',
                    'text' => 'Item 1'
                ]
            ],
            'formOptions' => ['alternatives' => [
                'id' => ['id1', 'id2']
            ]]
        ]);

        $html = $this->renderForm($form);
        $this->assertStringContainsString('alternatives: {"id":["id1","id2"]}', $html);
    }

    protected function setUp(): void
    {
        static::bootKernel();
    }
}