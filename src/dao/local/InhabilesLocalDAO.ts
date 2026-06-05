import fs from "fs";
import path from "path";
import { IInhabilesDAO } from "../interfaces/IInhabilesDAO";
import { InhabilJudicial } from "../../types/feriado.types";
import { config } from "../../config/config";
import { logger } from "../../utils/logger";

export class InhabilesLocalDAO implements IInhabilesDAO {
  private readonly dataDir: string;

  constructor() {
    this.dataDir = config.dataDir;
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private filePath(anio: number): string {
    return path.join(this.dataDir, `inhabiles-${anio}.json`);
  }

  private readFile(anio: number): InhabilJudicial[] {
    const file = this.filePath(anio);
    if (!fs.existsSync(file)) return [];
    try {
      return JSON.parse(fs.readFileSync(file, "utf-8")) as InhabilJudicial[];
    } catch (err) {
      logger.error(`Error al leer ${file}: ${err}`);
      return [];
    }
  }

  private writeFile(anio: number, data: InhabilJudicial[]): void {
    const file = this.filePath(anio);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
  }

  async findByFecha(fecha: string): Promise<InhabilJudicial | null> {
    const anio = parseInt(fecha.substring(0, 4), 10);
    const list = this.readFile(anio);
    return list.find((i) => i.fecha === fecha) ?? null;
  }

  async findByAnio(anio: number): Promise<InhabilJudicial[]> {
    return this.readFile(anio).sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  async save(inhabil: InhabilJudicial): Promise<void> {
    const anio = new Date(inhabil.fecha).getFullYear();
    const list = this.readFile(anio).filter((i) => i.fecha !== inhabil.fecha);
    list.push(inhabil);
    this.writeFile(anio, list);
    logger.info(`Inhábil judicial guardado: ${inhabil.fecha}`);
  }

  async delete(fecha: string): Promise<void> {
    const anio = parseInt(fecha.substring(0, 4), 10);
    const list = this.readFile(anio).filter((i) => i.fecha !== fecha);
    this.writeFile(anio, list);
    logger.info(`Inhábil judicial eliminado: ${fecha}`);
  }
}
