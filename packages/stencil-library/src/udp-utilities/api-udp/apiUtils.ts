import axios from 'axios';

import jwtDecode from 'jwt-decode';
import { makeApiCall } from '../api/makeApiCall/makeApiCall';
import { ConfigService } from '../../global/configService';



let baseURL = ConfigService.config.UNITY_API_DOMAIN  + ConfigService.config.INTEGRATION_V1_API_BASE
let baseURLV2 = ConfigService.config.UNITY_API_DOMAIN  + ConfigService.config.INTEGRATION_V2_API_BASE
let baseURLTenantV2 = ConfigService.config.UNITY_API_DOMAIN  + ConfigService.config.TENANT_V2_API_BASE
let baseURLMindscope = ConfigService.config.MINDSCOPE_API_DOMAIN + ConfigService.config.V1_API_BASE
let securityServiceV1 = ConfigService.config.UNITY_API_DOMAIN + ConfigService.config.SECURITY_SERVICE_V1_API_BASE
// const baseURLINT = ConfigService.config.INTEGRATION_V2_API_BASE;

export const initializeUrls = async (unityApiDomain: string, mindscopeApiDomain: string) => {
  baseURL = unityApiDomain + ConfigService.config.INTEGRATION_V1_API_BASE;
  baseURLV2 = unityApiDomain + ConfigService.config.INTEGRATION_V2_API_BASE;
  baseURLTenantV2 = unityApiDomain + ConfigService.config.TENANT_V2_API_BASE;
  baseURLMindscope = mindscopeApiDomain + ConfigService.config.V1_API_BASE;
  securityServiceV1 = unityApiDomain + ConfigService.config.SECURITY_SERVICE_V1_API_BASE;
}

const accessToken = localStorage.getItem('accessToken') || '';

//const UNITY_API_DOMAIN = 'https://az-api-unity-gateway-dev.azurewebsites.net'


let dynamicTenantId: string | null = null;



// Get user info
export const getUserInfo = async (accessToken: string): Promise<any> => {
  const headers: { [key: string]: string } = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const decodedToken = jwtDecode<DecodedToken>(accessToken);
  const sub = decodedToken.eid ?? decodedToken.sub;

  localStorage.setItem('accessToken', sub)

  //const url = `https://az-api-unity-gateway-dev.azurewebsites.net/SecurityService/api/v1/users/unityuser?sub=${sub}`;
  //const url = `https://gateway.unitydev.ca/SecurityService/api/v1/users/unityuser?sub=${sub}`;
  const url = `${securityServiceV1}/users/unityuser?sub=${sub}`;
  
  // const url = `${baseURL}/users/unityuser?sub=${sub}`;

  const response = await axios.get(url, { headers });
  if (response.status === 200) {
    console.log('response.data USER X', response.data)
    localStorage.setItem('defaultTenantId', response.data.defaultTenantId)
    return response.data;
  } else {
    throw new Error(`Failed to get user info. Status code: ${response.status}`);
  }
};



export const setDynamicTenantId = async (accessToken: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const userInfo = await getUserInfo(accessToken);
      dynamicTenantId = userInfo.tenantIds[0];
      console.log('dynamicTenantId:', dynamicTenantId);
      resolve();
    } catch (error) {
      console.log('Error fetching user info:', error);
      reject(error);
    }
  });
};


interface DecodedToken {
  exp: number;
  eid?: string;
  sub: string;
  // Add other expected fields here
}
  
   

// Function for the first API call 
export const getApiCatalogAndProduct = async (tenantId: string, productId: number, accessToken: string) => {
  const url = `${baseURL}/tenantProductApiCatalogBase/tenant/${tenantId}/product/${productId}`;
  return makeApiCall('GET', url, accessToken); 
};

// Function for the second API call
export const getPromotedMethodEntities = async (apiCatalogId: string, entityName: string, productId: string, accessToken: string) => {
  const url = `${baseURL}/apicatalog/${apiCatalogId}/promotedMethodEntities/${entityName}/product/${productId}`
  return makeApiCall('GET', url, accessToken); 
};



// Initialize the data
export const initializeApiCatalogAndProduct = async () => {
  try {
    // Fetch dynamic tenantId
    const userInfo = await getUserInfo(accessToken);
    const dynamicTenantId = localStorage.getItem('tennatId') || localStorage.getItem('defaulTenantId') || userInfo.tenantIds[0];
    //const dynamicTenantId = userInfo.tenantIds[0];  change this to restore unity data

    if (!dynamicTenantId) {
      throw new Error("Dynamic tenant ID not found");
    }

    // const { productId } = await getApiCatalogAndProduct(dynamicTenantId, 41, accessToken);
    // console.log('_productX',  productId);

    const productId = parseInt(localStorage.getItem('productId'), 10);

    const { apiCatalogId } = await getApiCatalogAndProduct(dynamicTenantId, productId, accessToken);
    console.log('_apiCatalogIdXZ', apiCatalogId); 
    localStorage.setItem("apiCatalogId", apiCatalogId);

    

    return { apiCatalogId, productId };
  } catch (error) {
    console.error('Error in initializing:', error);
    return null;
  }
};

//https://az-api-unity-gateway-dev.azurewebsites.net/IntegrationService/api/v1/apimethod/executeQueryAdHoc/
// Server-side call 
export const executeQueryAdHoc = async (data: any, apiMethodId: string, accessToken: string, tenantId: string, apiBase) => {
  // console.log('server side call', 'Data (APIUTIL) ::::', data, 'Api Method (APIUTIL) ::::', apiMethodId, 'Tenant ID (APIUTIL) ::::', tenantId);
  console.log('abcdefghi',apiMethodId  )
  const url = apiBase != 'hotlist' ? `${baseURL}/apimethod/executeQueryAdHoc/${apiMethodId}` : `${baseURLMindscope}/UdpHotList/containingRecord`;
  return makeApiCall('POST', url, accessToken, data, tenantId);
};

// Function for the new API call to get apiCatalog by apiCatalogId
export const getApiCatalogById = async (apiCatalogId: string, accessToken: string) => {
  console.log('getApiCatalogById called', apiCatalogId)
  const url = `${baseURL}/apiCatalog/${apiCatalogId}`;
  return makeApiCall('GET', url, accessToken);
};



export const executeQueryWithParameters = async (data: any, apiMethodId: string, accessToken: string, tenantId: string) => {
  //apiMethodId = 'db9d315d-f37e-4e8c-b312-5aa3006f1fd5'
  console.log('executeQueryWithParameters called', apiMethodId)
  const url = `${baseURL}/apimethod/executeQueryWithParameters/${apiMethodId}`;
  const response = await makeApiCall('POST', url, accessToken, data, tenantId);
  return response;  // return the response data
};


interface AliasMap {
  [key: string]: any;
}

interface LookupsMap {
  [key: string]: any;
}

export default class QueryResult {
  aliasMap: AliasMap | null | undefined;
  countable: boolean | null | undefined;
  eagerLoad: boolean | null | undefined;
  lookupsMap: LookupsMap | null | undefined;
  pageList: Array<any> = [];
  total: number | null | undefined;
}


interface LookupCollection {
  [key: string]: {
    data: Array<any>;
    keyName?: string;
    valueName?: string;
    businessObjectKey?: any;
  };
}

const getMappedPageList: (
  lookups: LookupCollection,
  pageList: Array<{ [key: string]: any }>
) => Array<{ [key: string]: any }> = (lookups = {}, pageList = []) => {
  const updatedPageList = pageList.map((item) => {
    const updatedItem = { ...item };

    Object.keys(lookups).forEach((attribute) => {
      const lookup = lookups[attribute];
      const propertyValue = item[attribute];

      if (propertyValue !== null && propertyValue !== undefined) {
        const matchingLookupRow = lookup?.data?.find((row) => {
          if (lookup.keyName && row[lookup.keyName]) {
            return (
              row[lookup.keyName].toString() === propertyValue.toString()
            );
          }
          return false;
        });

        if (matchingLookupRow && lookup.valueName) {
          updatedItem[attribute] = matchingLookupRow[lookup.valueName];
        }
      }
    });

    return updatedItem;
  });

  return updatedPageList;
};


// Utility function to wait for a condition
function waitForCondition(conditionFn: () => boolean, interval: number = 100): Promise<void> {
  return new Promise<void>((resolve) => {
    const intervalId = setInterval(() => {
      if (conditionFn()) {
        clearInterval(intervalId);
        resolve();
      }
    }, interval);
  });
}


export async function processQueryResponseWithLookups(
  _: string | null | undefined,
  response: any,
  replaceCache: boolean | null | undefined,
  //showSnackbars: boolean | null | undefined,
  lookupDataMap: object | null | undefined,
  getLookupById?: Function, // Provide this as a parameter
  setLookupsDataMap?: Function // Provide this as a parameter
): Promise<QueryResult | null> {
  let resultData: QueryResult = new QueryResult();
  let lookupsMap = {};
  console.log('treg Ghomas', response);
  if (response) {
    lookupsMap = lookupDataMap || response?.lookupsMap || {};
    resultData = response;
  } else {
    console.error('Could not retrieve query data');
    return null;
  }

  // Wait for lookupApiMethodId to be available in localStorage
  await waitForCondition(() => localStorage.getItem('lookupApiMethodId') !== null, 500);


  const promises: Array<Promise<any>> = [];
  const lookups: LookupCollection = {};
 
  Object.keys(lookupsMap).forEach((key: string) => {
    const lookupConfig = lookupsMap[key];
    if (lookupConfig?.value) {
      const existingLookup =
        !replaceCache && getLookupById(lookupConfig.value);
      const lookupQueryData = { id: lookupConfig.value };

      if (!existingLookup) {
        promises.push(
          executeQueryWithParameters(
            { data: lookupQueryData },
            //localStorage.getItem('lookupApiMethodId') || '5d8b0198-253d-4f44-b346-83573eef1c51',
            localStorage.getItem('lookupApiMethodId'),
            localStorage.getItem('tenantId'),
            accessToken
          )
            .then((response) => {
              if (response?.status === 200 && response?.data) {
                const lookupConfig = lookupsMap[key];
                lookups[key] = {
                  data: response.data.data,
                  keyName:
                    lookupConfig.lookupKeyName || response.data.keyName,
                  valueName:
                    lookupConfig.lookupValueName || response.data.valueName,
                  businessObjectKey: response.data.businessObjectKey
                };
                setLookupsDataMap(
                  { [response.data.id]: response.data },
                  replaceCache
                );
              }
            })
            .catch((e) => e)
        );
      } else {
        lookups[key] = {
          data: existingLookup.data,
          keyName: lookupConfig.lookupKeyName || existingLookup.keyName,
          valueName:
            lookupConfig.lookupValueName || existingLookup.valueName,
          businessObjectKey: existingLookup.businessObjectKey
        };
      }
    }
  });

  await Promise.all(promises);

  const mappedLookupPageList: Array<Object> = getMappedPageList(
    lookups,
    resultData.pageList
  );
  resultData.pageList = mappedLookupPageList;
  return resultData;
}





















//showSnackbars: boolean | null | undefined = false
//apiMethodId: string | null | undefined,

export const executeQueryAdHocAndMapLookups = async (
 
  lookupApiMethodId: string | null | undefined, // need to determine lookupApiMethodId
  
  _: string | null | undefined,
  
  lookupsMap: object | null | undefined,
  
  replaceCache: boolean | null | undefined,
  filterObject: any = {},
  defaultFilterObject: any = {},
  logicalSearchOperator: number | null | undefined,
 
) => {
  console.log('executeQueryAdHocAndMapLookups called')
  if (!lookupApiMethodId) {
    console.info('Udp Lookup Api Method Id NOT Set');
  }
  console.info('Udp Lookup Api Method Id IS Set', lookupApiMethodId);

  
// First, update filterObject with the logicalSearchOperator value
filterObject[0].logicalSearchOperator = logicalSearchOperator;

// Then, convert filterObject to an individual object
const convertedFilterObject = Object.assign({}, ...filterObject);


// Initialize searchObjectWithDefault using convertedFilterObject
let searchObjectWithDefault = { ...convertedFilterObject };

// Check if defaultFilterObject exists and it's not an empty array
if (defaultFilterObject && Array.isArray(defaultFilterObject) && defaultFilterObject.length > 0) {
  searchObjectWithDefault = {
    ...searchObjectWithDefault,
    filterElements: [...convertedFilterObject.filterElements, ...defaultFilterObject]
  };
}



console.log('filter object AUI', JSON.stringify(searchObjectWithDefault, null, 2));
console.log('tennantId:::', localStorage.getItem('tennatId'))
const response = await executeQueryAdHoc(searchObjectWithDefault, localStorage.getItem('apiMethodId'), localStorage.getItem('accessToken'), localStorage.getItem('tennatId'), ''   );
console.log('response from QUAD', response)
 
  if (lookupApiMethodId) {
    return await processQueryResponseWithLookups(
      lookupApiMethodId,
      response,
      replaceCache,
      // showSnackbars,
      lookupsMap,
    );
  }
  console.log('response from executeQueryAdHocAndMapLookups', response)
   return response?.data;
  
};



export async function getPromotedMethodId(tenantId, accessToken, entityName, productId, callback) {
  console.log('getPromotedMethodId called YY', tenantId, accessToken, entityName, productId);
  try {
    const { apiCatalogId } = await getApiCatalogAndProduct(tenantId, this.productId, accessToken);
    if (apiCatalogId) {
      localStorage.setItem("apiCatalogIdDemo", apiCatalogId);
      const result = await getPromotedMethodEntities(apiCatalogId, entityName, productId, accessToken);
      localStorage.setItem("promotedEntities", JSON.stringify(result)); // Set promoted entities in local storage
      console.log('Result from getPromotedMethodEntitiesY:', result);
      if (callback) {
        callback(result);
      }
    } else {
      console.log('apiCatalogId not received');
    }
  } catch (error) {
    console.log('Error occurred:', error);
  }
}


// Send a request to get a view
export const getSelectedView = async (gridviewId: string, accessToken: string, callback: (data: any) => void) => {
  const url = `${baseURLTenantV2}/GridView/${gridviewId}/PartiallyFull`;
  const data = await makeApiCall('GET', url, accessToken);
  console.log('data from utils:', data)
  // Execute the callback with the received data
  callback(data);

};
// Send a request to delete a view
export const deleteSelectedView = async (gridviewId: string, accessToken: string, callback: (data: any) => void) => {
  const url = `${baseURLTenantV2}/GridView/${gridviewId}`;
  const data = await makeApiCall('DELETE', url, accessToken);
  console.log('data from utils:', data)
  // Execute the callback with the received data
  callback(data);
};



// To get a list of available views
export const getAvailableViews = async (userId: string, gridId: string, apiCatalogId: string, entityName: string, accessToken: string, callback: (data: any) => void) => {
  const url = `${baseURLTenantV2}/GridView/getFromUser/${userId}/${gridId}?domainName=${entityName}&apiCatalogId=${apiCatalogId}`
  const data = await makeApiCall('GET', url, accessToken);
  
  // Execute the callback with the received data
  callback(data);
};


// Save a view
export const saveView = async (
  userId: string,
  gridId: string,
  apiCatalogId: string,
  accessToken: string,
  name: string,
  domain: string,
  tenantId: string, 
  gridConfigurations: any, 
  isPrivate: number,
  isDefault: number,
  callback: (data: any) => void
) => {
  const url = `${baseURLTenantV2}/GridView/createGridView`;

  // Construct your payload dynamically
  const payload = {
    gridView: {
      Name: name,
      GridViewVisibilityTypeId: isPrivate,
      isDefault: isDefault,
      tenantId: tenantId, 
      userId: userId,
      gridId: gridId,
      domain: domain,
      apiCatalogId: apiCatalogId,
    },
    gridConfigurations: gridConfigurations // Your form data
  };

  const data = await makeApiCall('POST', url, accessToken, payload, tenantId);

  // Execute the callback with the received data
  callback(data);
};

// UPDATE
// export const updateView = async (
//   gridViewId: string,
//   userId: string,
//   gridId: string,
//   apiCatalogId: string,
//   accessToken: string,
//   name: string,  
//   tenantId: string, 
//   // gridConfigurations: any, 
//   isDefault: number,
//   callback: (data: any) => void
// ) => {
//   const url = `${baseURLTenantV2}/GridView/${gridViewId}`;
//   const payload = {
//       Name: name,
//       GridViewVisibilityTypeId: 2,
//       isDefault: isDefault,
//       tenantId: tenantId,
//       userId: userId,
//       gridId: gridId,
//       domain: "Page",
//       apiCatalogId: apiCatalogId,
//   };
//   try {
//     // Make the API call using the makeApiCall function
//     const data = await makeApiCall('PUT', url, accessToken, payload, tenantId);
    
//     // Execute the callback with the received data
//     callback(data);
//   } catch (error) {
//     console.error('Error updating view:', error);
//     // Handle error appropriately
//   }
// };

// UPDATE
export const updateView = async (
  gridViewId: string,
  userId: string,
  gridId: string,
  apiCatalogId: string,
  accessToken: string,
  name: string,  
  tenantId: string, 
  // gridConfigurations: any, 
  isDefault: number,
  domain: string,
  gridViewVisibilityTypeId: number,
  callback: (data: any) => void
) => {
  const url = `${baseURLTenantV2}/GridView/${gridViewId}`;
  const payload = {
      Name: name,
      GridViewVisibilityTypeId: gridViewVisibilityTypeId,
      isDefault: isDefault,
      tenantId: tenantId,
      userId: userId,
      gridId: gridId,
      domain: domain,
      apiCatalogId: apiCatalogId,
  };
  try {
    // Make the API call using the makeApiCall function
    const data = await makeApiCall('PUT', url, accessToken, payload, tenantId);
    
    // Execute the callback with the received data
    callback(data);
  } catch (error) {
    console.error('Error updating view:', error);
    // Handle error appropriately
  }
};



// To get a list of available grid actions
export const getAvailableGridActions = async ( gridId: string, accessToken: string, callback: (data: any) => void) => {
  const url = `${baseURLV2}/action/grid/${gridId}`
  const data = await makeApiCall('GET', url, accessToken);
  
  // Execute the callback with the received data
  callback(data);
};


// Execute a grid action
// export const executeGridAction = async (data: any, actionId: string, accessToken: string, tenantId: string) => { 
//   const url = `${baseURL}/apimethod/executeQueryWithParameters/${actionId}`;
//   return makeApiCall('POST', url, accessToken, data, tenantId);
// };


// Execute a grid action
export const executeGridAction = async (data: any, actionId: string, accessToken: string, tenantId: string) => { 
  const url = `${baseURL}/apimethod/executeQueryWithParameters/${actionId}`;
  // Wrap the data into the format required by the API
  const wrappedData = {
    requestBody: data
  };
  // Pass the wrapped data to the API call function
  return makeApiCall('POST', url, accessToken, wrappedData, tenantId);
};





// New function to call and log getUserInfo
export const callAndLogUserInfo = async () => {
  try {
    const token = accessToken;  // Replace with how you fetch the token
    const userInfo = await getUserInfo(token);
    console.log('User Info from new util call:', userInfo.tenantIds[0]);
  } catch (error) {
    console.log('Error fetching user info:', error);
  }
};

// Call the function to log the user info
// callAndLogUserInfo();

console.log('dynamicTenantId:', dynamicTenantId);


// Function to get list of products
export const getProductList = async (apiCatalogId: string, accessToken: string) => {

  const url = `${baseURL}/ApiCatalog/${apiCatalogId}`
  return makeApiCall('GET', url, accessToken); 
};


// Data Browser Query w/ Grid 
// Response: 1) apiMethodId  2) body (filter elements)  3) catalogModification (array of columns - which columns to display)
// export const getApiMethodInstance  = async (queryId: string, accessToken: string) => {
//   const url = `${baseURL}/apimethod/executeQueryInstance/${queryId}`
//   return makeApiCall('POST', url, accessToken); 
// };

export const getApiMethodInstance = async (queryId: string, tenantId: string, accessToken: string) => {
  // const url = `${baseURL}/apimethodinstance/${queryId}`;
  const url = `${baseURL}/apimethodinstance/${queryId}`;
  const emptyObject = {};
  return makeApiCall('GET', url, accessToken, { data: emptyObject }, tenantId);
};

// https://az-api-unity-gateway-dev.azurewebsites.net/IntegrationService/api/v1/apimethodinstance/e956ce46-636c-4d7f-b594-8754eb3a7136

// Response: 1) entityName - used to get promotedMethodEntity
export const getApiMethod  = async (apiMethodId: string, accessToken: string) => {
  const url = `${baseURL}/apimethod/${apiMethodId}`
  return makeApiCall('GET', url, accessToken); 
};


// queryId: 'e956ce46-636c-4d7f-b594-8754eb3a7136'

export const getInstanceAndMethod = async (queryId: string, tenantId: string, accessToken: string) => {
  try {
    // First API Call
    const apiMethodInstanceResponse = await getApiMethodInstance(queryId,  tenantId, accessToken);
    console.log('apiMethodInstanceResponse', apiMethodInstanceResponse )
    // Extract apiMethodId from the first response
    const apiMethodId = apiMethodInstanceResponse.apiMethodId;
    
    if (!apiMethodId) {
      throw new Error('apiMethodId not found');
    }

    // Second API Call
    const apiMethodResponse = await getApiMethod(apiMethodId, accessToken);
    // console.log('apiMethodInstanceResponse 2', apiMethodInstanceResponse, apiMethodResponse )
    return {
      apiMethodInstanceResponse,
      apiMethodResponse,
    };
  } catch (error) {
    console.error(`Error performing API calls: ${error}`);
    return null;
  }
};





// Lookups

export const getPromotedLookupMethod  = async (apiCatalogId: string, productId: number, accessToken: string) => {
  const url = `${baseURL}/apicatalog/${apiCatalogId}/promotedMethodEntities/UdpLookup/product/${productId}?compareSanitizedName=true`
  return makeApiCall('GET', url, accessToken); 
};


// Hotlists

// Get all hotlists
export const getAllHotlists  = async (tenantId, accessToken) => {
  const url = `${baseURLMindscope}/UdpHotList`
  return makeApiCall('GET', url, accessToken, null, tenantId); 
};

// Create a new hotlist
export const createAHotlist  = async (data, tenantId, accessToken) => {
  const url = `${baseURLMindscope}/UdpHotList`
  return makeApiCall('POST', url, accessToken, data, tenantId); 
};


// Delete hotlist
export const deleteAHotlist  = async (hotlistId, tenantId, accessToken) => {
  const url = `${baseURLMindscope}/UdpHotList/${hotlistId}`
  return makeApiCall('DELETE', url, accessToken, null, tenantId); 
};

// Add a record to a hotlist
export const addRecordToAHotlist  = async (data, tenantId, accessToken) => {
  console.log('addRecordToAHotlist...', data)
  const url = `${baseURLMindscope}/UdpHotListRecord`
  return makeApiCall('POST', url, accessToken, data, tenantId, true); 
};


// Load a hotlist
export const loadAHotlist  = async ( hotlistID, tenantId, accessToken) => {
 
  const url = `${baseURLMindscope}/UdpHotList/${hotlistID}/full`
  return makeApiCall('GET', url, accessToken, null, tenantId, true); 
};


// Remove an item from a hotlist
export const removeRecordFromHotlist  = async ( hotlistID, tenantId, accessToken) => {
 
  const url = `${baseURLMindscope}/udphotlistrecord/${hotlistID}`
  return makeApiCall('DELETE', url, accessToken, null, tenantId, true); 
};



// const tenantId = 'f86a9b7c-bab0-4281-89a2-52b4caf89fab'
// const productIdX = 13; // replace with actual product ID
// const entityName = 'Actor'; // replace with actual entity name
// const apiMethodInstanceId = 'd0e34d80-b801-47ba-886d-9d1ae5344866'; // replace with actual apiMethodInstanceId
// const  apiMethodId = 'db9d315d-f37e-4e8c-b312-5aa3006f1fd5'; // replace with actual apiMethodId
// const gridViewId = "f8defdca-2ffe-4064-a208-730ab9c46357"
// const userId= "8fe3b5ce-6a94-4ff4-b35c-be2596ea1380"
// const gridId = "678410c2-430b-454b-bbef-1a6236a686ec"