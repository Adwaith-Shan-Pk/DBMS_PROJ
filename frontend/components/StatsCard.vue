<template>
  <div class="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
    <div :class="['w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', iconBg]">
      <span v-html="icon" class="text-white" />
    </div>
    <div class="min-w-0">
      <p class="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{{ label }}</p>
      <p class="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 leading-none">
        {{ loading ? '—' : value }}
      </p>
      <p v-if="sub" class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ sub }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label:   { type: String, required: true },
  value:   { type: [String, Number], default: 0 },
  icon:    { type: String, default: '' },
  iconBg:  { type: String, default: 'bg-blue-600' },
  sub:     { type: String, default: '' },
  loading: { type: Boolean, default: false },
})
</script>
