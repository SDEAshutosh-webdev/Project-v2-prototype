'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = useCallback((key: string, defaultValue = '') => {
    return searchParams.get(key) || defaultValue;
  }, [searchParams]);

  const setParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(pathname + '?' + params.toString());
  }, [router, pathname, searchParams]);

  const setMultipleParams = useCallback((newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v) {
        params.set(k, v);
      } else {
        params.delete(k);
      }
    });
    router.replace(pathname + '?' + params.toString());
  }, [router, pathname, searchParams]);

  return { getParam, setParam, setMultipleParams, searchParams };
}
