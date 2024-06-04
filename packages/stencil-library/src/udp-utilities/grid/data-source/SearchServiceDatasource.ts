import { SearchGroupingType, SearchSortDirection } from "../udp-grid-enums";
import { FilterOperators } from "../models/udp-models";
import {trimStringAfter} from "../../string-utilities";
import {getSearchObject} from "../search/search-utilities";
 
  let rowGroups = [];

  export const SearchServiceDatasource = (
    queryData,
    gridUID,
    isRecentSearch,
    apiMethodId,
    searchFilterElements,
    logicalSearchOperator,
    accessToken, 
    tenantId,
    executeQuery,
    defaultFilterObject,
    onDataFetched,
    
  ) => {
    return {
      async getRows(params) {  
        console.log('Incoming arguments get rows',
        // queryData,
        gridUID,
        isRecentSearch,
        // apiMethodId,
         searchFilterElements,
         defaultFilterObject,
        //logicalSearchOperator,
        //accessToken, // Add accessToken as an argument
        //tenantId, // Add tenantId as an argument
        // executeQuery,
        // onDataFetched
        ); 
        const {
          startRow,
          endRow,
          rowGroupCols,
          groupKeys,
          // valueCols,
          filterModel,
          sortModel,
        } = params.request;
        const page = endRow / 20;
        const searchObject = getSearchObject(
          //searchFilterElements,
          [],
          page,
          null,
          false,
          logicalSearchOperator
        );
  
        // handle server-side sorting on ag-grid
        // const data = { data: searchObject, filterObject:searchFilterElements };
        // const response = await executeQuery(data, apiMethodId, accessToken, tenantId, searchFilterElements, defaultFilterObject, logicalSearchOperator);
        // console.log('early response', response.pageList)

        // if (response) {
        //   if (response?.pageList?.length > 0) {
        //     onDataFetched(response.pageList);
        //     params.success({
        //       rowData: response.pageList,
        //       rowCount: parseInt(response.total)
        //     });
        //   } else {
        //     params.success([], 0);
        //   }
        // }


        if (Array.isArray(sortModel) && sortModel.length > 0) {
          const orderElements = searchObject.orderElements || [];
          sortModel.forEach(sortItem => {
            if (sortItem && sortItem.colId) {
              const formattedPropertyName = trimStringAfter(
                sortItem.colId.charAt(0).toUpperCase() + sortItem.colId.slice(1),
                '_'
              );
              const element = orderElements.find(
                element => element.sortColumn === formattedPropertyName
              );
              if (element) {
                element.sortDirection = sortItem.sort.toUpperCase();
              } else {
                orderElements.push({
                  sortColumn: formattedPropertyName,
                  sortDirection: sortItem.sort.toUpperCase(),
                });
              }
            }
          });
        }
           

       

  
        // handle server-side filtering on ag-grid
        if (Object.keys(filterModel).length) {
          const filterElements = searchObject.filterElements || [];
          Object.keys(filterModel).forEach(key => {
            const filterItem = filterModel[key];
            const formattedPropertyName = trimStringAfter(
              key.charAt(0).toUpperCase() + key.slice(1),
              '_'
            );
            const element = filterElements.find(
              element => element.searchField === formattedPropertyName
            );
            if (element) {
              element.searchValue = filterItem.filter;
              element.searchOperator = FilterOperators[filterItem.type];
            } else {
              filterElements.push({
                searchField: formattedPropertyName,
                searchValue: filterItem.filter,
                searchOperator: FilterOperators[filterItem.type],
              });
            }
          });
        }
  
        // construct search for initial grouping
        if (rowGroupCols.length && !groupKeys.length) {
          const formattedPropertyName = trimStringAfter(
            rowGroupCols[0].field.charAt(0).toUpperCase() +
              rowGroupCols[0].field.slice(1),
            '_'
          );
          searchObject.groupingType = SearchGroupingType.Distinct;
          if (!searchObject.groupProperty.includes(formattedPropertyName)) {
            searchObject.groupProperty.push(formattedPropertyName);
  
            const orderElements = searchObject.orderElements || [];
            const element = orderElements.find(
              element => element.sortColumn === formattedPropertyName
            );
            if (!element) {
              orderElements.push({
                sortColumn: formattedPropertyName,
                sortDirection: SearchSortDirection.Asc,
              });
            }
          }
        }
  
        // construct the filter for grouped columns
  // Check if groupKeys is an array and has elements
if (Array.isArray(groupKeys) && groupKeys.length > 0) {
  // Check if the length of groupKeys is equal to the length of rowGroupCols
  if (groupKeys.length === rowGroupCols.length) {
      searchObject.groupingType = '';
      const filterElements = searchObject.filterElements || [];
      groupKeys.forEach((key, index) => {
          if (rowGroupCols[index]) {  // Ensure rowGroupCols[index] is not undefined
              const rowGroupCol = rowGroupCols[index];
              const formattedPropertyName = trimStringAfter(
                  rowGroupCol.field.charAt(0).toUpperCase() + rowGroupCol.field.slice(1),
                  '_'
              );
              const element = filterElements.find(
                  element => element.searchField === formattedPropertyName
              );
              if (element) {
                  element.searchValue = key;
                  element.searchOperator = '=';
              } else {
                  filterElements.push({
                      searchField: formattedPropertyName,
                      searchValue: key,
                      searchOperator: '=',
                  });
              }
          }
      });
  } else {
      // Construct search for the next grouped element
      groupKeys.forEach((key, index) => {
          if (rowGroupCols[index]) { // Ensure rowGroupCols[index] is not undefined
              const formattedPropertyNameForSearch = trimStringAfter(
                  rowGroupCols[index].field.charAt(0).toUpperCase() + rowGroupCols[index].field.slice(1),
                  '_'
              );

              searchObject.filterElements = searchObject.filterElements || [];
              searchObject.filterElements.push({
                  searchField: formattedPropertyNameForSearch,
                  searchValue: key,
                  searchOperator: '=',
              });
          }
      });

      searchObject.groupingType = SearchGroupingType.Distinct;
      if (groupKeys.length < rowGroupCols.length) {
          const rowGroupCol = rowGroupCols[groupKeys.length];
          if (rowGroupCol) { // Ensure rowGroupCol is not undefined
              const formattedPropertyName = trimStringAfter(
                  rowGroupCol.field.charAt(0).toUpperCase() + rowGroupCol.field.slice(1),
                  '_'
              );

              searchObject.groupProperty = searchObject.groupProperty || [];
              if (!searchObject.groupProperty.includes(formattedPropertyName)) {
                  searchObject.groupProperty.push(formattedPropertyName);

                  const orderElements = searchObject.orderElements || [];
                  const element = orderElements.find(
                      element => element.sortColumn === formattedPropertyName
                  );
                  if (!element) {
                      orderElements.push({
                          sortColumn: formattedPropertyName,
                          sortDirection: SearchSortDirection.Asc,
                      });
                  }
              }
          }
      }
  }
}

        if (
          !startRow &&
          rowGroupCols.length === 0 &&
          !sortModel.length &&
          !Object.keys(filterModel).length &&
          !groupKeys.length &&
          queryData
        ) {

          if (queryData.pageList && queryData.pageList) {
            params.successCallback(queryData.pageList, queryData.total);
          } else {
            // TODO: add an overlay to display no rows
            params.successCallback([], 0);
          }
        } else {
          let response = null;
          if (executeQuery) {

    

            function deepCopy(obj) {
              return JSON.parse(JSON.stringify(obj));
          }
          
          function mergeArrays(searchFilterElements, searchObject) {
              return searchFilterElements.map(element => {
                  let newElement = deepCopy(element);
                  for (const key in searchObject) {
                      if (Array.isArray(newElement[key]) && newElement[key].length === 0 && searchObject[key].length > 0) {
                          newElement[key] = deepCopy(searchObject[key]);
                      } else if (!Array.isArray(newElement[key]) && searchObject.hasOwnProperty(key)) {
                          newElement[key] = searchObject[key];
                      } 
                      else if (key === 'filterElements' && searchObject[key].length > 0 && newElement[key].length > 0 && rowGroupCols.length > 0) {
                          //If columnFiltering and grouping rows are present, then we need to merge the filter elements
                          const filteredElements = searchObject[key].filter(element => element.searchOperator === '=');
                          newElement[key] = newElement[key].concat(filteredElements);
                    }
                    
                  }
                  return newElement;
              });
          }
          rowGroups = rowGroupCols.map(group => group.field);
          const updatedSearchFilterElements = mergeArrays(searchFilterElements, searchObject);

          function saveSearch() {
            // Ignore if empty search
            if (updatedSearchFilterElements[0].filterElements.length == 0) { return }
        
            // Define the new search
            var newSearchObj = updatedSearchFilterElements[0];

            // Add Timestamp 
            const currentTimeStamp: number = Date.now();
            const formattedTimeStamp: string = new Date(currentTimeStamp).toLocaleString();

            // Get list of all search histories for all grids, we'll be replacing this entirely in localstorage 
            var recentSearches = localStorage.getItem("recentSearches") ? JSON.parse(localStorage.getItem("recentSearches")) : [];

            // Get search history specific to current grid
              // Find current grid 
              var currentGridSearchHistoryObj = recentSearches.find(item => item.gridUID === (gridUID || 'default_gridUID'));
              if (currentGridSearchHistoryObj) {
                // Update the searchHistory property of the found object
                currentGridSearchHistoryObj.searchHistory.unshift({ timestamp: formattedTimeStamp, searchObj: newSearchObj});
                // Limit length to 10
                if (currentGridSearchHistoryObj.searchHistory.length > 10) {
                  currentGridSearchHistoryObj.searchHistory = currentGridSearchHistoryObj.searchHistory.slice(0, 10);
                }
              } else {
                // If the gridUID is not found, create a new object
                recentSearches.push({ gridUID: gridUID, searchHistory: [  { timestamp: formattedTimeStamp, searchObj: newSearchObj} ] });
              }
              // Store the updated array back into localStorage
              localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
        }
        if (isRecentSearch == false) {
          saveSearch();
        } else (
          isRecentSearch = false
        )
          
            const data = { data: searchObject, filterObject:searchFilterElements };
            //response = await executeQuery(data, apiMethodId);
            // Pass accessToken and tenantId to executeQueryAdHoc
            response = await executeQuery(data, apiMethodId, accessToken, tenantId, updatedSearchFilterElements, defaultFilterObject, logicalSearchOperator);
          }
          //const rowData = response?.data;
          const rowData = response
          console.log('early response', rowData.pageList)
          console.log('filter object from SearchServiceDatasource', searchFilterElements[0].filterElements)


     

          function toCamelCase(str) {
            // Check if 'str' is a string
            if (typeof str === 'string') {
                return str.charAt(0).toLowerCase() + str.slice(1);
            } else {
                // Handle the case where 'str' is not a string
                return str;
            }
        }

        function rankData(rowData, filterObjects) {

          // If this is true then row grouping has been enabled and we need to hide values when row is collasped
          //by setting them to null
          if (searchObject.groupProperty.length > 0 && searchObject.groupProperty){
              const groupProps = searchObject.groupProperty.map(prop => prop.toLowerCase());
              rowData.forEach(row => {
                // Loop through each property in the row
                for (let prop in row) {

                  // Check if the property is not in the groupProperties since properties in groupProperties should not be NULL 
                  // but rather have its column hidden which is done in ambient-template-grid.tsx
                  if (!groupProps.includes(prop.toLowerCase())) {
                    // Set the property to null
                    row[prop] = null;
                }
                }
              });
          }

          console.log('rankData, rd', rowData)
          console.log('rankData filterObjects', filterObjects)
          return rowData.map(row => {
              let searchRank = 10;
        
              filterObjects.forEach(filter => {
                  const fieldName = toCamelCase(filter.searchField);
                  
                  // Check if the field exists in the row
                  if (row.hasOwnProperty(fieldName)) {
                    console.log('pass this test?  ', row.hasOwnProperty(fieldName))
                      // Check if the field is a string and compare with lowercase, else compare directly
                      if (typeof row[fieldName] === 'string') {
                        console.log('pass test 2', typeof row[fieldName] === 'string')
                          if (row[fieldName].toLowerCase() === filter.searchValue.toLowerCase()) {
                            console.log('pass test 3', row[fieldName].toLowerCase() === filter.searchValue.toLowerCase())
                              searchRank += 10;
                          }
                      } else if (row[fieldName] === filter.searchValue) {
                          searchRank += 10;
                      }
                  }
              });
        
              return { ...row, searchRank };
          });
        }
        

 
        const rowDataRanked = rankData(rowData.pageList, searchFilterElements[0].filterElements);
        
        console.log('rowDataRanked', rowDataRanked)



        //const rowDataRankedSorted = rowDataRanked.sort((a, b) => b.searchRank - a.searchRank); 




          // if (rowData) {
          //   if (rowData?.pageList?.length > 0) {
          //     onDataFetched(rowDataRankedSorted);
          //     params.success({
          //       rowData: rowDataRankedSorted,
          //       rowCount: parseInt(rowData.total)
          //     });
          //   } else {
          //     params.success([], 0);
          //   }
          // } 


          if (!rowData || rowData.pageList.length === 0) {
            // When there are no records, ensure the format aligns with AG-Grid's expectations:
            console.log('No data to display.');
            const event = new CustomEvent('noDataDetected', { detail: {} });
            document.dispatchEvent(event);
            params.success({ // Make sure to pass an object with rowData and rowCount
              rowData: [],
              rowCount: 0
            });
            onDataFetched([], 0); // Indicating no data
          } else {
            // Handle the normal case with data
            const rowDataRanked = rankData(rowData.pageList, searchFilterElements[0].filterElements);
            const rowDataRankedSorted = rowDataRanked.sort((a, b) => b.searchRank - a.searchRank); 
            onDataFetched(rowDataRankedSorted, parseInt(rowData.total));
            params.success({
              rowData: rowDataRankedSorted,
              rowCount: parseInt(rowData.total),
            });
            console.log('Data processed and sent to grid.');
          }
          
          
        }
      },
    };
  };

  export { rowGroups }
  