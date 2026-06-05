import { Router } from "express";
import { InhabilesController } from "../controllers/inhabiles.controller";
import { InhabilesService } from "../services/inhabiles.service";
import { InhabilesLocalDAO } from "../dao/local/InhabilesLocalDAO";

const dao = new InhabilesLocalDAO();
const service = new InhabilesService(dao);
const controller = new InhabilesController(service);

export const inhabilesRouter = Router();

// POST /api/inhabiles — agrega un día inhábil judicial { fecha, descripcion }
inhabilesRouter.post("/", controller.add);

// GET /api/inhabiles/:anio — lista los inhábiles judiciales del año
inhabilesRouter.get("/:anio", controller.getByAnio);

// DELETE /api/inhabiles/:fecha — elimina un inhábil judicial por fecha
inhabilesRouter.delete("/:fecha", controller.delete);
