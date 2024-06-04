# udp-question



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type                                                                                        | Default     |
| ---------------- | ----------------- | ----------- | ------------------------------------------------------------------------------------------- | ----------- |
| `question`       | --                |             | `Question`                                                                                  | `undefined` |
| `questionNumber` | `question-number` |             | `number`                                                                                    | `undefined` |
| `styleOverrides` | --                |             | `{ helperText: FontOverrides; questionText: FontOverrides; paragraphText: FontOverrides; }` | `undefined` |
| `value`          | `value`           |             | `string`                                                                                    | `undefined` |


## Dependencies

### Used by

 - [udp-forms-renderer](../udp-forms-renderer)

### Depends on

- [stencil-field](../../form)
- [unity-typography](../../../..)

### Graph
```mermaid
graph TD;
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
  stencil-icon-button --> udp-ambient-tool-tip
  udp-ambient-tool-tip --> unity-typography
  udp-forms-renderer --> udp-question
  style udp-question fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
