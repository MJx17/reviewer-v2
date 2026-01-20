// export const apiRequest = async (endpoint, options = {}, accessToken = null, setAccessToken = null) => {
//   const API_BASE = import.meta.env.VITE_API_URL;

//   const makeRequest = async () => {
//     return fetch(`${API_BASE}${endpoint}`, {
//       headers: {
//         "Content-Type": "application/json",
//         ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//         ...options.headers,
//       },
//       credentials: "include", // sends cookies automatically
//       ...options,
//       body: options.body ? JSON.stringify(options.body) : undefined,
//     });
//   };

//   let res = await makeRequest();

//   // 🔁 If 401, try refresh silently
//   if (res.status === 401 && !endpoint.includes("/auth/refresh")) {
//     if (!setAccessToken) throw new Error("Unauthorized and no token setter provided");

//     try {
//       const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
//         method: "POST",
//         credentials: "include",
//       });

//       if (!refreshRes.ok) throw new Error("Refresh failed");

//       const data = await refreshRes.json();
//       if (data.accessToken && setAccessToken) {
//         setAccessToken(data.accessToken); // store in memory
//       }

//       res = await makeRequest(); // retry original request
//     } catch {
//       throw new Error("Unauthorized");
//     }
//   }

//   const contentType = res.headers.get("content-type");
//   let data = null;
//   if (contentType?.includes("application/json")) data = await res.json();

//   if (!res.ok) throw new Error(data?.error || res.statusText);
//   return data;
// };





// services/api.js
export const apiRequest = async (endpoint, options = {}, accessToken = null) => {
  const API_BASE = import.meta.env.VITE_API_URL;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
    credentials: "include", // send cookies automatically for refreshToken
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = res.headers.get("content-type");
  let data = null;
  if (contentType?.includes("application/json")) data = await res.json();

  if (!res.ok) {
    // ❌ Throw the backend JSON, not a plain Error
    throw data || { error: res.statusText, type: "system" };
  }

  return data;
};
