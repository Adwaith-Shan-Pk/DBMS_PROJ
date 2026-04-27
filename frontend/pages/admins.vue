<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Admins</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Manage admin accounts</p>
      </div>
      <BaseButton id="add-admin-btn" @click="openAdd">+ Add Admin</BaseButton>
    </div>

    <div class="card">
      <BaseTable :empty="!loading && admins.length === 0" :colspan="5">
        <template #headers>
          <th class="table-header">User ID</th>
          <th class="table-header">Username</th>
          <th class="table-header">Full Name</th>
          <th class="table-header">Status</th>
          <th class="table-header">Actions</th>
        </template>
        <template #rows>
          <tr v-if="loading"><td colspan="5" class="table-cell text-center py-8 text-slate-400">Loading…</td></tr>
          <tr v-for="a in admins" :key="a.userid" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="table-cell font-mono">#{{ a.userid }}</td>
            <td class="table-cell font-medium">{{ a.username }}</td>
            <td class="table-cell">{{ a.fullname }}</td>
            <td class="table-cell">
              <BaseBadge :color="a.status === 'Active' ? 'green' : 'gray'">{{ a.status || 'Active' }}</BaseBadge>
            </td>
            <td class="table-cell">
              <div class="flex gap-1">
                <BaseButton :id="`edit-admin-${a.userid}`" variant="ghost" size="sm" @click="openEdit(a)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                </BaseButton>
                <BaseButton :id="`delete-admin-${a.userid}`" variant="ghost" size="sm" class="text-red-500" @click="openDelete(a)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                </BaseButton>
              </div>
            </td>
          </tr>
        </template>
      </BaseTable>
    </div>

    <BaseModal v-model="showModal" :title="editMode ? 'Edit Admin' : 'Add Admin'" max-width="md">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="!editMode">
          <label for="adm-id" class="label">User ID *</label>
          <input id="adm-id" v-model.number="form.userid" type="number" required class="input-field" />
        </div>
        <div>
          <label for="adm-username" class="label">Username *</label>
          <input id="adm-username" v-model="form.username" type="text" required class="input-field" />
        </div>
        <div>
          <label for="adm-fullname" class="label">Full Name *</label>
          <input id="adm-fullname" v-model="form.fullname" type="text" required class="input-field" />
        </div>
        <div>
          <label for="adm-password" class="label">{{ editMode ? 'New Password (leave blank to keep)' : 'Password *' }}</label>
          <input id="adm-password" v-model="form.password" type="password" :required="!editMode" class="input-field" />
        </div>
        <div>
          <label for="adm-status" class="label">Status</label>
          <select id="adm-status" v-model="form.status" class="input-field">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <p v-if="formError" class="text-sm text-red-500">{{ formError }}</p>
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="showModal = false">Cancel</BaseButton>
        <BaseButton id="admin-submit-btn" :loading="saving" @click="handleSubmit">{{ editMode ? 'Update' : 'Create' }}</BaseButton>
      </template>
    </BaseModal>

    <ConfirmDialog v-model="showDelete" title="Delete Admin" :message="`Delete admin '${deleteTarget?.username}'?`" :loading="deleting" @confirm="handleDelete" />
  </div>
</template>

<script setup>
const { apiFetch } = useApi()
const admins = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDelete = ref(false)
const editMode = ref(false)
const saving = ref(false)
const deleting = ref(false)
const deleteTarget = ref(null)
const formError = ref('')

const defaultForm = () => ({ userid: '', username: '', fullname: '', password: '', status: 'Active' })
const form = reactive(defaultForm())

const fetchAll = async () => { loading.value = true; const r = await apiFetch('/api/admins'); if (r.success) admins.value = r.data; loading.value = false }
onMounted(fetchAll)

const openAdd = () => { editMode.value = false; Object.assign(form, defaultForm()); formError.value = ''; showModal.value = true }
const openEdit = (a) => { editMode.value = true; Object.assign(form, { ...a, password: '' }); formError.value = ''; showModal.value = true }
const openDelete = (a) => { deleteTarget.value = a; showDelete.value = true }

const handleSubmit = async () => {
  formError.value = ''; saving.value = true
  try {
    const res = editMode.value
      ? await apiFetch(`/api/admins/${form.userid}`, { method: 'PUT', body: form })
      : await apiFetch('/api/admins', { method: 'POST', body: form })
    if (res.success) { showModal.value = false; await fetchAll() }
    else formError.value = res.message
  } catch (e) { formError.value = 'Error saving' }
  finally { saving.value = false }
}
const handleDelete = async () => {
  deleting.value = true
  try { await apiFetch(`/api/admins/${deleteTarget.value.userid}`, { method: 'DELETE' }); showDelete.value = false; await fetchAll() }
  finally { deleting.value = false }
}
</script>
