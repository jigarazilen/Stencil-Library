import { Component, Prop, State, Event, EventEmitter, h, Watch, forceUpdate, Element } from '@stencil/core';
import { useTreeDatasource } from '../grid/conversionFunctions/conversionFunctions';
import { state } from '../../../../store/catalog-store';
import Close24 from '@carbon/icons/es/close/24';

export type FilterElement = {
  id: string; // Unique identifier
  searchField: string;
  searchOperator: string;
  searchValue: string;
  uniqueId: string;
  otherId: string;
};

export type FilterGroup = {
  id: string; // Unique identifier for the group
  logicalOperator: 'AND' | 'OR';
  filters: FilterElement[];
  children: FilterGroup[];
};


@Component({
  tag: 'advanced-search-grouped',
  styleUrl: 'advanced-search.css',
  shadow: true,
})
export class AdvancedSearchGrouped {
  @Prop() filterList: any[] = [];
  @Prop() filterRenderList: any[] = [];
  @Prop() fetchFilters: Function; // Assuming this function is passed down as a prop correctly
  @Prop() handleItemClick: (item: { searchField: string, searchOperator: string, searchValue: string }) => void;
  @State() nestedData: Map<string, any[]> = new Map();
  @Prop() handleDelete: (arg0: object) => void;
  @Prop() handleGroupItemDelete: (filterGroupId: string) => void;

  @Event() advancedSearchItemChange: EventEmitter;
  @Prop() handleValueChanged: (event: CustomEvent) => void;
  @State() searchObject: Array<any> = [];
  @State() tempNestedData: Map<string, any[]> = new Map(); 
  //@Prop() parentFilter?: string; 
  @State() testData: any[] = [];
  @State() showChildren: boolean = false;
  @Element() el: HTMLElement;
  @State() filterGroups: FilterGroup[] = [];
  //@State() filterObjectsWithGroups: FilterGroup[] = [];
  @Prop() filterObjectsWithGroups: FilterGroup[] = []
  @State() disable: boolean = true;
  @Prop() searchData: any;
  @Prop() updateLogicalOperator: (groupId: string, logicalOperator: 'AND' | 'OR') => void;

  @Prop() handleAddNewFilter: (groupId: string, otherId: string) => void;
  //@Prop() handleAddNewGroup: (groupId: string) => void;
  @Prop() handleAddNewGroup: (groupId: string, logicalOperator: 'AND' | 'OR') => void;
  @State() sharedId: string = '';

  //@Event({ bubbles: true, composed: true }) searchItemChanged: EventEmitter;
  @Event() searchItemChanged: EventEmitter; 

  @State() filters: Array<{
    id: string,
    groupId: string,
    searchField: string,
    searchOperator: string,
    searchValue: string
  }> = [];

  @Prop() recentSearchesOptions: any[] = [];
  @Prop() selectRecentSearch: (e: any) => void;
  @Prop() fullClearSearch: () => void; 

componentWillLoad() {
  console.log('this.testData x', this.testData)
  this.initializeFilterGroups();
  this.generateSharedId()
}
 

private initializeFilterGroups() {
  this.filterObjectsWithGroups
}


@Watch('filterList')
filterListWatcher(newValue: any[], oldValue: any[]) {
  if (newValue !== oldValue) {
    this.testData = newValue;
    console.log('filterList has changed, updated testData', this.testData);
  }
}

@Watch('filterObjectsWithGroups')
filterObjectsWithGroupsChanged(newValue: FilterGroup[], oldValue: FilterGroup[]) {
  if (newValue !== oldValue) {
    console.log('filterObjectsWithGroups has been updated externally');
    // React to the change as necessary, e.g., re-initialize certain state based on the new prop value
  }
}


// // Ensure you have a method to generate unique IDs
generateUniqueId() {
  // Example implementation (consider a more robust approach for production use)
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

generateSharedId() {
   //this.sharedId = '8888888'; 
   this.sharedId =  'id-' + Math.random().toString(36).substr(2, 9);
 // return 'id-' + Math.random().toString(36).substr(2, 9);
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


private onTreeListItemClick = (event: CustomEvent<{ searchField: string, searchOperator: string, searchValue: string, parentName?: string, parent?: string, parentPath?: string, id?:string }>) => {
  const detail = event.detail;
  console.log('Tree list item clicked in grouped:', detail);
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
  this.disable = true;
};

private selectorOptions = [
  {
    value: '1',
    label: 'AND'
  },
  {
    value: '2',
    label: 'OR'
  }

];


updateFilterWithUserData(uniqueId: string, userData: { searchField: string, searchOperator: string, searchValue: string }) {
  const updatedFilters = this.filters.map(filter => 
    filter.id === uniqueId ? {...filter, ...userData} : filter
  );
  this.filters = updatedFilters; // Update the state with the modified filters array
}



updateGroupLogicalOperator(groupId: string, newLogicalOperator: 'AND' | 'OR') {
  const updateOperatorInNode = (nodes: any[], nodeId: string, newOperator: 'AND' | 'OR') => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        node.logicalOperator = newOperator; // Update the operator
        return true;
      }
      if (node.children && updateOperatorInNode(node.children, nodeId, newOperator)) {
        return true; // Operator updated in a deeper level
      }
    }
    return false; // Node not found
  };

  // Attempt to update the operator in the node
  if (updateOperatorInNode(this.filterObjectsWithGroups, groupId, newLogicalOperator)) {
    // If the update was successful, trigger a state update
    this.filterObjectsWithGroups = [...this.filterObjectsWithGroups];
  }
}


handleSearchItemChange(event: CustomEvent) {
  const { searchField, searchOperator, searchValue, groupId } = event.detail;

  // Find the group and update the operator
  const group = this.filterObjectsWithGroups.find(g => g.id === groupId);
  if (group) {
    const filter = group.filters.find(f => f.searchField === searchField && f.searchValue === searchValue);
    if (filter) {
      filter.searchOperator = searchOperator;
      this.filterObjectsWithGroups = [...this.filterObjectsWithGroups]; // Trigger re-render
    }
  }

  // Re-emit the event for any other components or logic that depend on this
  this.searchItemChanged.emit(event.detail);
  console.log('searchItemChanged event emitted:', event.detail);
}



private handleOperatorSelected(event: CustomEvent, filterGroupId: string) {
  const selectedOptionValue = event.detail.value; // Assuming this is '1' for AND, '2' for OR
  const newLogicalOperator = selectedOptionValue === '1' ? 'AND' : 'OR';

  console.log(`Selected option: ${selectedOptionValue} (converted to ${newLogicalOperator}) from filter group: ${filterGroupId}`);

  // Call the updateLogicalOperator prop function passed from the parent component
  this.updateLogicalOperator(filterGroupId, newLogicalOperator);
}


currentLogicalOperator: 'AND' | 'OR' = 'AND';

private renderFilterGroup(filterGroup: FilterGroup, level: number = 0) {
  const paddingStyle = { 'padding-left': `${20 * level}px` };
 
  return (
    <div class={filterGroup.id !== "root" && 'filter-group'} style={paddingStyle}>
      <div style={{marginBottom: '16px'}} >
        <div style={{display: 'flex', gap: '8px'}}>
        <udp-selector
          large
          options={this.selectorOptions}
          onOptionSelected={(event: CustomEvent) => this.handleOperatorSelected(event, filterGroup.id)}
          defaultOption={filterGroup.logicalOperator === 'AND' ? '1' : '2'}
        ></udp-selector>
       {filterGroup.id !== "root" && <stencil-icon-button icon={Close24}  onClick={() => this.handleGroupItemDelete(filterGroup.id)}  ></stencil-icon-button>}
      
        </div> 
      
      </div>
      <div class="search-input-list" >
      {filterGroup.filters.map((filter, index) => (
        // console.log('filter in ASG', filter.searchOperator),
        <search-list-item
          key={`${filter.id}-${index}`}
          label={filter.searchField}
          handleDelete={() => this.handleDelete(filter)}
          name={filter.searchValue}
          operator={filter.searchOperator}
          groupId={filter.otherId} 
          onSearchItemChanged={(event) => this.handleSearchItemChange(event)}
        />
      ))}
      </div>
      <div style={{display: 'flex', gap: '8px', marginTop: '8px'}} >
        <custom-button variant='outline'  onClick={() => this.addFilter(filterGroup.id)}>+ Field</custom-button>
        <custom-button variant='outline'   onClick={() => this.handleAddNewGroup(filterGroup.id, this.currentLogicalOperator)}>+ Group</custom-button>
      </div>
      <div class="nested-groups">
        {filterGroup.children?.map(childGroup => this.renderFilterGroup(childGroup, level + 1)) || []}
      </div>
    </div>
  );
}

private addFilter(groupId: string) {
  console.log('Adding filter...');
  this.disable = false;
  // Use the generated uniqueId for the new filter
  const uniqueId = this.generateUniqueId(); // Assuming this method generates a unique ID
  if (this.handleAddNewFilter) {
    // Replace 'matchingTreeId' with the actual uniqueId generated above
    this.handleAddNewFilter(groupId, uniqueId);
  }

  const newFilterPlaceholder = {
    id: uniqueId,
    groupId: groupId,
    searchField: '', // Initial placeholder for the search field
    searchOperator: '=', // Default or initial placeholder for the search operator
    searchValue: '', // Initial placeholder for the search value
  };
  this.filters = [...this.filters, newFilterPlaceholder];
}


render() {
  const safeTestData = Array.isArray(this.testData) ? this.testData : [];
  //const safeFilterRenderList = Array.isArray(this.filterRenderList) ? this.filterRenderList : [];
 
  return (
    <div class="container">
      <div class="left-column">

        {this.selectRecentSearch !== null && this.fullClearSearch !== null && <div class="recent-searches">
            Recent Searches
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <udp-selector
              options={this.recentSearchesOptions}
              onOptionSelected={(e) => this.selectRecentSearch(e)}
              style={{ marginRight: '10px' }}
            ></udp-selector>
            <udp-function-button delete onClick={this.fullClearSearch}></udp-function-button>
            </div>
        </div>}

        {!safeTestData.length && <div style={{ marginRight: '8px' }}><udp-grid-loader width="362px" num-columns="1" num-rows="20"></udp-grid-loader></div>}
        <div>
          {safeTestData.map((filter, index) => (
            <tree-list-item
              add={true}
              showAdd={true}
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
       
{this.filterObjectsWithGroups.map((group) => this.renderFilterGroup(group))}
    </div>
      {/* <div style={{width: '411px', height: '715px', background: 'white', position: 'absolute', zIndex: '9', top: '63px', left: '15px'}} ></div> */}
      { this.disable &&  <div style={{width: '411px', height: '100vh', background: 'white', position: 'absolute', zIndex: '9', top: '45px', left: 'px', opacity: '0.7'}} ></div>}
    </div>
  );
}
}

