<?php declare(strict_types=1);

namespace Mrself\TreeTypeBundle\Tests\Functional;

use Doctrine\Common\Collections\ArrayCollection;
use Mrself\TreeTypeBundle\MrTreeType;
use Symfony\Component\Form\FormFactory;
use Twig\Environment;

class MrTreeTypeTest extends KernelTestCase
{
    use TestTrait;

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

        $form->submit(['tree_field' => '1']);
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

        $form->submit(['tree_field' => '1,2']);
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
        $this->assertStringContainsString('name="form[tree_field]"', $html);
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

        $form->submit(['tree_field' => '1']);
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

    public function testMultipleFalseWorksWithCollectionFormData()
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
            'data' => new ArrayCollection([$entity]),
            'tree' => [
                [
                    'id' => 1,
                    'parent' => '#',
                    'text' => 'Item 1'
                ]
            ],
            'formOptions' => ['multiple' => false]
        ]);

        $form->submit(['tree_field' => '1']);
        $data = $form->getData();
        $this->assertEquals(1, $data['tree_field']->getId());
    }

    public function testViewValueIsSplitByCommaBeforeForQueryParams()
    {
        $entity = $this->createEntity(1);
        $entity2 = $this->createEntity(2);

        $repository = $this->makeRepositoryMock(
            'findBy',
            ['id' => [1,2]],
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

        $form->submit(['tree_field' => '1,2']);
        $data = $form->getData();
        $this->assertEquals(1, $data['tree_field'][0]->getId());
    }

    protected function setUp()
    {
        static::bootKernel();
    }
}