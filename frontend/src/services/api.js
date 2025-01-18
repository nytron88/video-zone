import axios from "axios";
import config from "../config/config";
import { store } from "../store/store";
import { refreshToken } from "../store/slices/authSlice";

const apiClient = axios.create({
  baseURL: `${config.apiBaseUrl}/api/v1`,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response.status === 401 &&
      error.response.data.message?.invalid_access_token === true
    ) {
      try {
        const refreshAction = await store.dispatch(refreshToken());

        if (refreshToken.rejected.match(refreshAction)) {
          console.error("Failed to refresh token. Logging out.");
          error.response.data.message = "Failed to refresh token. Logging out.";
          return Promise.reject(error);
        }

        console.log("Token refreshed successfully.");
        return apiClient.request(error.config);
      } catch (refreshError) {
        console.error("Error during token refresh:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
