export interface Feriado {
  fecha: string; // "YYYY-MM-DD"
  tipo: "inamovible" | "trasladable" | "puente" | "no_laborable";
  nombre: string;
}

export interface FeriadosData {
  anio: number;
  fuente: string;
  sincronizadoEn: string; // ISO datetime
  feriados: Feriado[];
}

export interface InhabilJudicial {
  fecha: string; // "YYYY-MM-DD"
  descripcion: string;
  creadoEn: string; // ISO datetime
}

export interface CheckFechaResult {
  fecha: string;
  esInhabil: boolean; // true si es feriado nacional O inhábil judicial
  feriado?: Feriado; // presente si es feriado nacional
  inhabil?: InhabilJudicial; // presente si es inhábil judicial
}
