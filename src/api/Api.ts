import axios, { InternalAxiosRequestConfig } from 'axios';
import daysjs from 'dayjs';
import Auth from './Auth';
import { templateBaseUrl } from '@/constants';

const Api = axios.create({
  baseURL: templateBaseUrl,
});

Api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const updatedConfig = { ...config };
    if (Auth.getToken()) {
      updatedConfig.headers.Authorization = `Bearer ${Auth.getToken()}`;
    }
    return updatedConfig;
  },
  (error: any) => Promise.reject(error)
);

Api.interceptors.request.use(async (req: InternalAxiosRequestConfig) => {
  const decodedUser = Auth.getDecodedJwt();
  const isExpired = daysjs.unix(decodedUser.exp).diff(daysjs()) < 1;

  if (!isExpired) return req;
  const response = await axios.post(`${templateBaseUrl}/api/auth/refresh`, {
    refresh: Auth.getRefreshToken(),
  });
  Auth.setToken(response.data);
  const updatedConfig = { ...req };
  if (Auth.getToken()) {
    updatedConfig.headers.Authorization = `Bearer ${Auth.getToken()}`;
  }
  return updatedConfig;
});

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error?.response?.status === 401 &&
      error?.response?.data?.message === 'Invalid Token Please Login'
    ) {
      Auth.removeToken();
      window.location.pathname = '/login';
    }
    return Promise.reject(error);
  }
);
export default Api;
