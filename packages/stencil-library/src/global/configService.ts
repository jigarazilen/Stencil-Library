export class ConfigService {
  // private static _config = {
  //   UNITY_API_DOMAIN: 'https://az-api-unity-gateway-dev.azurewebsites.net',
  //   MINDSCOPE_API_DOMAIN: 'https://unitystart-mindscope-api.unitydev.ca',
  //   INTEGRATION_V1_API_BASE: '/IntegrationService/api/v1',
  //   INTEGRATION_V2_API_BASE: '/IntegrationService/api/v2',
  //   TENANT_V2_API_BASE: '/TenantService/api/v2',
  //   V1_API_BASE: '/api/v1',
  // };
  private static _config = {
    UNITY_API_DOMAIN: 'https://gateway.unitydev.ca',
    MINDSCOPE_API_DOMAIN: 'https://unitystart-mindscope-api.unitydev.ca',
    INTEGRATION_V1_API_BASE: '/IntegrationService/api/v1',
    INTEGRATION_V2_API_BASE: '/IntegrationService/api/v2',
    SECURITY_SERVICE_V1_API_BASE: '/SecurityService/api/v1',
    TENANT_V2_API_BASE: '/TenantService/api/v2',
    V1_API_BASE: '/api/v1',
  };

  static set config(config: { 
    UNITY_API_DOMAIN?: string; 
    INTEGRATION_V1_API_BASE?: string; 
    INTEGRATION_V2_API_BASE?: string;
    SECURITY_SERVICE_V1_API_BASE?: string;
    TENANT_V2_API_BASE?: string;
    MINDSCOPE_API_DOMAIN?: string;
    V1_API_BASE?: string;
  }) {
    this._config = { ...this._config, ...config };
  }

  static get config() {
    return this._config;
  }
}
