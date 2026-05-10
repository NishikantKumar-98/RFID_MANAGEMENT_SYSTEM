import { useCallback, useState } from 'react';
import { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

interface UseApiOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useApi = (options?: UseApiOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T,>(
      fn: () => Promise<{ data: ApiResponse<T> }>
    ): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const res = await fn();
        
        if (!res.data.success) {
          throw new Error(res.data.error || 'Request failed');
        }

        options?.onSuccess?.();
        return res.data.data || null;
      } catch (err: any) {
        const message =
          (err as AxiosError<ApiResponse>)?.response?.data?.error ||
          err?.message ||
          'An error occurred';
        setError(message);
        options?.onError?.(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return { loading, error, request, setError };
};
