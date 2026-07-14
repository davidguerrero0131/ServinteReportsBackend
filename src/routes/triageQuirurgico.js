const { Router } = require('express');
const router = Router();
const BD = require('../config/configDb');

// ==========================================
// FUNCIONES AUXILIARES DE PARSEO
// ==========================================
const extraerNumero = (texto) => {
    const match = texto.match(/:\s*([\d.]+)/);
    return match ? Number(match[1]) : undefined;
};

const parseTextoTriage = (texto) => {
    // 1. Validar que exista el dato
    if (!texto) return { condicionActual: {}, otrasConsideraciones: [], gasesArteriales: {} };

    // 2. Garantizar que sea un String puro (Manejo de Buffers o CLOBs)
    let textoSeguro = '';
    
    if (typeof texto === 'string') {
        textoSeguro = texto;
    } else if (Buffer.isBuffer(texto)) {
        textoSeguro = texto.toString('utf8'); // Convierte el Buffer de Oracle a texto
    } else {
        textoSeguro = String(texto);
    }

    // Si después de intentar convertirlo sigue sin ser un texto válido, retornamos vacío
    if (!textoSeguro || textoSeguro === '[object Object]') {
        return { condicionActual: {}, otrasConsideraciones: [], gasesArteriales: {} };
    }

    // 3. Ahora sí, es seguro usar .split()
    const partesTexto = textoSeguro.split('CLASIFICACION');
    const textoRelevante = partesTexto[0] ? partesTexto[0].trim() : '';
    
    if (!textoRelevante) return { condicionActual: {}, otrasConsideraciones: [], gasesArteriales: {} };

    const lineas = textoRelevante.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const resultado = { condicionActual: {}, otrasConsideraciones: [], gasesArteriales: {} };
    let seccionActual = '';

    for (const linea of lineas) {
        if (linea === 'CONDICION ACTUAL DEL PACIENTE') {
            seccionActual = 'CONDICION';
            continue;
        } else if (linea === 'OTRAS CONSIDERACIONES') {
            seccionActual = 'OTRAS';
            continue;
        }

        if (seccionActual === '') {
            if (linea.startsWith('DIAGNOSTICO DEL PACIENTE:')) {
                const match = linea.match(/DIAGNOSTICO DEL PACIENTE:\s*(.*?)\s*PROCEDIMIENTO ORDENADO:\s*(.*)/);
                if (match) {
                    resultado.diagnostico = match[1].trim();
                    resultado.procedimientoOrdenado = match[2].trim();
                }
            } else if (linea.startsWith('Fecha y hora de recepción')) {
                resultado.fechaRecepcionBoleta = linea.split(/:\s*(.+)/)[1]?.trim();
            }
        }
        else if (seccionActual === 'CONDICION') {
            if (linea.startsWith('Frecuencia respiratoria:')) resultado.condicionActual.frecuenciaRespiratoria = extraerNumero(linea);
            else if (linea.startsWith('SO2')) resultado.condicionActual.saturacionOxigeno = extraerNumero(linea);
            else if (linea.startsWith('FIO2')) resultado.condicionActual.fio2 = extraerNumero(linea);
            else if (linea.startsWith('PA PA Sistólica:')) {
                const sys = linea.match(/PA Sistólica:\s*(\d+)/)?.[1];
                const dia = linea.match(/PA Diastólica:\s*(\d+)/)?.[1];
                const pam = linea.match(/Presión arterial media:\s*(\d+)/)?.[1];
                if (sys) resultado.condicionActual.presionArterialSistolica = Number(sys);
                if (dia) resultado.condicionActual.presionArterialDiastolica = Number(dia);
                if (pam) resultado.condicionActual.presionArterialMedia = Number(pam);
            }
            else if (linea.startsWith('Frecuencia cardiaca:')) resultado.condicionActual.frecuenciaCardiaca = extraerNumero(linea);
            else if (linea.startsWith('Temperatura:')) resultado.condicionActual.temperatura = extraerNumero(linea);
            else if (linea.startsWith('Estado de conciencia:')) resultado.condicionActual.estadoConciencia = linea.split(':')[1]?.trim();
        }
        else if (seccionActual === 'OTRAS') {
            if (linea.startsWith('Puntuación:')) resultado.puntuacion = extraerNumero(linea);
            else if (linea.startsWith('¿Cuenta con reporte de gases arteriales?:')) resultado.gasesArteriales.cuentaConReporte = linea.split(':')[1]?.replace('?', '').trim();
            else if (linea.startsWith('PH arterial:')) {
                const ph = linea.match(/PH arterial:\s*([\d.]+)/)?.[1];
                const hco3 = linea.match(/HCO3.*?:\s*([\d.]+)/)?.[1];
                const lactato = linea.match(/Lactato:\s*([\d.]+)/)?.[1];
                const baseExceso = linea.match(/Base exceso arterial:\s*([\-\d.]+)/)?.[1];
                if (ph) resultado.gasesArteriales.ph = Number(ph);
                if (hco3) resultado.gasesArteriales.hco3 = Number(hco3);
                if (lactato) resultado.gasesArteriales.lactato = Number(lactato);
                if (baseExceso) resultado.gasesArteriales.baseExceso = Number(baseExceso);
            } else {
                resultado.otrasConsideraciones.push(linea);
            }
        }
    }
    return resultado;
};

// ==========================================
// RUTA DEL API
// ==========================================
router.get('/TriageQuirurgico', async (req, res) => {
    try {
        // En vez de *, definimos el orden para mapear con seguridad (fila[0], fila[1]...)
        let sql = `
            SELECT 
                PACHIS,             -- fila[0]
                PACTID,             -- fila[1]
                PACIDE,             -- fila[2]
                NOMBRE,             -- fila[3]
                REGCLIFCH,          -- fila[4]
                REGCLIFEG,          -- fila[5]
                REGCLIRTF_LIMPIO    -- fila[6]
            FROM BASDAT.V_TRIAGE_QUIRURGICO
            WHERE REGCLIFEG BETWEEN TRUNC(SYSDATE) - 30 AND TRUNC(SYSDATE) + 1 
            ORDER BY REGCLIFEG DESC
        `;

        let result = await BD.Open(sql, [], false);
        let pacientesTriage = [];

        result.rows.map(fila => {
            // Pasamos el texto limpio a nuestra función transformadora
            let triageEstructurado = parseTextoTriage(fila[6]);

            let pacienteSchema = {
                "PACHIS": fila[0],
                "PACTID": fila[1],
                "PACIDE": fila[2],
                "NOMBRE": fila[3],
                "REGCLIFCH": fila[4],
                "REGCLIFEG": fila[5],
                "DETALLES_TRIAGE": triageEstructurado // Aquí inyectamos el JSON ya limpio
            };

            pacientesTriage.push(pacienteSchema);
        });

        res.json(pacientesTriage);
        
    } catch (error) {
        console.error("Error obteniendo datos del Triage:", error);
        res.status(500).json({ error: error.message || "Ocurrió un error al procesar la solicitud" });
    }
});

module.exports = router;