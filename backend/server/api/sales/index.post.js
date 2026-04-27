import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id, quantity, unitprice, discount, status, admin_userid, item_id } = body

    if (!id || !quantity || !unitprice || !admin_userid) {
      return { success: false, message: 'Missing required fields' }
    }

    // Decrement stock if item_id provided
    if (item_id) {
      const items = await query('SELECT stock FROM ITEM WHERE id = ?', [item_id])
      if (items.length === 0) return { success: false, message: 'Item not found' }
      if (items[0].stock < quantity) return { success: false, message: 'Insufficient stock' }
      await query('UPDATE ITEM SET stock = stock - ? WHERE id = ?', [quantity, item_id])
    }

    await query(
      'INSERT INTO SALE (id, saledate, quantity, unitprice, discount, status, admin_userid) VALUES (?, NOW(), ?, ?, ?, ?, ?)',
      [id, quantity, unitprice, discount || null, status || 'Pending', admin_userid]
    )
    return { success: true, message: 'Sale created' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
