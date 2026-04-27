<template>
  <header class="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 h-16 flex items-center justify-between">
    <!-- Left: hamburger + page title -->
    <div class="flex items-center gap-3">
      <button
        id="sidebar-toggle-btn"
        class="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        @click="$emit('toggle-sidebar')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="text-base font-semibold text-slate-800 dark:text-white">{{ title }}</h1>
    </div>

    <!-- Right: theme toggle + admin info -->
    <div class="flex items-center gap-3">
      <ThemeToggle />
      <div v-if="admin" class="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
          {{ adminInitials }}
        </div>
        <div class="hidden sm:block">
          <p class="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">{{ admin.fullname }}</p>
          <p class="text-xs text-slate-400 dark:text-slate-500">{{ admin.username }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Dashboard' },
})
defineEmits(['toggle-sidebar'])

const { admin } = useAuth()

const adminInitials = computed(() => {
  if (!admin.value?.fullname) return 'A'
  return admin.value.fullname.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
})
</script>
