<?php declare(strict_types=1);

namespace Mrself\TreeTypeBundle;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MrTreeType extends AbstractType
{
    /**
     * @var EntityManagerInterface
     */
    private $em;
    /**
     * @var TreeValuesViewTransformer
     */
    private $viewTransformer;

    public function __construct(EntityManagerInterface $em, TreeValuesViewTransformer $viewTransformer)
    {
        $this->em = $em;
        $this->viewTransformer = $viewTransformer;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $this->viewTransformer->setOptions($options);
        $builder->addViewTransformer($this->viewTransformer);
    }

    public function setEntityManager($em)
    {
        $this->em = $em;
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $view->vars['field_id'] = md5($form->getName()) . 'mrTreeWidget';

        $tree = $options['tree'];
        $data = $form->getViewData();
        $tree = array_map(function (array $item) use ($options, $data): array {
            if ($options['multiple']) {
                if ($data) {
                    if (in_array($item['id'], $data)) {
                        $item['state'] = ['selected' => true];
                    }
                }
            } else {
                if ($item['id'] === $data) {
                    $item['state'] = ['selected' => true];
                }
            }

            return $item;
        }, $tree);
        $view->vars['tree'] = $tree;
        $view->vars['up_cascade_select'] = $options['up_cascade_select'];
        $view->vars['multiple'] = $options['multiple'];
        $view->vars['id_separator'] = $options['id_separator'];
        $view->vars['id_prefix'] = $options['id_prefix'];
        $view->vars['associations'] = $options['associations'];
        $view->vars['dependencies'] = $options['dependencies'];
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'multiple' => false,
            'id_prefix' => '',

            // Separator used to leave only the first part of id before the separator
            'id_separator' => '',

            'up_cascade_select' => false,
            'class' =>  null,
            'compound' => false,
            'data_class' => null,
            'associations' => [],
            'dependencies' => [],
        ]);

        $resolver->setRequired(['tree']);
        $resolver->setAllowedTypes('tree', 'array');
        $resolver->setAllowedTypes('dependencies', 'array');
        $resolver->setAllowedTypes('id_separator', ['string', 'bool']);

        $resolver->setAllowedTypes('associations', 'array[]');
        $resolver->setAllowedValues('associations', function (array $alternatives) {
            $filtered = array_filter($alternatives, function (array $value): bool {
                return !!array_filter($value, 'is_string');
            });

            return count($filtered) === count($alternatives);
        });

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