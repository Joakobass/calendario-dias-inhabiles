import { IInhabilesDAO } from "../dao/interfaces/IInhabilesDAO";
import { InhabilJudicial } from "../types/feriado.types";

export class InhabilesService {
  constructor(private readonly dao: IInhabilesDAO) {}

  async add(fecha: string, descripcion: string): Promise<InhabilJudicial> {
    const inhabil: InhabilJudicial = {
      fecha,
      descripcion,
      creadoEn: new Date().toISOString(),
    };
    await this.dao.save(inhabil);
    return inhabil;
  }

  async getByAnio(anio: number): Promise<InhabilJudicial[]> {
    return this.dao.findByAnio(anio);
  }

  async findByFecha(fecha: string): Promise<InhabilJudicial | null> {
    return this.dao.findByFecha(fecha);
  }

  async delete(fecha: string): Promise<void> {
    return this.dao.delete(fecha);
  }
}
