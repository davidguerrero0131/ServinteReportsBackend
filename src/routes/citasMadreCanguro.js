const { Router } = require('express');
const router = Router();
const BD = require('../config/configDb');
const asyncHandler = require('../utilities/asyncHandler');

router.get('/paciente/:idPaciente', asyncHandler(async (req, res) => {
    const sql = `select pacap1, pacap2 , pacnom || ' ' || PACNO2, pacide, pactid, pachis, pacsex, pactel, paccel, pacte2
                 from basdat.abpac
                 where pacide = :id or pachis = :id`;
    const result = await BD.Open(sql, { id: req.params.idPaciente }, false);

    const datos = (result.rows || []).map(dato => ({
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
    }));
    res.json(datos);
}));

module.exports = router;
