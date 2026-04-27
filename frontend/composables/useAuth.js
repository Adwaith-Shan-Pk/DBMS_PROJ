// Composable for managing auth state using localStorage
export const useAuth = () => {
  const admin = useState('auth_admin', () => {
    if (process.client) {
      const stored = localStorage.getItem('inventory_admin')
      return stored ? JSON.parse(stored) : null
    }
    return null
  })

  const login = (adminData) => {
    admin.value = adminData
    if (process.client) {
      localStorage.setItem('inventory_admin', JSON.stringify(adminData))
    }
  }

  const logout = () => {
    admin.value = null
    if (process.client) {
      localStorage.removeItem('inventory_admin')
    }
    navigateTo('/login')
  }

  const isLoggedIn = computed(() => !!admin.value)

  return { admin, login, logout, isLoggedIn }
}
