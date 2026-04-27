<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Purchases</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Manage purchase orders</p>
      </div>
      <BaseButton id="add-purchase-btn" @click="openAdd">+ Add Purchase</BaseButton>
    </div>

    <div class="card">
      <BaseTable :empty="!loading && purchases.length === 0" :colspan="9">
        <template #headers>
          <th class="table-header">ID</th>
          <th class="table-header">Date</th>
          <th class="table-header">Item No</th>
          <th class="table-header">Item Name</th>
          <th class="table-header">Unit Price</th>
          <th class="table-header">Qty</th>
          <th class="table-header">Vendor</th>
          <th class="table-header">Vendor ID</th>
          <th class="table-header">Actions</th>
        </template>
        <template #rows>
          <tr v-if="loading"><td colspan="9" class="table-cell text-center py-8 text-slate-400">Loading…</td></tr>
          <tr v-for="p in purchases" :key="p.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="table-cell font-mono">#{{ p.id }}</td>
            <td class="table-cell">{{ formatDate(p.purchase_date) }}</td>
            <td class="table-cell font-mono text-xs">{{ p.itemno }}</td>
            <td class="table-cell">{{ p.itemname }}</td>
            <td class="table-cell">₹{{ p.unitprice }}</td>
            <td class="table-cell">{{ p.quantity }}</td>
            <td class="table-cell">{{ p.vendorname || '—' }}</td>
            <td class="table-cell font-mono text-xs">{{ p.vendorID || '—' }}</td>
            <td class="table-cell">
              <div class="flex gap-1">
                <BaseButton :id="`edit-purchase-${p.id}`" variant="ghost" size="sm" @click="openEdit(p)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                </BaseButton>
                <BaseButton :id="`delete-purchase-${p.id}`" variant="ghost" size="sm" class="text-red-500" @click="openDelete(p)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                </BaseButton>
              </div>
            </td>
          </tr>
        </template>
      </BaseTable>
    </div>

    <BaseModal v-model="showModal" :title="editMode ? 'Edit Purchase' : 'Add Purchase'" max-width="xl">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div v-if="!editMode">
            <label for="pur-id" class="label">ID *</label>
            <input id="pur-id" v-model.number="form.id" type="number" required class="input-field" />
          </div>
          <div>
            <label for="pur-itemno" class="label">Item No *</label>
            <input id="pur-itemno" v-model="form.itemno" type="text" required class="input-field" />
          </div>
          <div :class="editMode ? 'col-span-2' : ''">
            <label for="pur-itemname" class="label">Item Name *</label>
            <input id="pur-itemname" v-model="form.itemname" type="text" required class="input-field" />
          </div>
          <div>
            <label for="pur-price" class="label">Unit Price *</label>
            <input id="pur-price" v-model.number="form.unitprice" type="number" min="0.01" step="0.01" required class="input-field" />
          </div>
          <div>
            <label for="pur-qty" class="label">Quantity *</label>
            <input id="pur-qty" v-model.number="form.quantity" type="number" min="1" required class="input-field" />
          </div>
          <div>
            <label for="pur-vendor" class="label">Vendor Name</label>
            <input id="pur-vendor" v-model="form.vendorname" type="text" class="input-field" />
          </div>
          <div>
            <label for="pur-vendorid" class="label">Vendor ID</label>
            <input id="pur-vendorid" v-model="form.vendorID" type="text" class="input-field" />
          </div>
        </div>
        <p v-if="formError" class="text-sm text-red-500">{{ formError }}</p>
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="showModal = false">Cancel</BaseButton>
        <BaseButton id="purchase-submit-btn" :loading="saving" @click="handleSubmit">{{ editMode ? 'Update' : 'Create' }}</BaseButton>
      </template>
    </BaseModal>

    <ConfirmDialog v-model="showDelete" title="Delete Purchase" :message="`Delete purchase #${deleteTarget?.id}?`" :loading="deleting" @confirm="handleDelete" />
  </div>
</template>

<script setup>
const { apiFetch } = useApi()
const purchases = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDelete = ref(false)
const editMode = ref(false)
const saving = ref(false)
const deleting = ref(false)
const deleteTarget = ref(null)
const formError = ref('')

const defaultForm = () => ({ id: '', itemno: '', itemname: '', unitprice: 0, quantity: 1, vendorname: '', vendorID: '' })
const form = reactive(defaultForm())

const fetchAll = async () => { loading.value = true; const r = await apiFetch('/api/purchases'); if (r.success) purchases.value = r.data; loading.value = false }
onMounted(fetchAll)

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'
const openAdd = () => { editMode.value = false; Object.assign(form, defaultForm()); formError.value = ''; showModal.value = true }
const openEdit = (p) => { editMode.value = true; Object.assign(form, { ...p }); formError.value = ''; showModal.value = true }
const openDelete = (p) => { deleteTarget.value = p; showDelete.value = true }

const handleSubmit = async () => {
  formError.value = ''; saving.value = true
  try {
    const res = editMode.value
      ? await apiFetch(`/api/purchases/${form.id}`, { method: 'PUT', body: form })
      : await apiFetch('/api/purchases', { method: 'POST', body: form })
    if (res.success) { showModal.value = false; await fetchAll() }
    else formError.value = res.message
  } catch (e) { formError.value = 'Error saving' }
  finally { saving.value = false }
}
const handleDelete = async () => {
  deleting.value = true
  try { await apiFetch(`/api/purchases/${deleteTarget.value.id}`, { method: 'DELETE' }); showDelete.value = false; await fetchAll() }
  finally { deleting.value = false }
}
</script>
