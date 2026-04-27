import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  try {
    const [[{ totalItems }]] = await Promise.all([
      query('SELECT COUNT(*) as totalItems FROM ITEM'),
    ])
    const [[{ totalSales }]] = await Promise.all([
      query('SELECT COUNT(*) as totalSales FROM SALE'),
    ])
    const [[{ totalPurchases }]] = await Promise.all([
      query('SELECT COUNT(*) as totalPurchases FROM PURCHASE'),
    ])
    const [[{ totalCustomers }]] = await Promise.all([
      query('SELECT COUNT(*) as totalCustomers FROM CUSTOMER'),
    ])
    const [[{ totalVendors }]] = await Promise.all([
      query('SELECT COUNT(*) as totalVendors FROM VENDOR'),
    ])
    const [[{ lowStock }]] = await Promise.all([
      query('SELECT COUNT(*) as lowStock FROM ITEM WHERE stock < 5'),
    ])

    const recentSales = await query(
      `SELECT s.id, s.saledate, s.quantity, s.unitprice, s.discount, s.status, a.username as adminName
       FROM SALE s LEFT JOIN ADMIN a ON s.admin_userid = a.userid
       ORDER BY s.saledate DESC LIMIT 5`
    )

    const lowStockItems = await query(
      'SELECT id, itemno, itemname, stock, unitprice FROM ITEM WHERE stock < 5 ORDER BY stock ASC'
    )

    return {
      success: true,
      data: {
        totalItems,
        totalSales,
        totalPurchases,
        totalCustomers,
        totalVendors,
        lowStock,
        recentSales,
        lowStockItems,
      }
    }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
