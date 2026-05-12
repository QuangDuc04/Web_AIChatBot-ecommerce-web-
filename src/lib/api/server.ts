// Used in Server Components for ISR data fetching.
// Uses native fetch() to leverage Next.js caching + revalidation.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
}

export async function serverFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { revalidate, tags, ...fetchOptions } = options;

  const url = `${API_URL}${path}`;

  const res = await fetch(url, {
    ...fetchOptions,
    next: {
      ...(revalidate !== undefined && { revalidate }),
      ...(tags && { tags }),
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  // Backend wraps responses in { success, message, data }
  if (json.success === false) {
    throw new Error(json.message || 'API request failed');
  }

  return json.data as T;
}
