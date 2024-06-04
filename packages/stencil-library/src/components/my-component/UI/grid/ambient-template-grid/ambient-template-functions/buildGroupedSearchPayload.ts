export function buildSearchPayload(filterObjectsWithGroups) {
    let currentGroupId = 0;
  console.log('filterObjectsWithGroups', filterObjectsWithGroups);
    // Converts the search operator to its symbolic form
    const convertSearchOperator = (operator) => {
      switch (operator) {
        case 'equals':
          return '=';
        case '<>':
          return '<>'; // Assuming this is already the symbolic form
        case '=': // Added to handle cases where the operator might already be in symbolic form
          return '=';
        // Add more cases as needed
        default:
          return operator; // Default case returns the operator as is
      }
    };
  
    // Converts the logical operator to its numeric form
    const convertLogicalOperator = (logicalOperator) => {
      return logicalOperator === 'AND' ? 1 : 2; // Assuming only AND/OR are used
    };
  
    const filterElements = [];
    const filterGroups = [];
  
    const traverse = (filterObject, parentId = null) => {
      currentGroupId++;
      const groupId = currentGroupId;
  
      filterGroups.push({
        groupId,
        logicalSearchOperator: convertLogicalOperator(filterObject.logicalOperator),
        parentGroupId: parentId,
      });
  
      filterObject.filters.forEach(filter => {
        filterElements.push({
          searchField: filter.searchField,
          searchOperator: convertSearchOperator(filter.searchOperator),
          searchValue: filter.searchValue, // Ensure this is correctly accessing the searchValue
          groupId,
        });
      });
  
      filterObject.children?.forEach(child => {
        traverse(child, groupId);
      });
    };
  
    filterObjectsWithGroups.forEach(filterObject => traverse(filterObject));
  
    return {
      pageNumber: 1,
      pageSize: 20,
      filterElements,
      orderElements: [],
      groupingType: "",
      groupProperty: [],
      groupOperationList: [],
      eagerLoad: false,
      logicalSearchOperator: filterGroups.length > 0 ? filterGroups[0].logicalSearchOperator : 1, // Default to 1 if no groups
      type: "advanced",
      filterGroups,
    };
  }
  

  