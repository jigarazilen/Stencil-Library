import { Component, Prop, State, Event, EventEmitter, h, Watch, forceUpdate } from '@stencil/core';
import { useTreeDatasource } from '../grid/conversionFunctions/conversionFunctions';
import { state } from '../../../../store/catalog-store';

@Component({
  tag: 'advanced-search',
  styleUrl: 'advanced-search.css',
  shadow: true,
})
export class AdvancedSearch {
  @Prop() filterList: any[] = [];
  @Prop() filterRenderList: any[] = [];
  @Prop() fetchFilters: Function; // Assuming this function is passed down as a prop correctly
  @Prop() handleItemClick: (item: { searchField: string, searchOperator: string, searchValue: string }) => void;
  @State() nestedData: Map<string, any[]> = new Map();
  @Prop() handleDelete: (arg0: object) => void;
  @Event() advancedSearchItemChange: EventEmitter;
  @Prop() handleValueChanged: (event: CustomEvent) => void;
  @State() searchObject: Array<any> = [];
  @State() tempNestedData: Map<string, any[]> = new Map(); 
  //@Prop() parentFilter?: string; 
  @State() testData: any[] = [];
  @State() showChildren: boolean = false;



componentWillLoad() {
  console.log('this.testData', this.testData)
}
 

@Watch('filterList')
filterListWatcher(newValue: any[], oldValue: any[]) {
  if (newValue !== oldValue) {
    this.testData = newValue;
    console.log('filterList has changed, updated testData', this.testData);
  }
}



handleReferenceClick = async (referenceValue: string, name: string, parentReference?: string, parentFilter?: string, parent?: string, parentPath?: string) => {
  console.log('Clicked reference:', referenceValue, 'Name:', name, 'Parent Reference:', parentReference, 'parentFilter', parentFilter, 'parent reference click test', parent, parentPath);

  if (state.isLoadingCatalogData || state.catalogData === null) {
      console.log('Catalog data is not ready yet.');
      return;
  }

  try {
    console.log('state.catalogData', state.catalogData)
    const extendedSearchFilterList = await useTreeDatasource(state.catalogData, referenceValue, true, true, name, parentFilter, parent);
      console.log('extendedSearchFilterList', extendedSearchFilterList);

      if (Array.isArray(extendedSearchFilterList)) {
        this.updateNestedData(extendedSearchFilterList);
      } else {
        console.error('Extended search filter list is not an array');
      }
      console.log('Updated nestedData:', Array.from(this.nestedData.entries()));
  } catch (error) {
      console.error('Error fetching filters:', error);
  }
};


updateNestedData = (children) => {
  if (!Array.isArray(children) || children.length === 0) {
    console.error('Invalid or empty children data provided for updateNestedData');
    return;
  }


  console.log('children in updatedNest', children);
  const fromFilter = children[0].extendedProperties.fromFilter;
  const parentName = children[0].extendedProperties.parent;

  const checkForName = fromFilter;
  
  const testParentArray = useTreeDatasource(state.catalogData, checkForName, true, true, name, '', '');
  console.log('testParentArray', testParentArray);

  if (testParentArray) {
    testParentArray.forEach(parentItem => {
      if (parentItem.name === parentName) {
        parentItem.referenceNode = children;
        console.log('add referenceNode array', children, testParentArray);
      } else if (parentItem.reference && parentItem.referenceNode) {
        this.updateNestedDataRecursively(parentItem.referenceNode, children, parentName);
      }
    });
  }

  // Helper function to check if an item is already present in the array
  const isItemPresent = (array, item) => array.some(existingItem => existingItem.name === item.name);

  // Recursive function to update the nested data
  const updateNestedDataHelper = (array, children, parentName) => {
    return array.map(item => {
      if (item.name === parentName) {
        // Filter out children that are already present before appending
        const newChildren = children.filter(child => !isItemPresent(item.referenceNode || [], child));
        return { ...item, referenceNode: [...(item.referenceNode || []), ...newChildren] };
      } else if (item.referenceNode) {
        return { ...item, referenceNode: updateNestedDataHelper(item.referenceNode, children, parentName) };
      } else {
        return item;
      }
    });
  };

  // Start the recursive update and assign it to testData
  this.testData = updateNestedDataHelper(this.testData, children, parentName);

  console.log('Updated testData', this.testData);
  forceUpdate(this); // Not generally recommended, use as a last resort
};



updateNestedDataRecursively = (nestedArray, children, parentName) => {
  nestedArray.forEach(item => {
    if (item.name === parentName) {
      item.referenceNode = children;
    } else if (item.referenceNode) {
      this.updateNestedDataRecursively(item.referenceNode, children, parentName);
    }
  });
};


private onTreeListItemClick = (event: CustomEvent<{ searchField: string, searchOperator: string, searchValue: string, parentName?: string, parent?: string, parentPath?: string }>) => {
  const detail = event.detail;
  
  // Function to convert string to PascalCase
  const toPascalCase = (str) => {
    return str.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('.');
  };

  // Check if both parentName and parentPath are present
  if (detail.parentName && detail.parentPath) {
    detail.searchField = `${detail.parentPath}.${detail.parentName}.${detail.searchField}`;
  } else if (detail.parentName) {
    // If only parentName is present, exclude parentPath
    detail.searchField = `${detail.parentName}.${detail.searchField}`;
  } else {
    // No parentName or parentPath, use searchField as is
    detail.searchField = `${detail.searchField}`;
  }

  // Convert searchField to PascalCase
  detail.searchField = toPascalCase(detail.searchField);

  this.handleItemClick(detail); // Perform the search with the modified search object
};

render() {
  const safeTestData = Array.isArray(this.testData) ? this.testData : [];
  const safeFilterRenderList = Array.isArray(this.filterRenderList) ? this.filterRenderList : [];

  return (
    <div class="container">
      <div class="left-column">
        {!safeTestData.length && <div style={{ marginRight: '8px' }}><udp-grid-loader width="362px" num-columns="1" num-rows="20"></udp-grid-loader></div>}
        <div>
          {safeTestData.map((filter, index) => (
            <tree-list-item
              key={`${filter.name}-${index}`}
              level={0}
              label={filter.name}
              reference={filter.reference}
              parentName=""
              parentFilter={filter.extendedProperties.parentFilter}
              parentPath={'filter.extendedProperties.parentPath'}
              parent={filter.extendedProperties?.parent}
              nestedItems={filter.referenceNode}
              onReference-clicked={(event: CustomEvent<{ reference: string, name: string, parentReference?: string, parentFilter?: string, parent?: string, parentPath?: string }>) =>
                this.handleReferenceClick(event.detail.reference, event.detail.name, event.detail.parentReference, event.detail.parentFilter, event.detail.parent, event.detail.parentPath)}
              onItemClick={this.onTreeListItemClick}
            >
            </tree-list-item>
          ))}
        </div>
      </div>
      <div class="right-column">
        <udp-page-header onValueChanged={this.handleValueChanged}></udp-page-header>
        <filter-conditions></filter-conditions>
        {safeFilterRenderList.map((filter) =>
          filter.filterElements.map((item, index) => (
            <search-list-item
              key={`${item.searchField}-${index}`}
              label={item.searchField}
              handleDelete={() => this.handleDelete({"searchField": item.searchField, "searchValue": item.searchValue })}
              name={item.searchValue}
            />
          ))
        )}
      </div>
    </div>
  );
}
}

