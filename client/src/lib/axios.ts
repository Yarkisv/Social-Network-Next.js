import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log(
      "Axios intercepted error: ",
      error.response.status,
      error.config.url
    );

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        console.log("Trting to refrest tokens");
        const refreshRes = await axiosInstance.post("/auth/refresh");
        console.log("Refresh success: ", refreshRes.status);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("Token refresh failed:", refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
