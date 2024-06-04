# selectable-list



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description | Type                     | Default     |
| ------------------ | ------------------- | ----------- | ------------------------ | ----------- |
| `disableSelection` | `disable-selection` |             | `boolean`                | `false`     |
| `displayKey`       | `display-key`       |             | `string`                 | `''`        |
| `error`            | `error`             |             | `string`                 | `''`        |
| `id`               | `id`                |             | `string`                 | `undefined` |
| `items`            | --                  |             | `any[]`                  | `[]`        |
| `multiSelect`      | `multi-select`      |             | `boolean`                | `false`     |
| `onInput`          | --                  |             | `(event: Event) => void` | `undefined` |
| `required`         | `required`          |             | `boolean`                | `undefined` |
| `useCheckbox`      | `use-checkbox`      |             | `boolean`                | `false`     |
| `value`            | `value`             |             | `string`                 | `undefined` |
| `valueKey`         | `value-key`         |             | `string`                 | `''`        |


## Events

| Event            | Description | Type                    |
| ---------------- | ----------- | ----------------------- |
| `udpFieldBlur`   |             | `CustomEvent<Event>`    |
| `udpFieldChange` |             | `CustomEvent<Object[]>` |


## Dependencies

### Used by

 - [stencil-field](../../forms/form)
 - [udp-dynamic-form](../../forms/dynamic-form)

### Depends on

- [unity-typography](../../..)

### Graph
```mermaid
graph TD;
  selectable-list --> unity-typography
  stencil-field --> selectable-list
  udp-dynamic-form --> selectable-list
  style selectable-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
