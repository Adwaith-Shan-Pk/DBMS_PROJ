import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    await query('DELETE FROM CUSTOMER WHERE id = ?', [id])
    return { success: true, message: 'Customer deleted' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
