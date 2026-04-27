import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  try {
    const rows = await query(
      `SELECT s.id, s.saledate, s.quantity, s.unitprice, s.discount, s.status, s.admin_userid,
              a.username as adminName
       FROM SALE s
       LEFT JOIN ADMIN a ON s.admin_userid = a.userid
       ORDER BY s.saledate DESC`
    )
    return { success: true, data: rows }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
