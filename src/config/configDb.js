const oracledb = require('oracledb');

// ==========================================
// CONFIGURACIÓN
// Lo ideal es definir estas variables de entorno en el servidor (o en un .env)
// y no dejar credenciales en el código. Los valores por defecto mantienen
// el comportamiento actual para que funcione sin cambios.
// ==========================================
const ORACLE_CLIENT_DIR = process.env.ORACLE_CLIENT_DIR || 'C:\\MisAplicaciones\\instantclient_23_5';

const dbConfig = {
    user: process.env.DB_USER || 'solo_lectura',
    password: process.env.DB_PASSWORD || 'Temporal01',
    connectString: process.env.DB_CONNECT || '192.168.10.101:1521/db1',
    poolMin: 1,
    poolMax: 10,
    poolIncrement: 1,
    poolTimeout: 60,       // segundos que una conexión ociosa permanece abierta
    queueTimeout: 30000,   // ms máximos esperando una conexión libre del pool
    poolPingInterval: 30   // verifica que la conexión siga viva antes de entregarla
};

// Tiempo máximo (ms) que puede tardar una consulta antes de abortarse
const CALL_TIMEOUT = Number(process.env.DB_CALL_TIMEOUT) || 60000;

// Los CLOB llegan como texto y no como objetos Lob (evita errores al leerlos)
oracledb.fetchAsString = [oracledb.CLOB];

try {
    oracledb.initOracleClient({ libDir: ORACLE_CLIENT_DIR });
} catch (err) {
    // Si ya estaba inicializado o la ruta no existe, se registra pero no se detiene el servidor
    console.error(`[DB] No se pudo inicializar Oracle Client en ${ORACLE_CLIENT_DIR}:`, err.message);
}

// ==========================================
// POOL DE CONEXIONES (se crea al primer uso y se reintenta si falla)
// ==========================================
let poolPromise = null;

function getPool() {
    if (!poolPromise) {
        poolPromise = oracledb.createPool(dbConfig)
            .then(pool => {
                console.log('[DB] Pool de conexiones creado');
                return pool;
            })
            .catch(err => {
                poolPromise = null; // permite reintentar en la siguiente petición
                throw err;
            });
    }
    return poolPromise;
}

async function Open(sql, binds = [], autoCommit = false) {
    const pool = await getPool();
    let cnn;
    try {
        cnn = await pool.getConnection();
        cnn.callTimeout = CALL_TIMEOUT;
        return await cnn.execute(sql, binds, { autoCommit });
    } finally {
        // La conexión SIEMPRE se devuelve al pool, aunque la consulta falle
        if (cnn) {
            try {
                await cnn.close();
            } catch (err) {
                console.error('[DB] Error cerrando conexión:', err.message);
            }
        }
    }
}

async function closePool() {
    if (!poolPromise) return;
    try {
        const pool = await poolPromise;
        await pool.close(10);
        console.log('[DB] Pool cerrado');
    } catch (err) {
        console.error('[DB] Error cerrando el pool:', err.message);
    } finally {
        poolPromise = null;
    }
}

module.exports = { Open, closePool };
