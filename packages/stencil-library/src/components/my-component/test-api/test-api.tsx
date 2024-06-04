import { Component, h, State } from '@stencil/core';
import { useApiServiceGet } from '../../../udp-utilities/api/useAxiosGet/useAxiosGet';

// Mock function to get current user; replace with your actual implementation
function getCurrentUser() {
  return {
    currentTenantId: 'someTenantId',
    accessToken: 'someAccessToken',
  };
}

const user = getCurrentUser();
const baseURL = process.env.INTEGRATION_API_BASE; 
const PRODUCT_ID = process.env.UNITY_PRODUCT_ID;

@Component({
  tag: 'test-api',
  // styleUrl: 'my-stencil-component.css',
  shadow: true,
})
export class TestApi {
  @State() tpacb: any = null;
  @State() loadingTpacb: boolean = true;
  @State() tpacbError: any = null;

  async componentWillLoad() {
    const url = `tenantProductApiCatalogBase/tenant/${user?.currentTenantId}/product/${PRODUCT_ID}`;
    const { data, loading, error } = await useApiServiceGet(baseURL, url, {}, !!!user, false);

    this.tpacb = data;
    this.loadingTpacb = loading;
    this.tpacbError = error;
  }

  render() {
    if (this.loadingTpacb) {
      return <div>Loading...</div>;
    }

    if (this.tpacbError) {
      return <div>Error: {JSON.stringify(this.tpacbError)}</div>;
    }

    return (
      <div>
        {/* Render your tpacb data here */}
        {JSON.stringify(this.tpacb)}
      </div>
    );
  }
}
