<?php declare(strict_types=1);

namespace Functional;

use Doctrine\Common\Collections\ArrayCollection;
use Mrself\TreeTypeBundle\Tests\Functional\KernelTestCase;
use Mrself\TreeTypeBundle\Tests\Functional\TestTrait;

class NodeIdCompositionTest extends KernelTestCase
{
    use TestTrait;

    public function testIdPrefixIsRemovedFromViewValueBeforeQueryingEntitiesWithMultipleFalse()
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
            'formOptions' => [
                'multiple' => false,
                'id_prefix' => 'prefix',
            ]
        ]);

        $form->submit(['tree_field' => 'prefix1']);
        $data = $form->getData();
        $this->assertEquals(1, $data['tree_field']->getId());
    }

    public function testIdPrefixIsRemovedFromViewValueBeforeQueryingEntitiesWithMultipleTrue()
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
            'formOptions' => [
                'multiple' => true,
                'id_prefix' => 'prefix',
            ]
        ]);

        $form->submit(['tree_field' => 'prefix1,prefix2']);
    }

    protected function setUp()
    {
        static::bootKernel();
    }
}