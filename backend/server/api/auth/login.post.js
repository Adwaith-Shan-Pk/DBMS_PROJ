import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    if (!username || !password) {
      throw createError({ statusCode: 400, message: 'Username and password required' })
    }

    const rows = await query(
      'SELECT userid, username, fullname, status FROM ADMIN WHERE username = ? AND password = ?',
      [username, password]
    )

    if (rows.length === 0) {
      return { success: false, message: 'Invalid username or password' }
    }

    return { success: true, data: rows[0] }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
