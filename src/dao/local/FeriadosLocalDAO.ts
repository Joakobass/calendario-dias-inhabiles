import fs from "fs";
import path from "path";
import { IFeriadosDAO } from "../interfaces/IFeriadosDAO";
import { FeriadosData } from "../../types/feriado.types";
import { config } from "../../config/config";
import { logger } from "../../utils/logger";

export class FeriadosLocalDAO implements IFeriadosDAO {
  private readonly dataDir: string;

  constructor() {
    this.dataDir = config.dataDir;
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private filePath(anio: number): string {
    return path.join(this.dataDir, `feriados-${anio}.json`);
  }

  async findByAnio(anio: number): Promise<FeriadosData | null> {
    const file = this.filePath(anio);
    if (!fs.existsSync(file)) return null;
    try {
      const raw = fs.readFileSync(file, "utf-8");
      return JSON.parse(raw) as FeriadosData;
    } catch (err) {
      logger.error(`Error al leer ${file}: ${err}`);
      return null;
    }
  }

  async save(data: FeriadosData): Promise<void> {
    const file = this.filePath(data.anio);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
    logger.info(`Guardado: ${file}`);
  }

  async findAll(): Promise<FeriadosData[]> {
    if (!fs.existsSync(this.dataDir)) return [];
    const files = fs.readdirSync(this.dataDir).filter((f) => f.startsWith("feriados-") && f.endsWith(".json"));
    const result: FeriadosData[] = [];
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(this.dataDir, file), "utf-8");
        result.push(JSON.parse(raw) as FeriadosData);
      } catch (err) {
        logger.error(`Error al leer ${file}: ${err}`);
      }
    }
    return result.sort((a, b) => a.anio - b.anio);
  }

  async delete(anio: number): Promise<void> {
    const file = this.filePath(anio);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      logger.info(`Eliminado: ${file}`);
    }
  }
}
