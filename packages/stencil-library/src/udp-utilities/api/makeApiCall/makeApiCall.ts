 import axios, { AxiosRequestConfig } from 'axios';

interface WrappedData {
    data?: any;
    [key: string]: any;
  }
  

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const makeApiCall = async <T extends WrappedData>(
  method: HttpMethod,
  url: string,
  accessToken: string,
  wrappedData?: T,
  tenantId?: string,
  useWrappedDataOnly: boolean = false // New parameter with a default value
): Promise<any> => {
    
  const defaultHeaders = {
    "Content-Type": wrappedData instanceof FormData ? "multipart/form-data": "application/json",
  };

  const headers = {
    ...defaultHeaders,
    Authorization: `Bearer ${accessToken}`,
  };

  if (tenantId) {
    headers["currentTenantId"] = tenantId;
  }

  // Decide whether to use the entire wrappedData or just its 'data' property
  const data = useWrappedDataOnly ? wrappedData : wrappedData?.data ?? wrappedData;

  const config: AxiosRequestConfig = {
    method,
    url,
    headers,
    timeout: 3000000,
    ...(method === 'POST' && data && { data: wrappedData instanceof FormData ? data : JSON.stringify(data) }),
    ...(method === 'PUT' && data && { data: JSON.stringify(data) })
  };

  try {
    const response = await axios(config);
    console.log("Server Response:", response.data, "METHOD:", method);
    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};