import { Request, Response } from "express";
import { InhabilesService } from "../services/inhabiles.service";

export class InhabilesController {
  constructor(private readonly service: InhabilesService) {}

  add = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fecha, descripcion } = req.body as { fecha?: string; descripcion?: string };
      if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha) || isNaN(new Date(fecha).getTime())) {
        res
          .status(400)
          .json({ status: "error", message: "Campo 'fecha' requerido en formato YYYY-MM-DD" });
        return;
      }
      if (!descripcion || descripcion.trim() === "") {
        res.status(400).json({ status: "error", message: "Campo 'descripcion' requerido" });
        return;
      }
      const inhabil = await this.service.add(fecha, descripcion.trim());
      res.status(201).json({ status: "success", payload: inhabil });
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

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fecha } = req.params;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || isNaN(new Date(fecha).getTime())) {
        res
          .status(400)
          .json({ status: "error", message: "Formato de fecha inválido. Usá YYYY-MM-DD" });
        return;
      }
      await this.service.delete(fecha);
      res.json({ status: "success", message: `Inhábil ${fecha} eliminado` });
    } catch (error) {
      res.status(500).json({ status: "error", message: (error as Error).message });
    }
  };
}
