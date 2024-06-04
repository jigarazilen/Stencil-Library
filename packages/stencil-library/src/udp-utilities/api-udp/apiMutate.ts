
import Axios from 'axios';

interface Config {
    headers?: {
      [key: string]: string;
    };
    [key: string]: any;
  }
  

// export const getAccessToken = async () => {
//     return 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ik1Bc2V1MXplcmJDaVA0cW5UNUtkRlFjaFNpTHpiVDJieFdCVVBVXzYtNGMiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiI5YzI0MTNiZS1hNTZiLTQ5NzAtOWVmMC0wZTNmMDI4Y2E1YWEiLCJlbWFpbCI6ImdyZWdvcnlAcmVkd2Vya3Mub3JnIiwibmFtZSI6IkdyZWdvcnkgVGhvbWFzIiwiZ2l2ZW5fbmFtZSI6IkdyZWdvcnkiLCJmYW1pbHlfbmFtZSI6IlRob21hcyIsInVuaXR5VXNlcklkIjoiOGZlM2I1Y2UtNmE5NC00ZmY0LWIzNWMtYmUyNTk2ZWExMzgwIiwidGVuYW50c0xpc3QiOiJbe1wiVGVuYW50SWRcIjpcImY4NmE5YjdjLWJhYjAtNDI4MS04OWEyLTUyYjRjYWY4OWZhYlwiLFwiVGVuYW50TmFtZVwiOlwiVW5pdmVydXMgU29mdHdhcmUgSW5jXCIsXCJQcm9kdWN0c1wiOlszNiwzNywzNCwzNSwxLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMTgsMTksMjAsMjEsMjIsMjMsMjQsMjUsMjYsMjcsMjgsMjksMiw0MSw1Ml0sXCJSb2xlc1wiOltcIjYyMzRiNzQwLWIyNmYtNDE4MS05Yjk1LTRjNDA2MzQ1MzhjMVwiXX0se1wiVGVuYW50SWRcIjpcIjk4ZjUwYTUxLTdjNjEtNDMxMC1iNWI0LTNhOWZlMDJjODEyM1wiLFwiVGVuYW50TmFtZVwiOlwiU21hcnRHcmlkQ0lTXCIsXCJQcm9kdWN0c1wiOlsxLDMsNCw1LDQxLDYsOCw3LDksMTEsMTAsMTUsMTYsMTQsMTcsMTgsMTksMjAsMjEsMjIsMjMsMjQsMjUsMjYsMTMsMTIsMjgsMjksMjcsMzBdLFwiUm9sZXNcIjpbXCI2MjM0Yjc0MC1iMjZmLTQxODEtOWI5NS00YzQwNjM0NTM4YzFcIl19XSIsInRpZCI6IjIxODg2NTI4LTM2MDItNGJmMi1hMzZiLTI5YjFkMTUyZTExYiIsImlzRm9yZ290UGFzc3dvcmQiOmZhbHNlLCJub25jZSI6IjQ3NDdkMTJhLWEzMGItNDRlMC1iNDllLTVmYmY0YjZhOTdmNiIsInNjcCI6ImFwaV9hY2Nlc3MiLCJhenAiOiJmYzUxNGZkOC01NGIzLTRmYWItYmRjOC1hZTdkY2Q4YzY1NzUiLCJ2ZXIiOiIxLjAiLCJpYXQiOjE2OTYzNTMzMTMsImF1ZCI6IjNmOTY2NDFmLTk0NDItNDUzMi1iNWJiLTdkYmM5Y2EzZjNhNSIsImV4cCI6MTY5NjM1NjkxMywiaXNzIjoiaHR0cHM6Ly91bml2ZXJ1c3VuaXR5ZGV2LmIyY2xvZ2luLmNvbS8yMTg4NjUyOC0zNjAyLTRiZjItYTM2Yi0yOWIxZDE1MmUxMWIvdjIuMC8iLCJuYmYiOjE2OTYzNTMzMTN9.Xcp8JSrF9mT3O3DSdqYmGRSAjo5Km4-XkLUDEuk3fXJnAPPF7vKtApSvA65iAlhqtyB4JY6idDrzWG5zgpyEvpTvc6Kvj6RjHXEkqMmsY6H1nFxAsIvfL72Sl8U4lBD9c4MOO1r5itfjsPkdZhV7ZtQi9xbFO0KTZmtLpET0hC0e8DA61uKAq2R5olfXi8pJThJGRRWleWFXwyatyjXIOfRpvuTfE5ls1zYSo62_7_FXOVAyAf-CrDLZFga8QYd4y5oncUAkbP4Lja0jDkHvvJhBRz67FePcWhJWo_6ofqGLRFBpFneduwgVgDMf6RY5mJa-5dlwDWE8YTqcuNMmlg'
//   };
  
// export const getMergedConfig = (accessToken: string | null, config?: Config): Config => {
//     const headers = config?.headers ? { ...config.headers } : {};
  
//     headers.currentTenantId = headers.currentTenantId || "f86a9b7c-bab0-4281-89a2-52b4caf89fab"; // Your currentTenantId
//     if (accessToken) headers.Authorization = headers.Authorization || `Bearer ${accessToken}`;
  
//     return { ...config, headers };
//   };


//   export const apiMutate = async (
//     baseURL: string,
//     url: string,
//     config: Config,
//     data: any,
//     accessToken: string | null
//   ) => {
//     const fullURL = { url: `${baseURL}/${url}` };
//     const mergedConfig = getMergedConfig(accessToken, config);
//     return Axios({ ...fullURL, ...mergedConfig, ...data });
//   };
  

export const getMergedConfig = (tenantId: string, accessToken: string | null, config?: Config): Config => {
  const headers = config?.headers ? { ...config.headers } : {};
  
  headers.currentTenantId = tenantId;
  if (accessToken) headers.Authorization = headers.Authorization || `Bearer ${accessToken}`;
  
  return { ...config, headers };
};

// export const apiMutate = async (
//   baseURL: string,
//   url: string,
//   config: Config,
//   data: any,
//   accessToken: string | null,
//   tenantId: string // New tenantId parameter
// ) => {
//   const fullURL = { url: `${baseURL}/${url}` };
//   const mergedConfig = getMergedConfig(tenantId, accessToken, config); // Pass the tenantId
//   return Axios({ ...fullURL, ...mergedConfig, ...data });
// };

export const apiMutate = async (
  baseURL: string,
  url: string,
  config: Config,
  data: any,
  accessToken: string | null,
  tenantId: string // New tenantId parameter
) => {
  const fullURL = { url: `${baseURL}/${url}` };
  const mergedConfig = getMergedConfig(tenantId, accessToken, config); // Pass the tenantId
  return Axios({ ...fullURL, ...mergedConfig, ...data });
};


