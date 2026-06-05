import { Router } from "express";
import { CalculoController } from "../controllers/calculo.controller";
import { CalculoService } from "../services/calculo.service";
import { FeriadosService } from "../services/feriados.service";
import { FeriadosLocalDAO } from "../dao/local/FeriadosLocalDAO";
import { InhabilesService } from "../services/inhabiles.service";
import { InhabilesLocalDAO } from "../dao/local/InhabilesLocalDAO";

const feriadosService = new FeriadosService(new FeriadosLocalDAO());
const inhabilesService = new InhabilesService(new InhabilesLocalDAO());
const service = new CalculoService(feriadosService, inhabilesService);
const controller = new CalculoController(service);

export const calculoRouter = Router();

// POST /api/calcular — calcula la fecha de vencimiento de un plazo procesal
// Body: { fechaInicio: "YYYY-MM-DD", plazo: number }
calculoRouter.post("/", controller.calcular);
