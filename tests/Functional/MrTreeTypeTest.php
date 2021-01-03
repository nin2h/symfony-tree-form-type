<?php declare(strict_types=1);

namespace Mrself\TreeTypeBundle\Tests\Functional;

use Mrself\TreeTypeBundle\MrTreeType;
use Symfony\Component\Form\FormFactory;
use Twig\Environment;

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
        /** @var Environment $twig */
        $twig = static::$container->get('twig');
        $html = $twig->createTemplate('{{ form(form) }}')->render(['form' => $view]);

        $mrTreeTypeBlockName = 'mrTreeWidget';
        $this->assertStringContainsString($mrTreeTypeBlockName, $html);
        $this->assertStringContainsString('Item 1', $html);
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