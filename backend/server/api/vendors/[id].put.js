import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { name, address, mobile, email } = body
    await query('UPDATE VENDOR SET name=?, address=?, mobile=?, email=? WHERE id=?',
      [name, address || null, mobile, email || null, id])
    return { success: true, message: 'Vendor updated' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
