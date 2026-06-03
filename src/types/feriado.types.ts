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

export interface CheckFechaResult {
  fecha: string;
  esFeriado: boolean;
  feriado?: Feriado;
}
