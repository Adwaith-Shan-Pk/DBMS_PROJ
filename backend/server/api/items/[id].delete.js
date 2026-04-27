import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    await query('DELETE FROM ITEM WHERE id = ?', [id])
    return { success: true, message: 'Item deleted' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
