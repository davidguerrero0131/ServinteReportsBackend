const { Router, request } = require('express');
const router = Router();
const BD = require('../config/configDb');

router.get('/pacientescirugia', async (req, res) => {
    sql = `select pacap1, pacap2, pacnom, epiactepi, epiacthis, epiactubi, ubinom, epiacthab, epiactutr from basdat.hiepiact join basdat.abpac on pachis = epiacthis JOIN BASDAT.INUBI ON ubicod = epiactubi WHERE EPIACTUBI IN ('P204', 'P2CA', 'P206', 'QX01', 'QX02', 'QX03', 'QX04', 'QX05', 'QX06') ORDER BY epiactubi`
    let result = await BD.Open(sql, [], false);
    pacientes = [];
    result.rows.map(paciente => {
        let pacienteTmp = {
            "primerApellido": paciente[0],
            "segundoApellido": paciente[1],
            "nombre": paciente[2],
            "episodio": paciente[3],
            "historia": paciente[4],
            "CodigoUbicacion": paciente[5],
            "nombreUbicacion": paciente[6],
            "nombreHabitacion": paciente[7],
            "ubicacionTransitoria": paciente[8]
        }
        pacientes.push(pacienteTmp);
    })
    res.json(pacientes);
});

router.get('/datoscirugiapaciente/:pacepi', async (req, res) => {
    sql = `SELECT * FROM BASDAT.DATOS_ACTO_QUIRURGICO WHERE regcliepi = ` + req.params.pacepi;
    let result = await BD.Open(sql, [], false);
    datos = [];
    result.rows.map(dato => {
        let datosSchema = {
           "Episodio": dato[0],
           "Anestesiologo": dato[1],
           "Cirujano": dato[2],
           "Insrumentador": dato[3],
           "Entrada": dato[4],
           "Salida": dato[5]
        }
        datos.push(datosSchema);
    })
    res.json(datos);
});


module.exports = router;