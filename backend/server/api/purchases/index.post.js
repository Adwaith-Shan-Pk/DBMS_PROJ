import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id, itemno, itemname, unitprice, quantity, vendorname, vendorID } = body

    if (!id || !itemno || !itemname || !unitprice || !quantity) {
      return { success: false, message: 'Missing required fields' }
    }

    // Increment stock for matching itemno
    await query('UPDATE ITEM SET stock = stock + ? WHERE itemno = ?', [quantity, itemno])

    await query(
      'INSERT INTO PURCHASE (id, purchase_date, itemno, itemname, unitprice, quantity, vendorname, vendorID) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)',
      [id, itemno, itemname, unitprice, quantity, vendorname || null, vendorID || null]
    )
    return { success: true, message: 'Purchase created' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
