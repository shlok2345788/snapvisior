const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

export function apiUrl(path: string): string {
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
}

export async function apiFetch(input: string, init?: RequestInit) {
  return fetch(apiUrl(input), {
    ...init,
    credentials: 'include',
  });
}
