// Composable for dark/light theme management
export const useTheme = () => {
  const isDark = useState('theme_dark', () => {
    if (process.client) {
      const stored = localStorage.getItem('inventory_theme')
      if (stored) return stored === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  const applyTheme = (dark) => {
    if (process.client) {
      if (dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('inventory_theme', dark ? 'dark' : 'light')
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
  }

  const initTheme = () => {
    applyTheme(isDark.value)
  }

  return { isDark, toggleTheme, initTheme }
}
