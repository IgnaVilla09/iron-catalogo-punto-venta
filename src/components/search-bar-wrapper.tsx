'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/search-bar';

export function SearchBarWrapper({ initialValue }: { initialValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSearch(search: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    const queryString = params.toString();
    router.push(`/${queryString ? `?${queryString}` : ''}`);
  }

  return <SearchBar initialValue={initialValue} onSearch={handleSearch} />;
}
