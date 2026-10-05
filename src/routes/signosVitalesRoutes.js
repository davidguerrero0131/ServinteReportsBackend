const { Router } = require('express');
const router = Router();
const BD = require('../config/configDb');
const asyncHandler = require('../utilities/asyncHandler');
const validacionNews2 = require('../utilities/utilitiesNews2');

router.get('/ubicacionesconpacientes', asyncHandler(async (req, res) => {
    const sql = `select ubinom, ubicod
                 from basdat.hiepiact
                 join basdat.inubi on ubicod = epiactubi
                 group by ubinom, ubicod
                 order by ubinom asc`;
    const result = await BD.Open(sql, [], false);

    const ubicaciones = (result.rows || []).map(ubicacion => ({
        "UBINOM": ubicacion[0],
        "UBICOD": ubicacion[1]
    }));
    res.json(ubicaciones);
}));

router.get('/pascientesubicacion/:ubicod', asyncHandler(async (req, res) => {
    const sql = `select pacap1, pacap2, pacnom, epiactepi, epiacthis, epiactubi, epiacthab
                 from basdat.hiepiact
                 join basdat.abpac on pachis = epiacthis
                 WHERE EPIACTUBI = :ubicod`;
    const result = await BD.Open(sql, { ubicod: req.params.ubicod }, false);

    const pacientes = (result.rows || []).map(paciente => ({
        "pacap1": paciente[0],
        "pacap2": paciente[1],
        "pacnom": paciente[2],
        "epiactepi": paciente[3],
        "epiacthis": paciente[4],
        "epiactubi": paciente[5],
        "epiacthab": paciente[6]
    }));
    res.json(pacientes);
}));

router.get('/signospaciente/:pacepi', asyncHandler(async (req, res) => {
    const sql = `select * from (
                    select * from BASDAT.SIGNOS_VITALES_NEWS2
                    WHERE regcliepi = :epi
                      AND SISTOLICA IS NOT NULL AND FIO2 IS NOT NULL AND SO2 IS NOT NULL
                    ORDER BY REGCLIFEG DESC
                 ) where ROWNUM <= 1`;
    const result = await BD.Open(sql, { epi: req.params.pacepi }, false);

    let pacientes = {};
    for (const paciente of (result.rows || [])) {
        if (paciente[11] != null && paciente[12] != null && paciente[9] != null && paciente[8] != null) {
            const pacienteSchema = {
                "regclisec": paciente[0],
                "regcliepi": paciente[1],
                "regclifec": paciente[2],
                "ubinom": paciente[3],
                "ubicod": paciente[4],
                "servicio": paciente[5],
                "sistolica": paciente[6],
                "diastolica": paciente[7],
                "presionArterialMedia": paciente[8],
                "frecuenciaCardiaca": paciente[9],
                "frecuenciaRespiratoria": paciente[10],
                "temperatura": correccionTemperatura(paciente[11]),
                "FIO2": paciente[12],
                "SO2": paciente[13],
                "Conciencia": paciente[14],
                "new2": 0
            };
            pacienteSchema.new2 = validacionNews2.validacionNews2(pacienteSchema);
            pacientes = pacienteSchema;
        }
    }
    res.json(pacientes);
}));

// Antes lanzaba un error (y tumbaba el servidor) si la temperatura venía con texto.
// Ahora devuelve '' y registra el valor inválido.
function correccionTemperatura(cadena) {
    if (cadena == null || cadena === '') return '';
    const numero = parseFloat(String(cadena).replace(/\s+/g, '').replace(',', '.'));
    if (isNaN(numero)) {
        console.warn(`[SIGNOS] Temperatura no numérica: "${cadena}"`);
        return '';
    }
    return numero;
}

module.exports = router;
