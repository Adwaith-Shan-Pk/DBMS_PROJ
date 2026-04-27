<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Sales</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Track all sales transactions</p>
      </div>
      <BaseButton id="add-sale-btn" @click="openAdd">+ Add Sale</BaseButton>
    </div>

    <div class="card">
      <BaseTable :empty="!loading && sales.length === 0" :colspan="8">
        <template #headers>
          <th class="table-header">ID</th>
          <th class="table-header">Date</th>
          <th class="table-header">Qty</th>
          <th class="table-header">Unit Price</th>
          <th class="table-header">Discount</th>
          <th class="table-header">Status</th>
          <th class="table-header">Admin</th>
          <th class="table-header">Actions</th>
        </template>
        <template #rows>
          <tr v-if="loading"><td colspan="8" class="table-cell text-center py-8 text-slate-400">Loading…</td></tr>
          <tr v-for="s in sales" :key="s.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="table-cell font-mono">#{{ s.id }}</td>
            <td class="table-cell">{{ formatDate(s.saledate) }}</td>
            <td class="table-cell">{{ s.quantity }}</td>
            <td class="table-cell">₹{{ s.unitprice }}</td>
            <td class="table-cell">{{ s.discount ? `₹${s.discount}` : '—' }}</td>
            <td class="table-cell"><BaseBadge :color="statusColor(s.status)">{{ s.status || '—' }}</BaseBadge></td>
            <td class="table-cell">{{ s.adminName }}</td>
            <td class="table-cell">
              <div class="flex gap-1">
                <BaseButton :id="`edit-sale-${s.id}`" variant="ghost" size="sm" @click="openEdit(s)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                </BaseButton>
                <BaseButton :id="`delete-sale-${s.id}`" variant="ghost" size="sm" class="text-red-500" @click="openDelete(s)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                </BaseButton>
              </div>
            </td>
          </tr>
        </template>
      </BaseTable>
    </div>

    <!-- Add Modal -->
    <BaseModal v-model="showModal" :title="editMode ? 'Edit Sale Status' : 'Add Sale'" max-width="lg">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <template v-if="!editMode">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="sale-id" class="label">ID *</label>
              <input id="sale-id" v-model.number="form.id" type="number" required class="input-field" />
            </div>
            <div>
              <label for="sale-admin" class="label">Admin *</label>
              <select id="sale-admin" v-model.number="form.admin_userid" required class="input-field">
                <option value="">Select admin</option>
                <option v-for="a in admins" :key="a.userid" :value="a.userid">{{ a.username }}</option>
              </select>
            </div>
            <div>
              <label for="sale-qty" class="label">Quantity *</label>
              <input id="sale-qty" v-model.number="form.quantity" type="number" min="1" required class="input-field" />
            </div>
            <div>
              <label for="sale-price" class="label">Unit Price *</label>
              <input id="sale-price" v-model.number="form.unitprice" type="number" min="0.01" step="0.01" required class="input-field" />
            </div>
            <div>
              <label for="sale-discount" class="label">Discount</label>
              <input id="sale-discount" v-model.number="form.discount" type="number" min="0" step="0.01" class="input-field" />
            </div>
            <div>
              <label for="sale-item" class="label">Item ID (for stock)</label>
              <input id="sale-item" v-model.number="form.item_id" type="number" class="input-field" placeholder="Optional" />
            </div>
          </div>
        </template>
        <div>
          <label for="sale-status" class="label">Status</label>
          <select id="sale-status" v-model="form.status" class="input-field">
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <p v-if="formError" class="text-sm text-red-500">{{ formError }}</p>
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="showModal = false">Cancel</BaseButton>
        <BaseButton id="sale-submit-btn" :loading="saving" @click="handleSubmit">{{ editMode ? 'Update' : 'Create' }}</BaseButton>
      </template>
    </BaseModal>

    <ConfirmDialog v-model="showDelete" title="Delete Sale" :message="`Delete sale #${deleteTarget?.id}?`" :loading="deleting" @confirm="handleDelete" />
  </div>
</template>

<script setup>
const { apiFetch } = useApi()
const sales = ref([])
const admins = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDelete = ref(false)
const editMode = ref(false)
const saving = ref(false)
const deleting = ref(false)
const deleteTarget = ref(null)
const formError = ref('')

const defaultForm = () => ({ id: '', quantity: 1, unitprice: 0, discount: null, status: 'Pending', admin_userid: '', item_id: null })
const form = reactive(defaultForm())

const fetchAll = async () => {
  loading.value = true
  const [sRes, aRes] = await Promise.all([apiFetch('/api/sales'), apiFetch('/api/admins')])
  if (sRes.success) sales.value = sRes.data
  if (aRes.success) admins.value = aRes.data
  loading.value = false
}
onMounted(fetchAll)

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'
const statusColor = (s) => ({ Completed: 'green', Pending: 'amber', Cancelled: 'red' }[s] || 'gray')

const openAdd = () => { editMode.value = false; Object.assign(form, defaultForm()); formError.value = ''; showModal.value = true }
const openEdit = (s) => { editMode.value = true; form.id = s.id; form.status = s.status; formError.value = ''; showModal.value = true }
const openDelete = (s) => { deleteTarget.value = s; showDelete.value = true }

const handleSubmit = async () => {
  formError.value = ''
  saving.value = true
  try {
    const res = editMode.value
      ? await apiFetch(`/api/sales/${form.id}`, { method: 'PUT', body: { status: form.status } })
      : await apiFetch('/api/sales', { method: 'POST', body: form })
    if (res.success) { showModal.value = false; await fetchAll() }
    else formError.value = res.message
  } catch (e) { formError.value = 'Error saving' }
  finally { saving.value = false }
}
const handleDelete = async () => {
  deleting.value = true
  try { await apiFetch(`/api/sales/${deleteTarget.value.id}`, { method: 'DELETE' }); showDelete.value = false; await fetchAll() }
  finally { deleting.value = false }
}
</script>
