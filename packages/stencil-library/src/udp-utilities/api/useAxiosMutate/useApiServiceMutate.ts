import { ApiService } from '../api-services';
import { AxiosResponse } from 'axios';
import userStore from '../../../store/user-store'; // Your user store
import { UserCreator } from '../../udp-user-creator'; // your Stencil UserCreator class

export const useApiServiceMutate = async (options: any) => {
  const apiService = new ApiService();
  const userCreator = new UserCreator();
  const user = userStore.state.user; // Access user directly from store
  let data: any | null = null;
  let loading = false;
  let error: any | null = null;

  loading = true;

  try {
    const fullURL = options.baseURL ? `${options.baseURL}/${options.url}` : options.url;
    const config = {
      ...options.config,
      headers: {
        Authorization: `Bearer ${user?.accessToken}`, // using user accessToken from store
      },
    };
    
    const response: AxiosResponse<any> = await (apiService.get(fullURL, config) as Promise<AxiosResponse<any>>);
    
    if (response.status === 200) {
      data = response.data;
      
      // You can also use the UserCreator class to modify or create a user here
      const newUser = await userCreator.createUser(response.data);
      console.log('New User:', newUser);
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (e) {
    error = e;
  } finally {
    loading = false;
  }

  return { data, loading, error };
};
