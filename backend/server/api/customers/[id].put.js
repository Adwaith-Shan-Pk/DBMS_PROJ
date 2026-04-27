import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { name, mobile, email } = body
    await query('UPDATE CUSTOMER SET name=?, mobile=?, email=? WHERE id=?', [name, mobile, email || null, id])
    return { success: true, message: 'Customer updated' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
