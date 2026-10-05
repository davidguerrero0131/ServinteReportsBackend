const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const BD = require('./config/configDb');

const reportsRoutes = require('./routes/reportsRoutes');
const signosVitalesRoutes = require('./routes/signosVitalesRoutes');
const pacientesCirugiaRoutes = require('./routes/pacientesCirugiaRoutes');
const citasMadreCanguro = require('./routes/citasMadreCanguro');
const triageQuirurgicoRoutes = require('./routes/triageQuirurgico');

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const HOST = process.env.HOST || '0.0.0.0';

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// rutas
app.use(reportsRoutes);
app.use(signosVitalesRoutes);
app.use(pacientesCirugiaRoutes);
app.use(citasMadreCanguro);
app.use(triageQuirurgicoRoutes);

// ruta de salud para monitoreo
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de errores: cualquier fallo responde 500 y el servidor sigue arriba
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);
    if (res.headersSent) return;
    res.status(err.status || 500).json({
        error: 'Error Interno del Servidor',
        detalle: err.message
    });
});

// run (un solo listen)
const server = app.listen(PORT, HOST, () => {
    console.log(`Server Reports Backend Servinte on ${HOST}:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`[SERVER] El puerto ${PORT} ya está en uso. ¿Hay otra instancia corriendo?`);
    } else {
        console.error('[SERVER] Error del servidor:', err);
    }
    process.exit(1);
});

// Red de seguridad: registrar errores no controlados sin detener el servicio
process.on('unhandledRejection', (reason) => {
    console.error('[PROCESS] Promesa rechazada sin manejar:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('[PROCESS] Excepción no controlada:', err);
});

// Cierre ordenado (Ctrl+C o detención del servicio)
async function shutdown(signal) {
    console.log(`[SERVER] ${signal} recibido, cerrando...`);
    server.close();
    await BD.closePool();
    process.exit(0);
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
