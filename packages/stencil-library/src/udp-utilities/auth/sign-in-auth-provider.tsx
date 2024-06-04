// import { Component, Method, State } from '@stencil/core';
// import { PublicClientApplication, EventType, Configuration } from '@azure/msal-browser';
// import { signInConfig } from './auth-config';
// // import {  tokenRequest, } from './auth-config';
// // import {  loginRequest } from './auth-config';

// @Component({
//   tag: 'sign-in-auth-provider',
//   shadow: true,
// })
// export class SignInAuthProvider {
//   @State() accounts = [];
//   private signInAuthProvider: PublicClientApplication;

//   constructor() {
//     this.signInAuthProvider = new PublicClientApplication(signInConfig);

//     // Initialize accounts
//     this.accounts = this.signInAuthProvider.getAllAccounts();
//     if (this.accounts.length > 0) {
//       this.signInAuthProvider.setActiveAccount(this.accounts[0]);
//     }

//     // Event Callback
//     this.signInAuthProvider.addEventCallback((event: any) => {
//       if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
//         const account = event.payload.account;
//         this.signInAuthProvider.setActiveAccount(account);
//       }
//     });

//     // Handle Redirect
//     this.signInAuthProvider.handleRedirectPromise().then((authResult) => {
//       const account = this.signInAuthProvider.getActiveAccount();
//       if (!account) {
//         this.signInAuthProvider.loginRedirect(loginRequest);
//       }
//     });
//   }

//   @Method()
//   async login() {
//     return this.signInAuthProvider.loginRedirect(tokenRequest);
//   }

//   @Method()
//   async logout() {
//     return this.signInAuthProvider.logoutRedirect({
//       account: this.signInAuthProvider.getActiveAccount(),
//     });
//   }

//   @Method()
//   async getActiveAccount() {
//     return this.signInAuthProvider.getActiveAccount();
//   }

//   @Method()
//   async acquireTokenSilent() {
//     const account = this.signInAuthProvider.getActiveAccount();
//     if (account) {
//       return this.signInAuthProvider.acquireTokenSilent({
//         ...tokenRequest,
//         account,
//       });
//     }
//     return null;
//   }
  
//   // add other methods related to authentication logic
//   // For example, methods for acquiring tokens, refresh logic, etc.
// }
