const mariadb = require('mariadb');

// ✅ SEGURO - Importar configuración desde archivo externo
const config = require('../../config/node-config.js');

// Pool de conexiones para MariaDB
const pool = mariadb.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD, // ← Ahora seguro
    database: config.DB_NAME,
    connectionLimit: config.DB_CONNECTION_LIMIT || 10,
    acquireTimeout: 60000,
    reconnect: true,
    timeout: 30000,
    ssl: false,
    compress: true,
    connectTimeout: 30000
});

// Verificar conexión
async function testConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log('✅ Conexión a MariaDB exitosa');
        return true;
    } catch (error) {
        console.error('❌ Error conectando a MariaDB:', error.message);
        return false;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = { pool, testConnection };

// Verificar que todas las tablas existan
async function verifyTables(conn) {
    const requiredTables = ['clients', 'products', 'invoices', 'invoice_items'];

    for (const table of requiredTables) {
        try {
            const result = await conn.query(`
                SELECT COUNT(*) as count
                FROM information_schema.tables
                WHERE table_schema = 'smartek_db'
                AND table_name = ?
            `, [table]);

            if (result[0].count === 0) {
                console.warn(`⚠️ La tabla ${table} no existe`);
                // Aquí podrías llamar a una función para crear las tablas
            }
        } catch (error) {
            console.error(`Error verificando tabla ${table}:`, error);
        }
    }
}

// Función para obtener conexión con manejo de errores
async function getConnection() {
    try {
        const conn = await pool.getConnection();
        return conn;
    } catch (error) {
        console.error('Error obteniendo conexión:', error);
        throw error;
    }
}

module.exports = {
    pool,
    testConnection,
    getConnection,
    verifyTables
};
