// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  nitro: {
    routeRules: {
      '/api/**': { cors: true }
    }
  },
  runtimeConfig: {
    // Keys can be overridden at runtime via NUXT_<KEY_UPPER> env vars.
    // e.g. dbHost → NUXT_DB_HOST, frontendUrl → NUXT_FRONTEND_URL
    dbHost:      process.env.DB_HOST      || 'localhost',
    dbPort:      process.env.DB_PORT      || '3306',
    dbUser:      process.env.DB_USER      || 'root',
    dbPassword:  process.env.DB_PASSWORD  || '',
    dbName:      process.env.DB_NAME      || 'inventory_db',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
})
