import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const rows = await query(
      `SELECT s.*, a.username as adminName FROM SALE s
       LEFT JOIN ADMIN a ON s.admin_userid = a.userid WHERE s.id = ?`,
      [id]
    )
    if (rows.length === 0) return { success: false, message: 'Sale not found' }
    return { success: true, data: rows[0] }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
