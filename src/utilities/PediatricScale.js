function validacionPediatricScale(signosVitales) {
    obstetricScale =
      validarSaturacionOxigeno(signosVitales.SO2, signosVitales.FIO2) +
      validarFIO2(signosVitales.FIO2) +
      validarFrecuenciaRespiratoria(signosVitales.frecuenciaRespiratoria) +
      validarFrecuenciaCardiaca(signosVitales.frecuenciaCardiaca) +
      valdarTensionArterial(signosVitales.sistolica) +
      validacionTemperatura(signosVitales.temperatura) +
      isAlerta(signosVitales.Conciencia);
  
    /*
    console.log(validarFrecuenciaRespiratoria(signosVitales.frecuenciaRespiratoria) + ' VALIDACION FRECUENCIA RESPIRATORIA-- \n'+ 
    validarFrecuenciaCardiaca(signosVitales.frecuenciaCardiaca) +' VALIDACION FRECUENCIA CARDIACA-- \n' + 
    valdarTensionArterial(signosVitales.sistolica) + ' VALIDACION TENSION ARTERIAL-- \n' +
    isAlerta(signosVitales.Conciencia) + ' VALIDACION CONCIENCIA-- \n' +
    validarFIO2(signosVitales.FIO2) + ' VALIDACION FIO2-- \n' + 
    validarSaturacionOxigeno(signosVitales.SO2, signosVitales.FIO2) + ' VALIDACION SATURACION DE OXIGENO -- \n' +
    isAlerta(signosVitales.Conciencia) + "..... Conciencia -- " + " -- " + signosVitales.Conciencia + '\n' + 
    validacionTemperatura(signosVitales.temperatura)+ ' VALIDACION TEMPERATURA--');
    console.log(news2 + '-----------------------------------------------------------------------------------------');
    console.log(isAlerta(signosVitales.Conciencia) + "..... Conciencia -- " + " -- " + signosVitales.Conciencia);
    */
    return obstetricScale;
  }
  
  function validarFrecuenciaRespiratoria(frecuenciaRespiratoria) {
    if (
      frecuenciaRespiratoria != 0 &&
      frecuenciaRespiratoria != undefined &&
      frecuenciaRespiratoria != null
    ) {
      if (frecuenciaRespiratoria <= 8 || frecuenciaRespiratoria >= 25) {
        return 3;
      } else if (frecuenciaRespiratoria >= 21 && frecuenciaRespiratoria <= 24) {
        return 2;
      } else if (frecuenciaRespiratoria >= 9 && frecuenciaRespiratoria <= 11) {
        return 1;
      } else if (frecuenciaRespiratoria >= 12 && frecuenciaRespiratoria <= 20) {
        return 0;
      }
    } else {
      return 0;
    }
  }
  
  function validarFIO2(FIO2) {
    if (FIO2 <= 21) {
      return 0;
    } else {
      return 1;
    }
  }
  
  function validarSaturacionOxigeno(SO2, FIO2) {
    if (FIO2 <= 21) {
      if (SO2 <= 91) {
        return 3;
      } else if (SO2 >= 92 && SO2 <= 93) {
        return 2;
      } else if (SO2 > 93 && SO2 <= 95) {
        return 1;
      } else if (SO2 > 95) {
        return 0;
      }
    } else {
      if (SO2 <= 83 || SO2 >= 97) {
        return 3;
      } else if ((SO2 >= 84 && SO2 <= 85) || (SO2 >= 95 && SO2 <= 96)) {
        return 2;
      } else if ((SO2 >= 86 && SO2 <= 87) || (SO2 >= 93 && SO2 <= 94)) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  
  function validarFrecuenciaCardiaca(frecuenciaCardiaca) {
    if (
      frecuenciaCardiaca != 0 &&
      frecuenciaCardiaca != undefined &&
      frecuenciaCardiaca != null
    ) {
      if (frecuenciaCardiaca <= 40 || frecuenciaCardiaca >= 131) {
        return 3;
      } else if (frecuenciaCardiaca >= 111 && frecuenciaCardiaca <= 130) {
        return 2;
      } else if (
        (frecuenciaCardiaca >= 41 && frecuenciaCardiaca <= 50) ||
        (frecuenciaCardiaca >= 91 && frecuenciaCardiaca <= 110)
      ) {
        return 1;
      } else if (frecuenciaCardiaca >= 51 && frecuenciaCardiaca <= 90) {
        return 0;
      }
    } else {
      return 0;
    }
  }
  
  function valdarTensionArterial(tensionArterial) {
    if (
      tensionArterial != 0 &&
      tensionArterial != undefined &&
      tensionArterial != null
    ) {
      if (tensionArterial <= 90 || tensionArterial >= 220) {
        return 3;
      } else if (tensionArterial >= 91 && tensionArterial <= 100) {
        return 2;
      } else if (tensionArterial >= 101 && tensionArterial <= 110) {
        return 1;
      } else if (tensionArterial >= 111 && tensionArterial <= 219) {
        return 0;
      }
    } else {
      return 0;
    }
  }
  
  function isAlerta(conciencia) {
    alerta = "Alerta";
    let textConciancia = conciencia + "";
    if (conciencia == null || textConciancia.includes(alerta)) {
      return 0;
    } else {
      return 3;
    }
  }
  
  function validacionTemperatura(temperatura) {
    if (temperatura != 0 && temperatura != undefined && temperatura != null) {
      if (temperatura <= 35) {
        return 3;
      } else if (temperatura > 39) {
        return 2;
      } else if (
        (temperatura > 35 && temperatura <= 36) ||
        (temperatura > 38 && temperatura <= 39)
      ) {
        return 1;
      } else if (temperatura > 36 && temperatura <= 38) {
        return 0;
      }
    } else {
      return 0;
    }
  }
  
  module.exports = { validacionPediatricScale };
  