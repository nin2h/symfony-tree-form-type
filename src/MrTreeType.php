<?php declare(strict_types=1);

namespace Mrself\TreeTypeBundle;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MrTreeType extends AbstractType
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->addViewTransformer(new CallbackTransformer(
            function ($normValue) use ($options) {
                if ($options['multiple']) {
                    if (!$normValue) {
                        return [];
                    }

                    return $normValue->map(function ($itemValue) {
                        return $itemValue->getId();
                    });
                }

                return $normValue ? $normValue->getId() : '';
            },
            function ($viewValue) use ($options) {
                $repository = $this->em->getRepository($options['class']);

                if ($options['multiple']) {
                    return $repository->findBy(['id' => $viewValue]);
                }

                return $repository->find($viewValue);
            }
        ));
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $view->vars['field_id'] = md5($form->getName()) . 'mrTreeWidget';
        $view->vars['tree'] = $options['tree'];
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'multiple' => false,
            'id_prefix' => '',
            'cascade_select' => false,
            'class' =>  null
        ]);

        $resolver->setRequired(['tree']);
        $resolver->setAllowedTypes('tree', 'array');

        $resolver->setNormalizer('tree', function (Options $options, array $tree): array {
            return array_map(function ($item) {
                if (is_array($item)) {
                    return $item;
                }

                $id = get_class($item) . ':' . $item->getId();
                $parent = $item->getParent() ? $item->getParent()->getId() : '#';
                return [
                    'id' => $id,
                    'parent' => $parent,
                    'text' => $item->getName()
                ];
            }, $tree);
        });
    }
}