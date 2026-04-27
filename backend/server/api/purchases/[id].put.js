import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { itemno, itemname, unitprice, quantity, vendorname, vendorID } = body
    await query(
      'UPDATE PURCHASE SET itemno=?, itemname=?, unitprice=?, quantity=?, vendorname=?, vendorID=? WHERE id=?',
      [itemno, itemname, unitprice, quantity, vendorname || null, vendorID || null, id]
    )
    return { success: true, message: 'Purchase updated' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
