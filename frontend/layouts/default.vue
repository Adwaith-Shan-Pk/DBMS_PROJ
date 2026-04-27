<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/40 z-30 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <SidebarNav :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main content -->
    <div class="lg:pl-64 flex flex-col min-h-screen">
      <!-- Top bar -->
      <TopNavbar :title="pageTitle" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <!-- Page content -->
      <main class="flex-1 px-4 lg:px-6 pt-20 pb-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const sidebarOpen = ref(false)
const route = useRoute()
const { isLoggedIn } = useAuth()

// Redirect to login if not authenticated
onMounted(() => {
  if (!isLoggedIn.value) {
    navigateTo('/login')
  }
})

const pageTitles = {
  '/dashboard':  'Dashboard',
  '/items':      'Items',
  '/sales':      'Sales',
  '/purchases':  'Purchases',
  '/customers':  'Customers',
  '/vendors':    'Vendors',
  '/admins':     'Admins',
}

const pageTitle = computed(() => pageTitles[route.path] || 'Inventory')
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
