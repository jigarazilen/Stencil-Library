# udp-time-selector



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type      | Default     |
| ---------- | ---------- | ----------- | --------- | ----------- |
| `error`    | `error`    |             | `string`  | `undefined` |
| `id`       | `id`       |             | `string`  | `undefined` |
| `label`    | `label`    |             | `string`  | `undefined` |
| `max`      | `max`      |             | `string`  | `undefined` |
| `min`      | `min`      |             | `string`  | `undefined` |
| `required` | `required` |             | `boolean` | `undefined` |
| `value`    | `value`    |             | `string`  | `''`        |


## Events

| Event            | Description | Type                      |
| ---------------- | ----------- | ------------------------- |
| `udpFieldBlur`   |             | `CustomEvent<FocusEvent>` |
| `udpFieldChange` |             | `CustomEvent<string>`     |
| `udpFieldFocus`  |             | `CustomEvent<FocusEvent>` |


## Dependencies

### Used by

 - [stencil-field](../../forms/form)

### Depends on

- [unity-typography](../../..)

### Graph
```mermaid
graph TD;
  udp-time-selector --> unity-typography
  stencil-field --> udp-time-selector
  style udp-time-selector fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
