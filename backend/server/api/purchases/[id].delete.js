import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    await query('DELETE FROM SALE_PURCHASE WHERE purchase_id = ?', [id])
    await query('DELETE FROM PURCHASE WHERE id = ?', [id])
    return { success: true, message: 'Purchase deleted' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
