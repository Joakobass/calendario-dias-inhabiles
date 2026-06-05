import { FeriadosService } from "./feriados.service";
import { InhabilesService } from "./inhabiles.service";
import { CalculoResult, DiaInhabil } from "../types/calculo.types";
import { Feriado, InhabilJudicial } from "../types/feriado.types";
import { logger } from "../utils/logger";

export class CalculoService {
  constructor(
    private readonly feriadosService: FeriadosService,
    private readonly inhabilesService: InhabilesService,
  ) {}

  async calcular(fechaInicio: string, plazo: number): Promise<CalculoResult> {
    const feriadosMap = new Map<string, Feriado>();
    const inhabilesMap = new Map<string, InhabilJudicial>();
    const aniosCargados = new Set<number>();

    // Carga lazy: solo se pide cada año la primera vez que el cursor lo necesita
    const cargarAnioSiNecesario = async (fecha: string): Promise<void> => {
      const anio = parseInt(fecha.substring(0, 4), 10);
      if (aniosCargados.has(anio)) return;
      aniosCargados.add(anio);
      try {
        const data = await this.feriadosService.getByAnio(anio);
        for (const f of data.feriados) feriadosMap.set(f.fecha, f);
      } catch {
        logger.warn(`No se pudieron cargar feriados nacionales para ${anio}`);
      }
      const inhabiles = await this.inhabilesService.getByAnio(anio);
      for (const i of inhabiles) inhabilesMap.set(i.fecha, i);
    };

    const clasificarDia = async (fecha: string): Promise<DiaInhabil | null> => {
      if (esDiaSemanaInhabil(fecha)) {
        return { fecha, tipo: "fin_de_semana", motivo: nombreDiaSemana(fecha) };
      }
      await cargarAnioSiNecesario(fecha);
      const feriado = feriadosMap.get(fecha);
      if (feriado) return { fecha, tipo: "feriado_nacional", motivo: feriado.nombre };
      const inhabil = inhabilesMap.get(fecha);
      if (inhabil) return { fecha, tipo: "inhabil_judicial", motivo: inhabil.descripcion };
      return null;
    };

    const diasInhabiles: DiaInhabil[] = [];

    const agregarSiNoEsta = (dia: DiaInhabil) => {
      if (!diasInhabiles.find((d) => d.fecha === dia.fecha)) {
        diasInhabiles.push(dia);
      }
    };

    // Regla 2 y 3: el plazo arranca desde el primer día hábil posterior a fechaInicio
    let cursor = addDays(fechaInicio, 1);
    let dia = await clasificarDia(cursor);
    while (dia) {
      agregarSiNoEsta(dia);
      cursor = addDays(cursor, 1);
      dia = await clasificarDia(cursor);
    }

    // cursor = día 1 del plazo
    let diasContados = 1;

    while (diasContados < plazo) {
      cursor = addDays(cursor, 1);
      dia = await clasificarDia(cursor);
      if (dia) {
        agregarSiNoEsta(dia);
      } else {
        diasContados++;
      }
    }

    // Regla 4: si el vencimiento cayó en inhábil (por seguridad), avanzar al siguiente hábil
    dia = await clasificarDia(cursor);
    while (dia) {
      agregarSiNoEsta(dia);
      cursor = addDays(cursor, 1);
      dia = await clasificarDia(cursor);
    }

    const fechaVencimiento = cursor;
    const diaSiguienteAlVencimiento = addDays(fechaVencimiento, 1);

    return {
      fechaInicio,
      plazo,
      fechaVencimiento,
      leyenda: `El vencimiento final del plazo se encuentra durante las 2 primeras horas hábiles del ${formatearFecha(diaSiguienteAlVencimiento)}.`,
      diasInhabiles: diasInhabiles.sort((a, b) => a.fecha.localeCompare(b.fecha)),
    };
  }
}

function addDays(fecha: string, days: number): string {
  const [year, month, day] = fecha.split("-").map(Number);
  // new Date(y, m, d) usa hora local, evita el problema de UTC timezone
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function esDiaSemanaInhabil(fecha: string): boolean {
  const [year, month, day] = fecha.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const dow = date.getDay(); // 0=domingo, 6=sábado
  return dow === 0 || dow === 6;
}

function nombreDiaSemana(fecha: string): string {
  const [year, month, day] = fecha.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][date.getDay()];
}

function formatearFecha(fecha: string): string {
  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
}
