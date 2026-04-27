import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { itemno, itemname, stock, unitprice, discount, customer_id, vendor_id } = body

    await query(
      'UPDATE ITEM SET itemno=?, itemname=?, stock=?, unitprice=?, discount=?, customer_id=?, vendor_id=? WHERE id=?',
      [itemno, itemname, stock, unitprice, discount || null, customer_id || null, vendor_id || null, id]
    )
    return { success: true, message: 'Item updated' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
