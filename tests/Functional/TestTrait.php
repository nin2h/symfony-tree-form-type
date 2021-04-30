<?php declare(strict_types=1);

namespace Mrself\TreeTypeBundle\Tests\Functional;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManager;
use Mrself\TreeTypeBundle\MrTreeType;
use Mrself\TreeTypeBundle\TreeValuesViewTransformer;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\Form\FormInterface;

trait TestTrait
{
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

        $fieldOptions = array_merge($options['formOptions'] ?? [], [
            'tree' => $options['tree'],
            'class' => 'EntityClass',
        ]);

        return $formFactory->createBuilder(FormType::class, ['tree_field' => $options['data']])
            ->add('tree_field', MrTreeType::class, $fieldOptions)
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
}