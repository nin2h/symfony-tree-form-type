<?php declare(strict_types=1);

namespace Functional;

use Mrself\TreeTypeBundle\Tests\Functional\KernelTestCase;
use Mrself\TreeTypeBundle\Tests\Functional\TestTrait;

class CascadeSelectTest extends KernelTestCase
{
    use TestTrait;

    public function testFalsyUpCascadeSelectIsRenderedWithFalsyZero()
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
            'formOptions' => ['up_cascade_select' => false]
        ]);

        $html = $this->renderForm($form);
        $this->assertStringContainsString('upCascadeSelect: !!0', $html);
    }

    public function testTruthyUpCascadeSelectIsRenderedWithTruthyOne()
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
            'formOptions' => ['up_cascade_select' => true]
        ]);

        $html = $this->renderForm($form);
        $this->assertStringContainsString('upCascadeSelect: !!1', $html);
    }

    protected function setUp()
    {
        static::bootKernel();
    }
}