import mysql from 'mysql2/promise'

let pool = null

export function getPool() {
  if (!pool) {
    const config = useRuntimeConfig()
    pool = mysql.createPool({
      host:     config.dbHost     || 'localhost',
      port:     parseInt(config.dbPort || '3306'),
      user:     config.dbUser     || 'root',
      password: config.dbPassword || '',
      database: config.dbName     || 'inventory_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }
  return pool
}

export async function query(sql, params = []) {
  const pool = getPool()
  const [rows] = await pool.execute(sql, params)
  return rows
}
