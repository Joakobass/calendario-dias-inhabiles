import { IFeriadosDAO } from "../dao/interfaces/IFeriadosDAO";
import { FeriadosData, Feriado, CheckFechaResult } from "../types/feriado.types";
import { config } from "../config/config";
import { logger } from "../utils/logger";

export class FeriadosService {
  constructor(private readonly dao: IFeriadosDAO) {}

  async getByAnio(anio: number): Promise<FeriadosData> {
    const cached = await this.dao.findByAnio(anio);
    if (cached) {
      logger.info(`Datos de ${anio} cargados desde archivo local`);
      return cached;
    }
    return this.sync(anio);
  }

  async sync(anio: number): Promise<FeriadosData> {
    logger.info(`Sincronizando feriados de ${anio} desde API pública...`);
    const url = `${config.apiBaseUrl}/${anio}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al consultar la API: ${response.status} ${response.statusText}`);
    }

    const raw = (await response.json()) as Feriado[];
    const data: FeriadosData = {
      anio,
      fuente: url,
      sincronizadoEn: new Date().toISOString(),
      feriados: raw,
    };

    await this.dao.save(data);
    logger.info(`Sincronizados ${raw.length} feriados para ${anio}`);
    return data;
  }

  async getAll(): Promise<FeriadosData[]> {
    return this.dao.findAll();
  }

  async delete(anio: number): Promise<void> {
    return this.dao.delete(anio);
  }

  async checkFecha(fecha: string): Promise<CheckFechaResult> {
    const anio = new Date(fecha).getFullYear();
    const data = await this.getByAnio(anio);
    const feriado = data.feriados.find((f) => f.fecha === fecha);
    return {
      fecha,
      esFeriado: !!feriado,
      feriado,
    };
  }
}
