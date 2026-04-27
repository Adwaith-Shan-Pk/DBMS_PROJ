import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id, name, address, mobile, email } = body
    if (!id || !name || !mobile) return { success: false, message: 'Missing required fields' }
    await query('INSERT INTO VENDOR (id, name, address, mobile, email) VALUES (?, ?, ?, ?, ?)',
      [id, name, address || null, mobile, email || null])
    return { success: true, message: 'Vendor created' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
