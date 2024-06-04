export interface SearchFilters {
    searchField: string,
    searchValue: string,
    searchOperator: string,
    searchValueType?: number
  }
  
  export interface FilterObject {
    filterType: string,
    type: string,
    filter: string
  }
  
  export interface GroupOperation {
    operation: string, //i.e. SUM, AVG, COUNT, MIN, MAX
    property: string
  }
  
  export interface OrderElement {
    sortColumn: string,
    sortDirection: string
  }
  
  export interface Search {
    eagerLoad?: boolean,
    pageNumber: number,
    pageSize: number,
    groupingType?: string,
    groupProperty?: string[],
    groupOperationList?: GroupOperation[],
    orderElements: OrderElement[],
    filterElements: SearchFilters[],
    logicalSearchOperator?: number
  }