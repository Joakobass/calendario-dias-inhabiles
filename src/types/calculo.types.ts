export type TipoInhabil = "fin_de_semana" | "feriado_nacional" | "inhabil_judicial";

export interface DiaInhabil {
  fecha: string;
  tipo: TipoInhabil;
  motivo: string;
}

export interface CalculoResult {
  fechaInicio: string;
  plazo: number;
  fechaVencimiento: string;
  leyenda: string;
  diasInhabiles: DiaInhabil[];
}
