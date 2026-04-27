import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { username, password, fullname, status } = body
    if (password) {
      await query('UPDATE ADMIN SET username=?, password=?, fullname=?, status=? WHERE userid=?',
        [username, password, fullname, status, id])
    } else {
      await query('UPDATE ADMIN SET username=?, fullname=?, status=? WHERE userid=?',
        [username, fullname, status, id])
    }
    return { success: true, message: 'Admin updated' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
