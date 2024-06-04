import { Component, Method } from '@stencil/core';
import { getStoredTenant } from './unity-session-storage';

export interface User {
  name: string | undefined;
  firstName: string | undefined;
  familyName: string | undefined;
  jobTitle: string | undefined;
  email: string | undefined;
  mobile: string | undefined;
  phone: string | undefined;
  id: string | undefined;
  location: string | undefined;
  aadId: string | undefined;
  accessToken: string | undefined;
  defaultTenantId: string | undefined;
  currentTenantId: string | undefined;
  tenantIds: Array<string> | undefined;
  roleIds: Array<string> | undefined;
  products: Array<object> | undefined;
  permissions: Array<object> | undefined;
  can: any | undefined;
  statusCode: number | undefined;
  unityId: string | undefined;
  additionalProperties: any | undefined;
  roleNames: Array<string> | undefined;
}

@Component({
  tag: 'udp-user-creator',  // The tag name to use this component
  shadow: true
})
export class UserCreator {
  
  @Method()
  async createUser(userInfo: any): Promise<User> {
    const tenantId: any =
    getStoredTenant() ||
    (userInfo?.defaultTenantId ??
      (userInfo?.tenantIds ? userInfo?.tenantIds[0] : ''));
  let userTenantPermissions: any = [];
  let userTenantRoles: any = [];
  let userTenantProducts: any = [];
  const currentUserTenantProperties = userInfo?.userTenantPropertiesView?.find(
    (propertyView: any) => propertyView?.tenantId === tenantId
  );
  userTenantPermissions = currentUserTenantProperties
    ? currentUserTenantProperties.permissions
    : [];
  userTenantRoles = currentUserTenantProperties
    ? currentUserTenantProperties.securityRoles
    : [];
  userTenantProducts = currentUserTenantProperties
    ? currentUserTenantProperties.products
    : [];

    return {
      name: userInfo?.displayName ?? '',
      firstName: userInfo?.givenName ?? '',
      familyName: userInfo?.surname ?? '',
      jobTitle: userInfo?.jobTitle ?? '',
      email: userInfo?.email ?? '',
      mobile: userInfo?.mobilePhone ?? '',
      phone: userInfo?.officePhone ?? '',
      id: userInfo?.userId ?? '',
      location: userInfo?.location ?? '',
      aadId: userInfo?.id ?? '',
      accessToken: userInfo?.accessToken ?? '',
      tenantIds: userInfo?.tenantIds ?? [],
      defaultTenantId: userInfo?.defaultTenantId ?? '',
      currentTenantId: process.env.REACT_APP_UNITY_TENANT_ID
        ? process.env.REACT_APP_UNITY_TENANT_ID
        : tenantId,
      roleIds: userTenantRoles.map((role: any) => role.roleId) ?? [],
      products: userTenantProducts,
      permissions: userTenantPermissions,
      can:
        userTenantPermissions.reduce((can: any, permission: any) => {
          if (permission.value === 'false') {
            can[permission.name] = false;
          } else if (permission.value === 'true') {
            can[permission.name] = true;
          } else {
            can[permission.name] = permission.value;
          }
          return can;
        }, {}) ?? {},
      statusCode: userInfo?.statusCode ?? undefined,
      unityId: userInfo?.unityId ?? undefined,
      additionalProperties: userInfo?.additionalProperties ?? undefined,
      roleNames: userTenantRoles.map((role) => role.name) ?? []
    };
  }

}