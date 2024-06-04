# udp-hotlist-form



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute | Description | Type                                                           | Default     |
| ------------------- | --------- | ----------- | -------------------------------------------------------------- | ----------- |
| `handleCancelClick` | --        |             | `() => void`                                                   | `undefined` |
| `handleFormSubmit`  | --        |             | `(name: string, isPrivate: boolean, columnState: any) => void` | `undefined` |
| `refetchViews`      | --        |             | `() => void`                                                   | `undefined` |


## Dependencies

### Used by

 - [ambient-template-grid](../../ambient-template-grid)

### Depends on

- [text-field](../../../inputs/text-field)
- [stencil-toggle](../../../inputs/toggle)
- [custom-button](../../../buttons/icon-button/primary-button)

### Graph
```mermaid
graph TD;
  udp-hotlist-form --> text-field
  udp-hotlist-form --> stencil-toggle
  udp-hotlist-form --> custom-button
  text-field --> unity-typography
  stencil-toggle --> unity-typography
  ambient-template-grid --> udp-hotlist-form
  style udp-hotlist-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
