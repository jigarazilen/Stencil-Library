
import { Component, State, Watch, Prop, EventEmitter, Event } from '@stencil/core';
import { apiMutate } from './apiMutate';  
//import { getApiCatalogAndProduct } from './apiUtils';

@Component({
  tag: 'udp-fetch',
  shadow: true,
})
export class UdpFetch {
  @Prop() accessToken: string;
  @Prop() tenantId: string; 
  @State() entityData: any[] = [];
  @State() loading: boolean = false;
  @Prop() isServerSide: boolean = false;

  // @Prop() promotedEntity: any =
  // {
  //   "entityName": "Actor",
  //   "productId": 41,
  //   "unityBaseGetAllMethod": {
  //     "apiMethodId": "8ab93cb4-ad6a-4b65-b1f9-0d5fb37efd62",
  //     "pageId": null,
  //     "pathParameters": [
  //       {
  //         "name": "udp-api-version",
  //         "in": "path",
  //         "parameterType": "string",
  //         "fullReference": ""
  //       }
  //     ],
  //     "queryParameters": [
  //       {
  //         "name": "includeSoftDelete",
  //         "in": "query",
  //         "parameterType": "bool",
  //         "fullReference": ""
  //       }
  //     ]
  //   },
  //   "unityBaseGetMethod": {
  //     "apiMethodId": "db064f38-7e9a-42dc-bd96-28627b93b8aa",
  //     "pageId": null,
  //     "pathParameters": [
  //       {
  //         "name": "iD",
  //         "in": "path",
  //         "parameterType": "long",
  //         "fullReference": ""
  //       },
  //       {
  //         "name": "udp-api-version",
  //         "in": "path",
  //         "parameterType": "string",
  //         "fullReference": ""
  //       }
  //     ],
  //     "queryParameters": []
  //   },
  //   "unityBaseGetFullMethod": {
  //     "apiMethodId": "a8b2de6d-15be-41f8-8a92-da84060eb0b8",
  //     "pageId": null,
  //     "pathParameters": [
  //       {
  //         "name": "iD",
  //         "in": "path",
  //         "parameterType": "long",
  //         "fullReference": ""
  //       },
  //       {
  //         "name": "udp-api-version",
  //         "in": "path",
  //         "parameterType": "string",
  //         "fullReference": ""
  //       }
  //     ],
  //     "queryParameters": []
  //   },
  //   "unityBaseCreateMethod": {
  //     "apiMethodId": "09752d46-1ab9-4d14-ac3f-02aef75b19ad",
  //     "pageId": null,
  //     "pathParameters": [
  //       {
  //         "name": "udp-api-version",
  //         "in": "path",
  //         "parameterType": "string",
  //         "fullReference": ""
  //       }
  //     ],
  //     "queryParameters": []
  //   },
  //   "unityBaseUpdateMethod": {
  //     "apiMethodId": "7273a4e4-8780-46e3-b24f-43c86b48ecec",
  //     "pageId": null,
  //     "pathParameters": [
  //       {
  //         "name": "iD",
  //         "in": "path",
  //         "parameterType": "long",
  //         "fullReference": ""
  //       },
  //       {
  //         "name": "udp-api-version",
  //         "in": "path",
  //         "parameterType": "string",
  //         "fullReference": ""
  //       }
  //     ],
  //     "queryParameters": []
  //   },
  //   "unityBaseDeleteMethod": {
  //     "apiMethodId": "67a4c8b6-9793-4b3f-a507-debddd7ed995",
  //     "pageId": null,
  //     "pathParameters": [
  //       {
  //         "name": "iD",
  //         "in": "path",
  //         "parameterType": "long",
  //         "fullReference": ""
  //       },
  //       {
  //         "name": "udp-api-version",
  //         "in": "path",
  //         "parameterType": "string",
  //         "fullReference": ""
  //       }
  //     ],
  //     "queryParameters": [
  //       {
  //         "name": "destroy",
  //         "in": "query",
  //         "parameterType": "bool",
  //         "fullReference": ""
  //       }
  //     ]
  //   },
  //   "unityBaseGetConfigMethod": null,
  //   "unityBaseSearchMethod": {
  //     "apiMethodId": "0b878aad-a726-437a-ab0d-2b4d1318068b",
  //     "pageId": null,
  //     "pathParameters": [
  //       {
  //         "name": "udp-api-version",
  //         "in": "path",
  //         "parameterType": "string",
  //         "fullReference": ""
  //       }
  //     ],
  //     "queryParameters": []
  //   },
  //   "unityBaseDescribeMethod": null,
  //   "unityBaseGetDataMethod": null,
  //   "unityBaseVirtualGetMethod": null,
  //   "unityBaseVirtualCreateMethod": null,
  //   "unityBaseVirtualUpdateMethod": null,
  //   "unityBaseVirtualDeleteMethod": null
  // }
  
  @Prop() promotedEntity: any = {}
  


  @Event() dataFetched: EventEmitter;

  async componentWillLoad() {
    console.log('Component is about to be loaded');
    await this.fetchEntityData();

    const getpromotedEntity = localStorage.getItem('promotedMethod')
    this.promotedEntity = JSON.parse(getpromotedEntity);
  }

  @Watch('promotedEntity')
  @Watch('isServerSide')
  async fetchEntityData() {
    console.log('fetchEntityData is called', this.promotedEntity);

    const maxRetries = 3;
    const delay = 1000;  // 1 second
    let retries = 0;
  
  
    // Fetch apiCatalogId and product (if you still need this)
  //  const { apiCatalogId, product } = await getApiCatalogAndProduct(this.tenantId, 13, accessToken);
  //  console.log('_apiCatalogId', apiCatalogId, product);


    // Use apiCatalogId to fetch promoted method entities
   // const entityName = 'Actor'; // replace with the actual entity name
    //const promotedEntities = await getPromotedMethodEntities(apiCatalogId, entityName, 13, this.accessToken);
   

    const fetchData = async () => {
      if (this.promotedEntity && !this.isServerSide) {
        this.entityData = [];
        this.loading = true;

        const baseURL = 'https://az-api-unity-gateway-dev.azurewebsites.net/IntegrationService/api/v1';
        const url = `apimethod/executeQueryWithParameters/${this.promotedEntity?.unityBaseGetAllMethod?.apiMethodId}`;
        const config = {
          method: 'post',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,  
            'Tenant-Id': this.tenantId,
          },
        };
        const data = {
          data: { includeSoftDelete: true },
        };

        try {
          const response = await apiMutate(baseURL, url, config, data, this.accessToken, this.tenantId);
            console.log(`Access Token: ${this.accessToken}`);
            console.log(`Tenant Id: ${this.tenantId}`);
            console.log(`Final API URL: ${baseURL}/${url}`);

          if (response?.status === 200) {
            
            this.entityData = response.data || [];
            console.log('response.data test', response.data);
            this.dataFetched.emit(this.entityData);
          }
        } catch (e) {
          if (retries < maxRetries) {
            retries++;
            console.log(`Retry ${retries} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            await fetchData();
          } else {
            console.log(`Max retries reached: ${e}`);
          }
        }
    
        this.loading = false;
      }
    };
    

    await fetchData();
  }
}




















 
 