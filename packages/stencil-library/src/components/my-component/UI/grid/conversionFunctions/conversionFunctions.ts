import { toLowerFirstChar, toTitleCase } from '../../../../../udp-utilities/string-utilities';



const defaultGridColumn = {
    headerName: '',
    field: '',
    minWidth: 100,
    autoHeight: true,
    sortable: false,
    headerComponentParams: { id: 'myCustomId1' },
    headerComponent: 'CustomHeaderComponent',
  };


  export const defaultColActionsDef = {
    resizable: true,
    editable: false,
    sortable: true,
    filter: true,
    floatingFilter: false,
    enableRowGroup: true
  };

  type MyType = {
    headerName: any;
    field: any;
    checkboxSelection: boolean;
    headerCheckboxSelection: boolean;
    cellRendererParams: { checkbox: boolean };
    minWidth: number;
    autoHeight: boolean;
    sortable: boolean;
    filter: string;  
    headerComponentParams: any;  
   headerComponent: string; 
  };
  


const getModelProperties = (model, componentsObj) => {
    let modelPropertiesObj = null;
    if (model) {
      modelPropertiesObj = model.properties;
      if (!modelPropertiesObj) {
        const refKeys = [];
        if (model['allOf']?.length) {
          model['allOf'].forEach((reference) => {
            if (reference['$ref']) {
              const refString = reference['$ref'];
              if (refString) {
                const lastIndex = refString.lastIndexOf('/');
                const referenceModel = refString.substring(lastIndex + 1);
                refKeys.push(referenceModel);
              }
            }
          });
        }
        refKeys.forEach((key) => {
          const abstractModel = componentsObj[key];
          if (modelPropertiesObj && abstractModel?.properties) {
            modelPropertiesObj = {
              ...modelPropertiesObj,
              ...abstractModel.properties
            };
          } else {
            modelPropertiesObj = abstractModel?.properties;
          }
        });
      }
    }
    return modelPropertiesObj;
  };
  

export const getEntityAttributes = (catalog, entityName) => {
    console.log('catalog entityName', catalog, entityName);
    if (!catalog) {
      return [];
    }
    const catalogObjectList = catalog?.ctlg?.catalogObjectList;
    const componentsObj = catalog?.ctlg?.components;
    const entity = catalogObjectList?.find(
      (catalogObject) => catalogObject.catalogObjectName === entityName
    );
    const model = componentsObj[entityName];
    let modelPropertiesObj = getModelProperties(model, componentsObj);
    if (entity?.properties?.length) {
      entity.properties.forEach((property) => {
        let nullable = true;
        if (modelPropertiesObj) {
          const modelProperty = modelPropertiesObj[property['name']];
          if (modelProperty) {
            nullable = modelProperty.nullable || false;
          }
        }
        property['nullable'] = nullable;
      });
    }
  console.log('entity XXX', entity)
    return entity ? entity.properties : [];
  };
  


  export const UdpGridColumnDefs = (
    entityAttributes,
    // actionList,
     //columnName = 'Actions',
    // crudTableActionRenderName = 'actionsRenderer',
    // panelDirection = 'right'
  ) => {
    console.log('entityAttributes', entityAttributes)
    const childEntityAttributes = entityAttributes?.reduce((defs, element) => {
      if (element?.extendedProperties?.childEntity) {
        defs.push(element);
      }
      return defs;
    }, []);
  
    let columnDefs =
      entityAttributes?.reduce((defs, element) => {
        // if (element?.extendedProperties?.defaultVisible) {
        if (!element?.extendedProperties?.childEntity) {
          // update column header if attribute has a child entity
          const childEntity = childEntityAttributes.find(
            ea =>
              Object.keys(ea?.extendedProperties?.childEntityAssoc || {})
                .length &&
              !ea?.extendedProperties?.childEntityAssoc?.UdpType &&
              ea?.name === element?.name &&
              ea?.extendedProperties?.childEntityAssoc.Keys.find(k =>
                toLowerFirstChar(k).includes(element?.name)
              )
          );
          const columnHeaderName = toTitleCase(
            childEntity ? childEntity?.reference : element?.name
          );
  
          let def = {
            ...defaultGridColumn,
            headerName: columnHeaderName,
            field: element?.name.charAt(0).toLowerCase() + element?.name.slice(1),
            //field: element?.name,
            // checkboxSelection: !defs.length && true,
            // headerCheckboxSelection: !defs.length && true,
            // Remove adding checkbox to the first column. This is now added as a single column in the grid, pinned to the left that the user cannot hide. 
            checkboxSelection: false,
            headerCheckboxSelection: false,
            cellRendererParams: {
               // Remove adding checkbox to the first column. This is now added as a single column in the grid, pinned to the left that the user cannot hide. 
              checkbox: false,
            },
          };
  
          if (element?.extendedProperties?.searchable) {
            let filterType = 'agTextColumnFilter';
            let filterOptions = ['equals'];

            switch (element?.type) {
              case 'string':
                filterType = 'agTextColumnFilter';
                filterOptions = ['contains', 'equals', 'notEqual', 'startsWith'];
                break;
              case 'int':
                filterType = 'agNumberColumnFilter';
                filterOptions = [ 'equals', 'notEqual', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'inRange'];
                break;
              case 'DateTime':
                filterType = 'agDateColumnFilter';
                filterOptions = ['equals', 'notEqual', 'lessThan', 'greaterThan', 'inRange'];
                break;
              default:
                filterType = 'agTextColumnFilter';
                filterOptions = ['contains', 'equals', 'notEqual', 'startsWith'];
                break;
            }

            def = {
              ...def,
              filter: filterType,
              filterParams: {
                suppressAndOrCondition: true,
                numberParser: (params) => {
                  return params === null ? null : params;
                },
                filterOptions: filterOptions,
                buttons: ['apply', 'clear']
              },
              enableRowGroup: true,
            } as MyType; // Add type assertion here
          }
          
          if (element?.extendedProperties?.orderable) {
            def = {
              ...def,
              sortable: true,
            };
          }
  
          defs.push(def);
        }
        //  }
        return defs;
      }, []) || [];

      console.log('columnDefs from conversionFunctions', columnDefs)
    
    return columnDefs;
  };



// Add in addition to 'name' 'parentName' - not to be confused with 'parentName currently in use'
// use name + parentName and assign it to 'parentPath'
// use parentPath to later set the object to set the search filter key.

export const useTreeDatasource = (
  apiCatalog,
  filter,
  searchableOnly = true,
  includeReferenceNodes = true,
  name,
  parentFilter,
  parent
) => {
  console.log('apiCatalog', apiCatalog)
  const filteredCatalogObjects = apiCatalog.ctlg.catalogObjectList.filter(
    (obj) =>
      !(obj.catalogObjectName.includes('Page') &&
        obj.catalogObjectName.length !== 4)
  ); 

  console.log(
    'items sent to useTreeDatasource',
    apiCatalog,
    filter,
    searchableOnly,
    includeReferenceNodes,
    name,
    parentFilter,
    parent
  )

  const catalogObjectName = filter
  const catalogObject = filteredCatalogObjects.find(
    (obj) => obj.catalogObjectName === catalogObjectName
  );

  if (!catalogObject) {
    console.error('Catalog object not found');
    return [];
  }

// const rows = catalogObject.properties.filter((obj) =>
//   (includeReferenceNodes || obj.reference == null) ||
//   (obj.extendedProperties.searchable && obj.name.includes(filter ?? '')) ||
//   (!searchableOnly && obj.name.includes(filter ?? ''))
//     ).map(obj => ({
//   ...obj,
//   extendedProperties: {
//     ...obj.extendedProperties,
//     parentFilter: filter, 
//     parent: name, 
//     fromFilter: parentFilter 
//   }
// }));

const rows = catalogObject.properties.filter((obj) =>
(includeReferenceNodes || obj.reference == null) ||
(obj.extendedProperties.searchable && obj.name.includes(filter ?? '')) ||
(!searchableOnly && obj.name.includes(filter ?? ''))
).map(obj => {
// Create or update parentPath based on existing value and new parent argument
let parentPath = obj.extendedProperties.parentPath;
if (parent) {
  parentPath = parentPath ? `${parentPath}.${parent}` : parent;
}

return {
  ...obj,
  extendedProperties: {
    ...obj.extendedProperties,
    parentFilter: filter, // Assigning the incoming filter argument to parentFilter
    parent: name, // Assigning the incoming name argument to parent
    fromFilter: parentFilter, // Assigning the incoming parentFilter argument to fromFilter
    parentPath: parentPath // Updated parentPath
  }
};
});




  console.log('Generated rows:', rows);
  return rows;
};

