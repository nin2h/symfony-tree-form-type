<?php declare(strict_types=1);

namespace Mrself\TreeTypeBundle\Tests\Functional;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManager;
use Mrself\TreeTypeBundle\MrTreeType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\Form\FormInterface;
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
        $entity = $this->createEntity(1);
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
        $entity = $this->createEntity(1);
        $repository = $this->makeRepositoryMock(
            'findBy',
            ['id' => [1]],
            [$entity]
        );
        $this->setEntityManagerToTreeType($repository);

        $form = $this->makeForm([
            'formOptions' => ['multiple' => true],
            'tree' => [
                [
                    'id' => 1,
                    'parent' => '#',
                    'text' => 'Item 1'
                ]
            ],
            'data' => new ArrayCollection()
        ]);

        $form->submit(['tree_field' => [1]]);
        $form->isValid();
        $data = $form->getData();
        $this->assertEquals(1, $data['tree_field'][0]->getId());
    }

    public function testViewTransformer()
    {
        $entity = $this->createEntity(1);
        $entity2 = $this->createEntity(2);

        $repository = $this->makeRepositoryMock(
            'findBy',
            ['id' => [1, 2]],
            [$entity, $entity2]
        );

        $this->setEntityManagerToTreeType($repository);

        $form = $this->makeForm([
            'data' => new ArrayCollection([$entity]),
            'tree' => [
                [
                    'id' => 1,
                    'parent' => '#',
                    'text' => 'Item 1'
                ]
            ],
            'formOptions' => ['multiple' => true]
        ]);

        $html = $this->renderForm($form);
        $this->assertStringContainsString('"selected"', $html);

        $form->submit(['tree_field' => [1, 2]]);
        $form->isValid();
        $data = $form->getData();
        $this->assertEquals(1, $data['tree_field'][0]->getId());
    }

    public function testRenderedHtmlContainsHiddenInput()
    {
        $form = $this->makeForm([
            'data' => new ArrayCollection(),
            'tree' => [
                [
                    'id' => 1,
                    'parent' => '#',
                    'text' => 'Item 1'
                ]
            ],
            'formOptions' => ['multiple' => true]
        ]);
        $html = $this->renderForm($form);
        $this->assertStringContainsString('name="tree_field"', $html);
    }

    public function testRenderedHtmlContainsCorrectFieldValue()
    {
        $entity = $this->createEntity(1);
        $entity2 = $this->createEntity(2);

        $form = $this->makeForm([
            'data' => new ArrayCollection([$entity, $entity2]),
            'tree' => [
                [
                    'id' => 1,
                    'parent' => '#',
                    'text' => 'Item 1'
                ]
            ],
            'formOptions' => ['multiple' => true]
        ]);
        $html = $this->renderForm($form);
        $this->assertStringContainsString('value="1,2"', $html);
    }

    public function testItWorksWithMultipleFalseWithData()
    {
        $entity = $this->createEntity(1);
        $repository = $this->makeRepositoryMock(
            'find',
            1,
            $entity
        );
        $this->setEntityManagerToTreeType($repository);

        $entity = $this->createEntity(1);

        $form = $this->makeForm([
            'data' => $entity,
            'tree' => [
                [
                    'id' => 1,
                    'parent' => '#',
                    'text' => 'Item 1'
                ]
            ],
            'formOptions' => ['multiple' => false]
        ]);
        $html = $this->renderForm($form);
        $this->assertStringContainsString('value="1"', $html);

        $form->submit(['tree_field' => 1]);
        $data = $form->getData();
        $this->assertEquals(1, $data['tree_field']->getId());
    }

    public function testItWorksWithMultipleFalseWithoutData()
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
            'formOptions' => ['multiple' => false]
        ]);

        $form->submit(['tree_field' => '']);
        $data = $form->getData();
        $this->assertNull($data['tree_field']);
    }

    private function makeRepositoryMock(string $method, $with, $return)
    {
        $repository = $this->createMock(ServiceEntityRepository::class);
        $repository->expects($this->once())
            ->method($method)
            ->with($with)
            ->willReturn($return);

        return $repository;
    }

    private function createEntity(int $id)
    {
        $entity = new class {
            public $id;
            public function getId()
            {
                return $this->id;
            }
        };
        $entity->id = $id;

        return $entity;
    }

    private function setEntityManagerToTreeType($repository)
    {
        $em = $this->createMock(EntityManager::class);
        $em->expects($this->once())
            ->method('getRepository')
            ->with('EntityClass')
            ->willReturn($repository);

        /** @var MrTreeType $mrTreeType */
        $mrTreeType = static::$container->get(MrTreeType::class);
        $mrTreeType->setEntityManager($em);
    }

    private function makeForm(array $options): FormInterface
    {
        /** @var FormFactory $formFactory */
        $formFactory = static::$container->get('form.factory');

        return $formFactory->createBuilder(FormType::class, ['tree_field' => $options['data']])
            ->add('tree_field', MrTreeType::class, array_merge($options['formOptions'], [
                'tree' => $options['tree'],
                'class' => 'EntityClass',
            ]))
            ->getForm();
    }

    public function renderForm(FormInterface $form): string
    {
        $twig = static::$container->get('twig');
        return $twig->createTemplate('{{ form(form) }}')->render(['form' => $form->createView()]);
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