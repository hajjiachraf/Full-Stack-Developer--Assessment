const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function apiFetch(input: string, init?: RequestInit) {
  const url = `${API_BASE_URL}${input}`
  const response = await fetch(url, init)
  return response
}

