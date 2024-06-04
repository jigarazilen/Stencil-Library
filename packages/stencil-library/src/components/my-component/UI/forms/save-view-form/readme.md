# save-view-form-dialog



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute        | Description | Type                                                            | Default     |
| ------------------ | ---------------- | ----------- | --------------------------------------------------------------- | ----------- |
| `apiCatalogId`     | `api-catalog-id` |             | `any`                                                           | `undefined` |
| `application`      | `application`    |             | `string`                                                        | `undefined` |
| `closeDialog`      | `close-dialog`   |             | `any`                                                           | `undefined` |
| `domain`           | `domain`         |             | `any`                                                           | `undefined` |
| `entity`           | `entity`         |             | `string`                                                        | `undefined` |
| `gApi`             | `g-api`          |             | `any`                                                           | `undefined` |
| `gcApi`            | `gc-api`         |             | `any`                                                           | `undefined` |
| `gridId`           | `grid-id`        |             | `any`                                                           | `undefined` |
| `handleClose`      | --               |             | `Function`                                                      | `undefined` |
| `handleFormSubmit` | --               |             | `(name: string, isPrivate: number, isDefault: boolean) => void` | `undefined` |
| `open`             | `open`           |             | `boolean`                                                       | `undefined` |
| `refetchViews`     | --               |             | `() => void`                                                    | `undefined` |
| `tenant`           | `tenant`         |             | `string`                                                        | `undefined` |
| `title`            | `title`          |             | `string`                                                        | `undefined` |
| `user`             | `user`           |             | `any`                                                           | `undefined` |


## Dependencies

### Used by

 - [ambient-template-grid](../../grid/ambient-template-grid)

### Depends on

- [fluent-dialog](../../dialogs/fluent-dialog)
- [text-field](../../inputs/text-field)
- [stencil-toggle](../../inputs/toggle)

### Graph
```mermaid
graph TD;
  save-view-form-dialog --> fluent-dialog
  save-view-form-dialog --> text-field
  save-view-form-dialog --> stencil-toggle
  fluent-dialog --> unity-typography
  fluent-dialog --> custom-button
  text-field --> unity-typography
  stencil-toggle --> unity-typography
  ambient-template-grid --> save-view-form-dialog
  style save-view-form-dialog fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
