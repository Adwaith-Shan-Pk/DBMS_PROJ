import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    await query('DELETE FROM SALE_PURCHASE WHERE sale_id = ?', [id])
    await query('DELETE FROM SALE WHERE id = ?', [id])
    return { success: true, message: 'Sale deleted' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
