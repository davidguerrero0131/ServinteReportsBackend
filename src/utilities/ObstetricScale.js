function validacionObstetricScale(signosVitales) {
    obstetricScale =
      validarSaturacionOxigeno(signosVitales.SO2, signosVitales.FIO2) +
      validarFIO2(signosVitales.FIO2) +
      validarFrecuenciaRespiratoria(signosVitales.frecuenciaRespiratoria) +
      validarFrecuenciaCardiaca(signosVitales.frecuenciaCardiaca) +
      validarPresionArterialSistolica(signosVitales.sistolica) +
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
      if (frecuenciaRespiratoria < 10 || frecuenciaRespiratoria >= 30) {
        return 3;
      } else if (frecuenciaRespiratoria >= 25 && frecuenciaRespiratoria <= 29) {
        return 2;
      } else if (frecuenciaRespiratoria >= 18 && frecuenciaRespiratoria <= 24) {
        return 1;
      } else if (frecuenciaRespiratoria >= 10 && frecuenciaRespiratoria <= 17) {
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
  
  function validarPresionArterialSistolica(PresionArterialSistolica) {
    if (
      PresionArterialSistolica != 0 &&
      PresionArterialSistolica != undefined &&
      PresionArterialSistolica != null
    ) {
      if (PresionArterialSistolica <= 80 || PresionArterialSistolica >= 160) {
        return 3;
      } else if ((PresionArterialSistolica >= 80 && PresionArterialSistolica < 90) || (PresionArterialSistolica >= 150 && PresionArterialSistolica < 160)) {
        return 2;
      } else if (PresionArterialSistolica >= 140 && PresionArterialSistolica < 149) {
        return 1;
      } else if (PresionArterialSistolica >= 90 && PresionArterialSistolica < 140) {
        return 0;
      }
    } else {
      return 0;
    }
  }

  function validarPresionArterialDiastolica(tensionArterialDiastolica) {
    if (
      tensionArterialDiastolica != 0 &&
      tensionArterialDiastolica != undefined &&
      tensionArterialDiastolica != null
    ) {
      if (tensionArterialDiastolica >= 110) {
        return 3;
      } else if (tensionArterialDiastolica >= 100 && tensionArterialDiastolica < 109) {
        return 2;
      } else if (tensionArterialDiastolica >= 90 && tensionArterialDiastolica < 99) {
        return 1;
      } else if (tensionArterialDiastolica < 90) {
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
      if (temperatura < 34 || temperatura >= 39) {
        return 3;
      }  else if (
        (temperatura >= 34 && temperatura <= 35) ||
        (temperatura >= 38 && temperatura < 39)
      ) {
        return 1;
      } else if (temperatura > 35 && temperatura < 38) {
        return 0;
      }
    } else {
      return 0;
    }
  }
  
  module.exports = { validacionObstetricScale };
  