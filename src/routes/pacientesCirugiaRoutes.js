const { Router } = require('express');
const router = Router();
const BD = require('../config/configDb');
const asyncHandler = require('../utilities/asyncHandler');

router.get('/pacientescirugia', asyncHandler(async (req, res) => {
    const sql = `select pacap1, pacap2, pacnom, epiactepi, epiacthis, epiactubi, ubinom, epiacthab, epiactutr
                 from basdat.hiepiact
                 join basdat.abpac on pachis = epiacthis
                 JOIN BASDAT.INUBI ON ubicod = epiactubi
                 WHERE EPIACTUBI IN ('P204', 'P2CA', 'P206', 'QX01', 'QX02', 'QX03', 'QX04', 'QX05', 'QX06')
                 ORDER BY epiactubi`;
    const result = await BD.Open(sql, [], false);

    const pacientes = (result.rows || []).map(paciente => ({
        "primerApellido": paciente[0],
        "segundoApellido": paciente[1],
        "nombre": paciente[2],
        "episodio": paciente[3],
        "historia": paciente[4],
        "CodigoUbicacion": paciente[5],
        "nombreUbicacion": paciente[6],
        "nombreHabitacion": paciente[7],
        "ubicacionTransitoria": paciente[8]
    }));
    res.json(pacientes);
}));

router.get('/datoscirugiapaciente/:pacepi', asyncHandler(async (req, res) => {
    const sql = `SELECT * FROM BASDAT.DATOS_ACTO_QUIRURGICO WHERE regcliepi = :epi`;
    const result = await BD.Open(sql, { epi: req.params.pacepi }, false);

    const datos = (result.rows || []).map(dato => ({
        "Episodio": dato[0],
        "Anestesiologo": dato[1],
        "Cirujano": dato[2],
        "Insrumentador": dato[3],
        "Entrada": dato[4],
        "Salida": dato[5]
    }));
    res.json(datos);
}));

module.exports = router;
