# udp-forms-renderer



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute      | Description | Type                                         | Default     |
| ---------------- | -------------- | ----------- | -------------------------------------------- | ----------- |
| `apiUrlBase`     | `api-url-base` |             | `string`                                     | `null`      |
| `callbackUrl`    | `callback-url` |             | `string`                                     | `undefined` |
| `formId`         | `form-id`      |             | `string`                                     | `undefined` |
| `getAccessToken` | --             |             | `() => Promise<string>`                      | `undefined` |
| `isPublic`       | `is-public`    |             | `boolean`                                    | `false`     |
| `productId`      | `product-id`   |             | `number`                                     | `undefined` |
| `tenantId`       | `tenant-id`    |             | `string`                                     | `undefined` |
| `triggerAction`  | --             |             | `(actionId: string, params: Object) => void` | `undefined` |
| `unityUrl`       | `unity-url`    |             | `string`                                     | `undefined` |
| `version`        | `version`      |             | `number`                                     | `undefined` |


## Dependencies

### Depends on

- [stencil-form](../../form)
- [udp-ambient-card](../../../data-display/cards/udp-ambient-card)
- [unity-typography](../../../..)
- [udp-question](../udp-question)
- [custom-button](../../../buttons/icon-button/primary-button)

### Graph
```mermaid
graph TD;
  udp-forms-renderer --> stencil-form
  udp-forms-renderer --> udp-ambient-card
  udp-forms-renderer --> unity-typography
  udp-forms-renderer --> udp-question
  udp-forms-renderer --> custom-button
  udp-ambient-card --> udp-adornment
  udp-ambient-card --> unity-typography
  udp-ambient-card --> stencil-icon-button
  stencil-icon-button --> udp-ambient-tool-tip
  udp-ambient-tool-tip --> unity-typography
  udp-question --> stencil-field
  udp-question --> unity-typography
  stencil-field --> text-field
  stencil-field --> text-area
  stencil-field --> udp-selector
  stencil-field --> selectable-list
  stencil-field --> udp-time-selector
  stencil-field --> udp-datetime-selector
  stencil-field --> udp-date-selector
  stencil-field --> file-upload
  text-field --> unity-typography
  text-area --> unity-typography
  udp-selector --> unity-typography
  selectable-list --> unity-typography
  udp-time-selector --> unity-typography
  udp-datetime-selector --> unity-typography
  udp-date-selector --> unity-typography
  file-upload --> unity-typography
  file-upload --> custom-button
  file-upload --> stencil-icon-button
  style udp-forms-renderer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
