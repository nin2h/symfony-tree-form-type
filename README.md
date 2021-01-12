# Symfony tree form plugin

**Still under development!**

## Installing

`composer require mrself/symfony-tree-form-type:^1.2.3`

Make sure `config/packages/twig.yaml` has the following code:

```yaml
twig:
    form_themes:
      - '@TreeType/tree_type.html.twig'
```

### Assets

The main js asset is located here `assets/dist/main.js`. It should be required in your front-end bundle or just added
to your html.

## Usage

```php
public function buildForm(\Symfony\Component\Form\FormBuilderInterface $builder, array $options)
{
    $builder->add('alternatives', MrTreeType::class, [
        'class' => DataClass::class,
        'tree' => [
            [
                'id' => '1',
                'text' => 'Item 1',
                'parent' => '#'
            ]
         ],
        'multiple' => true
    ]);
}
```