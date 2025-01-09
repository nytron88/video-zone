import axios from "axios";
import config from "../config/config";

const apiClient = axios.create({
  baseURL: `${config.apiBaseUrl}/api/v1`,
});

export default apiClient;
