const { Router, request } = require('express');
const router = Router();
const BD = require('../config/configDb');


router.get('/paciente/:idPaciente', async (req, res) => {
    sql = `select pacap1, pacap2, pacnom, pacide, pactid, pachis, pacsex, pactel, paccel, pacte2 from basdat.abpac where pacide = '${req.params.idPaciente}' or pachis = '${req.params.idPaciente}'`;
    let result = await BD.Open(sql, [], false);
    datos = [];
    result.rows.map(dato => {
        let datosSchema = {
           "apellido1": dato[0],
           "apellido2": dato[1],
           "nombre": dato[2],
           "numeroId": dato[3],
           "tipoId": dato[4],
           "idUnico": dato[5],
           "sexo": dato[6],
           "telefono1": dato[7],
           "celular1": dato[8],
           "celular2": dato[9]
        }
        datos.push(datosSchema);
    })
    res.json(datos);
});


module.exports = router;