import { Component, State, Event, EventEmitter, Prop } from '@stencil/core';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { ConfigService } from '../../global/configService';
//import { accessToken } from '../testAuth/manualAccessToken';

interface DecodedToken {
  exp: number;
  eid?: string;
  sub: string;
  // Add other expected fields here
}

interface ApiConfig {
  method: string;
  [key: string]: any;
}

@Component({
  tag: 'get-user',
})
export class GetUser {
  @Prop() accessToken: string;
  @State() loading: boolean = false;
  @State() userInfo: any = {};
  @State() unityUserInfo: any = {};
  @Event() userDataReady: EventEmitter;

  configBaseURL = ConfigService.config.UNITY_API_DOMAIN  + ConfigService.config.SECURITY_SERVICE_V1_API_BASE

  async getAccessToken(): Promise<string> {
    return this.accessToken;
  }

  async apiMutate(baseURL: string, url: string, config: ApiConfig): Promise<any> {
    const fullURL = `${baseURL}/${url}`;
    const accessToken = await this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      // Add other headers as needed
    };
    return axios({
        url: fullURL,
        headers,
        ...config,
      }).catch((error) => {
        if (error.response) {
        }
      }); 
  }


  
  async componentWillLoad() {
    await this.getUserInfo();
    // Emit the event when user data is ready
    this.userDataReady.emit(this.userInfo);

  }

  async getUserInfo() {
    const accessToken = await this.getAccessToken(); // Hardcoded for now
    if (!accessToken) return;

    this.loading = true;

    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(accessToken);
    const sub = decodedToken.eid ?? decodedToken.sub;

    let unityResponse: any;
 
    try {
      
      unityResponse = await this.apiMutate(
       
  
        this.configBaseURL,
        `users/unityuser?sub=${sub}`,
        {
          method: 'get',
        }
      );
      // Do something with the unityResponse here, e.g., storing the tenant.
      console.log('unityResponse', unityResponse)
      console.log('tenant', unityResponse.data.tenantIds[0])
    } catch (e) {
      console.log(e);
      this.userInfo = { /* ...emptyUser, statusCode: e?.response?.status */ };
    }

    let unityUserResponse: any;
    try {
      unityUserResponse = await this.apiMutate(
        // process.env.REACT_APP_USER_API_BASE!,
        this.configBaseURL,
        `users/${sub}`,
        {
          method: 'get',
        }
     
        );
        if (unityUserResponse) {
          this.unityUserInfo = {
            ...unityUserResponse.data,
            unityId: sub,
            displayName: `${unityUserResponse.data.givenName} ${unityUserResponse.data.surname}`,
          };
        }
      } catch (e) {
        console.log(e);
      }
      
      if (unityResponse) {
        this.userInfo = {
          ...unityResponse.data,
          statusCode: unityResponse.status,
          id: unityResponse.data.userId,
        }; 
        
        // Emit the event when user data is ready
        this.userDataReady.emit(this.userInfo);

      }
      
      this.loading = false;
    }
  
  }