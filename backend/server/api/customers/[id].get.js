import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const rows = await query('SELECT * FROM CUSTOMER WHERE id = ?', [id])
    if (rows.length === 0) return { success: false, message: 'Customer not found' }
    return { success: true, data: rows[0] }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
