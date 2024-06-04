import { LogicalSearchOperatorEnums, SearchGroupingType } from '../udp-grid-enums';
import { Search } from '../search/inquiry-search-datasource';

export const getSearchObject = (
    searchFilterElements,
    page,
    pageSize,
    eagerLoad = false,
    logicalSearchOperator = LogicalSearchOperatorEnums.And
  ) => {

    console.log('Incoming arguments SearchUtility', searchFilterElements);
    const searchObject: Search = {
      pageNumber: page || 1,
      pageSize: pageSize || 20,
      filterElements: [],
      orderElements: [],
      groupingType: '',
      groupProperty: [],
      groupOperationList: [],
      eagerLoad: eagerLoad,
      logicalSearchOperator: logicalSearchOperator,
    };
  
    if (searchFilterElements) {
      searchFilterElements.forEach(property => {
        const formattedPropertyName = property.searchField;
        searchObject.filterElements = searchFilterElements;
        // adds order elements
        if (property.sortDirection) {
          const orderElement = {
            sortColumn: formattedPropertyName,
            sortDirection: property.sortDirection,
          };
          searchObject.orderElements.push(orderElement);
        }
        if (property.distinct) {
          searchObject.groupingType = SearchGroupingType.Distinct;
          searchObject.groupProperty?.push(formattedPropertyName);
        }
      });
    }
  console.log('SearchUtility output', searchObject)
    return searchObject;
  };