import { Component, Element, h, State, Prop, Event, EventEmitter, Watch, Listen, Method } from '@stencil/core';
import { state } from '../../../../../store/catalog-store';
import { GridOptions } from 'ag-grid-community';
import CustomRenderer from '../../../../my-component/UI/grid/renderers/custom-renderer';
import CustomActionsRenderer from '../../../../my-component/UI/grid/renderers/custom-actions-renderer';
import Asterisk16 from '@carbon/icons/es/asterisk/16'; 
import { SearchServiceDatasource, rowGroups } from '../../../../../udp-utilities/grid/data-source/SearchServiceDatasource';
import { convertToAgGridColumns } from '../../../../../udp-utilities/grid/convertToAgGridColumns';
import { getSelectedView, 
        getAvailableViews, 
        saveView, 
        updateView,
        getAvailableGridActions, 
        // getProductList, 
        getInstanceAndMethod, 
        getPromotedLookupMethod,  
        executeQueryAdHocAndMapLookups, 
        executeQueryWithParameters,  
        executeGridAction, 
        getApiCatalogAndProduct, 
        getApiCatalogById, 
        executeQueryAdHoc,
        getAllHotlists,
        createAHotlist,
        deleteAHotlist,
        addRecordToAHotlist,
        loadAHotlist,
        removeRecordFromHotlist,
        deleteSelectedView
      } from '../../../../../udp-utilities/api-udp/apiUtils';
import { UdpGridColumnDefs, useTreeDatasource } from '../conversionFunctions/conversionFunctions' 
import '../../../../my-component/ag-grid.css'
import EmailCellRenderer from '../renderers/email-cell-renderer';
import OpenFunctionCellRenderer from '../renderers/open-function-cell-renderer';
import HotListAddRenderer from '../renderers/hot-list-add-renderer';
import { SharedContext } from '../renderers/sharedContext';
import HoverContentCellRenderer  from '../renderers/hover-content-cell-renderer';
import { GridStateTypeEnums } from './enums/gridEnums'
import { SearchObject, FilterDetail, HotListObject } from './interfaces/gridInterfaces';
import {transformSearchData, createStructuredQuery } from  '../../../../../udp-utilities/grid/data-converters/transformSearchData'
import { LicenseKey } from './license/licenseKey';
import { buildSearchPayload } from './ambient-template-functions/buildGroupedSearchPayload'
// import { FilterElement } from '../../advanced-search/advanced-search-grouped';
import * as localforage from 'localforage';
import '../../../../../global/app.css';
import Menu16 from '@carbon/icons/es/menu/16';
import close16 from '@carbon/icons/es/close/16';
// import OverflowMenuHorizontal16 from '@carbon/icons/es/overflow-menu--horizontal/16';
import DateTimeCellRenderer from '../renderers/date-time-cell-renderer';
import { RenderConfig } from './interfaces/gridInterfaces';


type NotificationStatus = 'error' | 'success' | 'warning';





@Component({
  tag: 'ambient-template-grid',
  styleUrl: 'ambient-template-grid.css',
  shadow: true
})
export class AmbientTemplateGrid {
   private prevPivotMode: boolean;
   //private dynamicFormRef: HTMLUdpDynamicFormElement;

  @Event() viewSaved: EventEmitter;
  @Event() externalEmitter: EventEmitter;
  @Element() el: HTMLElement;
  
  @Prop() columnDefs: any[] = [];
  @Prop() fullViewData: any = {};
  @Prop() productId: number = 0;
  @Prop() rowData: any[] = [];
  @Prop() viewListrowData: any[] = [];
  @Prop() gridState: any[] = [];
  @Prop() gridId: string = "";
  @Prop() apiCatalogId: string = "";
  @Prop() userId: string = "";
  @Prop() apiMethodId: string = "";
  @Prop() menuItems: Array<any> = [];
  @Prop() gridBarTitle: string = "";
  @Prop() viewChips: Array<any> = [];
  @Prop() additionalFilterChips: Array<any> = [];
  @Prop() kpiValues: Array<any> = [];
  @Prop() tenantId: string = "";
  @Prop() showAdvancedSearchFeature: boolean = true;
  @Prop() showFilterColumnFeature: boolean = true;
  @Prop() queryId: string = "";
  @Prop() accessToken: string;
  @Prop() defaultSearchObject: Array<any> = [];
  @Prop() actionId: string = '';
  @Prop() cellClickHandler: (value: any, callback: any) => void;
  @Prop() cellClickHandlerX: (value: any, callback: any) => void;
  @Prop() viewActionClickHandler: (value: any, callback: any) => void;
  @Prop() renderConfigs: RenderConfig[] = [];
  // @Prop() externalPayload: any = {}; // check to see if it fixes the issue with adding an empty object
  @Prop() externalPayload: any = null;
  @Prop() dataEmitter: any = {}
  @Prop() dataEmitterRequest: any = {}
  @Prop() fitGrid: string = ''
  @Prop() hotListIdentifier: string = "";
  @Prop() searchKey: Object = {};
  @Prop({ mutable: true }) filterObject: Array<any> = [
    {
      "pageNumber": 1,
      "pageSize": 20,
      "filterElements": [],
      "orderElements": [],
      "groupingType": "",
      "groupProperty": [],
      "groupOperationList": [],
      "eagerLoad": false,
      "logicalSearchOperator": 2,
      "type": "advanced"
    }
  ];
  @Prop({ mutable: true }) externalSearchFilter: Array<any> = [];
  @Prop() noResults: boolean = false;
  @Prop() maxChipsAllowed: number = 5;
  @Prop() suppressMenuHide: boolean = true; // default show column menu option without hovering
  @Prop() showRank: boolean = false;
  @Prop() showHotlistButton: boolean = false;
  @Prop() columnNames: { [key: string]: string } = {};
  @Prop() buttonTransform: string = '';

  @State() drawerOpen: boolean = false;
  @State() filterPanelOpen: boolean = true;
  @State() saveDialogOpen: boolean = false; 
  @State() editDialogOpen: boolean = false; 
  @State() gridOptionsDrawerOpen: boolean = false;
  @State() viewListGridOptions: GridOptions;
  @State() filterChips: Array<any> = []
  @State() promotedEntity: any = {}
  @State() isServerSide: boolean = true; 
  @State() showNotification: boolean = false;
  @State() notificationMessage: string = '';
  @State() notificationStatus: NotificationStatus = 'success';
  @State() loadedView: Array<any> = [];
  @State() loadedViewTitle: string = '';
  @State() loadedViewData: string = '';
  @State() currentColumnOrdering: Array<any> = [];
  @State() rowsSelected: boolean = false;
  @State() selectedRowCount: number = 0;
  @State() serverColumnDefs: Array<any> = [];
  @State() isSetupComplete: boolean = false;
  @State() extendedSearchFilterList: Array<any> = [];
  @State() viewListRowData: Array<any> = []
  @State() bulkActions: Array<any> = [];
  @State() sheetContent: string = 'advancedSearch';
  @State() searchObject: SearchObject = { filterElements: [] };
  @State() configuredColumnDefs: Array<any> = []
  @State() filterOn: string = '';
  @State() gridOptions: GridOptions;
  @State() tempSearchObject: { searchField: string, searchOperator: string, searchValue: any, groupId: number } = {
    searchField: '',
    searchOperator: '',
    searchValue: '',
    groupId:1
  };
  @State() catalogList: any = {}
  @State() dataRowClicked: any = {}
  @State() advancedSearchFilterList: Array<any> = [];
  @State() allHotlists: Array<any> = [];
  @State() externalToggle: string = '';
  @State() viewId: string = '';
  @State() defaultFilterObject: Array<any> = [
    {
      "pageNumber": 1,
      "pageSize": 20,
      "filterElements": [
      //   {
      //     "searchField": "genderCode",
      //     "searchOperator": "=",
      //     "searchValue" : "1"
      // }
      ],
      "orderElements": [],
      "groupingType": "",
      "groupProperty": [],
      "groupOperationList": [],
      "eagerLoad": false,
      "logicalSearchOperator": 1,
      "type": "advanced"
  }
  ]
  
  @State() filterRenderList: Array<any> = [
    {
      "pageNumber": 1,
      "pageSize": 20,
      "filterElements": [
       
      //   {
      //     "searchField": "Title",
      //     "searchOperator": "IN",
      //     "searchValue": "VP"
      // }
      ],
      "orderElements": [],
      "groupingType": "",
      "groupProperty": [],
      "groupOperationList": [],
      "eagerLoad": false,
      "logicalSearchOperator": 1,
      "type": "advanced"
  }
  ];
  @State() logicalSearchOperator: number = 1;
  @State() lookupsMap: any = null;  
  @State() transformedOptions: { label: string; value: string }[] = [];
  @State() advancedDrawerOpen: boolean = false;
  @State() viewDrawerOpen: boolean = false;
  @State() hotlistDrawerOpen: boolean = false;
  @State() customSearchDrawerOpen: boolean = false;
  @State() businessObjectKey: string;
  @State() hotListActive: string;
  @State() hotListId: string;
  @State() showHotlistForm: boolean = false;
  @State() confirmDialog: boolean = false;
  @State() confirmDialogDeleteView: boolean = false;
  @State() filteredCount: Array<any> = [];
  @State() hotlistSelectedFull: object = {};
  @State() advancedGroupSearchNodeId: string = '';
  @State() otherId: string = '';
  @State() updateForConfiguredColumnDefs: boolean = true;
  @State() filterObjectsWithGroups: Array<any> = [
    {
      id: 'root',
      logicalOperator: 'AND',
      filters: [

      ]
    }
  ]
 @State() loadedGridView: object = {};
 @State() linearLoading: boolean = false;
 @State() selectedGridId: string = '';
 @State() selectedViewName: string = '';
 @State() selectedViewIsDefault: boolean = false;
 @State() selectedViewGridViewVisibilityTypeId: number;
 @State() allFilters: Array<any> = [];
 @State() visibleChips: any[];
 @State() overflowChips: any[];
 @State() overflowActive: boolean = false;
 @State() setSearchStart: boolean = false;
 @State() refreshChips: boolean = false;
 @State() gridUID: string = "";
 @State() recentSearches: any[] = [];
 @State() recentSearchesOptions: any[] = [];
 @State() isRecentSearch: boolean = false;
 @State() nativeFilterInput: boolean = false;

testUIMetaData =  this.filterObjectsWithGroups = [
    {
      id: 'root',
      logicalOperator: 'AND',
      filters: [

      ]
    }
  ]

  
  @Event() selectedIdsChanged: EventEmitter<number[]>;

  @Listen('noDataDetected', { target: 'document' })
  noDataHandler() {
    this.linearLoading = false;
    this.noResults = true
    
  }

  @Watch('accessToken')
  accessTokenChanged(newValue: string) {
    if (newValue) {
      localStorage.setItem('accessToken', newValue);
    }
  }

  @Watch('columnDefs')
  watchColumnDefs(newValue: any) {
  console.log('columnDefs changed to:', newValue);
}

  @Watch('rowData')
  watchRowData(newValue: any) {
    console.log('rowData changed to:', newValue);
  } 

  @Watch('catalogList')
  watchHandler(newVal: any, _oldVal: any) {
    if (newVal) {
      this.filterByCatalogObjectName(localStorage.getItem('entityName'));  
    }
  }

  defaultColumnState = null;
  boundOnResize: any;
  viewListcolumnDefs: any[];

  

  

async filterByCatalogObjectName(catalogObjectName: string) {
  if (!this.catalogList) {
    console.warn('catalogList is empty or undefined.');
    return;
  }
// change to list from UdpGridColumnDefs
  const catalogObjectList = this.catalogList?.ctlg?.catalogObjectList;
  console.log('catalogObjectList', catalogObjectList)
  if (Array.isArray(catalogObjectList)) {
    catalogObjectList.forEach((object) => {
      if (object.catalogObjectName === catalogObjectName) {
        const names = object.properties.map((property) => {          
          return { name: property.name };
        });
        this.advancedSearchFilterList = names;
      }
    });
  } else {
    console.warn('catalogObjectList is not an array or is undefined.');
  }
}


getExtendedAdvancedSearchFilterList = async (filter) => {
  const accessToken = this.accessToken;

  // Function to wait for apiCatalogId to be available in localStorage
  const waitForApiCatalogId = () => {
    return new Promise<string>((resolve) => {
      const checkInterval = setInterval(() => {
        const apiCatalogId = localStorage.getItem('apiCatalogId');
        if (apiCatalogId) {
          clearInterval(checkInterval);
          resolve(apiCatalogId);
        }
      }, 100); // checks every 100 milliseconds
    });
  };

  console.log(filter)
  try {
    const apiCatalogId = await waitForApiCatalogId();
    let apiCatalogData: any;
    
    // Retrieve apiCatalogData from localForage or make the API call if not found
    apiCatalogData = await localforage.getItem('apiCatalogData');
    if (!apiCatalogData) {
      // Fetch data from the API if not available in localForage
      apiCatalogData = await getApiCatalogById(apiCatalogId, accessToken);
      console.log('apiCatalogData fetched from API:', apiCatalogData);
      // Store the fetched data in localForage for future use
      await localforage.setItem('apiCatalogData', apiCatalogData);
    }

    const transformedData = useTreeDatasource(apiCatalogData, localStorage.getItem('entityName'), true, true, '', '', '');

    if (transformedData) {
      state.catalogData = apiCatalogData;
      this.extendedSearchFilterList = transformedData;
     
    } else {
      console.error('No data returned from useTreeDatasource');
    }
  } catch (error) {
    console.error('Error fetching API Catalog:', error);
  }
};



  constructor() {
    this.changeOperator = this.changeOperator.bind(this);
  }


showCatalogDataTest = () => {
  console.log('state.catalogData', state.catalogData)
}

  @Method()
  async updateFilterAndFetch(newFilter: Array<any>) {
    this.filterObject = [
      {
        "pageNumber": 1,
        "pageSize": 20,
        "filterElements": [...newFilter],
        "orderElements": [],
        "groupingType": "",
        "groupProperty": [],
        "groupOperationList": [],
        "eagerLoad": false,
        "logicalSearchOperator": 2,
        "type": "advanced"
      }
    ];

    // Now call updateServerSideDatasource
    this.updateServerSideDatasource('', 'updateFilterAndFetch');
  }

  
  componentWillLoad() {
    if (this.accessToken) {
      localStorage.setItem('accessToken', this.accessToken);
    }

    localStorage.setItem('tennatId', this.tenantId);
    localStorage.setItem('productId', `${this.productId}`);

    this.gridUID = this.gridId + '-' + this.queryId;

    this.handleAdditionalSetup();

    this.filterObject[0].filterElements = [...this.externalSearchFilter];

    this.boundOnResize = this.onResize.bind(this);

    this.viewListcolumnDefs =  [
      {
        headerName: 'Name',
        field: 'name',
        resizable: true, // Enable resizing
        height: 100
      },
      {
        field: 'gridViewVisibilityTypeId',
        cellRenderer: CustomRenderer,
        height: '100px'
      },
      {
        headerName: 'Actions',
        field: 'gridViewId',
        cellRenderer: CustomActionsRenderer,
        cellRendererParams: {
          onClick: this.handleButtonClick,
        },
      }
    ];

    
  // Load the ag-Grid script
  this.loadAgGridScript()
  .then(() => {
    // Set the ag-Grid license key
    this.setAgGridLicenseKey();
    // Initialize the ag-Grid
    this.initializeGrid();
  })
  .then(() => {
    // Update the server-side datasource
    this.updateServerSideDatasource('', 'initialLoad');
  })
  .catch(error => {
    console.error('Error during grid initialization:', error);
  });

  // handleHotListAddHandler(otherCellValue) {
  //   console.log(otherCellValue)
  // }

    // this.handleAdditionalSetup();
    //this.fetchDataForViews()
    //this.transformBulkActions()
    //this.handleGetAllHotlists()
    
    // Grab list of recent searches from local storage
    this.getRecentSearches()
  }
// CWL Ends
  
  @Watch('promotedEntity')
  @Watch('isServerSide')
  @Watch('configuredColumnDefs')

configuredColumnDefsChanged(newValue: any ) {
  if (newValue.length > 0 && this.updateForConfiguredColumnDefs ) {
    this.updateServerSideDatasource('','configuredColumnDefs');
  }
}


// Main search call to server
  updateServerSideDatasource(requestType: string, specialType: string) {
    this.linearLoading = true
    
    console.log('special type', specialType)
    // Ensure all prerequisites are met before attempting to update the data source.
    if (!this.promotedEntity || !this.isServerSide || this.configuredColumnDefs.length === 0) {
      console.warn('Grid update prerequisites not met..');
      return;
    }

    this.noResults = false;
    
    let datasource = SearchServiceDatasource(
      null,
      this.gridUID,
      this.isRecentSearch,
      localStorage.getItem('apiMethodId') ||  this.promotedEntity.unityBaseSearchMethod.apiMethodId,
      this.filterObject,
      this.logicalSearchOperator,
      this.accessToken,
      this.tenantId,
      executeQueryAdHocAndMapLookups,
      this.defaultSearchObject,
      (dataFetched, totalCount) => {
        try {

      console.log('dataFetched SSD', dataFetched)
      console.log('Total row count:', totalCount);
      
       if(totalCount === 0) {
        this.linearLoading = false
       }
    


      if (this.gridOptions.api) {
        // Assuming gridOptions is your grid's configuration object and api is initialized
      
        // Listen for any event that signifies data has been updated or loaded
        this.gridOptions.api.addEventListener('modelUpdated', () => {
          const rowCount = this.gridOptions.api.getDisplayedRowCount();
          
          if(rowCount > 10) {
            console.log('row count check', rowCount )
            this.getExtendedAdvancedSearchFilterList('')
          }
      
          // Check if the grid has no rows displayed after a data update
          if (rowCount === 0) {
            // No rows in the grid, meaning the data source returned an empty pageList
            this.linearLoading = false; // Stop the loading animation
            // Optionally, trigger any other UI updates to reflect the empty state
          } else {
            // Rows are present, data loading was successful with content
            // Any additional handling for successful data load with rows
          }
        });
      }
      


    const updateColumnDefs = (dataFetched, serverColumnDefs) => {
      // Convert the fetched data to ag-grid columns, representing the full set of data columns
      const fullDataColumns = convertToAgGridColumns(dataFetched);
     console.log('fullDataColumns', fullDataColumns)
      // Create a Set of fields from fullDataColumns for quick lookup
      const fullDataFieldsSet = new Set(fullDataColumns.map(column => column.field));
  
      // Start with serverColumnDefs and update hide property
      let updatedColumns = serverColumnDefs.map(columnDef => {
          // Check if the field is 'searchRank' or in fullDataFieldsSet

          const hide = columnDef.field !== 'searchRank' && !fullDataFieldsSet.has(columnDef.field);
          return {
              ...columnDef,
              hide:hide
          };
      });
  
      // Add any columns from fullDataColumns that are not in serverColumnDefs
      fullDataColumns.forEach(column => {
          if (!serverColumnDefs.some(serverColumn => serverColumn.field === column.field) && this.showRank ) {
              const hide = column.field !== 'searchRank';
              updatedColumns.push({ ...column, hide: hide });
          }
      });

      // Update the column header names
      if (this.columnNames) {
        const updatedColumnsWithNewNames = updatedColumns.map(obj => ({
          ...obj,
          headerName: this.columnNames[obj.headerName] || obj.headerName // Use dictionary value or fallback to original value
        }));
        console.log('updatedColumnsWithNewNames');
        console.log(updatedColumnsWithNewNames);

        // Update the state or the updatedColumns with the new names
        updatedColumns = updatedColumnsWithNewNames;
      }

      // Hide column 
      if(rowGroups.length > 0 && rowGroups) {
        let groupProps = null;
        console.log('rowGroups', rowGroups)
        groupProps = rowGroups.map(prop => prop.toLowerCase());
        updatedColumns = updatedColumns.map(column => {
            // Check if this column's field is present in groupProperty
            const hide = groupProps.includes(column.field.toLowerCase());
            return {
                ...column,
                hide: hide
            };
        });
      }

      return updatedColumns;
  };
  
   
        const displayColumns = updateColumnDefs(dataFetched, this.configuredColumnDefs)

        console.log('displayColumns', displayColumns)
          
          const modifiedColumnDefs = displayColumns.map(column => {
            // Check if this column's headerName is present in displayColumns
            const isColumnDisplayed = displayColumns.find(displayColumn => displayColumn.headerName === column.headerName);
            // If it's not present, add the 'hide' property
            if (!isColumnDisplayed ) {
                if(column.headerName === 'Search Rank') {
                  return { ...column, sortable:false, hide: dataFetched[0].searchRank ? false : true };
                } else {
                  return { ...column, hide: true };
                }
            }
            // If it is present, return the column as is 
            return column;
        });

        const addRenderers = (columnDefs, renderConfigs) => {
          return columnDefs.map(colDef => {
            // Find a matching configuration for this column
            const config = renderConfigs.find(cfg => cfg.field === colDef.field);
            if (config) {
              // Merge existing cellRendererParams with ones from config, prioritizing config params
              const cellRendererParams = {
                ...colDef.cellRendererParams,
                ...config.cellRendererParams,
                otherField: config.otherField, // Assuming you might want to keep using this pattern
                callbackId: config.callbackId,
                showViewAction: true,
                showThirdAction: this.showHotlistButton,
              };
        
              return {
                ...colDef,
                cellRenderer: config.rendererName,
                cellRendererParams: cellRendererParams
              };
            }
            return colDef; // Return original colDef if no matching config is found
          });
        };

        const addActionsColumn = (columnDefs) => {
          const actionsColumnExists = columnDefs.some(column => column.field === 'actions');
          if (!actionsColumnExists) {
            const actionsColumn = {
              headerName: 'Actions',
              field: 'actions',
              cellRendererParams: { 
                shouldDisplayCustomContent: false, 
               
            },
              cellRenderer: 'hotListAddRenderer',
              pinned: 'right'
            };
            columnDefs.push(actionsColumn);
          }
          return columnDefs;
        };
        
        const addCheckboxColumn = (columnDefs) => {
          var bulkActions = localStorage.getItem('bulkActions'); // check if bulk actions are configured, if not then skip adding checkboxes
          if (bulkActions) {
            const checkboxColumnExists = columnDefs.some(column => column.field === 'checkbox');
            if (!checkboxColumnExists) {
              const checkboxColumn = {
                headerName: '',  // No title for the checkbox column
                field: 'checkbox',
                checkboxSelection: true, // This enables the checkbox selection feature
                headerCheckboxSelection: false, // set to false now as the server-size for select all is not fully implemented
                pinned: 'left', // Pinned to the left
                lockVisible: true, // This prevents the column from being hideable
                maxWidth: 70,
                filter: false, // no need to show filter for this column
                menuTabs: [], // Disables the menu in the column header
                sortable: false // Disables sorting for this column
              };
              columnDefs.unshift(checkboxColumn); // Use unshift to add it at the start of the array
            }
          }
          return columnDefs;
        };
        
        // Usage of the function to add checkbox column
        const columnDefsWithCheckbox = addCheckboxColumn(modifiedColumnDefs);
        
        // Add the Actions column to the definitions with checkbox
        let columnDefsWithActions = addActionsColumn(columnDefsWithCheckbox);
        console.log('columnDefsWithActions', columnDefsWithActions);

        // Reorder the columns based on the currentColumnOrdering
        if (this.currentColumnOrdering.length > 0) {
          const reorderedColumns = this.currentColumnOrdering.map(currentColOrder => columnDefsWithActions.find(col => col.field === currentColOrder.colId));
          // Update the columnDefs with the reordered columns
          columnDefsWithActions = reorderedColumns;
        }

        // Now pass this updated array to addRenderers or other manipulation functions
        const columnDefsWithRenderers = addRenderers(columnDefsWithActions, this.renderConfigs);
        
        this.serverColumnDefs = columnDefsWithRenderers;
        

        if (this.gridOptions && this.gridOptions.api) {
          this.gridOptions.api.setColumnDefs(this.serverColumnDefs);
          this.linearLoading = false;
          // load ctlg for advanced search after setting column defs
         
      }
      
        } catch (error) {
          console.error('Error processing data fetched for the grid:', error);
        }
    
        // Update list of recent searches
        this.getRecentSearches()
        this.isRecentSearch = false;
      }
    );
  
   // SearchServiceDatasource end

    // Set the new data source and trigger a refresh.
    if (this.gridOptions && this.gridOptions.api) {
      try {
        this.gridOptions.api.setServerSideDatasource(datasource);
        
        // No need to call refreshServerSide() as setting the datasource will implicitly refresh it.
      } catch (error) {
        console.error('Error setting server-side datasource:', error);
      }
    }
    //this.gridOptions.api && this.gridOptions.api.sizeColumnsToFit();
    // Optionally close the drawer.

    if(requestType != 'remove') {
      this.drawerOpen = false;
    }

    if(requestType != 'remove') {
      this.advancedDrawerOpen = false;
    }
    
    this.getGridState();
  }

  adjustGridScroll() {
    const gridViewport = this.el.querySelector('.ag-center-cols-viewport') as HTMLElement;
    if (gridViewport && gridViewport.style) {
      gridViewport.style.overflowY = 'hidden';
    }
    const scrollViewport = this.el.querySelector('.ag-body-viewport.ag-layout-normal') as HTMLElement;
    if (scrollViewport && scrollViewport.style) {
      scrollViewport.style.overflowY = 'hidden';
    }
  }


  triggerResizeEvent() {
    let resizeEvent = new CustomEvent('resize');
    window.dispatchEvent(resizeEvent);
}


onHotListCellClick(cellValue: any): void {
  console.log('Cell clicked in ambient-template-grid. Value:', cellValue);
  // Implement the logic to handle the cell click here
}

componentDidLoad() {

 


  
  



  SharedContext.myClickCallback = this.cellClickHandler.bind(this);
  SharedContext.viewActionCallback = this.viewActionClickHandler.bind(this);
  SharedContext.thirdActionCallback = this.cellClickHandlerX.bind(this);
 

  const input = {
    "KeyWordsearch": "(VP or \"vice president\") AND payroll"
  };
  const query = createStructuredQuery(input);
  console.log('convert input login to objects', query);

  SharedContext.hotListAddHandler = (otherCellValue, callbackId) => {
    console.log('Hotlist add clicked. Value:', otherCellValue, 'Callback ID:', callbackId);
    this.businessObjectKey = otherCellValue;
    this.handleHotListAddHandler(otherCellValue);
  };

// Can handle add or delete hotlist record from a list
SharedContext.hotListAddHandler = (otherCellValue, callbackId) => {
  console.log('Hotlist add clicked. Value:', otherCellValue.businessObjectKey, 'Callback ID:', callbackId);


function findMatchingHotListId(dataObject: any, otherCellValue: any): string | null {
  for (const record of dataObject.records) {
      const parsedData = JSON.parse(record.data)
      
      if (parsedData.businessObjectKey === otherCellValue.businessObjectKey) {
          return record.hotListRecordId;
      }
  }
  return null;
}



  this.businessObjectKey = otherCellValue
  if (!this.hotListActive) {
    this.hotlistDrawerOpen = true;
    
  } else {
    const matchingHotListId = findMatchingHotListId(this.hotlistSelectedFull, otherCellValue);
    removeRecordFromHotlist( matchingHotListId, this.tenantId,this.accessToken);
    const hotlistSelectedFull: HotListObject = this.hotlistSelectedFull as HotListObject;
    this.removeFilterSelection({ 
      searchField: "contactId",
      searchValue:matchingHotListId
    })
    this.handleRequestView(hotlistSelectedFull.hotListId)
  }
  
};





this.updateChipLayout(); 
window.addEventListener('resize', this.updateChipLayout);
}
  



// disconnectedCallback() {
//   window.removeEventListener('resize', this.checkOverflow);
// }



checkOverflow = () => {
  const containerWidth = this.el.getBoundingClientRect().width;
  let totalChipWidth = 150;
  const chips = this.el.querySelectorAll('stencil-chip');
  chips.forEach(chip => {
    totalChipWidth += chip.getBoundingClientRect().width;
  });
  this.overflowActive = totalChipWidth > containerWidth;
};



@Listen('resize', { target: 'window' })
  handleResize() {
    this.updateChipLayout();
  }

@Watch('serverColumnDefs')
serverColumnDefsChanged(newValue: any[]) {
  if(newValue && newValue.length != 0 && !this.isSetupComplete) {
    this.handleSecondarySetup();
    this.isSetupComplete = true;
  }
  this.updateChipLayout();
  console.log('serverColumnDefs1: ', this.serverColumnDefs);
}


renderChips() {
  return (
    this.allFilters.map((filter, index) => (
      <stencil-chip
        key={index}
        text={`${filter.searchField} ${filter.searchOperator} ${filter.searchValue}`} 
        level={filter.level}
        onOnDelete={() => this.removeFilterSelection(filter)}
        defaultToggled={true}
      />
    ))
  );
}

updateServerColumnDefs(data) {
  this.serverColumnDefs = data;
  if (this.serverColumnDefs.length != 0) {
    this.handleSecondarySetup();
  }
}



loadAgGridScript() {
  return new Promise<void>((resolve, reject) => {
    const agGridScript = document.createElement('script');
    agGridScript.src = 'https://cdn.jsdelivr.net/npm/ag-grid-enterprise@latest/dist/ag-grid-enterprise.min.noStyle.js';
    agGridScript.onload = () => resolve(undefined); // Explicitly pass undefined
    agGridScript.onerror = () => reject(new Error('Failed to load ag-Grid script'));
    document.head.appendChild(agGridScript);
  });
}

setAgGridLicenseKey() {
  if (window['agGrid'] && window['agGrid'].LicenseManager) {
    window['agGrid'].LicenseManager.setLicenseKey(LicenseKey);
  }
}

initializeGrid() {
  this.gridOptions = {
    animateRows: true,
    ...(this.isServerSide ? { rowModelType: 'serverSide' } : {}),
    ...(this.isServerSide ? { serverSideStoreType: 'partial' } : {}),
    ...(this.isServerSide ? { cacheOverflowSize: 2 } : {}),
    ...(this.isServerSide ? { cacheBlockSize: 20 } : {}),
    ...(this.isServerSide ? { maxConcurrentDatasourceRequests: 1 } : {}),
    pagination: true,
    paginationPageSize: 20,
    rowHeight: 32,
    defaultColDef: {
      filter: true,
    },
    rowSelection: 'multiple',
    
    suppressRowClickSelection: true,
    onSelectionChanged: () => {
      const selectedNodes = this.gridOptions.api.getSelectedNodes();
      const rowCount = selectedNodes.length;  
      this.rowsSelected = rowCount > 0;
      this.selectedRowCount = rowCount; 
      
    },
    onCellClicked: event => {
      console.log('Clicked Row Data:', event.data);
      this.dataRowClicked = event.data
    },

    // frameworkComponents: {
    //   emailCellRenderer: 'email-cell-renderer',
    // },
     components: {
      emailCellRenderer: EmailCellRenderer,
      openFunctionCellRenderer:OpenFunctionCellRenderer,
      hoverContentCellRenderer: HoverContentCellRenderer,
      hotListAddRenderer: HotListAddRenderer,
      dateTimeCellRenderer: DateTimeCellRenderer
    },
    columnDefs: this.serverColumnDefs, // getting defs for server side fetch
    rowData: this.rowData,
    sideBar: this.filterPanelOpen ? {
      toolPanels: [
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        },
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
          }

        }
      ],
      defaultToolPanel: ''
    } : null,
    onGridReady: () => {
      [500, 1000, 2000, 3000, 4000, 5000, 6000, 10000, 20000].forEach(delay => {
        setTimeout(() => {
            // Views have their own column width set
            if (!this.loadedView && !this.loadedViewData){
            this.fitGrid === 'fit' ? 
            this.gridOptions.api.sizeColumnsToFit() :
            this.gridOptions.columnApi.autoSizeAllColumns()
            }
        }, delay);
    });
      this.getGridState();
      // this.gridApi = params.api;
      this.defaultColumnState = this.gridOptions.columnApi.getColumnState();
      this.adjustGridScroll();
    //   this.gridOptions.api.sizeColumnsToFit();
    //   requestAnimationFrame(() => {
    //     this.gridOptions.api.sizeColumnsToFit();
    // });


    
    },
    onColumnMoved: () => {
      this.currentColumnOrdering = this.gridOptions.columnApi.getColumnState();
      this.getGridState();
    },
    onColumnVisible: () => {
      this.getGridState();
    },
    onColumnResized: () => {
      this.getGridState();
    },
    onColumnPinned: () => {
      this.getGridState();
    },
    onFilterChanged: () => {
      const filterModel = this.gridOptions.api.getFilterModel();
      //this.updateSearchObject(detail: { searchField: string, searchOperator: string, searchValue: any })
      console.log('filter Model contents',filterModel);
      if (Object.keys(filterModel).length > 0) {
        this.nativeFilterInput = true;
      }
      this.transformAndApplyFilters(filterModel);

      this.getGridState(); 
    },
    
  
     onSortChanged: () => {
this.getGridState(); 
},
onFirstDataRendered: () => {
this.getGridState(); 
// Here you can also check if pivot mode has changed
const isPivotMode = this.gridOptions.columnApi.isPivotMode();
if (isPivotMode !== this.prevPivotMode) {
console.log('pivot mode changed');
this.getPivotModeState(); // Replace with your actual method
this.prevPivotMode = isPivotMode;
}
},
suppressMenuHide: this.suppressMenuHide,
  } as unknown as GridOptions;
  new window['agGrid'].Grid(this.el.shadowRoot.querySelector('#myGrid'), this.gridOptions);


}

handleHotListAddHandler(otherCellValue) {
  console.log(otherCellValue)
}

// handleAdditionalSetup() {
  
//   this.handleGetPromotedLookupMethod();
//   if(localStorage.getItem('lookupApiMethodId')) {
//     this.handleGetInstanceAndMethod();
//   } else {
//     return;
//   }
// } 

async handleAdditionalSetup() {
  // Ensure handleGetPromotedLookupMethod is awaited to complete before proceeding.
  await this.handleGetPromotedLookupMethod();
  
  // After awaiting, check again for lookupApiMethodId in localStorage.
  if (localStorage.getItem('lookupApiMethodId')) {
    this.handleGetInstanceAndMethod();
  } else {
    // If lookupApiMethodId is still not set, it means there was an issue in handleGetPromotedLookupMethod.
    console.error('Failed to retrieve lookupApiMethodId - handleAdditionalSetup aborted.');
    // Return or handle the error as needed.
  }
}


handleSecondarySetup() {
  this.handleGetCatalogId();
  this.fetchAvailableGridActions();
  this.filterByCatalogObjectName(localStorage.getItem('entityName'));
  this.fetchDataForViews()
  this.transformBulkActions()
  this.handleGetAllHotlists()
  // this.getExtendedAdvancedSearchFilterList('');  @todo: dealing with ctlg call out of secondary setup
  
}

  // cellClickHandler(otherCellValue, callbackId) {
  //   console.log('Cell clicked. Value:', otherCellValue, 'Callback ID:', callbackId);
  //   // Additional logic here
  // }
 

  disconnectedCallback() {
    window.removeEventListener('resize', this.boundOnResize);
    window.removeEventListener('resize', this.updateChipLayout);
  }

  private onResize() {
    if (this.gridOptions && this.gridOptions.api) {
      this.fitGrid === 'fit' ? 
      this.gridOptions.api.sizeColumnsToFit() :
      this.gridOptions.columnApi.autoSizeAllColumns()
    }
  }

  exportToCsv() {
    if (this.gridOptions.api) {
      const params = {};
      this.gridOptions.api.exportDataAsCsv(params);
    }
  }

  fitColumns() {
    if (this.gridOptions && this.gridOptions.api) {
      this.gridOptions.api.sizeColumnsToFit();
    }
  }
  
  expandColumns() {
    if (this.gridOptions && this.gridOptions.api && this.gridOptions.columnApi) {
      this.gridOptions.columnApi.autoSizeAllColumns();
    }
    
  }

  getPivotModeState() {
    if (this.gridOptions && this.gridOptions.columnApi) {
      return this.gridOptions.columnApi.isPivotMode();
    }
    return false;
  }

  activeFilters: { [key: string]: string } = {};

  setColumnFilter(columnField: string, filterValue: string) {    
    let filterModel: any = {};
  
    if (this.gridOptions && this.gridOptions.api) {
      // If the filter is already active, remove it
      if (this.activeFilters[columnField] === filterValue) {
        delete this.activeFilters[columnField];
      } else {
        // Otherwise, set the filter and update the active filters
        this.activeFilters[columnField] = filterValue;
        filterModel = {
          [columnField]: {
            values: [filterValue]
          },
        };
      }
  
      // Apply the filter model
      this.gridOptions.api.setFilterModel(filterModel);
  
      // Notify grid of filter change
      this.gridOptions.api.onFilterChanged();
      
    }
  }
  

  // Add this method to your component class
deleteSelectedRows() {
  // Check if the API is available
  if (this.gridOptions && this.gridOptions.api) {
    const selectedNodes = this.gridOptions.api.getSelectedNodes();
    
    // Extract the data from selected nodes
    const selectedData = selectedNodes.map(node => node.data);
    
    // Pass selectedData to your delete function
    this.yourDeleteFunction(selectedData);
    
    // Optionally, you can remove the selected rows from the grid
    //const selectedRows = selectedNodes.map(node => node.rowIndex);
    this.gridOptions.api.applyTransaction({ remove: selectedData });
  }
}

// Your delete function (replace this with your actual delete logic)
yourDeleteFunction(selectedData) {
  console.log('Deleting these rows: ', selectedData);
}

toggleServerSide = () => {
  this.isServerSide = !this.isServerSide;
}

  getGridState() {
    if (this.gridOptions && this.gridOptions.columnApi) {
      const columnState = this.gridOptions.columnApi.getColumnState();
      const columnGroupState = this.gridOptions.columnApi.getColumnGroupState();
      const filterModel = this.filterObjectsWithGroups;
      const isPivotMode = this.gridOptions.columnApi.isPivotMode();
      const sortModel = columnState.filter(column => column.sort != null);

      const gridState = [];
      const columnGridConfiguration = {
        gridStateTypeId: GridStateTypeEnums.Column,
        gridId: this.gridId,
        values: JSON.stringify(columnState),
      };
      const columnGroupGridConfiguration = {
        gridStateTypeId: GridStateTypeEnums.Column_Group,
        gridId: this.gridId,
        values: JSON.stringify(columnGroupState),
      };
      const columnSortGridConfiguration = {
        gridStateTypeId: GridStateTypeEnums.Column_Sort,
        gridId: this.gridId,
        values: JSON.stringify(sortModel),
      };
      const columnFilterGridConfiguration = {
        gridStateTypeId: GridStateTypeEnums.Column_Filter,
        gridId: this.gridId,
        values: JSON.stringify(filterModel),
      };
      const pivotGridConfiguration = {
        gridStateTypeId: GridStateTypeEnums.Pivot_Mode,
        gridId: this.gridId,
        values: JSON.stringify(isPivotMode),
      };
      gridState.push(columnGridConfiguration);
      gridState.push(columnGroupGridConfiguration);
      gridState.push(columnSortGridConfiguration);
      gridState.push(columnFilterGridConfiguration);
      gridState.push(pivotGridConfiguration);


      console.log('Grid State:', gridState);
      this.gridState = gridState;
      // Do something with columnState
    }
  }
  
  togglePanel(panelType) {
    const panelTypes = ['filters', 'columns']; 
    panelTypes.forEach(type => {
      if (type !== panelType) {
        const otherPanelOpenKey = `${type}PanelOpen`;
        this[otherPanelOpenKey] = false;  // Close other panel if open
      }
    });
  
    const panelOpenKey = `${panelType}PanelOpen`;
    this[panelOpenKey] = !this[panelOpenKey]; // Toggle the current panel
  
    // Create the toolPanel configuration based on the panelType
    const toolPanelConfig = {
      id: panelType,
      labelDefault: panelType.charAt(0).toUpperCase() + panelType.slice(1),
      labelKey: panelType,
      iconKey: panelType === 'filters' ? 'filter' : 'columns',
      toolPanel: panelType === 'filters' ? 'agFiltersToolPanel' : 'agColumnsToolPanel',
      toolPanelParams: {
        suppressRowGroups: true,
        suppressValues: true,
        suppressPivots: true,
        suppressPivotMode: true,
      }
    };
  
    // Update gridOptions to reflect new sidebar settings
    this.gridOptions.sideBar = this[panelOpenKey] ? {
      toolPanels: [toolPanelConfig],
      defaultToolPanel: panelType,
    } : null;
  
    this.gridOptions.api.setSideBarVisible(this[panelOpenKey]);
  
    if (this[panelOpenKey]) {
      this.gridOptions.api.openToolPanel(panelType);
      console.log(`${panelType} panel opened`);
    } else {
      this.gridOptions.api.closeToolPanel();
      console.log(`${panelType} panel closed`);
    }
  
    // Apply Direct DOM Manipulation
    const sidebarElement = this.el.shadowRoot.querySelector('.ag-side-bar');
    if (sidebarElement instanceof HTMLElement) {
      sidebarElement.style.width = this[panelOpenKey] ? '200px' : 'initial';
    }
  
    // Refresh the grid here if needed
    //this.gridOptions.api.refreshClientSideRowModel();
  }


  resetDefaultView = () => {
    const domain = localStorage.getItem('entityName')
    this.viewListRowData.forEach(item => {
      if (item.isDefault === true) {
        try {
          updateView(item.gridViewId, this.userId, this.gridId, this.apiCatalogId, this.accessToken, item.name, this.tenantId, 0, domain, item.gridViewVisibilityTypeId, (data) => {
            console.log('Other view isDefault reset to 0', data);
          })
        } catch (error) {
          console.error('Error updating view, data:', error);
        }
        }
      }); 
  }
  
 
  async handleFormSubmit(name: string, isPrivate: number, isDefault: boolean, columnState) {
    console.log('from root', name, isPrivate, columnState);
    const userId = this.userId
    const gridId = this.gridId
    const apiCatalogId = this.apiCatalogId
    const accessToken = this.accessToken
    const tenantId = this.tenantId
    const gridConfigurations = columnState; // The columnState from the argument
    const isDefaultNum: number = isDefault ? 1 : 0;
    const domain = localStorage.getItem('entityName');
    // if newDefault == 1, then we need to make sure any existing view with isDefault=1 is set to =0
    if (isDefaultNum == 1) {
      this.resetDefaultView();
    }
    
    // Now call saveView
    try {
      console.log('Calling saveView with:', userId, gridId, apiCatalogId, accessToken, name, tenantId, gridConfigurations);
      await saveView(userId, gridId, apiCatalogId, accessToken, name, domain, tenantId, gridConfigurations, isPrivate,isDefaultNum,  (data) => {
        console.log('Data successfully saved', data);
        this.saveDialogOpen = !this.saveDialogOpen; // closes form
        this.showNotification = true;
        this.notificationMessage = `${data.gridView.name} has been saved successfully.`;
        this.notificationStatus = 'success';
        this.fetchDataForViews();
        setTimeout(() => {
          this.showNotification = !this.showNotification;
        }, 4000);
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  primaryActionClick(type: string) {
    if (type === 'advancedSearch') {
      this.advancedDrawerOpen = !this.advancedDrawerOpen;
    } else if (type === 'views') {
      this.viewDrawerOpen = !this.viewDrawerOpen;
    } else if (type === 'customSearch') {
      this.customSearchDrawerOpen = !this.customSearchDrawerOpen;
    } else {
      this.hotlistDrawerOpen = !this.hotlistDrawerOpen;
    }
  }

  showViews() {
    this.viewDrawerOpen = !this.viewDrawerOpen;
    this.sheetContent ='views'
    
    console.log('show view type', this.sheetContent)
  }

  showHotlist() {
    this.hotlistDrawerOpen = !this.hotlistDrawerOpen;
    this.businessObjectKey = null
    this.logicalSearchOperator = 2;
  }
  showCustomSearch() {
    this.customSearchDrawerOpen = !this.customSearchDrawerOpen;
  }

  showAdvancedSearch() {
    this.advancedDrawerOpen = !this.advancedDrawerOpen;
    this.logicalSearchOperator = 1;
    this.setSearchStart = false;
  }

  showViewSave() {
    this.saveDialogOpen = !this.saveDialogOpen;
  }

  showGridOptions() {
    this.gridOptionsDrawerOpen = !this.gridOptionsDrawerOpen;
  }

  openViewEdit(gridViewId: string, viewName: string, isDefault: boolean, gridViewVisibilityTypeId: number) {
    this.editDialogOpen = !this.editDialogOpen;
    this.selectedGridId = gridViewId;
    this.selectedViewName = viewName;
    this.selectedViewIsDefault = isDefault;
    this.selectedViewGridViewVisibilityTypeId = gridViewVisibilityTypeId;
    console.log(gridViewId, isDefault, gridViewVisibilityTypeId);

  }
  closeViewEdit() {
    this.editDialogOpen = !this.editDialogOpen;
  }

  clearFilter() {
    this.refreshOnNoResults()

    if (this.gridOptions && this.gridOptions.api && this.gridOptions.columnApi) {
      const { api, columnApi } = this.gridOptions;
      
      api.setQuickFilter('');
      columnApi.setRowGroupColumns([]);
      api.setFilterModel(null);
      api.setQuickFilter('');
      columnApi.resetColumnState();
  
      // Refresh the grid after clearing all filters and settings
     // api.refreshClientSideRowModel();
      this.loadedView = []
    }

     
  }


  setColumnState(state: Array<{ [key: string]: any }>) {

    if (this.gridOptions && this.gridOptions.columnApi) {
      const castedState = state as any;
      console.log('Applying state:', castedState);  // Added logging
      this.gridOptions.columnApi.applyColumnState({ state: castedState, applyOrder: true});
    } else {
      console.warn("Grid options or Column API not available.");
    }
  }

  onFirstDataRendered(gridData) {
    this.loadedView = [this.fullViewData];
    console.log('view name', gridData.name)
    // this.loadedViewTitle = this.fullViewData.name;
    this.loadedViewTitle = gridData.name;
    if (gridData && gridData.gridViewGridViewGridConfiguration) {
      gridData.gridViewGridViewGridConfiguration.forEach(config => {
        const state = config.gridViewGridConfigurationGridConfiguration;

        switch (state.gridStateTypeId) {
          case 1: 
            // this.gridOptions.columnApi.applyColumnState({state: JSON.parse(state.values)});
            this.loadedViewData = state.values;
            this.setColumnState(JSON.parse(state.values));
            //this.gridOptions.api.refreshServerSide();
            console.log('this should now work...', state.values)
            break;
          case GridStateTypeEnums.Pivot_Mode: 
            this.gridOptions.columnApi.setPivotMode(JSON.parse(state.values));
          
            break;
          case GridStateTypeEnums.Column_Sort: 
            const currentColumnState = this.gridOptions.columnApi.getColumnState();
            const newColumnState = JSON.parse(state.values);
            const mergedState = currentColumnState.map(col => newColumnState.find(newCol => newCol.colId === col.colId) || col);
            this.gridOptions.columnApi.applyColumnState({state: mergedState});
          
            break;
          case GridStateTypeEnums.Column_Filter:
            this.filterObjectsWithGroups = JSON.parse(state.values);
            this.handleSideSheetButtonClick();

            break;
          case GridStateTypeEnums.Column_Group:
              this.gridOptions.columnApi.setColumnGroupState(JSON.parse(state.values));
              break;
          default:
            console.log('No match found for', state.gridStateTypeId);
            break;
        }
      });
    }
    // this.fitColumns()
  }
  
  


  // Hotlist functions start

 // View all hotlists
 handleGetAllHotlists = async () => {
  try {
    const hotlistData = await getAllHotlists(this.tenantId, this.accessToken);
    console.log('hotlistData response', hotlistData)
    this.allHotlists = hotlistData;
    
  } catch (error) {
    console.error('Error fetching hotlists:', error);
  }
}


  // Add a hotlist item single
  handleSetSingleHotlistItem = (id) => {
    console.log('handleSetSingleHotlistItem X:', id);

    //const token = this.accessToken; 
    this.hotlistDrawerOpen = !this.hotlistDrawerOpen;
    this.sendSetSingleHotlistItem(id)

    const businessObjectKey = this.dataRowClicked.businessObjectKey;

    // Update the dataObject
    const dataObject = {
      "hotListId": id, // Assuming id is already defined
      "contextDate": "2023/01/01",
      "data": JSON.stringify(this.dataRowClicked),
      "entityBusinessObjectKey": businessObjectKey, 
      "currentUserId": "8fe3b5ce-6a94-4ff4-b35c-be2596ea1380"
    };
    
    console.log('if this.dataRowClicked', this.dataRowClicked)
  
    addRecordToAHotlist(dataObject, this.tenantId, this.accessToken)

  }
  
 //temp function to send hotlist request - will be replaced when endpoint it ready
 sendSetSingleHotlistItem = (id) => {
  if (this.businessObjectKey) {
    const requestBody = {
      data: JSON.stringify({ businessObjectKey: this.businessObjectKey }),
      hotListId: id
    };
    console.log('requestBody', requestBody)

   // alert(JSON.stringify(requestBody))
    
  } else {
    console.error('Missing businessObjectKey or hotListId');
  }
};



// delete a selected hotlist


confirmRequestDelete = (hotListId) => {
  this.confirmDialog = !this.confirmDialog;
  this.hotListId = hotListId;
}

handleRequestDelete = () => {
  deleteAHotlist(this.hotListId, this.tenantId, this.accessToken)
    .then(() => {
      this.handleGetAllHotlists();
      this.confirmDialog = false;
    })
    .catch(error => {
      console.error('Error deleting hotlist:', error);
      // handle any errors here
    });
};

updateDefaultView = (item) => {
  console.log("Making this view default: " + item.name + ", id: " + item.gridViewId);
  var newDefault = item.isDefault ? 0 : 1;
  const domain = localStorage.getItem('entityName');
  // if newDefault == 1, then we need to make sure any existing view with isDefault=1 is set to =0
  if (newDefault == 1) {
    this.resetDefaultView();
  }
  try {
    updateView(item.gridViewId, this.userId, this.gridId, this.apiCatalogId, this.accessToken, item.name, this.tenantId, newDefault, domain, item.gridViewVisibilityTypeId, (data) => {
      console.log('Data successfully updated view', data);
    })
    .then(() => {
      this.fetchDataForViews();
      this.confirmDialog = false;
      this.showNotification = true;
      this.notificationMessage = `Updated default view.`;
      this.notificationStatus = 'success';
      setTimeout(() => {
        this.showNotification = !this.showNotification;
      }, 4000);
    });
  } catch (error) {
    console.error('Error updating view, data:', error);
  }
}

async handleViewUpdate(gridId: any, name: string, isPrivate: number, isDefault: boolean) {
  var isDefaultNum = isDefault ? 1 : 0;
  console.log("isDefaultNum", isDefaultNum);
  const domain = localStorage.getItem('entityName');

   // if this isDefault is true, then we need to make sure any existing view with isDefault=1 is set to =0
  if (isDefaultNum == 1) {
    this.resetDefaultView();
  }
  try {
    updateView(gridId, this.userId, this.gridId, this.apiCatalogId, this.accessToken, name, this.tenantId, isDefaultNum, domain, isPrivate, (data) => {
      console.log('Data successfully updated view', data);
    })
    .then(() => {
      this.fetchDataForViews();
      this.confirmDialog = false;
      this.showNotification = true;
      this.notificationMessage = `Updated view.`;
      this.notificationStatus = 'success';
      setTimeout(() => {
        this.showNotification = !this.showNotification;
      }, 4000);
    });
  } catch (error) {
    console.error('Error updating view, data:', error);
  }
}




// convert hotlist to payload
mapHotlistsToPayload(hotlistIdentifiers) {
  console.log('mapHL', hotlistIdentifiers);
  return hotlistIdentifiers.map(keyID => ({
    searchField: this.hotListIdentifier,
    searchOperator: "=",
    searchValue: keyID
  }));
}



// set hotlist form open
toggleHotlistForm = () => {
  this.showHotlistForm = !this.showHotlistForm;
}

toggleAlertDialog = (type) => {
  if(type === 'hotlist') {
    this.confirmDialog = !this.confirmDialog;
  } else {
    this.confirmDialogDeleteView = !this.confirmDialogDeleteView;
  }
  
}

updateFilterObjectWithPayload(hotlistSearchKeys) {
  const payload = this.mapHotlistsToPayload(hotlistSearchKeys);
 console.log('ufowp payload', payload)
  this.filterObject = [
    {
      pageNumber: 1,
      pageSize: 20,
      filterElements: payload,
      orderElements: [],
      groupingType: "",
      groupProperty: [],
      groupOperationList: [],
      eagerLoad: false,
      logicalSearchOperator: 2,
      "type": "hotlist"
    }
  ];
  console.log('this.filterObject hotlist payload', this.filterObject)
  this.updateServerSideDatasource('','updateFilterObjectWithPayload')
  this.hotlistDrawerOpen = false;
}


// extract id to process for search object
extractContactIDs = (payload) => {
  const contactIDs = payload.records.map(record => {
      const dataObject = JSON.parse(record.data);
      return dataObject[this.hotListIdentifier];
  });
  return contactIDs;
};

// view a selected hotlist
handleRequestView = async (hotlistID) => {
  try {
      // Await for the Promise to resolve and then store the result
      const hotloadList = await loadAHotlist(hotlistID, this.tenantId, this.accessToken);

      // Process the data with extractContactIDs
      const contactIDs = this.extractContactIDs(hotloadList);
      this.hotListActive = hotloadList.name;
      state.hotListActive = this.hotListActive;

      // Set full list hotlist data
      this.hotlistSelectedFull = hotloadList;
      
      // Send the processed data to sendAsSearchObject
      this.updateFilterObjectWithPayload(contactIDs);
  } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error in handleRequestView:', error);
  }
};



  handleButtonClick = (cellValue) => {
    console.log('Button in cell clicked in root demo component:', cellValue);
    
    // Define the callback
    const callback = (data) => {
      // Will send to grid to update view

      console.log('Received data for Views MV:', data);

      this.onFirstDataRendered(data);
      this.loadedGridView = data;
    };
  
    const token = this.accessToken; 
    getSelectedView(cellValue, token, callback);

    this.viewDrawerOpen = !this.viewDrawerOpen;
  }


  handleDeleteView = () => {
    // alert(`Delete view with ID:) ${viewId}`)
    this.confirmDialogDeleteView = false
    const callback = (data) => {
      // Will send to grid to update view

      console.log('Received data for Views MV:', data);
      getAvailableViews(this.userId, this.gridId, this.apiCatalogId, localStorage.getItem('entityName'), localStorage.getItem('accessToken'), (data) => {
        this.viewListRowData = data; // Ensure this correctly updates the state
      });
    };

    deleteSelectedView(this.viewId, this.accessToken,callback )

    this.showNotification = true;
    this.notificationMessage = `Deleted view`;
    this.notificationStatus = 'success';
    setTimeout(() => {
      this.showNotification = !this.showNotification;
    }, 4000);
   }



  // Submit to save hotlist

  handleSaveHotlist = async (name: string, isPrivate: boolean) => {
    const hostListRequestBody = {
      "domain": localStorage.getItem('entityName'),
      "name": name,
      "tenantId": localStorage.getItem('tennatId'),
      "isPrivate": isPrivate,
      "createdBy": this.userId,
      "hotListDataSourceId": 1,
      "hotListTypeId": 2
    }
  
    try {
      await createAHotlist(hostListRequestBody, this.tenantId, this.accessToken);
      this.showHotlistForm = false;
      this.handleGetAllHotlists();
    } catch (error) {
      console.error('Error creating hotlist:', error);
      // handle any errors here
    }
  };
  
  
  handleGetCatalogId = async () => {

    try {
      const { apiCatalogId } = await getApiCatalogAndProduct(localStorage.getItem('tennatId'), this.productId, this.accessToken);
  
      if (!apiCatalogId) {
        console.error('apiCatalogId is undefined');
        return;
      }
  
      this.apiCatalogId = apiCatalogId; 
      localStorage.setItem('apiCatalogId', apiCatalogId);
  
    } catch (error) {
      console.error('Could not get catalog ID', error);
    }

  }

  

  fetchDataForViews = async () => {
    try {
      let apiCatalogId = this.apiCatalogId || localStorage.getItem('apiCatalogId');
  
      if (!apiCatalogId) {
        const fetchedData = await getApiCatalogAndProduct(localStorage.getItem('tennatId'), this.productId, this.accessToken);
        apiCatalogId = fetchedData.apiCatalogId;
      }
  
      if (!apiCatalogId) {
        console.warn('apiCatalogId is not yet defined');
        return;
      }
  
      this.apiCatalogId = apiCatalogId; // Update state with the apiCatalogId
      console.log(`apiCatalogId fetched: ${apiCatalogId}`);
  
      const token = this.accessToken;
      const userId = this.userId;
      const gridId = this.gridId;
  
      getAvailableViews(userId, gridId, apiCatalogId, localStorage.getItem('entityName'), token, (data) => {
        this.viewListRowData = data; // Ensure this correctly updates the state
        console.log("this.viewListRowData: ", this.viewListRowData);
        this.setDefaultView();
      });
      this.updateForConfiguredColumnDefs = false
    } catch (error) {
      console.error('Error fetching data for views:', error);
    }
  };

  setDefaultView = () => {
    const defaultViewObj = this.viewListRowData.find((item) => item.isDefault === true);
    console.log("defaultViewObj: ", defaultViewObj);
    if (defaultViewObj) {
      const callback = (data) => {
        console.log('Received data for Views MV:', data);
        this.onFirstDataRendered(data);
      };
      const token = this.accessToken; 
      getSelectedView(defaultViewObj.gridViewId, token, callback);
      }
  }

  fetchAvailableGridActions = () => {
    const callback = (data) => {
      // Will send to grid to update view
      console.log('List of bulk actions:', data);
      localStorage.setItem('bulkActions', JSON.stringify(data));
      this.bulkActions = data;
    };
  
    const token = this.accessToken;

    getAvailableGridActions( this.gridId, token, callback);

    this.updateServerSideDatasource('','configuredColumnDefs');
  };

 
  handleChipDelete = () => {
    // Your delete logic here
    // alert('Chip deleted!');
    console.log('Chip deleted!');
    this.loadedView = [];
    this.clearFilter()
  };

  fullClearSearch = () => {
    this.filterObjectsWithGroups[0].filters.length = 0; // clears the form UI
    
    this.filterObject = [
      {
        "pageNumber": 1,
        "pageSize": 20,
        "filterElements": [],
        "orderElements": [],
        "groupingType": "",
        "groupProperty": [],
        "groupOperationList": [],
        "eagerLoad": false,
        "logicalSearchOperator": 2,
        "type": "advanced"
      }
    ];

    this.hotListActive = null;
    state.hotListActive = null;
    this.updateServerSideDatasource('','clearSearch');
  }
  

  hasInitializedDefaultFilter = false; // Add this flag as a property in your class
  defaultFilterElements: any; // Replace any with your specific type
  activeChips: any[] = [];
  
  setFilterFromChips(chipText: string) {
   
    const isChipValid = this.filterChips.some(chip => chip.description === chipText);
    if (!isChipValid) {
      console.log('Invalid chipText, does not match any description in filterChips');
      return;
    }

    const index = this.activeChips.findIndex(chip => chip.description === chipText);
    console.log('active chips', chipText)
  console.log('filter chip list...', this.filterChips)
    // Initialize defaultFilterElements once, and only once
    if (!this.hasInitializedDefaultFilter) {
      if (this.filterObject && this.filterObject[0] && this.filterObject[0].filterElements) {
        this.defaultFilterElements = JSON.parse(JSON.stringify(this.filterObject[0].filterElements));
        this.hasInitializedDefaultFilter = true;
      }
    }
  
    // Toggle the chip on or off in activeChips
    if (index !== -1) {
      this.activeChips.splice(index, 1);
    } else {
      const chip = this.filterChips.find(chip => chip.description === chipText);
      this.activeChips.push(chip);
    }
  
    // Clear existing FirstName filters from filterElements
    this.filterObject[0].filterElements = this.filterObject[0].filterElements.filter(element => {
      return element.searchField !== this.filterOn;
    });
  
    // Re-add filters based on activeChips
    for (const chip of this.activeChips) {
      const searchValue = chip[this.filterOn] ? chip[this.filterOn] : chip.description;
      this.filterObject[0].filterElements.push({
        searchField: this.filterOn, // @todo: make this dynamic from api
        searchOperator: '=',
        searchValue: searchValue
      });
    }
  
    // If all chips are deactivated, revert to default pre-set filter
    if (this.activeChips.length === 0) {
      this.filterObject[0].filterElements = JSON.parse(JSON.stringify(this.defaultFilterElements));
    }
  
    this.logicalSearchOperator = 2
    // Update the server-side datasource to apply the new filters
    this.updateServerSideDatasource('','setFilterChips');
    
  }
  
  

  setFilterSelections(filter) {  
   
    console.log('filter input set for group', filter);
    const currentFilterObject = this.filterRenderList[0];
  
    currentFilterObject.filterElements = [
      ...currentFilterObject.filterElements,
      filter
    ];
  
    // Update the filterRenderList with the modified filter object
    this.filterRenderList = [
      currentFilterObject,
      ...this.filterRenderList.slice(1)
    ];

    console.log('setFilter Render', this.filterRenderList)
    
  }


  setGroupedFilterSelections(filter: any) {
    // Generate a unique ID for the new filter, you could use a different method
    const newFilterId = Date.now().toString(); // Simple example, consider using a more robust method

    // Prepare the filter object with the new ID
    const newFilter = { ...filter, id: newFilterId };

    // Function to recursively find and update the correct node
    const addFilterToNode = (nodes: any[], nodeId: string, filter: any, otherId: any) => {
      for (const node of nodes) {
        if (node.id === nodeId) {
          // Modify here: Include otherId as part of the newFilter object
          const newFilter = { ...filter, otherId }; // Merge otherId into the filter object
          node.filters.push(newFilter); // Add the updated filter object with otherId
          return true; // Stop searching when the correct node is updated
        }
        if (node.children && node.children.length > 0) {
          if (addFilterToNode(node.children, nodeId, filter, otherId)) {
            return true; // Stop searching if the correct node was found in the children
          }
        }
      }
      return false; // Node not found in this branch
    };
    

    // Attempt to add the new filter to the correct node
    addFilterToNode(this.filterObjectsWithGroups, this.advancedGroupSearchNodeId, newFilter, this.otherId);

    // Since we are modifying the array in place, we might need to trigger a state update manually
    this.filterObjectsWithGroups = [...this.filterObjectsWithGroups];
  }

  setGroupedSearchSections(groupId: string, logicalOperator: 'AND' | 'OR') {
    // Generate a unique ID for the new child section
    const newChildId = Date.now().toString(); // Example ID generation, consider using a UUID for production

    const newChild = {
      id: newChildId,
      filterId: groupId, //abc
      logicalOperator: logicalOperator,
      filters: [],
      children: []
    };

    // Recursive function to find the correct node and add the new child
    const addChildToNode = (nodes: any[], nodeId: string, child: any) => {
      for (const node of nodes) {
        if (node.id === nodeId) {
          if (!node.children) {
            node.children = []; // Ensure the children array exists
          }
          node.children.push(child);
          return true; // Node updated, stop the search
        }
        if (node.children && node.children.length > 0) {
          if (addChildToNode(node.children, nodeId, child)) {
            return true; // Child added in a deeper level
          }
        }
      }
      return false; // Node not found in this branch
    };

    // Attempt to add the new child to the node identified by groupId
    addChildToNode(this.filterObjectsWithGroups, groupId, newChild);

    // Trigger a state update to reflect the change
    this.filterObjectsWithGroups = [...this.filterObjectsWithGroups];
  }

  updateGroupLogicalOperator(groupId: string, logicalOperator: 'AND' | 'OR') {
    const updateOperator = (nodes: any[], nodeId: string, newOperator: 'AND' | 'OR') => {
      for (const node of nodes) {
        if (node.id === nodeId) {
          node.logicalOperator = newOperator; // Update the logical operator here
          return true; // Successfully updated, stop the search
        }
        if (node.children && updateOperator(node.children, nodeId, newOperator)) {
          return true; // Successfully updated in a deeper level
        }
      }
      return false; // Node not found
    };
  
    // Attempt to update the logical operator in the node identified by groupId
    if (updateOperator(this.filterObjectsWithGroups, groupId, logicalOperator)) {
      // If the group was found and updated, trigger a state update
      this.filterObjectsWithGroups = [...this.filterObjectsWithGroups];
      console.log(`Updated logical operator for group ${groupId} to ${logicalOperator}`);
    } else {
      console.log(`Group with ID ${groupId} not found for logical operator update.`);
    }
  }
  


  
  resetToDefaultState() {
    if (this.defaultColumnState) {
      // Using the saved initial state
      this.gridOptions.columnApi.applyColumnState(this.defaultColumnState);
    } else {
      // Using the ag-Grid API method to reset to default
      this.gridOptions.columnApi.resetColumnState();
    }
  }
  

removeFilterSelection(filter) {
  console.log('filter input', filter);
  console.log('filter initial', this.filterRenderList);
  this.setFilterFromChips(filter.searchValue)
   this.externalToggle = filter.searchValue;
  // Update filterRenderList with the current state of filterObject
  this.filterRenderList = this.filterObject.map(obj => ({
    ...obj,
    filterElements: obj.filterElements.map(fe => ({ ...fe }))
  }));

  console.log('synchronized filterRenderList', this.filterRenderList);

  // Remove the filter from filterObject
  this.filterObject.forEach(obj => {
    obj.filterElements = obj.filterElements.filter(item => {
      return !(item.searchField === filter.searchField && item.searchValue === filter.searchValue);
    });
  });

  // Now remove the filter from filterRenderList
  this.filterRenderList.forEach(listItem => {
    listItem.filterElements = listItem.filterElements.filter(item => {
      return !(item.searchField === filter.searchField && (item.searchValue === filter.searchValue || filter.searchValue === ""));
    });
  });

  // Creating new copies for reactivity if needed
  this.filterObject = [...this.filterObject];
  this.filterRenderList = [...this.filterRenderList];

  console.log('filterObject after removal', this.filterObject);
  console.log('filterRenderList after removal', this.filterRenderList);

  // Update the server-side datasource if necessary
  this.updateServerSideDatasource('remove','remove items');
  this.gridOptions.api.setFilterModel(this.filterObject[0].filterElements);

  this.removeFromSearchGroupUI(filter, this.filterObjectsWithGroups)
}


removeFromSearchGroupUI(filterToRemove, filterObjectsWithGroups) {
  // Helper function to remove the filter by ID
  console.log('filterObjectsWithGroups', filterObjectsWithGroups);
  console.log('filterToRemove', filterToRemove);
  const removeFilterById = (filtersArray, filterId) => {
    return filtersArray.filter(filter => filter.id !== filterId);
  };

  // Recursive function to search and remove the filter
  const searchAndRemoveFilter = (groups, filterId) => {
    groups.forEach(group => {
      // Remove the filter from the current group if it matches the filter ID
      group.filters = removeFilterById(group.filters, filterId);

      // If there are children, recurse into them
      if (group.children && group.children.length > 0) {
        searchAndRemoveFilter(group.children, filterId);
      }
    });
  };

  // Start the recursive search and remove process
  searchAndRemoveFilter(filterObjectsWithGroups, filterToRemove.id);

  // Line to deal with full removal as the function to pin point additional nested elements is not yet available
  //this.filterObject[0].filterElements = []
}

handleGroupItemDelete(groupId) {
  // Recursive function to search for and remove the group by ID
  const searchAndRemoveGroup = (groups, groupId) => {
    return groups.reduce((acc, group) => {
      // If the current group matches the groupId, do not add it to the accumulator
      if (group.id === groupId) {
        return acc;
      }
      
      // Otherwise, add the group to the accumulator
      const newGroup = { ...group };
      
      // If the group has children, recurse to potentially remove from children
      if (newGroup.children && newGroup.children.length > 0) {
        newGroup.children = searchAndRemoveGroup(newGroup.children, groupId);
      }
      
      acc.push(newGroup);
      return acc;
    }, []);
  };

  // Start the recursive search and remove process
  this.filterObjectsWithGroups = searchAndRemoveGroup(this.filterObjectsWithGroups, groupId);

  console.log('Updated filterObjectsWithGroups', this.filterObjectsWithGroups);
}



@Listen('searchItemChanged')

searchItemChangedHandler(event: CustomEvent) {
  const { searchField, searchOperator, searchValue, groupId } = event.detail;
  console.log('Event detail handler', event.detail);
  this.refreshChips = true;
  this.setSearchStart = true;
  // Function to check if the entry is valid and complete
  const isEntryValid = (field, operator, value) => {
    // Implement your specific validation logic here
    // For example, check if all fields are non-empty and meet certain criteria
    return field && operator && value && value.trim() !== '';
  };

  
  // Function to update filter list with groups
  const updateFilterObjectsWithGroups = (searchField, searchOperator, searchValue) => {
    let found = false;
    for (let group of this.filterObjectsWithGroups) {
      for (let filter of group.filters) {
        if (filter.searchField === searchField && filter.searchValue === searchValue) {
          filter.searchOperator = searchOperator;
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (!found) {
      this.filterObjectsWithGroups[0].filters.push({
        searchField,
        searchOperator,
        searchValue,
        parentName: "",
        parentPath: "filter.extendedProperties.parentPath",
        id: Date.now().toString(),
        otherId: `id-${Math.random().toString(36).substr(2, 9)}`
      });
    }
  };

    // Update filter list with groups only if there's no groupId in the event details
    if (!groupId) {
      updateFilterObjectsWithGroups(searchField, searchOperator, searchValue);
    }
  
  const filterObjectIndex = 0; 
  const filterRenderListIndex = 0;

  const updateFilterList = (filterList, index) => {
    const operatorValue = searchOperator.value ? searchOperator.value : searchOperator;
    const existingFilterIndex = filterList[index].filterElements.findIndex(
      obj => obj.searchField === searchField && obj.searchValue === searchValue
    );

    if (isEntryValid(searchField, searchOperator, searchValue)) {
      if (existingFilterIndex !== -1) {
        filterList[index].filterElements[existingFilterIndex] = {
          searchField,
          searchOperator: operatorValue,
          searchValue, 
          groupId: 1,
          fieldId: event.detail.groupId
        };
      } else {
        filterList[index].filterElements.push({
          searchField,
          searchOperator: operatorValue,
          searchValue,
          groupId: 1,
          fieldId: event.detail.groupId
        });
      }
    } else {
      if (existingFilterIndex !== -1) {
        filterList[index].filterElements.splice(existingFilterIndex, 1);
      }
    }
  };

  updateFilterList(this.filterObject, filterObjectIndex);
  updateFilterList(this.filterRenderList, filterRenderListIndex);

  // Immutably update the state for both lists
  this.filterObject = [...this.filterObject];
  this.filterRenderList = [...this.filterRenderList];
  this.filterObjectsWithGroups = [...this.filterObjectsWithGroups];

  
}
// searchItemChangeHandler ends...


// Utility function to wait for `bulkActions` to be available in localStorage
waitForBulkActions = (): Promise<any> => {
  return new Promise((resolve) => {
    const checkLocalStorage = () => {
      const bulkActions = localStorage.getItem('bulkActions');
      if (bulkActions) {
        resolve(JSON.parse(bulkActions));
      } else {
        setTimeout(checkLocalStorage, 1000); // Check every 1 second
      }
    };
    checkLocalStorage();
  });
};

// Modified handleGetActions to wait for bulkActions and then execute grid action
async handleGetActions(data: any, ind) {
  try {
    const bulkActions = await this.waitForBulkActions(); // Wait for bulkActions to be available
    
    // const actionId = bulkActions[ind].actionId; 
    // console.log('actionId', actionId)
    
    const value = bulkActions[ind].value; 
    
    const response = await executeGridAction(data, value, this.accessToken, this.tenantId);

    console.log('Response received', response);
    if (response) {
      console.log('Calling updateServerSideDatasource');
      this.updateServerSideDatasource('', 'handleGetActions');
    } else {
      console.error('Unexpected response:', response);
    }
  } catch (error) {
    console.error('There was an error executing the grid action:', error.response ? error.response.data : error);
    this.showNotification = true;
    this.notificationMessage = error.response ? error.response.data : "An unknown error occurred";
    this.notificationStatus = 'error';
  }
}




  handleSelectedOption(event: CustomEvent) {
    // Assuming `event.detail` includes the selected option's identifier, like `value`
    const { name, actionTypeId, value } = event.detail; // You might need to adjust based on the actual structure
     console.log('actionTypeId', actionTypeId)
    // Find the index of the selected option based on its value
    const index = this.transformedOptions.findIndex(option => option.value === value);
  
    if (index !== -1) {
      console.log(`Selected option index: ${index}`);
      // Now you have the index, you can use it as needed
    } else {
      console.log('Selected option was not found in transformedOptions');
      return; // Exit if no valid selection was made
    }
  
    if (this.gridOptions && this.gridOptions.api) {
      const selectedNodes = this.gridOptions.api.getSelectedNodes();
      
      // Extract the data from selected nodes
      const selectedData = selectedNodes.map(node => node.data);
      
      console.log('Selected data:', selectedData);
      // Use the found index from the selected option for whatever logic needs it
      this.handleGetActions(selectedData, index); // Updated to use `index`
  
      // Extract just the ids from the selectedData
      const selectedIds = selectedData.map(data => data.id);
      
      console.log('Selected ids:', selectedIds);
  
      // Emit the selectedIds array so parent components can listen to it
      this.selectedIdsChanged.emit(selectedIds);
    }
  
    // Perform some logic based on the selected option
    if (name) {
      console.log(`Option selected: ${name}`);
      // Additional logic for handling the selection by name
    }
  
    // Perform some action based on the actionTypeId, if it exists
    if (actionTypeId) {
      console.log(`Action to be performed: ${actionTypeId}`);
      // Execute some action based on the actionTypeId
      // Example: this.performActionById(actionTypeId);
    }
  }
  

  resetSearchHandler() {
    this.filterObject = JSON.parse(JSON.stringify(this.defaultFilterObject));
  }
  

  updateSearchObject(detail: { searchField: string, searchOperator: string, searchValue: any }) {
    // Clone the first object in the filterObject array
    const updatedObject = { ...this.filterObject[0] };
    console.log('detail', detail)
    // Append the new filter element to filterElements array
    updatedObject.filterElements = [...updatedObject.filterElements, detail];
  
    // Replace the first object in the filterObject array with the updated object
    this.filterObject = [updatedObject];
    
    console.log('Updated filterObject:', this.filterObject);
  }

  // Commented out filter options are currently not suppored in the regex
  filterOptions = {
    equals: '=',
    contains: 'LIKE',
    // notContains: 'NOT LIKE',
    notEqual: '<>',
    greaterThan: '>',
    lessThan: '<',
    greaterThanOrEqual: '>=',
    lessThanOrEqual: '<=',
    startsWith: 'STARTSWITH', 
    // endsWith: 'ENDSWITH', 
    // blank: 'IS NULL',
    // notBlank: 'IS NOT NULL',
    inRange: 'BETWEEN', 
  };

  transformAndApplyFilters(filterModel: {[key: string]: FilterDetail}) {
    for (const [column, filterDetails] of Object.entries(filterModel)) {

      if (filterDetails && filterDetails.type) {
        const selectedFilterOptions = this.filterOptions[filterDetails.type];

        let value = filterDetails.filter;

        // If you are filtering a date columm
        if (filterDetails.filterType === 'date') {

          // If you are filtering between two dates
          if (filterDetails.type === 'inRange') {
            value = filterDetails.dateFrom + "," + filterDetails.dateTo;

          }else{
            value = filterDetails.dateFrom;
          }
        }else if (filterDetails.filterType === 'text'){
            value = filterDetails.filter;
        
        }else if (filterDetails.filterType === 'number'){
          if (filterDetails.type === 'inRange') {
            value = filterDetails.filter + "," + filterDetails.filterTo;
          }else{
            value = filterDetails.filter;
          }
        }
        
        const setDetail = {
          searchField: column,
          searchOperator: selectedFilterOptions,
          searchValue: value
        };

        //this.updateSearchObject(detail);
        this.searchItemChangedHandler({
          detail: setDetail,
          initCustomEvent: function (): void {
            throw new Error('Function not implemented.');
          },
          bubbles: false,
          cancelBubble: false,
          cancelable: false,
          composed: false,
          currentTarget: undefined,
          defaultPrevented: false,
          eventPhase: 0,
          isTrusted: false,
          returnValue: false,
          srcElement: undefined,
          target: undefined,
          timeStamp: 0,
          type: '',
          composedPath: function (): EventTarget[] {
            throw new Error('Function not implemented.');
          },
          initEvent: function (): void {
            throw new Error('Function not implemented.');
          },
          preventDefault: function (): void {
            throw new Error('Function not implemented.');
          },
          stopImmediatePropagation: function (): void {
            throw new Error('Function not implemented.');
          },
          stopPropagation: function (): void {
            throw new Error('Function not implemented.');
          },
          NONE: 0,
          CAPTURING_PHASE: 1,
          AT_TARGET: 2,
          BUBBLING_PHASE: 3
        });
      }
    }
  }
  

  updateSearchObjectState() {
    // Clone the first object in the filterObject array
    const updatedObject = { ...this.filterObject[0] };
  
    // Replace the first object in the filterObject array with the updated object
    this.filterObject = [updatedObject];

  }
  
 
  changeOperator(event: CustomEvent) { 
    // Convert string to integer
    const convertedValue = parseInt(event.detail, 10);
    console.log('Converted value:', convertedValue);
    // Update the state
    this.logicalSearchOperator = convertedValue;
  }
  
  
 handleGetInstanceAndMethod = async () => {
    const queryId = this.queryId; 
    const apiData = await getInstanceAndMethod(queryId, this.tenantId, this.accessToken);
    if (apiData) {
      // Save data to local storage
      localStorage.setItem('apiMethodId', apiData.apiMethodInstanceResponse.apiMethodId);
      localStorage.setItem('filterBody', JSON.stringify(apiData.apiMethodInstanceResponse.body));
      localStorage.setItem('catalogModification', JSON.stringify(apiData.apiMethodInstanceResponse.catalogModification));
      localStorage.setItem('entityName', apiData.apiMethodResponse.entityName);

      console.log('apiData.apiMethodInstanceResponse.catalogModification', JSON.parse(apiData.apiMethodInstanceResponse.catalogModification))

    const getConfiguredColumnDefs = UdpGridColumnDefs(JSON.parse(apiData.apiMethodInstanceResponse.catalogModification))
    this.configuredColumnDefs = getConfiguredColumnDefs
    console.log('getConfiguredColumnDefs', this.configuredColumnDefs)
    this.getLookupsMap(JSON.parse(apiData.apiMethodInstanceResponse.catalogModification))
    }
  };



  
  handleGetPromotedLookupMethod = async () => {
    const productId = this.productId;
    const accessToken = this.accessToken; 
  
    try {
      let apiCatalogId = this.apiCatalogId;
  
      if (!apiCatalogId) {
        apiCatalogId = localStorage.getItem('apiCatalogId');
      }
  
      if (!apiCatalogId) {
        const response = await getApiCatalogAndProduct(localStorage.getItem('tennatId'), productId, accessToken);
        apiCatalogId = response.apiCatalogId;
      }
  
      if (!apiCatalogId) {
        throw new Error('apiCatalogId is undefined');
      }
  
      // Fetching Promoted Lookup Method
      const promotedLookupMethodResponse = await getPromotedLookupMethod(apiCatalogId, productId, accessToken);
      console.log('Promoted Lookup Method Response X:', promotedLookupMethodResponse);
  
      // Set the local storage items as needed for promotedLookupMethodResponse
      localStorage.setItem('promotedLookupMethodResponse', promotedLookupMethodResponse.unityBaseGetDataMethod.apiMethodId);
      localStorage.setItem('lookupApiMethodId', promotedLookupMethodResponse.unityBaseGetDataMethod.apiMethodId);
      localStorage.setItem('promotedEntity', JSON.stringify(promotedLookupMethodResponse));
      this.promotedEntity = promotedLookupMethodResponse;
  
      let productList = state.catalogData;
      // let apiCatalogData: any;
      // try {
      //   // Retrieve apiCatalogData from localForage otherwise make the api call
      //   apiCatalogData = await localforage.getItem('apiCatalogData');
      // } catch (err) {
      //   console.error('LocalForage: Error retrieving apiCatalogData:', err);
      // }
      // @todo consider removing call
      // if (!productList && !apiCatalogData) {
      //   productList = await getProductList(apiCatalogId, accessToken);
      // } else if (!productList && apiCatalogData) {
      //   productList = apiCatalogData;
      // }
  
      this.catalogList = productList; 
  
    } catch (error) {
      console.error('Error performing API call:', error);
    }
  };
  

  // @Watch('filterChips')
  async getLookupId(lookupsMap: any) {
    if (!lookupsMap) return null;
    
    const lookupToFilterOn = Object.values(lookupsMap).find((item: any) => item.filterOn);
    console.log('lookupToFilterOn', lookupToFilterOn)
    const lookupId = (lookupToFilterOn as any)?.value || '';
  
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  
    if (!lookupId || typeof lookupId !== 'string' || !uuidPattern.test(lookupId)) {
      console.error('Invalid lookupId', lookupId);
      return null;
    }
  
    console.log('lookupId', lookupId)
  
    // Call the function and await its result
    const data = await executeQueryWithParameters(
      {
        "data": {
          "id": lookupId
        }
      },
      localStorage.getItem('promotedLookupMethodResponse') || this.apiMethodId,
      this.accessToken, 
      this.tenantId,
    );
    this.filterChips = data.data;
    console.log('filterChips has been updated', this.filterChips)
    return lookupId;
  }
  

  getLookupsMap(queryColumnsData) {
    
    if (!queryColumnsData.length) return null;
      const map = {};
      const lookupColumns = queryColumnsData.filter((column) => {
      const lookupValue = column.extendedProperties?.lookup;
      return !!lookupValue;
    });

    lookupColumns.forEach((lc) => {
      map[lc.name] = {
        lookupKeyName: lc.extendedProperties?.lookupKeyName || '',
        lookupValueName: lc.extendedProperties?.lookupKeyName || '',
        value: lc.extendedProperties?.lookup || '',
        filterOn: !!lc.filterOn || false
      };
    });
    this.getLookupId(map)
    const keys = Object.keys(map);
    const keyString = keys[0];
    this.filterOn = keyString
    return map;
  }

  @Watch('bulkActions')
  transformBulkActions() {
    if (this.bulkActions) {
      this.transformedOptions = this.bulkActions.map((action, index) => ({
        label: action.name,
        value: action.value,
        id: index 
      }));
    }
  }
  


  toggleNotification = () => {
    this.showNotification = !this.showNotification;
  }




  handleSideSheetButtonClick = async () => {
    
    this.testGroupFilter()
    this.updateServerSideDatasource('','advanced grouped search')
    this.nativeFilterInput = false;
    this.customSearchDrawerOpen = false;
  };

  

  // advanced search grouping

  handleAddNewFilter = (groupId: string, otherId: string) => {
    // Process the groupId to add a new filter
    console.log('Processing groupId in parent ATG 1:', groupId);
    console.log('Processing groupId in parent ATG 2:', otherId);
    this.advancedGroupSearchNodeId = groupId;
    this.otherId = otherId;
  };



  handleAddNewGroup = (groupId: string, logicalOperator: 'AND' | 'OR') => {
    console.log('Processing groupId in parent Group ATG:', groupId, logicalOperator);
    this.advancedGroupSearchNodeId = groupId;
    // Pass the logicalOperator to setGroupedSearchSections
    this.setGroupedSearchSections(groupId, logicalOperator);
  };
  

  updateLogicalOperator = (groupId: string, logicalOperator: 'AND' | 'OR') => {
    console.log(`Updating logical operator for group ${groupId} to ${logicalOperator}`);
    // Implement the logic to update the logical operator for the group
    this.updateGroupLogicalOperator(groupId, logicalOperator);
  };
  
  


  @Watch('externalPayload')
  externalPayloadChanged(newValue: any, oldValue: any) {
    if (newValue !== oldValue) {
      this.handleTransformSearchData();
    }
  }

  @Watch('dataEmitterRequest')
  dataEmitterChanged(newValue: any, oldValue: any) {
    if (newValue !== oldValue) {
      console.log('dataEmitterChanged', newValue);
      this.handleDataEmitterRequest(newValue);
      
      // Create a new CustomEvent with the newValue as detail
      // const newEvent = new CustomEvent('searchItemChange', {
      //   detail: newValue
      // });
      // this.searchItemChangedHandler(newEvent);
    }
  }
  

  isEmptyObject = (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  handleDataEmitterRequest = async (newValue) => {
    // Check if newValue is null, undefined, or an empty object
    if (newValue === null || newValue === undefined || this.isEmptyObject(newValue)) {
      // Handle the case where newValue is not usable
      console.log('Skipping API call due to empty or invalid newValue');
      return;
    }
  
    const emitterSearchObject = {
      "pageNumber": 1,
      "pageSize": 20,
      "filterElements": [newValue],
      "orderElements": [],
      "groupingType": "",
      "groupProperty": [],
      "groupOperationList": [],
      "eagerLoad": false,
      "logicalSearchOperator": 1,
      "type": "advanced"
    }

   
  try {
    const response = await executeQueryAdHoc(
      emitterSearchObject,
      localStorage.getItem('apiMethodId'),
      localStorage.getItem('accessToken'),
      localStorage.getItem('tennatId'),
      ''
    );
    console.log('data emitter response', response);

    this.externalEmitter.emit(response); // Emitting the response data
  } catch (error) {
    console.error('Error fetching data:', error);
  }


  }

  // handleTransformSearchData = () => {
  //   const modifiedSearchObjects = transformSearchData(this.externalPayload, this.searchKey);
  
  //   // Merge the filterElements
  //   if (modifiedSearchObjects.filterElements) {
  //     this.filterObject[0].filterElements.push(...modifiedSearchObjects.filterElements);
  //   }
  
  //   // Handle filterGroups (assuming you want to replace the existing ones)
  //   if (modifiedSearchObjects.filterGroups) {
  //     this.filterObject[0].filterGroups = modifiedSearchObjects.filterGroups;
  //   }
  
  //   console.log('modifiedSearchObjects', this.filterObject[0].filterElements);
  //   this.updateServerSideDatasource('','handleTransformSearchData');
  // }
  
  
  handleTransformSearchData = () => {
    const modifiedSearchObjects = transformSearchData(this.externalPayload, this.searchKey);
  
    // Merge the filterElements
    if (modifiedSearchObjects.filterElements) {
      this.filterObject[0].filterElements.push(...modifiedSearchObjects.filterElements);
    }
  
    // Handle filterGroups (assuming you want to replace the existing ones)
    if (modifiedSearchObjects.filterGroups) {
      this.filterObject[0].filterGroups = modifiedSearchObjects.filterGroups;
    }
  
    // Log the updated filter elements
    console.log('modifiedSearchObjects', this.filterObject[0].filterElements);
  
    // Extract the first element to send as an individual object
    const firstFilterElement = this.filterObject[0].filterElements[0];
  
    // Create a new CustomEvent with the first object as detail (instead of the entire array)
    const filterElementEvent = new CustomEvent('filterElementChange', {
      detail: firstFilterElement
    });
  
    // Pass the event to the handler function
    this.searchItemChangedHandler(filterElementEvent);
  
    this.updateServerSideDatasource('', 'handleTransformSearchData');
  }
  


  setGlobalSearchOperatoryType = (operator: number) => {
    this.logicalSearchOperator = operator;
    this.updateServerSideDatasource('','setGlobalSearchOperatoryType');
  }
  

  testGroupFilter = () => {
    const searchGroupFilterPayload = buildSearchPayload(this.filterObjectsWithGroups);
    this.filterObject = [searchGroupFilterPayload];
    this.setSearchStart = true;
  }



  updateFilterObjectsWithInput(filterObjectsWithGroups, filterObject) {
    const updateFilters = (filters, filterElements) => {
        filters.forEach(filter => {
            const inputElement = filterElements.find(element => element.fieldId === filter.otherId);
            if (inputElement) {
                filter.searchOperator = inputElement.searchOperator;
                filter.searchValue = inputElement.searchValue;
            }
        });
    };

    const traverseAndUpdate = (objects) => {
        objects.forEach(obj => {
            // Update the current level filters
            if (obj.filters) {
                updateFilters(obj.filters, filterObject[0].filterElements);
            }
            // Recursively update children, if any
            if (obj.children && obj.children.length > 0) {
                traverseAndUpdate(obj.children);
            }
        });
    };

    // Start the traversal and update process
    traverseAndUpdate(filterObjectsWithGroups);
    this.updateChipLayout();
}
  
  
  handleSearchItemChange(detail) {
    console.log('Search item changed:', detail);
    // Assuming 'detail' contains 'uniqueId' and the new data for the filter
    // this.updateFilterWithBlurData(detail.uniqueId, detail);
    console.log('filterObjectsWithGroups', this.filterObjectsWithGroups)
    //this.updateFiltersFromGroupSearch()
    this.updateFilterObjectsWithInput(this.filterObjectsWithGroups, this.filterObject);
  }


  
  collectAllFilters(filterGroup, level = 0) {
    let allFilters = [];
    
    // Collect top-level filters and include the current level
    if (filterGroup.filters && filterGroup.filters.length > 0) {
      allFilters = allFilters.concat(filterGroup.filters.map(filter => ({ ...filter, level })));
    }

    // Recursively collect filters from children, incrementing the level
    if (filterGroup.children && filterGroup.children.length > 0) {
      filterGroup.children.forEach(child => {
        allFilters = allFilters.concat(this.collectAllFilters(child, level + 1));
      });
    }

   
    return allFilters;
  }


  refreshOnNoResults = () => {
    this.filterObject[0].filterElements = [];
    if (this.noResults) {
      this.loadAgGridScript()
      .then(() => {
        if (this.nativeFilterInput == true) {
          // this.setAgGridLicenseKey();
          this.initializeGrid();
        }
      })
      .then(() => {
        this.updateServerSideDatasource('', 'initialLoad');
      })
      .then(() => { 
        this.handleSecondarySetup();
      })
      .catch(error => {
        console.error('Error during grid initialization:', error);
      });
    }
    this.updateServerSideDatasource('','advanced search sheet')
    this.filterObjectsWithGroups = [
      {
        id: 'root',
        logicalOperator: 'AND',
        filters: [
          
        ]
      }
    ]
    this.updateChipLayout()
    this.noResults = false;
    this.setDefaultView();
    // this.nativeFilterInput = false;
  }


  deleteHandlerView = (gridViewId) => {
    this.viewId = gridViewId
    this.confirmDialogDeleteView = true
  }


  

 
  updateChipLayout = () => {
    requestAnimationFrame(() => {
      const chipsContainer = this.el.shadowRoot
        ? this.el.shadowRoot.getElementById('advanced-group-search-chips')
        : document.getElementById('advanced-group-search-chips');
  
      if (chipsContainer) {
        // Force reflow if necessary
        chipsContainer.offsetWidth;
        
        const containerWidth = chipsContainer.getBoundingClientRect().width;
        let totalChipWidth = 0;
        const chipWidths = Array.from(chipsContainer.querySelectorAll('stencil-chip'))
          .map(chip => chip.getBoundingClientRect().width);

        // console.log('chipWidths', chipWidths)
  
        let maxVisible = 1;
        
        
        for (let width of chipWidths) {
          if (totalChipWidth + width + 400 > containerWidth) break;
          if (maxVisible >= this.maxChipsAllowed) break; // Limit the number of visible chips to 7, but only after width check
          totalChipWidth += width;
          maxVisible++;
      }
        this.visibleChips = [...this.allFilters.slice(0, maxVisible)];
        this.overflowChips = [...this.allFilters.slice(maxVisible)];
      
        this.refreshChips = false;
        // console.log('Container width:', containerWidth, 'Total chip width:', totalChipWidth, 'Max visible:', maxVisible);
      } else {
        console.warn("Chips container not found");
      }
    });
  };
  
  
  


  updateLayoutAfterRender = () => {
    requestAnimationFrame(this.updateChipLayout);
  }

  // Fetch recentSearches from local storage
  getRecentSearches = () => {
    const recentSearchesString = localStorage.getItem("recentSearches");
    if (recentSearchesString == null) { return }
    const recentSearches: any[] = JSON.parse(recentSearchesString);
    var currentGridSearchHistoryObj = recentSearches.find(item => item.gridUID === this.gridUID);
    if (!currentGridSearchHistoryObj) {
      this.recentSearches = [];
    }else{
      this.recentSearches = recentSearches.length > 0 ? currentGridSearchHistoryObj.searchHistory : [];
    }
    this.recentSearchesOptions = this.recentSearches.map(item => ({
      label: item.timestamp,
      value: item.searchObj
    }))
  }
  // Handle selecting a recent search from the drop down udp-selector
  selectRecentSearch = (e) => {
    this.fullClearSearch(); // Clear previous searches first
    var selectedSearchObj = e.detail.value;
    this.filterObject[0] = selectedSearchObj;
    this.filterRenderList[0] = selectedSearchObj;
    this.isRecentSearch = true;
    this.updateServerSideDatasource('','advanced grouped search')
    this.nativeFilterInput = false;
    // this.customSearchDrawerOpen = false; // uncomment if want advanced search sidesheet to close after clicking

    var filterObjectsWithGroupsTemp = this.filterObjectsWithGroups;
    selectedSearchObj.filterElements.map((tempFilter, index) => {
      filterObjectsWithGroupsTemp[0].filters[index] = { ...tempFilter };
      // console.log("after assignment: ", filterObjectsWithGroupsTemp[0].filters[index]);
    });
    this.filterObjectsWithGroups = filterObjectsWithGroupsTemp;

    // this.updateFilterObjectsWithInput(this.filterObjectsWithGroups, this.filterObject);
  }

   @Watch('allFilters')
  allFiltersChanged() {
    if(this.refreshChips) {
      this.updateChipLayout();
    }
  }


//   private isUpdatingChipLayout = false;

// // @Watch('allFilters')
// allFiltersChanged() {
//   if (!this.isUpdatingChipLayout) {
//     this.isUpdatingChipLayout = true;
//     this.updateChipLayout();
//     this.isUpdatingChipLayout = false;
//   }
// }



  render() { 
    const filterPanelWidth = this.filterPanelOpen ? '200px' : 'initial';
    const shouldShowSecondRow = 
    (this.setSearchStart && this.filterObjectsWithGroups?.[0]?.filters?.[0]?.searchValue) ||
    this.filterChips.length > 0 ||
    this.loadedView.length > 0 ||
    this.hotListActive ||
    this.kpiValues.length > 0 ||
    this.selectedRowCount > 0;

const shouldHideSecondRow = !shouldShowSecondRow;
   
    this.allFilters = this.filterObjectsWithGroups.reduce((acc, curr) => {
      return acc.concat(this.collectAllFilters(curr));
    }, []);


    return (
      <div>
       
      <div>
      {this.showNotification && (
        <udp-notification active={this.showNotification}
                          message={this.notificationMessage}
                          status={this.notificationStatus}
                          userCancel
                          style={{ zIndex: '999991', transform: 'translateY(20px)' }}
                          >
        </udp-notification>
      )}
      </div>
        <style>
          {`:host ::slotted(.ag-side-bar) {
            width: ${filterPanelWidth} !important;
          }`}
        </style>
      {/* <button onClick={() =>this.showCatalogDataTest()} >Look at ctlg</button> */}
      {/* <button onClick={()=> this.testGroupFilter()} >Test payload build grouped</button>
      <button onClick={()=> this.updateFiltersFromGroupSerch()} >Test data to group search array</button> */}

        <grid-primary-bar 
          title={this.gridBarTitle}
          customSaveViewClick={()=>this.showViewSave()}
          customShowViewClick={() => this.showViews()}
          customShowHotlistClick={() => this.showHotlist()}
          customShowCustomSearchClick={() => this.showCustomSearch()}
          customClearClick={() => this.clearFilter()}
          customExpandClick={() => this.expandColumns()}
          customExportClick={() => this.exportToCsv()}
          hiddenActionButtons={['saveView', 'filter']}
          //primaryActionClick={() => this.primaryActionClick()}
          primaryActionClick={()=> this.onFirstDataRendered(this.fullViewData)}
          customColumnViewClick={() => this.togglePanel('columns')}
          customFitColumnClick={() => this.fitColumns()}
          customFilterViewClick={() => this.togglePanel('filters')}
          customToggleServerClientClick={() => this.toggleServerSide()}
          customAdvancedSearchClick={() => this.showAdvancedSearch()}
          customShowGridOptionsClick={() => this.showGridOptions()}
          showAdvancedSearchFeature={this.showAdvancedSearchFeature}
          showFilterColumnFeature={this.showFilterColumnFeature}
          showHotlistButton={this.showHotlistButton}
        >
        </grid-primary-bar>

        <udp-pop-over-grid-action-header isOpen={this.gridOptionsDrawerOpen} anchorElement={document.querySelector('grid-primary-bar')}>
          <stencil-icon-button-grid-action-header onClick={() => {this.togglePanel('columns'); this.showGridOptions()}} tooltip='Show/Hide Columns'><unity-typography variant="button">Show/Hide Columns</unity-typography></stencil-icon-button-grid-action-header>
          <udp-divider size="100%"></udp-divider>
          <stencil-icon-button-grid-action-header onClick={() => {this.fitColumns(); this.showGridOptions()}} tooltip='Fit to Column'><unity-typography variant="button">Fit to Column</unity-typography></stencil-icon-button-grid-action-header>
          <udp-divider size="0px"></udp-divider>
          <stencil-icon-button-grid-action-header onClick={() => {this.expandColumns(); this.showGridOptions()}} tooltip='Expand Grid'><unity-typography variant="button">Expand Grid</unity-typography></stencil-icon-button-grid-action-header>
        </udp-pop-over-grid-action-header>
    





       
        <div class="second-row" style={{ display: shouldHideSecondRow ? 'none' : '' }}>
  

      {this.rowsSelected && (
        <div class="bulk-select"  >
        <udp-badge content={this.selectedRowCount}>
          <udp-selector
            options={this.bulkActions.length > 0 ? this.transformedOptions : []}
            onOptionSelected={(e) => this.handleSelectedOption(e)}
          ></udp-selector>
        </udp-badge>
        </div>
      )}
      
     { this.loadedView.length !== 0 &&  <div class="chip-wrapper">
      <stencil-chip text={this.loadedViewTitle} color="secondary"  
      // onOnDelete={this.handleDelete as any} 
      onOnDelete={this.handleChipDelete}
      defaultToggled={true}  leftIcon={Asterisk16} ></stencil-chip>
      <udp-divider variant="vertical" size="30px"></udp-divider>
      </div>}
{/* 
Here is the filter chip menu from lookkups */}
<div class="chip-section" >
{this.filterChips.length > 0 &&   <udp-dynamic-container-with-menu id="filterChipsContainer" externalToggle={this.externalToggle}   onUdpChipClicked={(event: CustomEvent) => this.setFilterFromChips(event.detail)}  menuItems={this.filterChips} ></udp-dynamic-container-with-menu>}
</div>
<div class="advanced-group-search-chips" id="advanced-group-search-chips" >

<div class="chip-container">
  {/* {console.log('this.visibleChips', this.visibleChips)} */}
        { this.visibleChips && this.visibleChips.map((filter) => (
          
          <stencil-chip
            key={filter.id}
            text={`${filter.searchField} ${filter.searchOperator} ${filter.searchValue}`} 
            level={filter.level}
            onOnDelete={() => this.removeFilterSelection(filter)}
            defaultToggled={true}
          />
        ))}

{this.overflowChips && this.overflowChips.length > 0 && (
          <div  >
        {this.overflowChips.length > 0 &&    <stencil-icon-button 
              icon={ !this.overflowActive ? Menu16 : close16 } 
              onClick={() => this.overflowActive = !this.overflowActive} 
              tooltip="Show more filters" 
            />}
            <udp-pop-over isOpen={this.overflowActive} >
              <div class="overflowChip" >
              {this.overflowChips.map((filter) => (
                <stencil-chip
                  key={filter.id}
                  text={`${filter.searchField} ${filter.searchOperator} ${filter.searchValue}`}
                  level={filter.level}
                  onOnDelete={() => this.removeFilterSelection(filter)}
                  defaultToggled={true}
                />
              ))}
</div>
           </udp-pop-over>
          </div>
        )}
      </div>



<div>
 
</div>



</div>

<div class="kpi"  >
    <kpi-list kpiValues={this.kpiValues}></kpi-list>
</div>
      </div>
      {this.linearLoading &&  <udp-linear-loader/> }
      <div style={{marginLeft: '24px'}} >  { this.serverColumnDefs.length === 0 && <udp-grid-loader num-columns="6" num-rows="10"></udp-grid-loader>}</div>   
     
   
  { this.noResults && <div><upd-alert-banner onClick={()=> this.refreshOnNoResults()}  type="info" message="Sorry, no records meet your search criteria"></upd-alert-banner></div>}
 <div> <ag-table gridOptions={this.gridOptions} licensekey={LicenseKey}></ag-table>  </div>    
 {/* {console.log('this.gridOptions', this.gridOptions)} */}
       



        <side-sheet  sideSheetButtonLabel="Search"  handleSideSheetButton={()=> this.updateServerSideDatasource('','advanced search sheet')}  title='Advanced Search' open={this.advancedDrawerOpen} toggleDrawer={() => this.primaryActionClick('advancedSearch')} position='right' >
          <div style={{width: '1200px'}}> 
              <advanced-search 
                handleDelete={(filter) => this.removeFilterSelection(filter)} 
                filterRenderList={this.filterRenderList}  
                filterList={this.extendedSearchFilterList} // list that shows available filters
                handleItemClick={(headerName) => this.setFilterSelections(headerName)}
                onAdvancedSearchItemChange={(event: CustomEvent) => this.updateSearchObject(event.detail)}
                handleValueChanged={this.changeOperator}
                //onRequestExtendedFilterList={(event: CustomEvent<string>) => this.getExtendedAdvancedSearchFilterList(event.detail)}
                fetchFilters={()=>this.getExtendedAdvancedSearchFilterList('test')}
              />
           </div>
          </side-sheet>

        <side-sheet  widthOption="short"  handleSideSheetButton={()=> this.updateServerSideDatasource('','views panel') }  title='Views' open={this.viewDrawerOpen} toggleDrawer={() => this.primaryActionClick('views')} position='right' >
          <div>
              <div style={{width: '450px', marginBottom: '8px'}} >
                  <hint-panel hint="Quickly access and manage your pre-configured table/grid views. These views are designed to help you focus on specific sets of data and streamline your workflow." 
                      hideHintText="Hide Hint">
                  </hint-panel>
              </div>

              <div style={{width: '446px'}} >
              { 
                this.viewListRowData && this.viewListRowData.map((item => {
                  if (item.gridViewVisibilityTypeId === 2  || item.userId.toLowerCase() === this.userId.toLocaleLowerCase()){
                    return ( 
                      <tree-list-item
                      // key={index}
                      showEditOption
                      showDeleteOption
                      label={item.name}
                      onClick={() => this.handleButtonClick(item.gridViewId)}
                      editHandler={()=>this.openViewEdit(item.gridViewId, item.name, item.isDefault, item.gridViewVisibilityTypeId)}
                      deleteHandler={()=> this.deleteHandlerView(item.gridViewId)}
                      //deleteHandler={() => this.confirmViewDelete(item.name, item.gridViewId)}
                      showUpdateDefaultOption={true}
                      updateDefaultHandler={() => this.updateDefaultView(item)}
                      isDefault={item.isDefault}
                      gridViewVisibilityTypeId={item.gridViewVisibilityTypeId}
                      showAdd={false}            
                      showViewOption={false}
                      >
                    </tree-list-item>
                    )
                  }

              }))
              
              }</div>
            </div>
        </side-sheet>
        
        <side-sheet    
          title='Search' 
          sideSheetButtonLabel="Search"   
          handleSideSheetButton={this.handleSideSheetButtonClick}  
          open={this.customSearchDrawerOpen} 
          toggleDrawer={() => this.primaryActionClick('customSearch')} 
          position='right' 
          buttonTransform={this.buttonTransform}
          >
         
            {/* <udp-dynamic-form ref={el => this.dynamicFormRef = el as HTMLUdpDynamicFormElement}></udp-dynamic-form> */}

            <advanced-search-grouped 
                handleAddNewFilter={this.handleAddNewFilter}
                handleAddNewGroup={this.handleAddNewGroup}
                handleDelete={(filter) => this.removeFilterSelection(filter)} 
                filterRenderList={this.filterRenderList}  
                filterList={this.extendedSearchFilterList} // list that shows available filters
                //handleItemClick={(headerName) => this.setFilterSelections(headerName)}
                handleItemClick={(headerName) => this.setGroupedFilterSelections(headerName)}
                onAdvancedSearchItemChange={(event: CustomEvent) => this.updateSearchObject(event.detail)}
                handleValueChanged={this.changeOperator}
                filterObjectsWithGroups={this.filterObjectsWithGroups}
                //onRequestExtendedFilterList={(event: CustomEvent<string>) => this.getExtendedAdvancedSearchFilterList(event.detail)}
                fetchFilters={()=>this.getExtendedAdvancedSearchFilterList('test')}
                onSearchItemChanged={(event) => this.handleSearchItemChange(event.detail)}
                updateLogicalOperator={this.updateLogicalOperator.bind(this)}
                handleGroupItemDelete={(group) => this.handleGroupItemDelete(group)} 
                recentSearchesOptions={this.recentSearchesOptions}
                selectRecentSearch={this.selectRecentSearch}
                fullClearSearch={this.fullClearSearch}
              />

        </side-sheet>

        <side-sheet disabled={this.showHotlistForm} widthOption="short"  sideSheetButtonLabel="Create New Hotlist"  handleSideSheetButton={()=> this.toggleHotlistForm()}  title='Hot Lists' open={this.hotlistDrawerOpen} toggleDrawer={() => this.primaryActionClick('hotlists')} position='right' >
          <div>
          { this.showHotlistForm && <udp-hotlist-form handleFormSubmit={this.handleSaveHotlist}  handleCancelClick={()=> this.toggleHotlistForm()} ></udp-hotlist-form>}

              <div style={{width: '446px'}} >
              { 
                this.allHotlists && this.allHotlists.map((item => {
                  if (item.domain === localStorage.getItem('entityName')) {
                    return ( 
                      <tree-list-item
                      // key={index}
                      label={item.name}
                      showViewOption={true}
                      showAdd={this.businessObjectKey ? true : false}
                      //showAdd={true}
                      showDeleteOption={true}
                      viewHandler={() => this.handleRequestView(item.hotListId)}
                      deleteHandler={() => this.confirmRequestDelete(item.hotListId)}
                      
                      // dataOne={new Date(item.createdOn).toLocaleDateString('en-GB', { year: '2-digit', month: '2-digit', day: '2-digit' })}
                      // dataTwo={new Date(item.createdOn).toLocaleDateString('en-GB', { year: '2-digit', month: '2-digit', day: '2-digit' })}
                      onClick={() => this.handleSetSingleHotlistItem(item.hotListId)}
                      statusValue={item.isPrivate}
                      statusClasses={{
                        'true': 'default', 
                        'false': 'neutral' 
                      }}
                      statusLabel={item.isPrivate ? 'Private' : 'Shared'}
                      >
                    </tree-list-item>
                    )
                  }
               
              }))
              
              }
      
              
              </div>
            </div>
        </side-sheet>

        <save-view-form-dialog  
          open={this.saveDialogOpen}
          title="Save New View"
          closeDialog={()=>this.showViewSave()}
          handleFormSubmit={(name: string, isPrivate: number, isDefault: boolean) => {
            // Assuming this.columnState exists in this component's scope
            this.handleFormSubmit(name, isPrivate, isDefault, this.gridState);
          }}
        />

        <edit-view-form-dialog  
          open={this.editDialogOpen}
          title="Edit View"
          closeDialog={()=>this.closeViewEdit()}
          currentGridId={this.selectedGridId}
          currentName={this.selectedViewName}
          currentGridViewVisibilityTypeId={this.selectedViewGridViewVisibilityTypeId}
          currentIsDefault={this.selectedViewIsDefault}
          handleFormSubmit={(gridId: any, name: string, isPrivate: number, isDefault: boolean) => {
            console.log("Calling handleViewUpdate with", gridId, name, isPrivate, isDefault, this.gridState)
            this.handleViewUpdate(gridId, name, isPrivate, isDefault);
          }}
        />



<div  /> 
        <fluent-dialog
            title="Delete Hotlist"
            message="Are you sure you want to delete this hotlist?"
            actionOne={() => this.handleRequestDelete()}
            actionTwo={() => this.toggleAlertDialog('hotlist')}
            labelOne="Confirm"
            labelTwo="Cancel"
            open={this.confirmDialog} // Use state to control dialog visibility
        >
          <div>This will not delete any of the data but only the records <br/>
            from the hotlist and the hotlist itself. </div>
        </fluent-dialog>


        <fluent-dialog
            title="Delete View"
            message="Are you sure you want to delete this view?"
            actionOne={() => this.handleDeleteView()}
            actionTwo={() => this.toggleAlertDialog('view')}
            labelOne="Confirm"
            labelTwo="Cancel"
            open={this.confirmDialogDeleteView} // Use state to control dialog visibility
        >
          <div>This will not delete any of the data but only the settings <br/>
            saved to display this view. </div>
        </fluent-dialog>

   
        
      </div>
    );
  }
  
}
