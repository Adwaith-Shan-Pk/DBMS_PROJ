<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Items</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Manage your inventory items</p>
      </div>
      <BaseButton id="add-item-btn" @click="openAdd">+ Add Item</BaseButton>
    </div>

    <!-- Table -->
    <div class="card">
      <BaseTable :empty="!loading && items.length === 0" :colspan="8">
        <template #headers>
          <th class="table-header">Item No</th>
          <th class="table-header">Name</th>
          <th class="table-header">Stock</th>
          <th class="table-header">Unit Price</th>
          <th class="table-header">Discount</th>
          <th class="table-header">Vendor</th>
          <th class="table-header">Customer</th>
          <th class="table-header">Actions</th>
        </template>
        <template #rows>
          <tr v-if="loading">
            <td colspan="8" class="table-cell text-center text-slate-400 py-8">Loading…</td>
          </tr>
          <tr v-for="item in items" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="table-cell font-mono text-xs">{{ item.itemno }}</td>
            <td class="table-cell font-medium">{{ item.itemname }}</td>
            <td class="table-cell">
              <BaseBadge :color="stockColor(item.stock)">{{ item.stock }}</BaseBadge>
            </td>
            <td class="table-cell">₹{{ item.unitprice }}</td>
            <td class="table-cell">{{ item.discount ? `₹${item.discount}` : '—' }}</td>
            <td class="table-cell">{{ item.vendorName || '—' }}</td>
            <td class="table-cell">{{ item.customerName || '—' }}</td>
            <td class="table-cell">
              <div class="flex items-center gap-1">
                <BaseButton :id="`edit-item-${item.id}`" variant="ghost" size="sm" @click="openEdit(item)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                </BaseButton>
                <BaseButton :id="`delete-item-${item.id}`" variant="ghost" size="sm" class="text-red-500 hover:text-red-600" @click="openDelete(item)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                </BaseButton>
              </div>
            </td>
          </tr>
        </template>
      </BaseTable>
    </div>

    <!-- Add/Edit Modal -->
    <BaseModal v-model="showModal" :title="editMode ? 'Edit Item' : 'Add Item'" max-width="xl">
      <form id="item-form" @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="item-id" class="label">ID *</label>
            <input id="item-id" v-model.number="form.id" type="number" required :disabled="editMode" class="input-field" />
          </div>
          <div>
            <label for="item-itemno" class="label">Item No *</label>
            <input id="item-itemno" v-model="form.itemno" type="text" required class="input-field" />
          </div>
          <div class="col-span-2">
            <label for="item-name" class="label">Item Name *</label>
            <input id="item-name" v-model="form.itemname" type="text" required class="input-field" />
          </div>
          <div>
            <label for="item-stock" class="label">Stock *</label>
            <input id="item-stock" v-model.number="form.stock" type="number" min="0" required class="input-field" />
          </div>
          <div>
            <label for="item-price" class="label">Unit Price *</label>
            <input id="item-price" v-model.number="form.unitprice" type="number" min="0.01" step="0.01" required class="input-field" />
          </div>
          <div>
            <label for="item-discount" class="label">Discount</label>
            <input id="item-discount" v-model.number="form.discount" type="number" min="0" step="0.01" class="input-field" />
          </div>
          <div>
            <label for="item-vendor" class="label">Vendor ID</label>
            <input id="item-vendor" v-model.number="form.vendor_id" type="number" class="input-field" />
          </div>
          <div>
            <label for="item-customer" class="label">Customer ID</label>
            <input id="item-customer" v-model.number="form.customer_id" type="number" class="input-field" />
          </div>
        </div>
        <p v-if="formError" class="text-sm text-red-500">{{ formError }}</p>
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="showModal = false">Cancel</BaseButton>
        <BaseButton id="item-submit-btn" :loading="saving" @click="handleSubmit">{{ editMode ? 'Update' : 'Create' }}</BaseButton>
      </template>
    </BaseModal>

    <!-- Confirm Delete -->
    <ConfirmDialog
      v-model="showDelete"
      title="Delete Item"
      :message="`Are you sure you want to delete '${deleteTarget?.itemname}'?`"
      :loading="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
const { apiFetch } = useApi()

const items = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDelete = ref(false)
const editMode = ref(false)
const saving = ref(false)
const deleting = ref(false)
const deleteTarget = ref(null)
const formError = ref('')

const defaultForm = () => ({ id: '', itemno: '', itemname: '', stock: 0, unitprice: 0, discount: null, vendor_id: null, customer_id: null })
const form = reactive(defaultForm())

const fetchItems = async () => {
  loading.value = true
  try {
    const res = await apiFetch('/api/items')
    if (res.success) items.value = res.data
  } finally { loading.value = false }
}

onMounted(fetchItems)

const stockColor = (s) => s > 10 ? 'green' : s >= 5 ? 'amber' : 'red'

const openAdd = () => {
  editMode.value = false
  Object.assign(form, defaultForm())
  formError.value = ''
  showModal.value = true
}
const openEdit = (item) => {
  editMode.value = true
  Object.assign(form, { ...item })
  formError.value = ''
  showModal.value = true
}
const openDelete = (item) => { deleteTarget.value = item; showDelete.value = true }

const handleSubmit = async () => {
  formError.value = ''
  saving.value = true
  try {
    const res = editMode.value
      ? await apiFetch(`/api/items/${form.id}`, { method: 'PUT', body: form })
      : await apiFetch('/api/items', { method: 'POST', body: form })
    if (res.success) { showModal.value = false; await fetchItems() }
    else formError.value = res.message
  } catch (e) { formError.value = 'Error saving item' }
  finally { saving.value = false }
}

const handleDelete = async () => {
  deleting.value = true
  try {
    await apiFetch(`/api/items/${deleteTarget.value.id}`, { method: 'DELETE' })
    showDelete.value = false
    await fetchItems()
  } finally { deleting.value = false }
}
</script>
