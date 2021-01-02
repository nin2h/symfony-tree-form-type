<?php declare(strict_types=1);

namespace Mrself\TreeTypeBundle\Tests\Functional;

use Mrself\TreeTypeBundle\MrTreeType;
use Symfony\Component\Form\FormFactory;

class MrTreeTypeTest extends KernelTestCase
{
    public function testBase()
    {
        /** @var FormFactory $formFactory */
        $formFactory = static::$container->get('form.factory');
        $form = $formFactory->createBuilder(MrTreeType::class, [], [
            'tree' => [
                [
                    'id' => 1,
                    'parent' => '#',
                    'text' => 'Item 1'
                ]
            ]
        ]);
        $view = $form->getForm()->createView();
    }

    protected static function getKernelClass()
    {
        return TestKernel::class;
    }

    protected function setUp()
    {
        static::bootKernel();
    }
}