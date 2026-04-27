import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const rows = await query(
      `SELECT i.*, c.name as customerName, v.name as vendorName
       FROM ITEM i
       LEFT JOIN CUSTOMER c ON i.customer_id = c.id
       LEFT JOIN VENDOR v ON i.vendor_id = v.id
       WHERE i.id = ?`,
      [id]
    )
    if (rows.length === 0) return { success: false, message: 'Item not found' }
    return { success: true, data: rows[0] }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
