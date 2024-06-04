// import { SignInAuthProvider } from './sign-in-auth-provider'; // Assuming this is the correct import path.
// import { BrowserUtils } from '@azure/msal-browser';

// // Importing UnitySessionStorage
// import { 
//   clearStoredAccessToken,
//   clearStoredRefreshToken,
// } from '../unity-session-storage';

// export type LoginFunction = () => void;
// export type LogoutFunction = () => void;

// // Initialize your auth provider
// const signInAuthProvider = new SignInAuthProvider();

// export const useLoginAction: LoginFunction = () => {
//   if (process.env.REACT_APP_LOCAL_AUTH === 'true') {
//     // TODO: come up with a better way to handle this case
//     if (window.location.pathname !== '/login') {
//       localLogout();
//     }
//   } else {
//     // this case is fine
//     if (BrowserUtils.isInIframe()) {
//       // Handle iframe scenario if needed
//     } else {
//       signInAuthProvider.login();
//     }
//   }
// };

// export const useLogoutAction: LogoutFunction = () => {
//   if (BrowserUtils.isInIframe()) {
//     // Handle iframe scenario if needed
//   } else {
//     signInAuthProvider.logout();
//   }
// };

// export const localLogout = () => {
//   clearStoredAccessToken();
//   clearStoredRefreshToken();
//   window.location.replace(`${window.location.origin}/login`);
// };