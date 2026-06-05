import { InhabilJudicial } from "../../types/feriado.types";

export interface IInhabilesDAO {
  findByFecha(fecha: string): Promise<InhabilJudicial | null>;
  findByAnio(anio: number): Promise<InhabilJudicial[]>;
  save(inhabil: InhabilJudicial): Promise<void>;
  delete(fecha: string): Promise<void>;
}
