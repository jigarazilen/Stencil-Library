# search-list-item



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute  | Description | Type                          | Default     |
| -------------- | ---------- | ----------- | ----------------------------- | ----------- |
| `groupId`      | `group-id` |             | `string`                      | `undefined` |
| `handleDelete` | --         |             | `(event: MouseEvent) => void` | `undefined` |
| `label`        | `label`    |             | `string`                      | `undefined` |
| `name`         | `name`     |             | `string`                      | `undefined` |
| `operator`     | `operator` |             | `string`                      | `undefined` |


## Events

| Event               | Description | Type               |
| ------------------- | ----------- | ------------------ |
| `searchItemChanged` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [advanced-search](../../../../advanced-search)
 - [advanced-search-grouped](../../../../advanced-search)

### Depends on

- [unity-typography](../../../../..)
- [udp-selector](../../../../selector)
- [text-field](../../../../inputs/text-field)
- [stencil-icon-button](../../../../buttons/icon-button)

### Graph
```mermaid
graph TD;
  search-list-item --> unity-typography
  search-list-item --> udp-selector
  search-list-item --> text-field
  search-list-item --> stencil-icon-button
  udp-selector --> unity-typography
  text-field --> unity-typography
  stencil-icon-button --> udp-ambient-tool-tip
  udp-ambient-tool-tip --> unity-typography
  advanced-search --> search-list-item
  advanced-search-grouped --> search-list-item
  style search-list-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
