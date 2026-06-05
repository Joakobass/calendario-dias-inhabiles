import { Request, Response } from "express";
import { CalculoService } from "../services/calculo.service";

const PLAZO_MAX = 365;

export class CalculoController {
  constructor(private readonly service: CalculoService) {}

  calcular = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fechaInicio, plazo } = req.body as { fechaInicio?: string; plazo?: unknown };

      if (!fechaInicio || !/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio) || isNaN(new Date(fechaInicio).getTime())) {
        res.status(400).json({ status: "error", message: "Campo 'fechaInicio' requerido en formato YYYY-MM-DD" });
        return;
      }

      const plazoNum = Number(plazo);
      if (!Number.isInteger(plazoNum) || plazoNum < 1 || plazoNum > PLAZO_MAX) {
        res.status(400).json({
          status: "error",
          message: `Campo 'plazo' requerido: entero entre 1 y ${PLAZO_MAX}`,
        });
        return;
      }

      const result = await this.service.calcular(fechaInicio, plazoNum);
      res.json({ status: "success", payload: result });
    } catch (error) {
      res.status(500).json({ status: "error", message: (error as Error).message });
    }
  };
}
