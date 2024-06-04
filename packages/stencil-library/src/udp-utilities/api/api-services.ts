import axios, { AxiosResponse } from 'axios';


export interface ApiResponse<T> extends Promise<AxiosResponse<T>> {
    // Add other members from Observable if you need
  }

export class ApiService {
  private serviceUrl: string;

  // Initialize the serviceUrl using the constructor, the default is an empty string
  constructor(serviceUrl: string = '') {
    this.serviceUrl = serviceUrl;
  }

  

  // Method to update the base URL dynamically
  setServiceUrl(url: string) {
    this.serviceUrl = url;
  }

  getJSONFile(url: string): ApiResponse<any> {
    const headersConfig = {};
    headersConfig['ignoreLoadingBar'] = '';
    return axios.get(url, { headers: headersConfig });
  }

  get(path: string, params: any = {}, externalUrlDomain: string = ''): ApiResponse<any> {
    const url = externalUrlDomain ? `${externalUrlDomain}${path}` : `${this.serviceUrl}${path}`;
    return axios.get(url, { params }) as ApiResponse<any>;
  }

  put(path: string, body: any = {}, externalUrlDomain?: string, isFormData: boolean = false): ApiResponse<any> {
    const url = externalUrlDomain ? `${externalUrlDomain}${path}` : `${this.serviceUrl}${path}`;
    if (!isFormData) {
      body = JSON.stringify(body);
    }
    return axios.put(url, body);
  }

  post(path: string, body: any = {}, externalUrlDomain?: string, isFormData: boolean = false, params?: any): ApiResponse<any> {
    const url = externalUrlDomain ? `${externalUrlDomain}${path}` : `${this.serviceUrl}${path}`;
    if (!isFormData) {
      body = JSON.stringify(body);
    }
    return axios.post(url, body, { params });
  }

  multipartForm(path: string, body: any, isContentJson?: boolean): ApiResponse<any> {
    const formData = new FormData();
    formData.append('file', body);
    const url = `${this.serviceUrl}${path}`;
    return axios.post(url, formData, isContentJson ? { headers: { 'Content-Type': 'multipart/form-data' } } : {});
  }

  delete(path: string, externalUrlDomain: string = ''): ApiResponse<any> {
    const url = externalUrlDomain ? `${externalUrlDomain}${path}` : `${this.serviceUrl}${path}`;
    return axios.delete(url);
  }
}
