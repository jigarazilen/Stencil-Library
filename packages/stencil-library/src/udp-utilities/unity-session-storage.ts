const TenantStorageKey = 'active-tenant';
const AccessTokenKey = 'active-access-token';
const RefreshTokenKey = 'active-refresh-token';

export const storeInitialTenant = (): void => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlTenantId = urlParams.get('tenantId');

  if (urlTenantId) {
    storeTenant(urlTenantId);
  }
};

export const storeTenant = (tenantId: string): void => {
  window.sessionStorage.setItem(TenantStorageKey, tenantId);
};

export const getStoredTenant = (): string | null => {
  return window.sessionStorage.getItem(TenantStorageKey);
};

export const clearStoredTenant = (): void => {
  window.sessionStorage.removeItem(TenantStorageKey);
};

export const storeAccessToken = (accessToken: string): void => {
  window.localStorage.setItem(AccessTokenKey, accessToken);
};

export const getStoredAccessToken = (): string | null => {
  return window.localStorage.getItem(AccessTokenKey);
};

export const clearStoredAccessToken = (): void => {
  window.localStorage.removeItem(AccessTokenKey);
};

export const storeRefreshToken = (refreshToken: string): void => {
  window.localStorage.setItem(RefreshTokenKey, refreshToken);
};

export const getStoredRefreshToken = (): string | null => {
  return window.localStorage.getItem(RefreshTokenKey);
};

export const clearStoredRefreshToken = (): void => {
  window.localStorage.removeItem(RefreshTokenKey);
};
