import useSWR, { SWRConfiguration } from 'swr';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = async (url: string, options?: { method?: string; data?: any }) => {
  const response = await axiosInstance({
    url,
    method: options?.method || 'GET',
    data: options?.data,
  });
  return response.data;
};

export function useSWRApi<T>(
  url: string | null,
  options?: { method?: string; data?: any },
  config?: SWRConfiguration
) {
  const key = url ? JSON.stringify({ url, options }) : null;
  const { data, error, mutate } = useSWR<T>(
    key,
    () => fetcher(url!, options),
    config
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}