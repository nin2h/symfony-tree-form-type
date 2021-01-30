<?php declare(strict_types=1);

namespace Mrself\TreeTypeBundle;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\DataTransformerInterface;

class TreeValuesViewTransformer implements DataTransformerInterface
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @var array
     */
    private $formOptions;

    public function transform($value)
    {
        if ($value instanceof Collection) {
            return $this->collectionToIds($value);
        }

        if ($this->formOptions['multiple']) {
            if (!$value) {
                return [];
            }

            return $this->collectionToIds($value);
        }

        return $value ? $this->attachPrefixToId($value->getId()) : '';
    }

    protected function collectionToIds(Collection $collection): array
    {
        return $collection->map(function ($itemValue) {
            return $this->attachPrefixToId($itemValue->getId());
        })->toArray();
    }


    protected function attachPrefixToId($id): string
    {
        return $this->formOptions['id_prefix'] . $id;
    }

    public function reverseTransform($value)
    {
        if (!$value) {
            if ($this->formOptions['multiple']) {
                return [];
            }

            return null;
        }

        $repository = $this->em->getRepository($this->formOptions['class']);

        if ($this->formOptions['multiple']) {
            $ids = $this->multipleViewValueToIds($value, $this->formOptions);
            return new ArrayCollection($repository->findBy(['id' => $ids]));
        }

        $value = $this->formatNodeViewId($value, $this->formOptions);
        return $repository->find($value);
    }

    protected function multipleViewValueToIds(string $viewValue, array $options): array
    {
        $viewValue = explode(',', $viewValue);
        return array_map(function (string $idWithPrefix) use ($options): string {
            return $this->formatNodeViewId($idWithPrefix, $options);
        }, $viewValue);
    }

    protected function formatNodeViewId(string $viewId, array $options): string
    {
        $withoutPrefix = str_replace($options['id_prefix'], '', $viewId);

        if ($options['id_separator'] === '') {
            return $withoutPrefix;
        }

        return explode($options['id_separator'], $withoutPrefix)[0];
    }

    public function setOptions(array $options)
    {
        $this->formOptions = $options;
    }

    public function setEntityManager(EntityManagerInterface $em)
    {
        $this->em = $em;
    }
}