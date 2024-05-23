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
        '` + req.params['id'] + `') `;

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
        '` + req.params['nom'] + `' `;

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

router.get('/evolucionesespecialistas', async (req, res) => {
    sql = `
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
    let result = await BD.Open(sql, [], false);
    Cites = [];
    result.rows.map(cite => {
        var clob_fecha_apertura = cite[0]._impl._parentObj;
        console.log(clob_fecha_apertura);

            let userSchema = {
                "FECHA_APERTURA": cite[0],
                "PACTID": cite[1],
                "PACIDE": cite[2],
                "HISTORIA": cite[3],
                "NOM_ESPECIALISTA": cite[4],
                "ESPNOM": cite[5],
                "PROGRAMA": cite[6],
                "FECHA_HORA_FIRMA": cite[7],
                "TURNO": cite[8]
            }
            Cites.push(userSchema);
    })
    //console.log(Cites)
    res.json(Cites);
})


module.exports = router;