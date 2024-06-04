// src/global/state.ts
import { createStore } from '@stencil/store';
import { getApiCatalogById } from '../udp-utilities/api-udp/apiUtils'; 

const { state, onChange } = createStore({
  catalogData: null,
  isLoadingCatalogData: false,
  hotListActive: ''
});

async function loadCatalogData(apiCatalogId, accessToken) {
  state.isLoadingCatalogData = true;

  try {
    // const apiCatalogData = localStorage.getItem('apiCatalogId') || await getApiCatalogById(apiCatalogId, accessToken);
    const apiCatalogData = await getApiCatalogById(apiCatalogId, accessToken);
    console.log('store state was')
    state.catalogData = apiCatalogData;
  } catch (error) {
    console.error('Error loading catalog data:', error);
    state.catalogData = null; // Reset the catalog data on error
  } finally {
    state.isLoadingCatalogData = false;
  }
}

//export default state;
export { state, onChange, loadCatalogData };
