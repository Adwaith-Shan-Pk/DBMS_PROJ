import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  try {
    const rows = await query('SELECT * FROM CUSTOMER ORDER BY id ASC')
    return { success: true, data: rows }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
