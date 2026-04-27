<template>
  <div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatsCard
        id="stat-items"
        label="Total Items"
        :value="stats.totalItems"
        :loading="loading"
        icon-bg="bg-blue-600"
        :icon="icons.items"
      />
      <StatsCard
        id="stat-sales"
        label="Total Sales"
        :value="stats.totalSales"
        :loading="loading"
        icon-bg="bg-green-600"
        :icon="icons.sales"
      />
      <StatsCard
        id="stat-purchases"
        label="Purchases"
        :value="stats.totalPurchases"
        :loading="loading"
        icon-bg="bg-amber-500"
        :icon="icons.purchases"
      />
      <StatsCard
        id="stat-customers"
        label="Customers"
        :value="stats.totalCustomers"
        :loading="loading"
        icon-bg="bg-teal-600"
        :icon="icons.customers"
      />
      <StatsCard
        id="stat-vendors"
        label="Vendors"
        :value="stats.totalVendors"
        :loading="loading"
        icon-bg="bg-slate-600"
        :icon="icons.vendors"
      />
      <StatsCard
        id="stat-lowstock"
        label="Low Stock"
        :value="stats.lowStock"
        :loading="loading"
        icon-bg="bg-red-600"
        :icon="icons.lowstock"
        :sub="stats.lowStock > 0 ? 'Needs attention' : 'All good'"
      />
    </div>

    <!-- Tables row -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Recent Sales -->
      <div class="card p-5">
        <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Recent Sales</h2>
        <BaseTable :empty="!loading && stats.recentSales.length === 0" :colspan="5">
          <template #headers>
            <th class="table-header">Date</th>
            <th class="table-header">Qty</th>
            <th class="table-header">Unit Price</th>
            <th class="table-header">Status</th>
            <th class="table-header">Admin</th>
          </template>
          <template #rows>
            <tr v-if="loading">
              <td colspan="5" class="table-cell text-center text-slate-400">Loading…</td>
            </tr>
            <tr v-for="s in stats.recentSales" :key="s.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="table-cell">{{ formatDate(s.saledate) }}</td>
              <td class="table-cell">{{ s.quantity }}</td>
              <td class="table-cell">₹{{ s.unitprice }}</td>
              <td class="table-cell"><BaseBadge :color="saleStatusColor(s.status)">{{ s.status }}</BaseBadge></td>
              <td class="table-cell">{{ s.adminName }}</td>
            </tr>
          </template>
        </BaseTable>
      </div>

      <!-- Low Stock Items -->
      <div class="card p-5">
        <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Low Stock Alerts
          <span v-if="stats.lowStock > 0" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-xs font-semibold">{{ stats.lowStock }}</span>
        </h2>
        <BaseTable :empty="!loading && stats.lowStockItems.length === 0" :colspan="4">
          <template #headers>
            <th class="table-header">Item No</th>
            <th class="table-header">Name</th>
            <th class="table-header">Stock</th>
            <th class="table-header">Price</th>
          </template>
          <template #rows>
            <tr v-if="loading">
              <td colspan="4" class="table-cell text-center text-slate-400">Loading…</td>
            </tr>
            <tr v-for="item in stats.lowStockItems" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="table-cell font-mono text-xs">{{ item.itemno }}</td>
              <td class="table-cell">{{ item.itemname }}</td>
              <td class="table-cell">
                <BaseBadge color="red">{{ item.stock }}</BaseBadge>
              </td>
              <td class="table-cell">₹{{ item.unitprice }}</td>
            </tr>
          </template>
        </BaseTable>
      </div>
    </div>
  </div>
</template>

<script setup>
const { apiFetch } = useApi()

const loading = ref(true)
const stats = reactive({
  totalItems: 0, totalSales: 0, totalPurchases: 0,
  totalCustomers: 0, totalVendors: 0, lowStock: 0,
  recentSales: [], lowStockItems: [],
})

onMounted(async () => {
  try {
    const res = await apiFetch('/api/dashboard')
    if (res.success) Object.assign(stats, res.data)
  } finally {
    loading.value = false
  }
})

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'
const saleStatusColor = (s) => ({ Completed: 'green', Pending: 'amber', Cancelled: 'red' }[s] || 'gray')

const icons = {
  items:     `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"/></svg>`,
  sales:     `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/></svg>`,
  purchases: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>`,
  customers: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>`,
  vendors:   `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/></svg>`,
  lowstock:  `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`,
}
</script>
