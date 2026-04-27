import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id, itemno, itemname, stock, unitprice, discount, customer_id, vendor_id } = body

    if (!id || !itemno || !itemname || stock == null || !unitprice) {
      return { success: false, message: 'Missing required fields' }
    }

    await query(
      'INSERT INTO ITEM (id, itemno, itemname, stock, unitprice, discount, customer_id, vendor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, itemno, itemname, stock, unitprice, discount || null, customer_id || null, vendor_id || null]
    )
    return { success: true, message: 'Item created' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
