/* CONVERSO — axios instance with AsyncStorage tokens + Bearer/refresh interceptors.
   Base URL comes from EXPO_PUBLIC_API_URL (see .env.example).
   crm-api envelopa respostas em { data, message } — desembrulhamos no interceptor. */
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@converso/token';
const REFRESH_KEY = '@converso/refresh';

export const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token (if any) to every request.
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore storage errors; request proceeds unauthenticated
  }
  return config;
});

async function refreshAccessToken(): Promise<string | null> {
  const refresh = await AsyncStorage.getItem(REFRESH_KEY);
  if (!refresh) return null;
  try {
    const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken: refresh });
    const payload = res.data?.data ?? res.data;
    const access = payload?.accessToken;
    if (access) {
      await setTokens(access, payload?.refreshToken);
      return access;
    }
  } catch {
    /* fall through */
  }
  await clearToken();
  return null;
}

api.interceptors.response.use(
  (res) => {
    const b = res.data;
    if (b && typeof b === 'object' && 'data' in b && 'message' in b) {
      res.data = (b as { data: unknown }).data;
    }
    return res;
  },
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const token = await refreshAccessToken();
      if (token) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);

export async function setTokens(token: string, refresh?: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  if (refresh) await AsyncStorage.setItem(REFRESH_KEY, refresh);
}

// Back-compat alias.
export async function setToken(token: string): Promise<void> {
  await setTokens(token);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY]);
}
