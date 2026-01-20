const API_BASE = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let refreshPromise = null;

export const apiRequest = async (endpoint, options = {}) => {
  const makeRequest = async () => {
    return fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // send cookies (refresh token)
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  };

  let res = await makeRequest();

  // 🔁 If access token expired, try silent refresh
  if (res.status === 401 && !endpoint.includes("/auth/refresh-token")) {
    if (!isRefreshing) {
      isRefreshing = true;
      // Call refresh token endpoint silently
      refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include", // refresh token is in HTTP-only cookie
      })
        .then(async (r) => {
          if (!r.ok) throw new Error("Refresh failed");
          // optionally parse new access token if returned
          const contentType = r.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            const data = await r.json();
            // if your backend returns the new access token in response body
            // localStorage.setItem("accessToken", data.accessToken);
          }
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    try {
      await refreshPromise;       // wait for token refresh
      res = await makeRequest();  // retry original request
    } catch {
      throw new Error("Unauthorized"); // refresh failed
    }
  }

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  const contentType = res.headers.get("content-type");
  let data = null;

  if (contentType?.includes("application/json")) {
    data = await res.json();
  }

  if (!res.ok) {
    throw new Error(data?.error || res.statusText);
  }

  return data;
};
