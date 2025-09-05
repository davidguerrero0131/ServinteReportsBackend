const { Router, request } = require('express');
const router = Router();
const BD = require('../config/configDb');
const validacionNews2 = require('../utilities/utilitiesNews2');

router.get('/ubicacionesconpacientes', async (req, res) => {
    sql = `select ubinom, ubicod from basdat.hiepiact join basdat.inubi on ubicod = epiactubi group by ubinom,ubicod order by ubinom asc`;
    let result = await BD.Open(sql, [], false);
    ubicaciones = [];
    result.rows.map(ubicacion => {
        let ubiSchema = {
            "UBINOM": ubicacion[0],
            "UBICOD": ubicacion[1]
        }
        ubicaciones.push(ubiSchema);
    })
    res.json(ubicaciones);
});

router.get('/pacientescirugia', async (req, res) =>{
    sql = `select pacap1, pacap2, pacnom, epiactepi, epiacthis, epiactubi, ubinom, epiacthab, epiactutr from basdat.hiepiact join basdat.abpac on pachis = epiacthis JOIN BASDAT.INUBI ON ubicod = epiactubi WHERE EPIACTUBI IN ('P204', 'P2CA', 'P206')`
    let result = await BD.Open(sql, [], false);
    pacientes = [];
    result.rows.map(paciente =>{
        let pacienteTmp = {
            "primerApellido": paciente[0],
            "segundoApellido": paciente[1],
            "nombre": paciente[2],
            "episodio" : paciente[3],
            "historia" : paciente[4],
            "CodigoUbicacion": paciente[5],
            "nombreUbicacion": paciente[6],
            "nombreHabitacion": paciente[7],
            "ubicacionTransitoria": paciente[8]
        }
        pacientes.push(pacienteTmp);
    })
    res.json(pacientes);
})


router.get('/pascientesubicacion/:ubicod', async (req, res) => {
    sql = `select pacap1, pacap2, pacnom, epiactepi, epiacthis, epiactubi, epiacthab from basdat.hiepiact join basdat.abpac on pachis = epiacthis  WHERE EPIACTUBI = '` + req.params.ubicod + `'`;
    let result = await BD.Open(sql, [], false);
    pacientes = [];
    result.rows.map(paciente => {
        let pacienteSchema = {
            "pacap1": paciente[0],
            "pacap2": paciente[1],
            "pacnom": paciente[2],
            "epiactepi": paciente[3],
            "epiacthis": paciente[4],
            "epiactubi": paciente[5],
            "epiacthab": paciente[6]
        }
        pacientes.push(pacienteSchema);
    })
    res.json(pacientes);
})

router.get('/signospaciente/:pacepi', async (req, res) => {
    sql = `select * from (select * from BASDAT.SIGNOS_VITALES_NEWS2 WHERE regcliepi = '` + req.params.pacepi + `' AND SISTOLICA IS NOT NULL AND FIO2 IS NOT NULL AND SO2 IS NOT NULL  ORDER BY REGCLIFEG DESC) where ROWNUM <= 1`;
    let result = await BD.Open(sql, [], false);
    pacientes = {};
    result.rows.map(paciente => {
        if (paciente[11] != null && paciente[12] != null && paciente[9] != null && paciente[8] != null && pacientes != {}) {
            let pacienteSchema = {
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
                "temperatura": CorreccionTemperatura(paciente[11]),
                "FIO2": paciente[12],
                "SO2": paciente[13],
                "Conciencia": paciente[14],
                "new2": 0
            }
            pacienteSchema.new2 = validacionNews2.validacionNews2(pacienteSchema);
            pacientes = pacienteSchema;
        }
    })
    res.json(pacientes);
})

function CorreccionTemperatura(cadena) {
    if (cadena != null && cadena != '') {
        let cadenaLimpia = cadena.replace(/\s+/g, '');
        let numero = parseFloat(cadenaLimpia);
        if (isNaN(numero)) {
            throw new Error('No se pudo convertir la cadena a número');
        }
        return numero;
    }else{
        return '';
    }
}


module.exports = router;