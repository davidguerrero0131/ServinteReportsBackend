const { Router, request } = require('express');
const router = Router();
const BD = require('../config/configDb');

router.get('/EntidadPaciente/:id', async (req, res) => {
    sql = ` select DISTINCT pacide, EMPCOD,EMPNOM, PACOTREMP
    from basdat.abpac
    inner join basdat.ABPACOTR on pacotrsec = pachis
    inner join basdat.MSEMP on PACOTREMP = empcod
    --inner join inempdet on  empcod=empdetcod
    where  empact='S'
    --carano ='2023' and movmes ='06'
    and pacide
     in (
        '` + req.params['id']+ `') `;

    let result = await BD.Open(sql, [], false);
    Cites = [];
    result.rows.map(cite => {
            let userSchema = {
                "PACIDE": cite[0],
                "EMPCOD": cite[1],
                "EMPNOM": cite[2],
                "PACOTREMP": cite[3]
            }
            Cites.push(userSchema);
    })


    res.json(Cites);
})

router.get('/Entidad/:nom', async (req, res) => {
    sql = ` SELECT empcod, empnom, EMPDETCOD,EMPDETRAZ, EMPDETADM
    FROM basdat.INEMP , basdat.inempdet 
    where empdetcod=empcod AND EMPNOM = 
        '` + req.params['nom']+ `' `;

    let result = await BD.Open(sql, [], false);
    entidad = [];
    result.rows.map(cite => {
            let userSchema = {
                "EMPCOD": cite[0],
                "EMPNOM": cite[1],
                "EMPDETCOD": cite[2],
                "EMPDETRAZ": cite[3],
                "EMPDETADM": cite[4]
            }
            entidad.push(userSchema);
    })


    res.json(entidad);
})


module.exports = router;