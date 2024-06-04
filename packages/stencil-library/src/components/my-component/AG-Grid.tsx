// import { Component, Element, h, State, Prop, Event, EventEmitter } from '@stencil/core';
// import { GridOptions } from 'ag-grid-community';


// const enum GridStateTypeEnums {
//   Column = 1,
//   Pivot_Mode = 2,
//   Column_Sort = 3,
//   Column_Filter = 4,
//   Column_Group = 5
// }



// @Component({
//   tag: 'ag-grid',
//   styleUrl: 'ag-grid.css',
//   shadow: true
// })
// export class MyAgGrid {
//    private prevPivotMode: boolean;
   
//   @Event() viewSaved: EventEmitter;
//   @Element() el: HTMLElement;
//   @State() gridOptions: GridOptions;
//   @Prop() columnDefs: any[] = [];
//   @Prop() rowData: any[] = [];
//   @Prop() gridState: any[] = [];
//   @Prop() gridId: string = "";
//   @State() drawerOpen: boolean = false;
//   @State() filterPanelOpen: boolean = true;
//   @State() dialogOpen: boolean = false; // new State property for dialog
// <<<<<<< HEAD
//   @Prop() handleFormSubmit: (name: string, isPrivate: number, columnState: any[]) => void;
// =======
//   @Prop() handleFormSubmit: (name: string, isPrivate: boolean, isDefault: boolean, columnState: any[]) => void;
// >>>>>>> 686c51efa108c116b80d814b55a1918c771c195f

//   boundOnResize: any;

//   LicenseKey =
//   'CompanyName=Univerus Software Inc,LicensedApplication=MAIS eRec,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-036887,SupportServicesEnd=13_March_2024_[v2]_MTcxMDI4ODAwMDAwMA==54783d1f49ba5fe020d522b1165fad9f';

//   uncheckedSvgString = '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="20" height="20" stroke="black" fill="none" stroke-width="2"></rect></svg>';
//   checkedSvgString = '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="20" height="20" stroke="black" fill="black" stroke-width="2"></rect><path d="M5 10l3 3 7-7" stroke="white" stroke-width="2" fill="none"></path></svg>';

//   getPivotModeState() {
//     if (this.gridOptions && this.gridOptions.columnApi) {
//       return this.gridOptions.columnApi.isPivotMode();
//     }
//     return false;
//   }


//   componentWillLoad() {
//     this.boundOnResize = this.onResize.bind(this);
//   }
//   componentDidLoad() {
//     // First, create a promise for the script loading
//     const scriptPromise = new Promise<void>((resolve) => {
//       const agGridScript = document.createElement('script');
//       agGridScript.src = 'https://cdn.jsdelivr.net/npm/ag-grid-enterprise@latest/dist/ag-grid-enterprise.min.noStyle.js';
//       agGridScript.onload = () => resolve();
//       document.head.appendChild(agGridScript);
//     });
  
//     // Wait for the script to load
//     scriptPromise
//       .then(() => {
//         // Then dynamically import
//         return import('ag-grid-enterprise');
//       })
//       .then(() => {
//         // Once that's done, set the license
//         if (window['agGrid'] && window['agGrid'].LicenseManager) {
//           window['agGrid'].LicenseManager.setLicenseKey(this.LicenseKey);
//         }
  
//         // Now we set up the grid options
//         this.gridOptions = {
//           // icons: {
//           //   checkboxUnchecked: this.uncheckedSvgString,
//           //   checkboxChecked: this.checkedSvgString,
//           //   // other custom icons
//           // },
//           animateRows: true,
//           columnDefs: this.columnDefs,
//           rowData: this.rowData,
//           sideBar: this.filterPanelOpen ? {
//             toolPanels: [
//               {
//                 id: 'filters',
//                 labelDefault: 'Filters',
//                 labelKey: 'filters',
//                 iconKey: 'filter',
//                 toolPanel: 'agFiltersToolPanel',
//               },
//               {
//                 id: 'columns',
//                 labelDefault: 'Columns',
//                 labelKey: 'columns',
//                 iconKey: 'columns',
//                 toolPanel: 'agColumnsToolPanel',
//               }
//             ],
//             defaultToolPanel: 'filters'
//           } : null,
//           onGridReady: () => {
//             this.gridOptions.api.sizeColumnsToFit();
//             this.getGridState();
//           },
//           onColumnMoved: () => {
//             this.getGridState();
//           },
//           onColumnVisible: () => {
//             console.log('column view change')
//             this.getGridState();
//           },
//           onFilterChanged: () => {
//             console.log('filter changed');
//             this.getGridState(); 
//           },
//            onSortChanged: () => {
//     console.log('sort changed');
//     this.getGridState(); // Replace with your actual method
//   },
//   onFirstDataRendered: () => {
//     console.log('first data rendered or data changed');
//     this.getGridState(); // Replace with your actual method
//     // Here you can also check if pivot mode has changed
//     const isPivotMode = this.gridOptions.columnApi.isPivotMode();
//     if (isPivotMode !== this.prevPivotMode) {
//       console.log('pivot mode changed');
//       this.getPivotModeState(); // Replace with your actual method
//       this.prevPivotMode = isPivotMode;
//     }
//   }
//         };
  
//         // Initialize the grid
//         new window['agGrid'].Grid(this.el.shadowRoot.querySelector('#myGrid'), this.gridOptions);
  
//         // Handle window resize
//         window.addEventListener('resize', this.boundOnResize);
//         this.onResize();
//       })
//       .catch((error) => {
//         console.error('An error occurred:', error);
//       });
//   }
  

//   disconnectedCallback() {
//     window.removeEventListener('resize', this.boundOnResize);
//   }

//   private onResize() {
//     if (this.gridOptions && this.gridOptions.api) {
//       this.gridOptions.api.sizeColumnsToFit();
//     }
//   }

//   exportToCsv() {
//     if (this.gridOptions.api) {
//       const params = {};
//       this.gridOptions.api.exportDataAsCsv(params);
//     }
//   }

//   fitColumns() {
//     console.log("fitColumns called");
//     console.log("API state:", this.gridOptions.api);  // Debug line
//     if (this.gridOptions && this.gridOptions.api) {
//       console.log("Inside condition");
//       this.gridOptions.api.sizeColumnsToFit();
//     }
//   }
  

//   expandColumns() {
//     console.log("expandColumns called");
//     if (this.gridOptions && this.gridOptions.api && this.gridOptions.columnApi) {
//       this.gridOptions.columnApi.autoSizeAllColumns();
//     }
    
//   }
  

//   getGridState() {
//     if (this.gridOptions && this.gridOptions.columnApi) {
//       const columnState = this.gridOptions.columnApi.getColumnState();
//       const columnGroupState = this.gridOptions.columnApi.getColumnGroupState();
//       const filterModel = this.gridOptions.api.getFilterModel();
//       const isPivotMode = this.gridOptions.columnApi.isPivotMode();
//       const sortModel = columnState.filter(column => column.sort != null);

//       const gridState = [];
//       const columnGridConfiguration = {
//         gridStateTypeId: GridStateTypeEnums.Column,
//         gridId: this.gridId,
//         values: JSON.stringify(columnState),
//       };
//       const columnGroupGridConfiguration = {
//         gridStateTypeId: GridStateTypeEnums.Column_Group,
//         gridId: this.gridId,
//         values: JSON.stringify(columnGroupState),
//       };
//       const columnSortGridConfiguration = {
//         gridStateTypeId: GridStateTypeEnums.Column_Sort,
//         gridId: this.gridId,
//         values: JSON.stringify(sortModel),
//       };
//       const columnFilterGridConfiguration = {
//         gridStateTypeId: GridStateTypeEnums.Column_Filter,
//         gridId: this.gridId,
//         values: JSON.stringify(filterModel),
//       };
//       const pivotGridConfiguration = {
//         gridStateTypeId: GridStateTypeEnums.Pivot_Mode,
//         gridId: this.gridId,
//         values: JSON.stringify(isPivotMode),
//       };
//       gridState.push(columnGridConfiguration);
//       gridState.push(columnGroupGridConfiguration);
//       gridState.push(columnSortGridConfiguration);
//       gridState.push(columnFilterGridConfiguration);
//       gridState.push(pivotGridConfiguration);


//       console.log('Grid State:', gridState);
//       this.gridState = gridState;
//       // Do something with columnState
//     }
//   }
  


//   togglePanel(panelType) {
//     console.log(`toggle ${panelType} panel`);
//     const panelTypes = ['filters', 'columns'];
    
//     panelTypes.forEach(type => {
//       if (type !== panelType) {
//         const otherPanelOpenKey = `${type}PanelOpen`;
//         this[otherPanelOpenKey] = false;  // Close other panel if open
//       }
//     });
  
//     const panelOpenKey = `${panelType}PanelOpen`;
//     this[panelOpenKey] = !this[panelOpenKey]; // Toggle the current panel
  
//     // Create the toolPanel configuration based on the panelType
//     const toolPanelConfig = {
//       id: panelType,
//       labelDefault: panelType.charAt(0).toUpperCase() + panelType.slice(1),
//       labelKey: panelType,
//       iconKey: panelType === 'filters' ? 'filter' : 'columns',
//       toolPanel: panelType === 'filters' ? 'agFiltersToolPanel' : 'agColumnsToolPanel',
//     };
  
//     // Update gridOptions to reflect new sidebar settings
//     this.gridOptions.sideBar = this[panelOpenKey] ? {
//       toolPanels: [toolPanelConfig],
//       defaultToolPanel: panelType,
//     } : null;
  
//     this.gridOptions.api.setSideBarVisible(this[panelOpenKey]);
  
//     if (this[panelOpenKey]) {
//       this.gridOptions.api.openToolPanel(panelType);
//       console.log(`${panelType} panel opened`);
//     } else {
//       this.gridOptions.api.closeToolPanel();
//       console.log(`${panelType} panel closed`);
//     }
  
//     // Apply Direct DOM Manipulation
//     const sidebarElement = this.el.shadowRoot.querySelector('.ag-side-bar');
//     if (sidebarElement instanceof HTMLElement) {
//       sidebarElement.style.width = this[panelOpenKey] ? '200px' : 'initial';
//     }
  
//     // Refresh the grid here if needed
//     this.gridOptions.api.refreshClientSideRowModel();
//   }
  
//   // saveView() {
//   //   //alert('Save View Clicked');
//   //   this.dialogOpen = !this.dialogOpen; 
//   // }

//   saveView() {
//     // Emit an event with the data you want to pass
//     this.viewSaved.emit({
//       form: 'yourFormContent',
//       grid: 'yourGridContent',
//     });
//     // Call handleFormSubmit here
// <<<<<<< HEAD
//     this.handleFormSubmit('YourName', 1, this.gridState);
// =======
//     this.handleFormSubmit('YourName', true, false, this.gridState);
// >>>>>>> 686c51efa108c116b80d814b55a1918c771c195f
//   }
  
  

//   primaryActionClick() {
//     console.log("Primary Action Clicked again");
//     this.drawerOpen = !this.drawerOpen;
//   }


//   showViews() {
//     this.drawerOpen = !this.drawerOpen;
//   }


//   showViewSave() {
//     this.dialogOpen = !this.dialogOpen;
//     console.log('show view dialog', this.dialogOpen)
//   }


//   clearFilter() {
//     if (this.gridOptions && this.gridOptions.api && this.gridOptions.columnApi) {
//       const { api, columnApi } = this.gridOptions;
  
//       api.setQuickFilter('');
//       columnApi.setRowGroupColumns([]);
//       api.setFilterModel(null);
//       api.setQuickFilter('');
//       columnApi.resetColumnState();
  
//       // Refresh the grid after clearing all filters and settings
//       api.refreshClientSideRowModel();
//     }
//   }
  

//   render() {
//     const filterPanelWidth = this.filterPanelOpen ? '200px' : 'initial';

//     const KPI_VALUES = [
//       { label: 'Avg per cycle', value: 2.3 },
//       { label: 'Water', value: 2.3 },
//       { label: 'Electric', value: 16.7 },
//       { label: 'Sewer', value: 5600 },
//     ];


//     return (
//       <div>
//         <style>
//           {`:host ::slotted(.ag-side-bar) {
//             width: ${filterPanelWidth} !important;
//           }`}
//         </style>
//         <grid-primary-bar 
//           title="Grid Primary Bar"
//           customSaveViewClick={()=>this.showViewSave()}
//           customShowViewClick={() => this.showViews()}
//           customClearClick={() => this.clearFilter()}
//           customExpandClick={() => this.expandColumns()}
//           customExportClick={() => this.exportToCsv()}
//           hiddenActionButtons={['saveView', 'filter']}
//           primaryActionClick={() => this.primaryActionClick()}
//           customColumnViewClick={() => this.togglePanel('columns')}
//           customFitColumnClick={() => this.fitColumns()}
//           customFilterViewClick={() => this.togglePanel('filters')}
//         ></grid-primary-bar>


//         <kpi-list kpiValues={KPI_VALUES}></kpi-list>
        
//         <div id="myGrid" style={{ height: '1200px', width: '100%' }} class="ag-theme-material"></div>
      
//         <side-sheet title="Select A View" open={this.drawerOpen} toggleDrawer={() => this.primaryActionClick()} position='right' >
//           <hint-panel hint="Quickly access and manage your pre-configured table/grid views. These views are designed to help you focus on specific sets of data and streamline your workflow." hideHintText="Hide Hint"></hint-panel>
//           ...content here
//         </side-sheet>

//         <save-view-form-dialog  
//           open={this.dialogOpen}
//           title="Save New View"
//           closeDialog={()=>this.showViewSave()}
// <<<<<<< HEAD
//           handleFormSubmit={(name: string, isPrivate: number) => {
// =======
//           handleFormSubmit={(name: string, isPrivate: boolean, isDefault: boolean) => {
// >>>>>>> 686c51efa108c116b80d814b55a1918c771c195f
//             // Assuming this.columnState exists in this component's scope
//             this.handleFormSubmit(name, isPrivate, isDefault, this.gridState);
//           }}

//             // actionOne={() => this.saveView()}
//             // actionTwo={() => this.saveView()}
//             // labelOne="Confirm"
//             // labelTwo="Cancel"
//         />
//         {/* <fluent-dialog
//             title="Save New View"
//             message="This is a message."
//             actionOne={() => this.saveView()}
//             actionTwo={() => this.saveView()}
//             labelOne="Confirm"
//             labelTwo="Cancel"
//             open={this.dialogOpen} // Use state to control dialog visibility
//         >
//           <div>Here is some dialog content...</div>
//         </fluent-dialog> */}

//       </div>
//     );
//   }
  
// }
