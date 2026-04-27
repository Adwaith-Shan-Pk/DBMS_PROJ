import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { userid, username, password, fullname, status } = body
    if (!userid || !username || !password || !fullname) return { success: false, message: 'Missing required fields' }
    await query('INSERT INTO ADMIN (userid, username, password, fullname, status) VALUES (?, ?, ?, ?, ?)',
      [userid, username, password, fullname, status || 'Active'])
    return { success: true, message: 'Admin created' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
