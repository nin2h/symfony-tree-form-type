<?php declare(strict_types=1);

namespace Mrself\TreeTypeBundle\Tests\Functional;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManager;
use Mrself\TreeTypeBundle\MrTreeType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
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

    public function testCanHandleSubmittedData()
    {
        $entity = new class {
            public function getId()
            {
                return 1;
            }
        };

        $repository = $this->createMock(ServiceEntityRepository::class);
        $repository->expects($this->once())
            ->method('findBy')
            ->with(['id' => [1]])
            ->willReturn([$entity]);

        $em = $this->createMock(EntityManager::class);
        $em->expects($this->once())
            ->method('getRepository')
            ->with('EntityClass')
            ->willReturn($repository);

        /** @var MrTreeType $mrTreeType */
        $mrTreeType = static::$container->get(MrTreeType::class);
        $mrTreeType->setEntityManager($em);

        /** @var FormFactory $formFactory */
        $formFactory = static::$container->get('form.factory');
        $formBuilder = $formFactory->createBuilder(FormType::class, ['tree_field' => new ArrayCollection()])
            ->add('tree_field', MrTreeType::class, [
                'tree' => [
                    [
                        'id' => 1,
                        'parent' => '#',
                        'text' => 'Item 1'
                    ]
                ],
                'multiple' => true,
                'class' => 'EntityClass',
            ]);
        $form = $formBuilder->getForm();

        $twig = static::$container->get('twig');
        $html = $twig->createTemplate('{{ form(form) }}')->render(['form' => $form->createView()]);
        $form->submit(['tree_field' => [1]]);
        $form->isValid();
        $data = $form->getData();
        $this->assertEquals(1, $data['tree_field'][0]->getId());
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