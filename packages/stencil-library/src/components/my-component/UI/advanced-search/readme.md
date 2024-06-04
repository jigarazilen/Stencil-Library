# advanced-search



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute     | Description | Type                                                                                    | Default     |
| ------------------------- | ------------- | ----------- | --------------------------------------------------------------------------------------- | ----------- |
| `fetchFilters`            | --            |             | `Function`                                                                              | `undefined` |
| `filterList`              | --            |             | `any[]`                                                                                 | `[]`        |
| `filterObjectsWithGroups` | --            |             | `FilterGroup[]`                                                                         | `[]`        |
| `filterRenderList`        | --            |             | `any[]`                                                                                 | `[]`        |
| `fullClearSearch`         | --            |             | `() => void`                                                                            | `undefined` |
| `handleAddNewFilter`      | --            |             | `(groupId: string, otherId: string) => void`                                            | `undefined` |
| `handleAddNewGroup`       | --            |             | `(groupId: string, logicalOperator: "AND" \| "OR") => void`                             | `undefined` |
| `handleDelete`            | --            |             | `(arg0: object) => void`                                                                | `undefined` |
| `handleGroupItemDelete`   | --            |             | `(filterGroupId: string) => void`                                                       | `undefined` |
| `handleItemClick`         | --            |             | `(item: { searchField: string; searchOperator: string; searchValue: string; }) => void` | `undefined` |
| `handleValueChanged`      | --            |             | `(event: CustomEvent<any>) => void`                                                     | `undefined` |
| `recentSearchesOptions`   | --            |             | `any[]`                                                                                 | `[]`        |
| `searchData`              | `search-data` |             | `any`                                                                                   | `undefined` |
| `selectRecentSearch`      | --            |             | `(e: any) => void`                                                                      | `undefined` |
| `updateLogicalOperator`   | --            |             | `(groupId: string, logicalOperator: "AND" \| "OR") => void`                             | `undefined` |


## Events

| Event                      | Description | Type               |
| -------------------------- | ----------- | ------------------ |
| `advancedSearchItemChange` |             | `CustomEvent<any>` |
| `searchItemChanged`        |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [ambient-template-grid](../grid/ambient-template-grid)

### Depends on

- [udp-selector](../selector)
- [stencil-icon-button](../buttons/icon-button)
- [search-list-item](../data-display/tree/tree-list-item/search-item)
- [custom-button](../buttons/icon-button/primary-button)
- [udp-function-button](../buttons/icon-button/function-button)
- [udp-grid-loader](../loaders/udp-grid-loader)
- [tree-list-item](../data-display/tree/tree-list-item)

### Graph
```mermaid
graph TD;
  advanced-search-grouped --> udp-selector
  advanced-search-grouped --> stencil-icon-button
  advanced-search-grouped --> search-list-item
  advanced-search-grouped --> custom-button
  advanced-search-grouped --> udp-function-button
  advanced-search-grouped --> udp-grid-loader
  advanced-search-grouped --> tree-list-item
  udp-selector --> unity-typography
  stencil-icon-button --> udp-ambient-tool-tip
  udp-ambient-tool-tip --> unity-typography
  search-list-item --> unity-typography
  search-list-item --> udp-selector
  search-list-item --> text-field
  search-list-item --> stencil-icon-button
  text-field --> unity-typography
  udp-grid-loader --> udp-skeleton-loading
  tree-list-item --> tree-list-item
  tree-list-item --> unity-typography
  tree-list-item --> status-chip
  tree-list-item --> udp-function-button
  status-chip --> unity-typography
  ambient-template-grid --> advanced-search-grouped
  style advanced-search-grouped fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
