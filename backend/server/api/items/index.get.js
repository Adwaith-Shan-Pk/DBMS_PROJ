import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  try {
    const rows = await query(
      `SELECT i.id, i.itemno, i.itemname, i.stock, i.unitprice, i.discount,
              i.customer_id, i.vendor_id,
              c.name as customerName, v.name as vendorName
       FROM ITEM i
       LEFT JOIN CUSTOMER c ON i.customer_id = c.id
       LEFT JOIN VENDOR v ON i.vendor_id = v.id
       ORDER BY i.id ASC`
    )
    return { success: true, data: rows }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
