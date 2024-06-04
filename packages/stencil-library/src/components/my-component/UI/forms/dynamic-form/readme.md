# udp-dynamic-form



<!-- Auto Generated Below -->


## Methods

### `getFormData() => Promise<{ searchField: string; searchOperator: any; searchValue: any; groupId: number; }[]>`



#### Returns

Type: `Promise<{ searchField: string; searchOperator: any; searchValue: any; groupId: number; }[]>`




## Dependencies

### Depends on

- [udp-selector](../../selector)
- [file-upload](../../inputs/file-upload)
- [selectable-list](../../inputs/selectable-list)
- [text-field](../../inputs/text-field)

### Graph
```mermaid
graph TD;
  udp-dynamic-form --> udp-selector
  udp-dynamic-form --> file-upload
  udp-dynamic-form --> selectable-list
  udp-dynamic-form --> text-field
  udp-selector --> unity-typography
  file-upload --> unity-typography
  file-upload --> custom-button
  file-upload --> stencil-icon-button
  stencil-icon-button --> udp-ambient-tool-tip
  udp-ambient-tool-tip --> unity-typography
  selectable-list --> unity-typography
  text-field --> unity-typography
  style udp-dynamic-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
