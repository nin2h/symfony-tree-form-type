<?php declare(strict_types=1);

namespace Mrself\TreeTypeBundle\Tests\Functional;

use Doctrine\Common\Collections\ArrayCollection;
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

    public function testItAddsSelectedStateToTreeItemsWhichAreSelected()
    {
        $entity = new class {
            public function getId()
            {
                return 1;
            }
        };
        $collection = new ArrayCollection([$entity]);

        /** @var FormFactory $formFactory */
        $formFactory = static::$container->get('form.factory');
        $form = $formFactory->createBuilder(MrTreeType::class, $collection, [
            'tree' => [
                [
                    'id' => 1,
                    'parent' => '#',
                    'text' => 'Item 1'
                ]
            ],
            'multiple' => true,
        ]);
        $view = $form->getForm()->createView();
        /** @var Environment $twig */
        $twig = static::$container->get('twig');
        $html = $twig->createTemplate('{{ form(form) }}')->render(['form' => $view]);

        $this->assertStringContainsString('"selected"', $html);
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