const { Router } = require('express');
const router = Router();
const BD = require('../config/configDb');
const asyncHandler = require('../utilities/asyncHandler');

const mapEntidad = (rows) => (rows || []).map(cite => ({
    "EMPCOD": cite[0],
    "EMPNOM": cite[1],
    "EMPDETCOD": cite[2],
    "EMPDETRAZ": cite[3],
    "EMPDETADM": cite[4]
}));

router.get('/EntidadPaciente/:id', asyncHandler(async (req, res) => {
    const sql = `select DISTINCT pacide, EMPCOD, EMPNOM, PACOTREMP
                 from basdat.abpac
                 inner join basdat.ABPACOTR on pacotrsec = pachis
                 inner join basdat.MSEMP on PACOTREMP = empcod
                 where empact = 'S'
                   and pachis = :id`;
    const result = await BD.Open(sql, { id: req.params.id }, false);

    const cites = (result.rows || []).map(cite => ({
        "PACIDE": cite[0],
        "EMPCOD": cite[1],
        "EMPNOM": cite[2],
        "PACOTREMP": cite[3]
    }));
    res.json(cites);
}));

router.get('/Entidad/:nom', asyncHandler(async (req, res) => {
    const sql = `SELECT empcod, empnom, EMPDETCOD, EMPDETRAZ, EMPDETADM
                 FROM basdat.INEMP, basdat.inempdet
                 where empdetcod = empcod AND EMPNOM = :nombre`;
    const result = await BD.Open(sql, { nombre: req.params.nom }, false);
    res.json(mapEntidad(result.rows));
}));

router.post('/datosentidad', asyncHandler(async (req, res) => {
    const { nombre } = req.body || {};

    if (!nombre) {
        return res.status(400).json({
            error: "Bad Request",
            message: "El parámetro 'nombre' es requerido en el body."
        });
    }

    const sql = `SELECT empcod, empnom, EMPDETCOD, EMPDETRAZ, EMPDETADM
                 FROM basdat.INEMP, basdat.inempdet
                 WHERE empdetcod = empcod AND EMPNOM = :nombre`;
    const result = await BD.Open(sql, { nombre }, false);
    res.json(mapEntidad(result.rows));
}));

router.get('/evolucionesespecialistas', asyncHandler(async (req, res) => {
    // NOTA: el rango de fechas sigue fijo como en la versión original
    const sql = `
    SELECT
      regexp_substr(regclirtf, '\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2}', 1, 1) AS fecha_apertura,
      pactid,
      pacide,
      epiinahis || ' - ' || epiinanum AS HISTORIA,
      basdat.SIIDE.IDEAP1 || ' ' || basdat.SIIDE.IDEAP2 || ' ' || basdat.SIIDE.IDENOM AS nom_especialista,
      espnom,
      CASE basdat.HHREGCLI.REGCLIPRO
        WHEN 'chpevomed' THEN 'EVOLUCIÓN MEDICA'
        WHEN 'chpevouci' THEN 'INGRESO/NOTA ADICIONAL UCI'
        WHEN 'chpeucievo' THEN 'EVOLUCIÓN UCIA'
        WHEN 'chpucidia' THEN 'EVOLUCIÓN UCIP'
      END AS programa,
      SUBSTR(
        regexp_substr(regclirtf, 'Firmado por:.*?(\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2})', 1, 1, NULL, 1),
        1,
        17
      ) AS fecha_Hora_firma,
      CASE
        WHEN TO_NUMBER(SUBSTR(
          regexp_substr(regclirtf, 'Firmado por:.*?(\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2})', 1, 1, NULL, 1),
          12, 2
        )) BETWEEN 7 AND 13 THEN 'MAÑANA'
        WHEN TO_NUMBER(SUBSTR(
          regexp_substr(regclirtf, 'Firmado por:.*?(\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2})', 1, 1, NULL, 1),
          12, 2
        )) BETWEEN 14 AND 18 THEN 'TARDE'
        ELSE 'NOCHE'
      END AS TURNO
    FROM
      basdat.HIEPIINA
      INNER JOIN basdat.HHREGCLI ON HIEPIINA.EPIINAEPI = HHREGCLI.REGCLIEPI
      INNER JOIN basdat.SIIDE ON HHREGCLI.REGCLIUSU = SIIDE.IDECOD
      INNER JOIN basdat.abpac ON pachis = epiinahis
      INNER JOIN basdat.inesp ON regcliesp = espcod
      INNER JOIN basdat.sipro ON regclipro = procod
    WHERE
      HHREGCLI.REGCLIPRO IN ('chpevomed', 'chpevouci', 'chpeucievo', 'chpucidia')
      AND REGCLIFCH BETWEEN TO_DATE('01/04/2024', 'dd/mm/yyyy') AND TO_DATE('02/04/2024', 'dd/mm/yyyy') + 1
    `;
    const result = await BD.Open(sql, [], false);

    // Con fetchAsString = [CLOB] (configDb.js) cite[0] ya llega como texto;
    // se eliminó el acceso a cite[0]._impl._parentObj que fallaba con valores nulos.
    const cites = (result.rows || []).map(cite => ({
        "FECHA_APERTURA": cite[0],
        "PACTID": cite[1],
        "PACIDE": cite[2],
        "HISTORIA": cite[3],
        "NOM_ESPECIALISTA": cite[4],
        "ESPNOM": cite[5],
        "PROGRAMA": cite[6],
        "FECHA_HORA_FIRMA": cite[7],
        "TURNO": cite[8]
    }));
    res.json(cites);
}));

module.exports = router;
