# udp-ambient-card



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description | Type     | Default   |
| ---------- | ----------- | ----------- | -------- | --------- |
| `moreText` | `more-text` |             | `string` | `''`      |
| `overflow` | `overflow`  |             | `string` | `''`      |
| `width`    | `width`     |             | `string` | `'600px'` |


## Dependencies

### Used by

 - [udp-forms-renderer](../../../forms/udp-forms/udp-forms-renderer)

### Depends on

- [udp-adornment](../../adornment/udp-adornment)
- [unity-typography](../../../..)
- [stencil-icon-button](../../../buttons/icon-button)

### Graph
```mermaid
graph TD;
  udp-ambient-card --> udp-adornment
  udp-ambient-card --> unity-typography
  udp-ambient-card --> stencil-icon-button
  stencil-icon-button --> udp-ambient-tool-tip
  udp-ambient-tool-tip --> unity-typography
  udp-forms-renderer --> udp-ambient-card
  style udp-ambient-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
