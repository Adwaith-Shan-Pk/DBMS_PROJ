import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    await query('DELETE FROM ADMIN WHERE userid = ?', [id])
    return { success: true, message: 'Admin deleted' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
