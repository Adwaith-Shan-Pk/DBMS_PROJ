import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    await query('DELETE FROM VENDOR WHERE id = ?', [id])
    return { success: true, message: 'Vendor deleted' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
