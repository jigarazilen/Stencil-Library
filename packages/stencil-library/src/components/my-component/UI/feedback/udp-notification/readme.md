# udp-notification



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type                                | Default     |
| ------------ | ------------- | ----------- | ----------------------------------- | ----------- |
| `active`     | `active`      |             | `boolean`                           | `false`     |
| `message`    | `message`     |             | `string`                            | `undefined` |
| `status`     | `status`      |             | `"error" \| "success" \| "warning"` | `undefined` |
| `userCancel` | `user-cancel` |             | `boolean`                           | `false`     |


## Dependencies

### Used by

 - [ambient-template-grid](../../grid/ambient-template-grid)

### Depends on

- [unity-typography](../../..)

### Graph
```mermaid
graph TD;
  udp-notification --> unity-typography
  ambient-template-grid --> udp-notification
  style udp-notification fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
