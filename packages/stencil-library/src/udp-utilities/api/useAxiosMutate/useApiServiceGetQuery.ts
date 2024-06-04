import { useUser } from '../../../udp-utilities/useUsers'; // import your existing useUser function
import axios from 'axios';

async function useApiServiceGetQuery(url: string, params: any, config: any, _isManual: boolean) {
  const user = useUser();
  
  if (!user?.accessToken) {
    _isManual = true;
  }

  const headers = {
    ...config.headers,
    currentTenantId: user?.currentTenantId ?? ''
  };

  config.headers = headers;

  try {
    const { data } = await axios({ url, params, ...config });
    return { data, loading: false, error: null };
  } catch (error) {
    return { data: null, loading: false, error };
  }
}

async function useApiServiceGet(baseURL: string, url: string, config: any = {}, _isManual: boolean, _useCache: boolean = true) {
  const user = useUser();
  
  if (!user?.accessToken) {
    _isManual = true;
  }

  const headers = {
    ...config.headers,
    currentTenantId: user?.currentTenantId ?? ''
  };

  config.headers = headers;

  const fullURL = `${baseURL}/${url}`;
  
  try {
    const { data } = await axios({ url: fullURL, ...config });
    return { data, loading: false, error: null };
  } catch (error) {
    return { data: null, loading: false, error };
  }
}

export { useApiServiceGetQuery, useApiServiceGet };
