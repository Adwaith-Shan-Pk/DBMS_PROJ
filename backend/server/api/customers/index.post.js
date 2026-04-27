import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id, name, mobile, email } = body
    if (!id || !name || !mobile) return { success: false, message: 'Missing required fields' }
    await query('INSERT INTO CUSTOMER (id, name, mobile, email) VALUES (?, ?, ?, ?)', [id, name, mobile, email || null])
    return { success: true, message: 'Customer created' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
