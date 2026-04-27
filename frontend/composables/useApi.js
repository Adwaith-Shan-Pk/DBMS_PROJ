// Composable for API calls to the backend
export const useApi = () => {
  const config = useRuntimeConfig()
  const base = config.public.apiBase || 'http://localhost:3001'

  const apiFetch = (path, options = {}) => {
    return $fetch(`${base}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })
  }

  return { apiFetch }
}
