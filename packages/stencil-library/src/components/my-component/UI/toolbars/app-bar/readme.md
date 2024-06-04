# app-bar



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type     | Default     |
| ---------- | ---------- | ----------- | -------- | ----------- |
| `username` | `username` |             | `string` | `undefined` |


## Dependencies

### Used by

 - [my-component](../../..)

### Depends on

- [stencil-icon-button](../../buttons/icon-button)
- [unity-typography](../../..)
- [udp-avatar](../../data-display/udp-avatar)

### Graph
```mermaid
graph TD;
  app-bar --> stencil-icon-button
  app-bar --> unity-typography
  app-bar --> udp-avatar
  stencil-icon-button --> udp-ambient-tool-tip
  udp-ambient-tool-tip --> unity-typography
  udp-avatar --> unity-typography
  my-component --> app-bar
  style app-bar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
