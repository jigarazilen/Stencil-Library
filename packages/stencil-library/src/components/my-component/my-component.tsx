import { Component, Prop, h, State, Listen } from '@stencil/core';
import Asterisk16 from '@carbon/icons/es/asterisk/16';
//import { convertToAgGridColumns } from '../../udp-utilities/grid/convertToAgGridColumns';
//import { getApiCatalogById } from '../../udp-utilities/api-udp/apiUtils';
//import { accessToken } from '../../udp-utilities/testAuth/manualAccessToken';
//import {getPromotedMethodId } from '../../udp-utilities/api-udp/apiUtils';
import '../my-component/ag-grid.css'
import { defaultPayload, demoMSSearchData } from  '../../udp-utilities/grid/data-converters/transformSearchData'
//import { ConfigService } from '../../global/configService';
import { RenderConfig } from '../my-component/UI/grid/ambient-template-grid/interfaces/gridInterfaces';

//import { useTreeDatasource } from '../my-component/UI/grid/conversionFunctions/conversionFunctions'





@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @Prop() first: string;
  @Prop() middle: string;
  @Prop() last: string;  

  @State() toggled: boolean = false;
  @State() dialogOpen: boolean = false; // new State property for dialog
  @State() drawerOpen: boolean = false;
  @State() popoverOpen: boolean = false;
  @State() loadedView: Array<any> = [];
  @State() loadedViewTitle: string = 'Root View';
  //@State() tenantId: string = '';
  @State() tenantId: string = '034A2261-E825-4857-9EC5-E1DC2E577EEB';
  @State()  externalSearchFilter: Array<any> = [];

  @State() mindscopeDemoPayload: Object = {}
  @State() dataEmitterDemo: Object = {}

  // In your root Stencil component
@State() renderConfigs = [
  { 
    field: 'ownership',
    rendererName: 'emailCellRenderer',
    otherField: 'emailAddress',
    callbackId: 'handleContactClick'
  },
  {
    field: 'fullName',
    rendererName: 'openFunctionCellRenderer',
    otherField: 'fullName',
    callbackId: 'handleDefaultContactClick'
  },
  {
    field: 'actions',
    rendererName: 'hotListAddRenderer',
    otherField: 'businessObjectKey',
    callbackId: 'handleActionClick'
  },
  {
    field: 'lastUpdate',
    rendererName: 'dateTimeCellRenderer',
    otherField: 'lastUpdate',
    callbackId: 'handleContactClick',
    cellRendererParams: {
      formatMode: 'exact' as 'exact', // Type assertion
      locale: 'US' as 'US'           // Type assertion
    }
  } as RenderConfig
];

@State() filterObject: Array<any> = [
  {
    "pageNumber": 1,
    "pageSize": 20,
    "filterElements": [
    
    ],
    "orderElements": [],
    "groupingType": "",
    "groupProperty": [],
    "groupOperationList": [],
    "eagerLoad": false,
    "logicalSearchOperator": 1
}
]

 
  @State() activeTabIndex: number = 0;
  @State() viewChips: Array<any> = [];
  @State() additionalFilterChips: Array<any> = [];
  @State() kpiValues: Array<any> = [
    { label: 'Avg per cycle', value: 2.3 },
    { label: 'Water', value: 2.3 },
    { label: 'Electric', value: 16.7 },
    { label: 'Sewer', value: 5600 },
  ];
  @State() rowData: Array<any> = [];
  @State() columnDefs: Array<any> = [];
  @State() TestcolumnDefs: Array<any> = [
  
      {
          "name": "BusinessObjectKeyA",
          "field": "businessObjectKeyB",
          "minWidth": 80,
          "autoHeight": true,
          "sortable": true,
          "cellStyle": {
              "white-space": "nowrap",
              "overflow": "hidden",
              "text-overflow": "ellipsis"
          },
          "filter": "agTextColumnFilter",
          "resizable": true
      },
      {
          "headerName": "Id",
          "field": "id",
          "minWidth": 80,
          "autoHeight": true,
          "sortable": true,
          "cellStyle": {
              "white-space": "nowrap",
              "overflow": "hidden",
              "text-overflow": "ellipsis"
          },
          "filter": "agTextColumnFilter",
          "resizable": true
      },
      {
          "headerName": "FirstName",
          "field": "firstName",
          "minWidth": 80,
          "autoHeight": true,
          "sortable": true,
          "cellStyle": {
              "white-space": "nowrap",
              "overflow": "hidden",
              "text-overflow": "ellipsis"
          },
          "filter": "agTextColumnFilter",
          "resizable": true
      },
      {
          "headerName": "LastName",
          "field": "lastName",
          "minWidth": 80,
          "autoHeight": true,
          "sortable": true,
          "cellStyle": {
              "white-space": "nowrap",
              "overflow": "hidden",
              "text-overflow": "ellipsis"
          },
          "filter": "agTextColumnFilter",
          "resizable": true
      },
      {
          "headerName": "GenderCode",
          "field": "genderCode",
          "minWidth": 80,
          "autoHeight": true,
          "sortable": true,
          "cellStyle": {
              "white-space": "nowrap",
              "overflow": "hidden",
              "text-overflow": "ellipsis"
          },
          "filter": "agTextColumnFilter",
          "resizable": true
      },
      {
          "headerName": "Birthdate",
          "field": "birthdate",
          "minWidth": 80,
          "autoHeight": true,
          "sortable": true,
          "cellStyle": {
              "white-space": "nowrap",
              "overflow": "hidden",
              "text-overflow": "ellipsis"
          },
          "filter": "agTextColumnFilter",
          "resizable": true
      },
      {
          "headerName": "DeathDate",
          "field": "deathDate",
          "minWidth": 80,
          "autoHeight": true,
          "sortable": true,
          "cellStyle": {
              "white-space": "nowrap",
              "overflow": "hidden",
              "text-overflow": "ellipsis"
          },
          "filter": "agTextColumnFilter",
          "resizable": true
      },
      {
          "headerName": "SerializeFields",
          "field": "serializeFields",
          "minWidth": 80,
          "autoHeight": true,
          "sortable": true,
          "cellStyle": {
              "white-space": "nowrap",
              "overflow": "hidden",
              "text-overflow": "ellipsis"
          },
          "filter": "agTextColumnFilter",
          "resizable": true
      },
      {
          "headerName": "ActorGender",
          "field": "actorGender",
          "minWidth": 80,
          "autoHeight": true,
          "sortable": true,
          "cellStyle": {
              "white-space": "nowrap",
              "overflow": "hidden",
              "text-overflow": "ellipsis"
          },
          "filter": "agTextColumnFilter",
          "resizable": true
      },
      {
          "headerName": "ActorMovieActors",
          "field": "actorMovieActors",
          "minWidth": 80,
          "autoHeight": true,
          "sortable": true,
          "cellStyle": {
              "white-space": "nowrap",
              "overflow": "hidden",
              "text-overflow": "ellipsis"
          },
          "filter": "agTextColumnFilter",
          "resizable": true
      },
      {
          "headerName": "UdpTags",
          "field": "udpTags",
          "minWidth": 80,
          "autoHeight": true,
          "sortable": true,
          "cellStyle": {
              "white-space": "nowrap",
              "overflow": "hidden",
              "text-overflow": "ellipsis"
          },
          "filter": "agTextColumnFilter",
          "resizable": true
      }
  
  ];
  
  @State() filterChips: Array<any> = [
      {
          "label": "Brad",
          "value": 'Brad',
          "id": 0,
          "keyName": "firstName"
      },
      {
          "label": "Bruce",
          "value": "Bruce",
          "id": 1,
          "keyName": "firstName"
      },
      {
          "label": "Tom",
          "value": "Tom",
          "id": 2,
          "keyName": "firstName"
      },
      {
          "label": "Dispatched",
          "value": 0,
          "id": 3,
          "keyName": "firstName"
      },
      {
          "label": "Field Mobility",
          "value": 0,
          "id": 4,
          "keyName": "firstName"
      },
      {
          "label": "Fleet Management X",
          "value": 0,
          "id": 5,
          "keyName": "firstName"
      },
      {
          "label": "Crew Routing",
          "value": 0,
          "id": 6,
          "keyName": "firstName"
      },
      {
          "label": "Asset Routing",
          "value": 0,
          "id": 7,
          "keyName": "firstName"
      },
      {
          "label": "Work Orders",
          "value": 0,
          "id": 8,
          "keyName":"firstName"
      },
      {
          "label": "Consumer Information",
          "value": 0,
          "id": 9,
          "keyName": "firstName"
      },
      {
          "label": "Cashiering",
          "value": 0,
          "id": 10,
          "keyName": "firstName"
      },
      {
          "label": "Consumer Engagement",
          "value": 0,
          "id": 11,
          "keyName": "firstName"
      },
      {
          "label": "Contact Center",
          "value": 0,
          "id": 12,
          "keyName": "firstName"
      },
      {
          "label": "MDM",
          "value": 0,
          "id": 13,
          "keyName": "firstName"
      },
      {
          "label": "Course Management",
          "value": 0,
          "id": 14,
          "keyName": "firstName"
      },
      {
          "label": "Facility Management",
          "value": 0,
          "id": 15,
          "keyName": "firstName"
      },
      {
          "label": "Instructor Application",
          "value": 0,
          "id": 16,
          "keyName": "firstName"
      },
      {
          "label": "Member Management",
          "value": 0,
          "id": 17,
          "keyName": "firstName"
      }

  ];
  @Prop() accessTokenProp: string = ""

  @State() clientDetails: Array<any> = []
  @State() viewDrawerOpen: boolean = false;

  //accessToken = accessToken
  accessToken = localStorage.getItem('accessToken')
  entityName = 'Actor';
  productId = parseInt(localStorage.getItem('productId'), 10);
  //apiCatalogId = '5ee7b3ed-8aba-4c40-8b61-fabdcf9a440c'
  apiCatalogId = localStorage.getItem('apiCatalogId')
  userId= "8fe3b5ce-6a94-4ff4-b35c-be2596ea1380"
  gridId = "CC8529E0-1CDD-4FC2-820A-50F76433B19E"
  



  toggleDrawer = () => {
    this.drawerOpen = !this.drawerOpen;
  };


  handleUserData(event: CustomEvent) {
    const userInfo = event.detail;
    // Do something with userInfo
    console.log('USER::::',userInfo);
    this.tenantId = userInfo.tenantIds[0];
  }

 


  handleChipDelete = () => {
    // Your delete logic here
    // alert('Chip deleted!');
    this.loadedView = [];
  };

  setAdditionalFilterChips = (newChips) => {
    this.additionalFilterChips = newChips;
  };

  setViewChips = (newChips) => {
    this.viewChips = newChips;
  };

  setFilter = () => {
    // Your set filter logic here
  };


  // private handleClick(): void {
  //   console.log('Button was clicked!');
  // }

  handleToggle() {
    this.toggled = !this.toggled;
  }

  handlePopover = () => {
    this.popoverOpen = !this.popoverOpen;
  }

  logTest = () => {
    console.log('log Test...!');
    this.dialogOpen = !this.dialogOpen; // Toggle dialog state
  }




viewListrowData =   [
  {
    "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridView|f8defdca-2ffe-4064-a208-730ab9c46357",
    "gridViewId": "f8defdca-2ffe-4064-a208-730ab9c46357",
    "name": "Test Page View",
    "clusterId": 4,
    "gridViewVisibilityTypeId": 2,
    "isDefault": false,
    "tenantId": "f86a9b7c-bab0-4281-89a2-52b4caf89fab",
    "userId": "26c5be02-219d-4a8b-896a-4da10bde0839",
    "gridId": "678410c2-430b-454b-bbef-1a6236a686ec",
    "domain": "Page",
    "apiCatalogId": "5ee7b3ed-8aba-4c40-8b61-fabdcf9a440c",
    "serializeFields": null,
    "gridViewGridViewVisibilityType": null,
    "gridViewTenant": null,
    "gridViewUser": null,
    "gridViewGrid": null,
    "gridViewApiCatalog": null,
    "gridViewGridViewGridConfiguration": [],
    "udpTags": []
},
{
    "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridView|ef966d75-07e8-4664-ae08-ec30adf756f7",
    "gridViewId": "ef966d75-07e8-4664-ae08-ec30adf756f7",
    "name": "Test view",
    "clusterId": 5,
    "gridViewVisibilityTypeId": 1,
    "isDefault": false,
    "tenantId": "f86a9b7c-bab0-4281-89a2-52b4caf89fab",
    "userId": "8fe3b5ce-6a94-4ff4-b35c-be2596ea1380",
    "gridId": "678410c2-430b-454b-bbef-1a6236a686ec",
    "domain": "Page",
    "apiCatalogId": "5ee7b3ed-8aba-4c40-8b61-fabdcf9a440c",
    "serializeFields": null,
    "gridViewGridViewVisibilityType": null,
    "gridViewTenant": null,
    "gridViewUser": null,
    "gridViewGrid": null,
    "gridViewApiCatalog": null,
    "gridViewGridViewGridConfiguration": [],
    "udpTags": []
}
]


fullViewData = {
  "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridView|f8defdca-2ffe-4064-a208-730ab9c46357",
  "gridViewId": "f8defdca-2ffe-4064-a208-730ab9c46357",
  "name": "Test Page View",
  "clusterId": 4,
  "gridViewVisibilityTypeId": 2,
  "isDefault": false,
  "tenantId": "f86a9b7c-bab0-4281-89a2-52b4caf89fab",
  "userId": "26c5be02-219d-4a8b-896a-4da10bde0839",
  "gridId": "678410c2-430b-454b-bbef-1a6236a686ec",
  "domain": "Page",
  "apiCatalogId": "5ee7b3ed-8aba-4c40-8b61-fabdcf9a440c",
  "serializeFields": null,
  "gridViewGridViewVisibilityType": {
      "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridViewVisibilityType|2",
      "gridViewVisibilityTypeId": 2,
      "name": "Public",
      "serializeFields": null,
      "gridViewVisibilityTypeGridView": [],
      "udpTags": []
  },
  "gridViewTenant": {
      "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.Tenant|f86a9b7c-bab0-4281-89a2-52b4caf89fab",
      "tenantId": "f86a9b7c-bab0-4281-89a2-52b4caf89fab",
      "clusterId": 1,
      "tenantName": "Univerus Software Inc",
      "contactEmail": "userdemo@outlook.com",
      "locked": false,
      "theme": "sap",
      "showUnsubscribedProducts": false,
      "description": "Univerus Software",
      "apiAuthKey": "220b069a-5598-4ed6-b3fa-893ca0220f32",
      "defaultVerticalId": 2,
      "serializeFields": null,
      "tenantAggregateThreshold": [],
      "tenantApiMethodInstanceTenant": [],
      "tenantBillingDetails": [],
      "tenantBlobDocument": [],
      "tenantGridView": [],
      "tenantGroup": [],
      "tenantInquiryTreeTenant": [],
      "tenantMenuInstanceTenant": [],
      "tenantMenuItemInstanceTenant": [],
      "tenantMenuItemInstanceTenantGroup": [],
      "tenantMenuItemInstanceTenantRole": [],
      "tenantMenuStructure": [],
      "tenantPage": [],
      "tenantPanel": [],
      "tenantProperty": [],
      "tenantRole": [],
      "tenantRule": [],
      "tenantSupportIntegration": [],
      "tenantVertical": null,
      "tenantTenantDriveConfig": [],
      "tenantTenantProduct": [],
      "tenantTenantProductApiCatalogBase": [],
      "tenantTenantProductHomePage": [],
      "tenantTenantUser": [],
      "tenantTranslation": [],
      "tenantUser": [],
      "udpTags": []
  },
  "gridViewUser": {
      "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.User|26c5be02-219d-4a8b-896a-4da10bde0839",
      "userId": "26c5be02-219d-4a8b-896a-4da10bde0839",
      "clusterId": 778,
      "externalUUID": "22248368-9a38-41b7-9980-e7b3b79f5990",
      "email": "ckung@univerus.com",
      "locked": false,
      "defaultTenantId": "f86a9b7c-bab0-4281-89a2-52b4caf89fab",
      "serializeFields": null,
      "userApiCatalog": [],
      "userApiCatalog2": [],
      "userApiUrlBase": [],
      "userApiUrlBase2": [],
      "userBillingDetailUsers": [],
      "userGridView": [],
      "userInquiryTree": [],
      "userLoadedInquiryTreeNode": [],
      "userMenuInstanceUser": [],
      "userPage": [],
      "userRule": [],
      "userTenantUser": [],
      "userTranslation": [],
      "userTenant": null,
      "userUserGridConfiguration": [],
      "userUserGroup": [],
      "userUserProduct": [],
      "userUserRole": [],
      "udpTags": []
  },
  "gridViewGrid": {
      "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.Grid|678410c2-430b-454b-bbef-1a6236a686ec",
      "gridId": "678410c2-430b-454b-bbef-1a6236a686ec",
      "clusterId": 31,
      "name": "UDP_Grid_UI_UX_Sandbox",
      "serializeFields": null,
      "gridGridConfiguration": [],
      "gridGridView": [],
      "udpTags": []
  },
  "gridViewApiCatalog": null,
  "gridViewGridViewGridConfiguration": [
      {
          "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridViewGridConfiguration|f8defdca-2ffe-4064-a208-730ab9c46357,27c4125d-2d39-4753-aba6-1a24581ba5b5",
          "gridViewId": "f8defdca-2ffe-4064-a208-730ab9c46357",
          "gridConfigurationId": "27c4125d-2d39-4753-aba6-1a24581ba5b5",
          "serializeFields": null,
          "gridViewGridConfigurationGridView": null,
          "gridViewGridConfigurationGridConfiguration": {
              "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridConfiguration|27c4125d-2d39-4753-aba6-1a24581ba5b5",
              "gridConfigurationId": "27c4125d-2d39-4753-aba6-1a24581ba5b5",
              "clusterId": 2927,
              "gridStateTypeId": 5,
              "gridId": "678410c2-430b-454b-bbef-1a6236a686ec",
              "values": "[]",
              "serializeFields": null,
              "gridConfigurationApiMethodInstanceGridConfiguration": [],
              "gridConfigurationGridStateType": null,
              "gridConfigurationGrid": null,
              "gridConfigurationGridViewGridConfiguration": [],
              "gridConfigurationUserGridConfiguration": [],
              "udpTags": []
          },
          "udpTags": []
      },
      {
          "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridViewGridConfiguration|f8defdca-2ffe-4064-a208-730ab9c46357,341f3721-60d5-445c-b2c8-2959c679bbc2",
          "gridViewId": "f8defdca-2ffe-4064-a208-730ab9c46357",
          "gridConfigurationId": "341f3721-60d5-445c-b2c8-2959c679bbc2",
          "serializeFields": null,
          "gridViewGridConfigurationGridView": null,
          "gridViewGridConfigurationGridConfiguration": {
              "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridConfiguration|341f3721-60d5-445c-b2c8-2959c679bbc2",
              "gridConfigurationId": "341f3721-60d5-445c-b2c8-2959c679bbc2",
              "clusterId": 2926,
              "gridStateTypeId": 1,
              "gridId": "678410c2-430b-454b-bbef-1a6236a686ec",
              "values": [
                {
                    "colId": "data1",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "data2",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "data3",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "data4",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "productId",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "tenantId",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "userId",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "pageTypeId",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "gridProperties",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "widgets",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "basePageId",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "showPageName",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "isUdpPage",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "version",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                },
                {
                    "colId": "layoutTypeId",
                    "width": 200,
                    "hide": false,
                    "pinned": null,
                    "sort": null,
                    "sortIndex": null,
                    "aggFunc": null,
                    "rowGroup": false,
                    "rowGroupIndex": null,
                    "pivot": false,
                    "pivotIndex": null,
                    "flex": null
                }
            ],
            
              "serializeFields": null,
              "gridConfigurationApiMethodInstanceGridConfiguration": [],
              "gridConfigurationGridStateType": null,
              "gridConfigurationGrid": null,
              "gridConfigurationGridViewGridConfiguration": [],
              "gridConfigurationUserGridConfiguration": [],
              "udpTags": []
          },
          "udpTags": []
      },
      {
          "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridViewGridConfiguration|f8defdca-2ffe-4064-a208-730ab9c46357,e422b3bd-9752-423b-ab40-a887b453bab3",
          "gridViewId": "f8defdca-2ffe-4064-a208-730ab9c46357",
          "gridConfigurationId": "e422b3bd-9752-423b-ab40-a887b453bab3",
          "serializeFields": null,
          "gridViewGridConfigurationGridView": null,
          "gridViewGridConfigurationGridConfiguration": {
              "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridConfiguration|e422b3bd-9752-423b-ab40-a887b453bab3",
              "gridConfigurationId": "e422b3bd-9752-423b-ab40-a887b453bab3",
              "clusterId": 2928,
              "gridStateTypeId": 3,
              "gridId": "678410c2-430b-454b-bbef-1a6236a686ec",
              "values": "[]",
              "serializeFields": null,
              "gridConfigurationApiMethodInstanceGridConfiguration": [],
              "gridConfigurationGridStateType": null,
              "gridConfigurationGrid": null,
              "gridConfigurationGridViewGridConfiguration": [],
              "gridConfigurationUserGridConfiguration": [],
              "udpTags": []
          },
          "udpTags": []
      },
      {
          "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridViewGridConfiguration|f8defdca-2ffe-4064-a208-730ab9c46357,b3d19bb6-feda-4746-8df5-d2f677faa3b2",
          "gridViewId": "f8defdca-2ffe-4064-a208-730ab9c46357",
          "gridConfigurationId": "b3d19bb6-feda-4746-8df5-d2f677faa3b2",
          "serializeFields": null,
          "gridViewGridConfigurationGridView": null,
          "gridViewGridConfigurationGridConfiguration": {
              "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridConfiguration|b3d19bb6-feda-4746-8df5-d2f677faa3b2",
              "gridConfigurationId": "b3d19bb6-feda-4746-8df5-d2f677faa3b2",
              "clusterId": 2929,
              "gridStateTypeId": 4,
              "gridId": "678410c2-430b-454b-bbef-1a6236a686ec",
              "values": "{}",
              "serializeFields": null,
              "gridConfigurationApiMethodInstanceGridConfiguration": [],
              "gridConfigurationGridStateType": null,
              "gridConfigurationGrid": null,
              "gridConfigurationGridViewGridConfiguration": [],
              "gridConfigurationUserGridConfiguration": [],
              "udpTags": []
          },
          "udpTags": []
      },
      {
          "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridViewGridConfiguration|f8defdca-2ffe-4064-a208-730ab9c46357,30a5a78a-0ff0-45c3-a6ff-f7716ad3b8a1",
          "gridViewId": "f8defdca-2ffe-4064-a208-730ab9c46357",
          "gridConfigurationId": "30a5a78a-0ff0-45c3-a6ff-f7716ad3b8a1",
          "serializeFields": null,
          "gridViewGridConfigurationGridView": null,
          "gridViewGridConfigurationGridConfiguration": {
              "businessObjectKey": "Univerus.Unity.Crm.Domain.Models.GridConfiguration|30a5a78a-0ff0-45c3-a6ff-f7716ad3b8a1",
              "gridConfigurationId": "30a5a78a-0ff0-45c3-a6ff-f7716ad3b8a1",
              "clusterId": 2930,
              "gridStateTypeId": 2,
              "gridId": "678410c2-430b-454b-bbef-1a6236a686ec",
              "values": "false",
              "serializeFields": null,
              "gridConfigurationApiMethodInstanceGridConfiguration": [],
              "gridConfigurationGridStateType": null,
              "gridConfigurationGrid": null,
              "gridConfigurationGridViewGridConfiguration": [],
              "gridConfigurationUserGridConfiguration": [],
              "udpTags": []
          },
          "udpTags": []
      }
  ],
  "udpTags": []
}


customSaveViewClick = () => {
  alert('Save View Clicked')
}

 defaultActionButtons = [
  {
    icon: 'user',
    label: 'Add Candidate',
    visible: true,
    showLabel: true,
    clickHandler: this.customSaveViewClick,
  },
  {
    icon: 'wizard',
    label: 'Candidate Wizard',
    visible: true,
    showLabel: true,
    clickHandler: this.customSaveViewClick,
  },
];


handleLoadView = () => {
  this.loadedView = [this.fullViewData];
}

testPah = () => {
  // alert('Primary Action Header Function')
}

selectTab(index: number) {
  this.activeTabIndex = index;
  console.log('select tab')
}

handleDataFetched = (event: CustomEvent) => {
  console.log("Data fetched in parent:", event.detail);
  
};


// Test search convertor:

transformSearchData(searchData) {
  const transformed = [];

  // Iterate over all keys in searchData
  Object.keys(searchData).forEach(key => {
    const value = searchData[key];

    // Skip non-searchable, empty fields, or boolean values
    if (value === null || value === '' || typeof value === 'boolean' || Array.isArray(value) && value.length === 0) {
      return;
    }

    // Determine the appropriate operator for each field.
    // For example, if the field should use "IN" operator
    // This is a placeholder, implement your logic here
    const operator = "IN"; 

    // Push a new search criteria object into the transformed array
    transformed.push({
      searchField: key,
      searchOperator: operator,
      searchValue: value,
    });
  });

  console.log('Transformed search data:', transformed);

  return transformed;
}


 demoMSSearchData = {
  "SearchCriteriaEquationDetails": {
      "SkillSearchDetails": {
          "AnySkillDetails": [],
          "AllSkillDetails": [],
          "ExcludeSkillDetails": [],
          "ValueExpression": "",
          "DisplayExpression": "",
          "SkillDetailsBoolOn": []
      }
  },
  "CustomFieldSearch": [],
  "SearchName": null,
  "CandidateID": null,
  "IsCandidateIDOptional": false,
  "CandidateIdID": "_textCandidateId",
  "CandidateIDLabelKey": "26",
  "FirstName": null,
  "IsFirstNameOptional": false,
  "FirstNameID": "_textFirstName",
  "FirstNameLabelKey": "28",
  "LastName": null,
  "IsLastNameOptional": false,
  "LastNameID": "_textLastName",
  "LastNameLabelKey": "30",
  "PhoneNumber": null,
  "IsPhoneNumberOptional": false,
  "PhoneNumberID": "_textPhone",
  "PhoneNumberLabelKey": "21",
  "PhoneType": null,
  "PhoneTypeID": "_listPhoneType",
  "PhoneTypeSelectedText": null,
  "IsPhoneTypeOptional": false,
  "Email": null,
  "IsEmailOptional": false,
  "EmailID": "_textEmail",
  "EmailLabelKey": "1000",
  "ExcludeCandidatesPartOfText": null,
  "IsExcludeCandidatesPartOfOptional": false,
  "ExcludeCandidatesPartOfID": "_autoExcludeCandidatesPartOf",
  "ListExcludeCandidatesPartOf": null,
  "CheckExcludeOfflimits": false,
  "CheckBoxExcludeOfflimitsID": "_checkBoxExcludeOfflimits",
  "IsDateAvailiabilityOptional": false,
  "DateAvailiabilityID": "_dateAvailiability",
  "ConditionAvailiabilityLabelKey": "1413",
  "ConditionAvailiabilityRelation": null,
  "IsDateLastContactedOptional": false,
  "DateBoxLastContactID": "_dateBoxLastContact",
  "ConditionLastContactLabelKey": "151",
  "ConditionLastContactedRelation": null,
  "IsMustHaveNotInPlaceOptional": false,
  "DatePlaceFromID": "_datePlaceFrom",
  "DatePlaceFromLabelKey": "1727",
  "MustHaveNotInPlaceID": "_mustHaveNotInPlace",
  "DatePlaceToID": "_datePlaceTo",
  "ChkSun": false,
  "ChkSunID": "_ckSun",
  "LabelSun": "Sun",
  "ChkMon": false,
  "ChkMonID": "_ckMon",
  "LabelMon": "Mon",
  "ChkTue": false,
  "ChkTueID": "_ckTue",
  "LabelTue": "Tue",
  "ChkWed": false,
  "ChkWedID": "_ckWed",
  "LabelWed": "Wed",
  "ChkThu": false,
  "ChkThuID": "_ckThu",
  "LabelThu": "Thu",
  "ChkFri": false,
  "ChkFriID": "_ckFri",
  "LabelFri": "Fri",
  "ChkSat": false,
  "ChkSatID": "_ckSat",
  "LabelSat": "Sat",
  "ScheduleActivitySelectedValue": "1059",
  "ScheduleActivitySelectedText": "ANNIVERSARY",
  "IsScheduleActivityOptional": false,
  "ScheduleActivityID": "_listScheduleActivityId",
  "ScheduleActivityLabelKey": "4684",
  "WithScheduleActivity": true,
  "ScheduleStatusSelectedValue": 2,
  "ScheduleStatusSelectedText": "Completed",
  "IsScheduleStatusOptional": true,
  "ScheduleStatusID": "_listScheduleStatusId",
  "ScheduleStatusLabelKey": "4684",
  "RecruiterSelectedValue": "13",
  "RecruiterSelectedText": "Brad Atchison",
  "RecruiterID": "_listRecruiterId",
  "RecruiterLabelKey": "4684",
  "IsRecruiterOptional": true,
  "ResultOfActivitySelectedValue": null,
  "ResultOfActivitySelectedText": null,
  "ResultOfActivityID": "_listResultOfActivityId",
  "ResultOfActivityLabelKey": "4684",
  "IsResultOfActivityOptional": false,
  "EnteredDateFromID": "EnteredDateFromID",
  "EnteredDateToID": "EnteredDateToID",
  "EnteredDateLabelKey": null,
  "IsEnteredDateOptional": false,
  "StartDateFromID": "StartDateFromID",
  "StartDateToID": "StartDateToID",
  "StartDateLabelKey": null,
  "IsStartDateOptional": false,
  "LastContactedDateFromID": "LastContactedDateFromID",
  "LastContactedDateToID": "LastContactedDateToID",
  "LastContactedDateLabelKey": null,
  "IsLastContactedDateOptional": false,
  "ChkOriginalResume": false,
  "ChkOriginalResumeID": "_checkBoxOriginalResume",
  "ChkModifiedResume": false,
  "ChkModifiedResumeID": "_checkBoxModifiedResume",
  "ChkHistoricalResume": false,
  "ChkHistoricalResumeID": "_checkBoxHistoricalResume",
  "ChkCandProfileNote": false,
  "ChkCandProfileNoteID": "_checkBoxCandProfileNote",
  "ChkNotes": false,
  "ChkNotesID": "_checkBoxNotes",
  "ChkEmail": false,
  "ChkEmailID": "_checkBoxEmail",
  "IsKeyWordSearch": false,
  "KeyWordsearch": null,
  "County": null,
  "IsCountyOptional": false,
  "CountyID": "_textCounty",
  "CountyLabelKey": "4684",
  "CountriesSelectedValue": null,
  "CountriesSelectedText": null,
  "CountryID": "_listCountries",
  "CountriesLabelKey": "56",
  "IsCountryOptional": false,
  "ProvincesSelectedValue": null,
  "ProvincesSelectedText": null,
  "ProvincesID": "_listProvinces",
  "ProvincesLabelKey": "55",
  "IsProvincesOptional": false,
  "ListCitiesValue": null,
  "ListCitiesID": "_listCities",
  "ListCitiesLabelKey": "9",
  "LkCitiesLabelKey": "9",
  "LkCitiesID": "_lkCities",
  "LkCitiesValue": null,
  "LkCitiesText": null,
  "IsCityOptional": false,
  "Address": null,
  "AddressID": "_textAddress",
  "AddressLabelKey": "8",
  "IsAddressOptional": false,
  "Address2": null,
  "Address2ID": "_textAddress2",
  "Address2LabelKey": "4004",
  "IsAddress2Optional": false,
  "PostalCode": null,
  "PostalCodeID": "_textPostalCode",
  "PostalCodeLabelKey": "10",
  "IsPostalCodeOptional": false,
  "LocatedFrom": null,
  "LocatedFromID": "_textLocatedFrom",
  "LocatedDistanceSelectedValue": null,
  "IsLocatedFromOptional": false,
  "BirthID": "_dateBirth",
  "BirthLabelKey": "32",
  "IsdateBirthOptional": false,
  "AgeFrom": null,
  "AgeFromID": "_txtAgeFrom",
  "IsAgeOptional": false,
  "AgeTo": null,
  "AgeToID": "_txtAgeTo",
  "YearsExpFrom": null,
  "YearsExpFromID": "_txtYearsExpFrom",
  "YearsExpTo": null,
  "YearsExpToID": "_txtYearsExpTo",
  "IsYearsExperienceOptional": false,
  "TextSin": null,
  "TextSinID": "_textSin",
  "TextSinLabelKey": "128",
  "IsSinIDOptional": false,
  "StatusSelectedValue": null,
  "StatusSelectedText": null,
  "StatusID": "_listStatus",
  "StatusLabelKey": "34",
  "IsStatusOptional": false,
  "SecondStatusSelectedValue": null,
  "SecondStatusSelectedText": null,
  "SecondStatusID": "_listSecondStatus",
  "SecondStatusLabelKey": "4529",
  "IsSecondStatusOptional": false,
  "RatingSelectedValue": null,
  "RatingSelectedText": null,
  "RatingID": "_listRating",
  "RatingLabelKey": "35",
  "IsRatingOptional": false,
  "MarketSrcSelectedValue": null,
  "MarketSrcSelectedText": null,
  "MarketSrcID": "_listMarketSrc",
  "MarketSrcLabelKey": "1084",
  "IsMarketSrcOptional": false,
  "CandidateNpn": null,
  "CandidateNpnID": "_txtCandidateNpn",
  "CandidateNpnLabelKey": "4275",
  "IsCandidateNpnOptional": false,
  "TransportationTypeSelectedValue": null,
  "TransportationTypeSelectedText": null,
  "TransportationTypeID": "_listTransportation",
  "TransportationTypeLabelKey": "3149",
  "IsTransportationTypeOptional": false,
  "EmploymentTypeSelectedValue": null,
  "EmploymentTypeSelectedText": null,
  "EmploymentTypeID": "_listEmploymentType",
  "EmploymentTypeLabelKey": "117",
  "IsEmploymentTypeOptional": false,
  "PayRateCurrencySelectedValue": null,
  "PayRateCurrencySelectedText": null,
  "PayRateCurrencyID": "_listPayRateCurrency",
  "PayRateCurrencyLabelKey": "5070",
  "IsPayRateCurrencyOptional": false,
  "MinimumPayRateFrom": null,
  "MinimumPayRateFromID": "_txtMinimumPayRateFrom",
  "MinimumPayRateFromLabelKey": "118",
  "IsMinimumPayRateOptional": false,
  "MinimumPayRateTo": null,
  "MinimumPayRateToID": "_txtMinimumPayRateTo",
  "OvertimePayRateFrom": null,
  "OvertimePayRateFromID": "_txtOvertimePayRateFrom",
  "OvertimePayRateFromLabelKey": "4982",
  "IsOvertimePayRateOptional": false,
  "OvertimePayRateTo": null,
  "OvertimePayRateToID": "_txtOvertimePayRateTo",
  "DivisionSelectedValue": null,
  "DivisionSelectedText": null,
  "DivisionID": "_listDivision",
  "DivisionLabelKey": "143",
  "IsDivisionOptional": false,
  "DepartmentSelectedValue": null,
  "DepartmentSelectedText": null,
  "DepartmentID": "_listDepartment",
  "DepartmentLabelKey": "146",
  "IsDeptOptional": false,
  "OfficeSelectedValue": null,
  "OfficeSelectedText": null,
  "OfficeID": "_listOffice",
  "OfficeLabelKey": "1876",
  "IsOfficeOptional": false,
  "BusinessUnitSelectedValue": null,
  "BusinessUnitSelectedText": null,
  "BusinessUnitID": "_listBusinessUnit",
  "BusinessUnitLabelKey": "556",
  "IsBusinessUnitOptional": false,
  "OwnershipValue": null,
  "OwnershipText": null,
  "OwnershipID": "_autoOwnership",
  "OwnershipLabelKey": "1694",
  "IsOwnershipOptional": false,
  "CustomUserList1Value": null,
  "CustomUserList1Text": null,
  "CustomUserList1ID": "_listCustomUserList1",
  "CustomUserList1LabelKey": "11414",
  "IsCustomUserList1Optional": false,
  "CustomUserList2Value": null,
  "CustomUserList2Text": null,
  "CustomUserList2ID": "_listCustomUserList2",
  "CustomUserList2LabelKey": "11415",
  "IsCustomUserList2Optional": false,
  "CustomUserList3Value": null,
  "CustomUserList3Text": null,
  "CustomUserList3ID": "_listCustomUserList3",
  "CustomUserList3LabelKey": "11416",
  "IsCustomUserList3Optional": false,
  "NoteTypeSelectedValue": null,
  "NoteTypeSelectedText": null,
  "NoteTypeID": "_listNoteType",
  "NoteTypeLabelKey": "63",
  "IsNoteTypeOptional": false,
  "ActMgrValue": null,
  "ActMgrText": null,
  "ActMgrID": "_autoActMgr",
  "ActMgrLabelKey": "1818",
  "IsActMgrOptional": false,
  "CompanyName": null,
  "CompanyNameID": "_txtCompanyName",
  "CompanyNameLabelKey": "37",
  "IsCompanyNameOptional": false,
  "Title": null,
  "TitleID": "_txtTitle",
  "TitleLabelKey": "149",
  "IsTitleOptional": false,
  "BaseSalaryID": "_txtBaseSalary",
  "ConditionBaseSalaryRelation": null,
  "BaseSalaryLabelKey": null,
  "IsBaseSalaryOptional": false,
  "LastSalaryIncreaseID": "_txtLastSalaryIncrease",
  "LastSalaryIncreaseLabelKey": "4952",
  "IsLastSalaryIncreaseOptional": false,
  "TotalCompensationID": "_txtTotalCompensation",
  "TotalCompensationLabelKey": "4953",
  "IsTotalCompensationOptional": false,
  "EnteredDateFrom": "2023-12-01",
  "EnteredDateTo": "2023-12-10",
  "StartDateFrom": "2023-12-07",
  "StartDateTo": "2023-12-10",
  "ListID": 0,
  "Append": false
}

// componentDidLoad() {
//   document.addEventListener('secondActionClick in Angular demo', this.handleSecondActionClick);
//   document.addEventListener('thirdActionClick in Angular demo', this.handleSecondActionClick);
// }

  
handleApiResult = (result) => {
  console.log('Received result in parent:', result);
  // Save to local storage
  localStorage.setItem("promotedMethod", JSON.stringify(result));
  localStorage.setItem("promotedMethodDemo", JSON.stringify(result));
}



promotedEntityFromLocalStorage = JSON.parse(localStorage.getItem('promotedEntity'));



handleCellClick = (cellValue: any, callbackId: any) => {
  // Your Angular-specific logic here
  console.log('Cell clicked in Angular. Value:', cellValue, 'CB', callbackId);
  if (callbackId === 'handleContactClick') {
    //alert(`Contact clicked, ${cellValue}`);
    this.dataEmitterDemo =  {
      "searchField": "clientContact",
      "searchOperator": "=",
      "searchValue": cellValue
      }
  } else if (callbackId === 'handleActionClick') {
    alert(`Second action clicked in my test..., ${callbackId}, ${cellValue}`)
  } else {
    console.log(`A second function in parent, ${callbackId}`);
  }
};
handleCellClickX = (cellValue: any, callbackId: any) => {
  alert(`Third action clicked, ${callbackId}, ${cellValue}`)
};


handleViewActionClick = (cellValue: any, callbackId: any) => {
  alert(`VIEW !! in my test, ${callbackId}, ${cellValue}`)
  console.log('get full data list from grid:', cellValue.defaultClient);
};


cellClickHandler(otherCellValue, callbackId) {
  console.log('In Angular Parent:', otherCellValue, 'Callback ID:', callbackId);
  // Additional logic here
}


// @ts-ignore: 'childComponent' is declared but its value is never read.
private childComponent: HTMLAmbientTemplateGridElement;

// private updateChildFilter() {
//   const newFilter = [
    
//     {
//       "searchField": "ClientContact",
//       "searchOperator": "IN",
//       "searchValue": "Jeff Clark"
//     }
    
//   ];

//   this.childComponent.updateFilterAndFetch(newFilter);
// }


updateDemoPayload() {
  this.mindscopeDemoPayload = demoMSSearchData
 }

updateDemoEmitter() {
  this.dataEmitterDemo =  {
    "searchField": "city",
    "searchOperator": "=",
    "searchValue": "San Diego"
    }
}


@Listen('externalEmitter')
onExternalData(event: CustomEvent) {
  const dataFromChild = event.detail; // Data from the child component
  console.log('Received data from child:', dataFromChild);

  if (dataFromChild && dataFromChild.pageList) {
    this.clientDetails = dataFromChild.pageList;
    this.viewDrawerOpen = true; // Assuming this is part of your component's state
    console.log('clientDetails list...', this.clientDetails);
  }
}


// handleSecondActionClick = (event: CustomEvent) => {
//   const detail = event.detail;
//   console.log('Second action clicked in parent with details:', detail);

//   // Handle the action here
//   // ...
// }

// componentWillLoad() {
//   // Set configuration before the component loads
//   ConfigService.config = {
//     UNITY_API_DOMAIN: 'https://az-api-unity-gateway-dev.azurewebsites.net',
//   };
// }


pageData = {
  "pageId": "b3854182-009b-4396-b51d-fbec4b732dca",
  "name": "New PAH",
  "userId": "8fe3b5ce-6a94-4ff4-b35c-be2596ea1380",
  "tenantId": "f86a9b7c-bab0-4281-89a2-52b4caf89fab",
  "productId": 3,
  "layoutTypeId": 5,
  "pageData": [
      {
          "section": 1,
          "position": 1,
          "sectionName": "Section One",
          "componentName": "Header",
          "componentTypeId": 12,
          "sectionId": "21e8ccff-71c6-49ad-999b-7969bc13b539",
          "id": "9acb3088-ceff-4bc2-9ae5-71cf9d265c9d",
          "columnSize": {
              "xs": 12
          },
          "properties": {
              "title": {
                  "key": null,
                  "i18n": "utilitiesLabel",
                  "label": "Primary Action Header",
                  "type": "label"
              },
              "subheader": {
                  "key": null,
                  "i18n": "utilitiesDescription",
                  "label": "Primary Action Button",
                  "type": "label"
              },
              "single": {
                  "value": true,
                  "type": "bool"
              },
              "grid": {
                  "value": false,
                  "type": "bool"
              },
              "tabList": {
                  "value": [
                      {
                          "icon": "ChannelIcon",
                          "label": "Channel",
                          "i18n": "channelLabel",
                          "view": {
                              "id": "5c69deb2-0d55-4245-9950-3d4087736567",
                              "component": "Page",
                              "type": "page",
                              "properties": {}
                          }
                      },
                      {
                          "icon": "RegisterIcon",
                          "label": "Registry",
                          "i18n": "registryLabel",
                          "view": {
                              "id": "954e62ed-42c4-470b-ae20-b6538c229ee2",
                              "component": "Page",
                              "type": "page",
                              "properties": {}
                          }
                      }
                  ],
                  "type": "tabs"
              },
              "button": {
                  "id": "d428b3a7-15fc-47e8-9328-07311e6c8811",
                  "key": null,
                  "i18n": "createLabel",
                  "label": "Create",
                  "opens": "sideSheet",
                  "view": {
                      "id": "1724bbc2-62ba-4fcf-97f8-4a49c1393672",
                      "component": "Form",
                      "type": "form",
                      "properties": {}
                  },
                  "type": "button"
              },
              "secondaryButtons": {
                  "value": [
                      {
                          "id": "52b093b8-d9b5-4fff-96b6-086f25a2254a",
                          "icon": "RefreshIcon",
                          "label": "Refresh",
                          "i18n": "refreshLabel",
                          "opens": null,
                          "apiMethodInstanceId": null,
                          "apiMethod": {
                              "apiMethodId": "71d826dc-88b0-46fe-85c3-ad53a72f0efc",
                              "apiCatalogId": "95aa404c-48c4-43b7-a908-13f97172a170"
                          }
                      },
                      {
                          "id": "e7db268b-f829-450d-8113-8696a9ed04e7",
                          "icon": "DetailIcon",
                          "label": "Details",
                          "i18n": "detailsLabel",
                          "opens": "sideSheet",
                          "view": {
                              "id": "b1f4001f-1d5f-485f-a36c-3eba8a621a64",
                              "component": "DisplayCard",
                              "type": "card",
                              "properties": {}
                          },
                          "apiMethodInstanceId": null,
                          "apiMethod": null
                      }
                  ],
                  "type": "secondaryActions"
              }
          }
      },
      {
          "section": 2,
          "position": 1,
          "sectionName": "Section Two",
          "componentName": "AmbientGrid",
          "componentTypeId": 12,
          "sectionId": "dea1a869-a29e-4e74-bad8-57634feaf796",
          "id": "baab045a-7ff6-4083-99bd-71ccbe77b06c",
          "columnSize": {
              "xs": 12
          },
          "properties": {
              "tenantId": "034A2261-E825-4857-9EC5-E1DC2E577EEB",
              "productId": 44,
              "queryId": "de331702-3ada-4f61-91ba-4772b758a691",
              "gridId": "CC8529E0-1CDD-4FC2-820A-50F76433B19E",
              "hotListIdentifier": "candidateID",
              "userId": "8fe3b5ce-6a94-4ff4-b35c-be2596ea1380",
              "gridBarTitle": "Data Bar",
              "renderConfigs": [
                  {
                      "field": "clientContact",
                      "rendererName": "openFunctionCellRenderer",
                      "otherField": "defaultClient",
                      "callbackId": "handleContactClick"
                  },
                  {
                      "field": "defaultClient",
                      "rendererName": "hoverContentCellRenderer",
                      "otherField": "title",
                      "callbackId": "handleDefaultContactClick"
                  },
                  {
                      "field": "actions",
                      "rendererName": "hotListAddRenderer",
                      "otherField": "businessObjectKey",
                      "callbackId": "handleDefaultContactClickX"
                  }
              ]
          }
      }
  ]
}


  render() {
    const usernames = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    return (
      <div>
       
       <app-bar username='joey' > Unity Ambient X </app-bar>
       <primary-action-header 
          title="Primary Action Header" 
          onClick={() => this.testPah() } 
          defaultActionButtons={this.defaultActionButtons}  
          activeTabIndex={this.activeTabIndex}   
          selectTab={(index) => this.selectTab(index)} 
          primaryActionClick={() => this.handleLoadView()}
          tabs={false}
          
          >
          
          </primary-action-header>
      {/* { this.tenantId &&  
       
        <udp-fetch
          accessToken={this.accessToken}
          tenantId ={this.tenantId}
          onDataFetched={(event) => this.handleData(event)}
          />}
  */}

           {/* @api reduction change  */}
            {/* <get-user
          accessToken={this.accessToken}
          onUserDataReady={this.handleUserData.bind(this)}
        ></get-user> */}

        <div>
          <udp-tab active={this.activeTabIndex === 0}>

          {/* <custom-button 
              variant='outline'  
          
              onCustomClick={this.tryFilter}>
              Try Filter



            </custom-button> */}


{/* 
            <custom-button variant='outline' onClick={() => this.updateChildFilter()}>Update Filter and Fetch Data</custom-button>
            <custom-button variant='outline' onClick={() => this.updateDemoPayload()}>Update Payload</custom-button>
            <custom-button variant='outline' onClick={() => this.updateDemoEmitter()}>Data Emitter</custom-button> */}

            {/* <custom-button variant='outline' onClick={()=> this.transformSearchData(demoMSSearchData)} >Test search conversion</custom-button> */}
{/* 
            <custom-button variant='outline' onClick={() => this.updateDemoEmitter()}>Data Emitter</custom-button> */}
            <custom-button variant='outline' onClick={() => this.updateDemoPayload()}>Demo External Search  </custom-button>
         { 
          //this.promotedEntityFromLocalStorage &&

          


          <div>
         <ambient-template-grid ref={(el) => this.childComponent = el as HTMLAmbientTemplateGridElement}
              // buttonTransform='translate(0,55px)'
              maxChipsAllowed={6}
              showHotlistButton={true}
              dataEmitterRequest={this.dataEmitterDemo}
              externalPayload={this.mindscopeDemoPayload}
              renderConfigs={this.renderConfigs}
              cellClickHandler={this.handleCellClick}
              cellClickHandlerX={this.handleCellClickX}
              viewActionClickHandler={this.handleViewActionClick}
              //hotListIdentifier="candidateID"
              hotListIdentifier="contactID"
              //cellClickHandler={this.cellClickHandler}
              productId={44}
              //actionId='6cc6bf70-67ec-4398-a9a4-b19dd06da16b'
              //queryId='e956ce46-636c-4d7f-b594-8754eb3a7136' // Unity sandbox actor
             //queryId='97a18cdb-2484-4720-ad37-e11e43ad4866' // Contact 
              queryId='b00e6adb-b691-4c3a-b704-2546ea21810f' // Candidates
              //tenantId='f86a9b7c-bab0-4281-89a2-52b4caf89fab'
              tenantId='034A2261-E825-4857-9EC5-E1DC2E577EEB'
             // apiCatalogId={this.apiCatalogId}
              userId={this.userId}
               gridId={this.gridId}
              // kpiValues={this.kpiValues}
              //promotedEntity={this.promotedEntityFromLocalStorage}
              accessToken={this.accessToken}
              fullViewData={this.fullViewData}
              //filterObject={this.filterObject}
              externalSearchFilter={this.externalSearchFilter}
              // showAdvancedSearchFeature={false}
              // showFilterColumnFeature={false}

              // defaultSearchObject={
              //   [ 
             
              //     {
              //       "searchField": "FirstName",
              //       "searchOperator": "=",
              //       "searchValue": "Linda"
              //   },
              //   {
              //     "searchField": "LastName",
              //     "searchOperator": "=",
              //     "searchValue": "Cole"
              // }
              //   ]
              // }
            //  defaultSearchObject={
            //   [
            //     {
            //       "searchField": "Title",
            //          "searchOperator": "=",
            //          "searchValue": "Producer"
            //     }
            //   ]
            //  }
              gridBarTitle="Data Bar"
                 
            //   additionalFilterChips={this.additionalFilterChips}
              //   menuItems={this.filterChips}
            //   viewChips={this.viewChips}
            //   viewListrowData={this.viewListrowData}
            //   columnDefs={this.columnDefs} 
            //   rowData={this.rowData.length > 0 && this.rowData }
              // handleButtonClick={this.handleButtonClick}
              // viewListcolumnDefs={this.viewListcolumnDefs} 
              // tenantId={this.tenantId}
              //promotedEntity={this.promotedEntity}
                 // handleFormSubmit={this.handleFormSubmit}
            //   filterChips={this.filterChips}
            // handleDelete={this.handleChipDelete}
             // loadedViewTitle={this.loadedViewTitle}
              // loadedView={this.loadedView}
             searchKey={defaultPayload}
              >
          </ambient-template-grid>

{/* <udp-split-screen id="splitScreen">
  <div slot="first-panel" style={{height: '100vh'}}>
 
  </div>
  <div slot="second-panel" style={{height: '100vh',  padding: '16px'}} >
 
 <div style={{width: '450px'}}> <udp-ambient-card></udp-ambient-card> </div>


    </div> 
</udp-split-screen> */}



         
          </div>
          
          }
{/* 
<page-renderer pageData={this.pageData.pageData} accessToken={localStorage.getItem('accessToken')} userId="8fe3b5ce-6a94-4ff4-b35c-be2596ea1380"  tenantId='034A2261-E825-4857-9EC5-E1DC2E577EEB'></page-renderer> */}




          <side-sheet  widthOption="short"    title='Details' open={this.viewDrawerOpen} toggleDrawer={() => this.viewDrawerOpen = false} position='right' >
          <div>
              <div style={{width: '450px', marginBottom: '8px'}} >
                  <hint-panel hint="Quickly access and manage your pre-configured table/grid views. These views are designed to help you focus on specific sets of data and streamline your workflow." 
                      hideHintText="Hide Hint">
                  </hint-panel>
              </div>
              <div> 
          {
            this.clientDetails && this.clientDetails.map((item) => {
              return (
                <div>
                  <tree-list-item label={'Name : '+ item.fullName} />
                  <tree-list-item label={'City : '+ item.city} />
                  <tree-list-item label={'Candidate ID : '+ item.candidateID} />
                  <tree-list-item label={'Phone : '+ item.businessPhone} />
                  <tree-list-item label={item.client_ContactClientID} />
                  <tree-list-item label={item.client_ContactContactID} />
 
                  <tree-list-item label={item.emailAddress} />
                  <tree-list-item label={item.emailID} />
                  <tree-list-item label={item.personID} />
                  <tree-list-item label={item.phoneID} />
                 
                  <tree-list-item label={item.contactID} />
                  <tree-list-item label={item.businessObjectKey} />
                </div>
              
              );
            })
          }
        </div>

  
            </div>
        </side-sheet>

          </udp-tab>
          <udp-tab active={this.activeTabIndex === 1}>
            <div class="container" > 
              
            <ambient-demo-container title="Hint Panel">
              <hint-panel hint="Quickly access and manage your pre-configured table/grid views. These views are designed to help you focus on specific sets of data and streamline your workflow." hideHintText="Hide Hint"></hint-panel>
            </ambient-demo-container>


            <ambient-demo-container title="Primary Button">
                <custom-button>Main Button</custom-button>     
            </ambient-demo-container>


            <ambient-demo-container title="Secondary Button">
                <custom-button variant='outline' >Secondary Button</custom-button>     
            </ambient-demo-container>

        

            <ambient-demo-container title="Chip">
                <stencil-chip text="Chip"  color="secondary"  />
            </ambient-demo-container>

            <ambient-demo-container title="Chip">
                <stencil-chip text="Chip"  defaultToggled={true}  leftIcon={Asterisk16} />
            </ambient-demo-container>


            <ambient-demo-container title="Icon Button">
               <div style={{display: 'flex', gap: '8px'}} > 
                  <div>
                  <stencil-icon-button noBackground darkIcon={true} icon={Asterisk16}  
                  >Secondary Action
                </stencil-icon-button>
                  </div>
                  <div style={{background: 'black'}} >
                  <stencil-icon-button noBackground darkIcon={false} icon={Asterisk16}  
                  >Secondary Action
                </stencil-icon-button>
                  </div>
               </div>
            </ambient-demo-container>


            <ambient-demo-container title="Popover">

            <div style={{width: '100px', height: '170px'}} >
                    <udp-pop-over isOpen={true}>
                       <div style={{width: '100px', height: '150px'}} ></div>
                    </udp-pop-over>

                    </div>
                </ambient-demo-container>


                <ambient-demo-container title="Primary Action Header">

                <primary-action-header 
          title="Primary Action Header" 
          onClick={() => this.testPah() } 
          defaultActionButtons={this.defaultActionButtons}  
          activeTabIndex={this.activeTabIndex}   
          selectTab={(index) => this.selectTab(index)} 
          primaryActionClick={() => this.handleLoadView()}
          actionButtonLabel="Add"
          >
          
          </primary-action-header>

                </ambient-demo-container>
                      
                <ambient-demo-container title="Tooltip">
                    <udp-ambient-tool-tip content="Tool tip content"  > <unity-typography>Hover for tooltip </unity-typography>   </udp-ambient-tool-tip>
                </ambient-demo-container>

                <ambient-demo-container title="Textfield">

                <text-field
                   label="View Name"
                   placeholder="Create a name for your view"
              ></text-field>

                </ambient-demo-container>


                <ambient-demo-container title="Toggle">

                       <stencil-toggle  label="Private" checked={true} ></stencil-toggle>

                </ambient-demo-container>



                <ambient-demo-container title="Selector">
                {/* <udp-selector options={['Delete', 'Option 2']} ></udp-selector> */}

                </ambient-demo-container>


                <ambient-demo-container title="Badge">
                <udp-badge content={5}>
                <custom-button >Main Button</custom-button>
                </udp-badge>
            </ambient-demo-container>


            <ambient-demo-container title="Tabs">
            <div  class="tabs" > 
        <udp-tabs>
      <button 
        class={this.activeTabIndex === 0 ? 'active' : ''} 
        slot="tab-title" 
        onClick={() => this.selectTab(0)}
      >
        Demo Grid
      </button>
      <button 
        class={this.activeTabIndex === 1 ? 'active' : ''} 
        slot="tab-title" 
        onClick={() => this.selectTab(1)}
      >
        Other Content
      </button>
    </udp-tabs>
        </div>
            </ambient-demo-container>

            

            <ambient-demo-container title="App bar">
            <app-bar username='joey' > Unity Ambient X </app-bar>
            </ambient-demo-container>



     
              <div style={{display: 'flex', gap: '8px'}} > 
              <ambient-demo-container title="Avatar">
        <div style={{ display: 'flex', gap: '8px' }}>
          {usernames.map((username) => (
            <udp-avatar username={username}></udp-avatar>
          ))}
        </div>
      </ambient-demo-container>
              </div>
              
            <ambient-demo-container title="Typography">
                <unity-typography variant='body' >Body</unity-typography>
                <unity-typography variant='h1' >H1</unity-typography>
                <unity-typography variant='h2' >H2</unity-typography>
                <unity-typography variant='h3' >H3</unity-typography>
                <unity-typography variant='h4' >H4</unity-typography>
                <unity-typography variant='h4' >H5</unity-typography>
                <unity-typography variant='h4' >H6</unity-typography>
                <unity-typography variant='h4' >caption-text</unity-typography>
                <unity-typography variant='h4' >data-display-one</unity-typography>
                <unity-typography variant='h4' >data-display-two</unity-typography>
                <unity-typography variant='h4' >button</unity-typography>

            </ambient-demo-container>



            <ambient-demo-container title="theme color">

              <div style={{display: 'flex', gap: '8px'}} > 
                <div style={{width: '50px', height: '50px', background:  "var(--primary-color)" }} ></div>
                <div style={{width: '50px', height: '50px', background:  "var(--secondary-color)" }} ></div>
              </div>
            </ambient-demo-container>

            <ambient-demo-container title="new">
            </ambient-demo-container>

            </div>
          </udp-tab>
        </div>
       

      


       <div  /> 
        <fluent-dialog
            title="Sample Dialog"
            message="This is a message."
            actionOne={() => alert('Action One Clicked')}
            actionTwo={() => alert('Action Two Clicked')}
            labelOne="Confirm"
            labelTwo="Cancel"
            open={this.dialogOpen} // Use state to control dialog visibility
        >
          <div>Here is some dialog content...</div>
        </fluent-dialog>

      </div>
    );
  }
}
