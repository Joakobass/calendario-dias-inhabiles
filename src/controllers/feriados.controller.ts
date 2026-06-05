import { Request, Response } from "express";
import { FeriadosService } from "../services/feriados.service";
import { InhabilesService } from "../services/inhabiles.service";
import { CheckFechaResult } from "../types/feriado.types";

export class FeriadosController {
  constructor(
    private readonly service: FeriadosService,
    private readonly inhabilesService: InhabilesService
  ) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getAll();
      res.json({ status: "success", payload: data });
    } catch (error) {
      res.status(500).json({ status: "error", message: (error as Error).message });
    }
  };

  getByAnio = async (req: Request, res: Response): Promise<void> => {
    try {
      const anio = parseInt(req.params.anio, 10);
      if (isNaN(anio) || anio < 2000 || anio > 2100) {
        res.status(400).json({ status: "error", message: "Año inválido" });
        return;
      }
      const data = await this.service.getByAnio(anio);
      res.json({ status: "success", payload: data });
    } catch (error) {
      res.status(500).json({ status: "error", message: (error as Error).message });
    }
  };

  sync = async (req: Request, res: Response): Promise<void> => {
    try {
      const anio = parseInt(req.params.anio, 10);
      if (isNaN(anio) || anio < 2000 || anio > 2100) {
        res.status(400).json({ status: "error", message: "Año inválido" });
        return;
      }
      const data = await this.service.sync(anio);
      res.json({ status: "success", payload: data });
    } catch (error) {
      res.status(500).json({ status: "error", message: (error as Error).message });
    }
  };

  checkFecha = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fecha } = req.params;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || isNaN(new Date(fecha).getTime())) {
        res.status(400).json({ status: "error", message: "Formato de fecha inválido. Usá YYYY-MM-DD" });
        return;
      }
      const [feriado, inhabil] = await Promise.all([
        this.service.findFeriadoByFecha(fecha),
        this.inhabilesService.findByFecha(fecha),
      ]);
      const result: CheckFechaResult = {
        fecha,
        esInhabil: !!(feriado ?? inhabil),
        feriado,
        inhabil: inhabil ?? undefined,
      };
      res.json({ status: "success", payload: result });
    } catch (error) {
      res.status(500).json({ status: "error", message: (error as Error).message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const anio = parseInt(req.params.anio, 10);
      if (isNaN(anio)) {
        res.status(400).json({ status: "error", message: "Año inválido" });
        return;
      }
      await this.service.delete(anio);
      res.json({ status: "success", message: `Datos de ${anio} eliminados` });
    } catch (error) {
      res.status(500).json({ status: "error", message: (error as Error).message });
    }
  };
}
