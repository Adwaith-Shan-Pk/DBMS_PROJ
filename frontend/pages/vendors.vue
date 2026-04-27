<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Vendors</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Manage vendor records</p>
      </div>
      <BaseButton id="add-vendor-btn" @click="openAdd">+ Add Vendor</BaseButton>
    </div>

    <div class="card">
      <BaseTable :empty="!loading && vendors.length === 0" :colspan="6">
        <template #headers>
          <th class="table-header">ID</th>
          <th class="table-header">Name</th>
          <th class="table-header">Address</th>
          <th class="table-header">Mobile</th>
          <th class="table-header">Email</th>
          <th class="table-header">Actions</th>
        </template>
        <template #rows>
          <tr v-if="loading"><td colspan="6" class="table-cell text-center py-8 text-slate-400">Loading…</td></tr>
          <tr v-for="v in vendors" :key="v.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="table-cell font-mono">#{{ v.id }}</td>
            <td class="table-cell font-medium">{{ v.name }}</td>
            <td class="table-cell text-slate-400 max-w-xs truncate">{{ v.address || '—' }}</td>
            <td class="table-cell">{{ v.mobile }}</td>
            <td class="table-cell text-slate-400">{{ v.email || '—' }}</td>
            <td class="table-cell">
              <div class="flex gap-1">
                <BaseButton :id="`edit-vendor-${v.id}`" variant="ghost" size="sm" @click="openEdit(v)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                </BaseButton>
                <BaseButton :id="`delete-vendor-${v.id}`" variant="ghost" size="sm" class="text-red-500" @click="openDelete(v)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                </BaseButton>
              </div>
            </td>
          </tr>
        </template>
      </BaseTable>
    </div>

    <BaseModal v-model="showModal" :title="editMode ? 'Edit Vendor' : 'Add Vendor'" max-width="md">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="!editMode">
          <label for="vend-id" class="label">ID *</label>
          <input id="vend-id" v-model.number="form.id" type="number" required class="input-field" />
        </div>
        <div>
          <label for="vend-name" class="label">Name *</label>
          <input id="vend-name" v-model="form.name" type="text" required class="input-field" />
        </div>
        <div>
          <label for="vend-address" class="label">Address</label>
          <textarea id="vend-address" v-model="form.address" rows="2" class="input-field resize-none" />
        </div>
        <div>
          <label for="vend-mobile" class="label">Mobile *</label>
          <input id="vend-mobile" v-model="form.mobile" type="text" required class="input-field" />
        </div>
        <div>
          <label for="vend-email" class="label">Email</label>
          <input id="vend-email" v-model="form.email" type="email" class="input-field" />
        </div>
        <p v-if="formError" class="text-sm text-red-500">{{ formError }}</p>
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="showModal = false">Cancel</BaseButton>
        <BaseButton id="vendor-submit-btn" :loading="saving" @click="handleSubmit">{{ editMode ? 'Update' : 'Create' }}</BaseButton>
      </template>
    </BaseModal>

    <ConfirmDialog v-model="showDelete" title="Delete Vendor" :message="`Delete '${deleteTarget?.name}'?`" :loading="deleting" @confirm="handleDelete" />
  </div>
</template>

<script setup>
const { apiFetch } = useApi()
const vendors = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDelete = ref(false)
const editMode = ref(false)
const saving = ref(false)
const deleting = ref(false)
const deleteTarget = ref(null)
const formError = ref('')

const defaultForm = () => ({ id: '', name: '', address: '', mobile: '', email: '' })
const form = reactive(defaultForm())

const fetchAll = async () => { loading.value = true; const r = await apiFetch('/api/vendors'); if (r.success) vendors.value = r.data; loading.value = false }
onMounted(fetchAll)

const openAdd = () => { editMode.value = false; Object.assign(form, defaultForm()); formError.value = ''; showModal.value = true }
const openEdit = (v) => { editMode.value = true; Object.assign(form, { ...v }); formError.value = ''; showModal.value = true }
const openDelete = (v) => { deleteTarget.value = v; showDelete.value = true }

const handleSubmit = async () => {
  formError.value = ''; saving.value = true
  try {
    const res = editMode.value
      ? await apiFetch(`/api/vendors/${form.id}`, { method: 'PUT', body: form })
      : await apiFetch('/api/vendors', { method: 'POST', body: form })
    if (res.success) { showModal.value = false; await fetchAll() }
    else formError.value = res.message
  } catch (e) { formError.value = 'Error saving' }
  finally { saving.value = false }
}
const handleDelete = async () => {
  deleting.value = true
  try { await apiFetch(`/api/vendors/${deleteTarget.value.id}`, { method: 'DELETE' }); showDelete.value = false; await fetchAll() }
  finally { deleting.value = false }
}
</script>
