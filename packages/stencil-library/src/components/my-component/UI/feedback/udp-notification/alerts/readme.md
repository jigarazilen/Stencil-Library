# upd-alert-banner



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type                                          | Default     |
| --------- | --------- | ----------- | --------------------------------------------- | ----------- |
| `message` | `message` |             | `string`                                      | `''`        |
| `onClick` | --        |             | `() => void`                                  | `undefined` |
| `type`    | `type`    |             | `"error" \| "info" \| "success" \| "warning"` | `'info'`    |


## Dependencies

### Used by

 - [ambient-template-grid](../../../grid/ambient-template-grid)

### Depends on

- [unity-typography](../../../..)
- [stencil-icon-button](../../../buttons/icon-button)

### Graph
```mermaid
graph TD;
  upd-alert-banner --> unity-typography
  upd-alert-banner --> stencil-icon-button
  stencil-icon-button --> udp-ambient-tool-tip
  udp-ambient-tool-tip --> unity-typography
  ambient-template-grid --> upd-alert-banner
  style upd-alert-banner fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
