const CONFIG = {
  version: '3.1.0',
  anioFiscal: 2026,
  subsidioMensualMaximo: 535.65,   // 15.02% de UMA mensual 2026
  limiteIngresoSubsidio: 11492.66, // Ingreso mensual máximo para subsidio
  imss: {
    porcentajeEmpleado: 0.01025,
    salarioMinimo: 278.80,
    umaDiaria: 108.40,
    topeUma: 25
  },
  periodos: {
    mensual: { dias: 30, factorMensual: 1, factorPeriodo: 1, nombre: 'Mensual' },
    quincenal: { dias: 15, factorMensual: 2, factorPeriodo: 0.5, nombre: 'Quincenal' },
    semanal: { dias: 7, factorMensual: 4.33, factorPeriodo: 0.2309, nombre: 'Semanal' }
  },
  valesDespensa: { limiteMensualExento: 975.60 },
  primaDominicalPorcentaje: 0.25
};
