# udp-datetime-selector



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                          | Type      | Default     |
| ---------- | ---------- | -------------------------------------------------------------------- | --------- | ----------- |
| `error`    | `error`    |                                                                      | `string`  | `undefined` |
| `id`       | `id`       |                                                                      | `string`  | `undefined` |
| `label`    | `label`    |                                                                      | `string`  | `undefined` |
| `max`      | `max`      | Maximum date, supports any date supported by the js Date constructor | `string`  | `undefined` |
| `min`      | `min`      | Minimum date, supports any date supported by the js Date constructor | `string`  | `undefined` |
| `required` | `required` |                                                                      | `boolean` | `undefined` |
| `value`    | `value`    |                                                                      | `string`  | `''`        |


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
  udp-datetime-selector --> unity-typography
  stencil-field --> udp-datetime-selector
  style udp-datetime-selector fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
