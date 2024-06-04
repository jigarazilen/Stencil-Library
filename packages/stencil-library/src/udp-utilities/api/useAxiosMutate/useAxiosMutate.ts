import { ApiService } from '../api-services';
import { AxiosResponse } from 'axios';

interface UseApiServiceMutateOptions {
  baseURL?: string;
  url: string;
  config?: any;
}

interface UseApiServiceMutateResult<T> {
  data: T | null;
  loading: boolean;
  error: any | null;
}

export async function useApiServiceMutate<T>(
  options: UseApiServiceMutateOptions
): Promise<UseApiServiceMutateResult<T>> {
  const apiService = new ApiService();
  let data: T | null = null;
  let loading = false;
  let error: any | null = null;

  // Simulating React's useEffect here, replace with your Stencil lifecycle methods
  loading = true;

  try {
    const fullURL = options.baseURL
      ? `${options.baseURL}/${options.url}`
      : options.url;
    const response: AxiosResponse<any> = await apiService.get(
      fullURL,
      options.config
    );

    if (response.status === 200) {
      data = response.data;
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (e) {
    error = e;
  } finally {
    loading = false;
  }

  return { data, loading, error };
}
