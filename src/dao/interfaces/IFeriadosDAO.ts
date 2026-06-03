import { FeriadosData } from "../../types/feriado.types";

export interface IFeriadosDAO {
  findByAnio(anio: number): Promise<FeriadosData | null>;
  save(data: FeriadosData): Promise<void>;
  findAll(): Promise<FeriadosData[]>;
  delete(anio: number): Promise<void>;
}
