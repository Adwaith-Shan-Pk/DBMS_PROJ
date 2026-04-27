<template>
  <BaseModal :modelValue="modelValue" title="Confirm Action" max-width="sm" @update:modelValue="$emit('update:modelValue', $event)">
    <div class="flex items-start gap-4">
      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <div>
        <p class="text-sm font-semibold text-slate-800 dark:text-white">{{ title }}</p>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ message }}</p>
      </div>
    </div>
    <template #footer>
      <BaseButton id="confirm-cancel-btn" variant="secondary" @click="$emit('update:modelValue', false)">Cancel</BaseButton>
      <BaseButton id="confirm-delete-btn" variant="danger" :loading="loading" @click="$emit('confirm')">Delete</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: 'This action cannot be undone.' },
  loading: { type: Boolean, default: false },
})
defineEmits(['update:modelValue', 'confirm'])
</script>
