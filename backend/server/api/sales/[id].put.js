import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { status } = body
    await query('UPDATE SALE SET status=? WHERE id=?', [status, id])
    return { success: true, message: 'Sale updated' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
