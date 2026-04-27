<template>
  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colorClasses]">
    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  color: { type: String, default: 'gray' }, // green | amber | red | gray | blue
})

const colorClasses = computed(() => ({
  green:  'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
  amber:  'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400',
  red:    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
  gray:   'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  blue:   'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400',
}[props.color] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'))
</script>
