import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  try {
    const rows = await query('SELECT userid, username, fullname, status FROM ADMIN ORDER BY userid ASC')
    return { success: true, data: rows }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
