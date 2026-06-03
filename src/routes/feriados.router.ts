import { Router } from "express";
import { FeriadosController } from "../controllers/feriados.controller";
import { FeriadosService } from "../services/feriados.service";
import { FeriadosLocalDAO } from "../dao/local/FeriadosLocalDAO";

const dao = new FeriadosLocalDAO();
const service = new FeriadosService(dao);
const controller = new FeriadosController(service);

export const feriadosRouter = Router();

// GET /api/feriados — lista todos los años sincronizados localmente
feriadosRouter.get("/", controller.getAll);

// GET /api/feriados/check/:fecha — verifica si una fecha es feriado (formato YYYY-MM-DD)
feriadosRouter.get("/check/:fecha", controller.checkFecha);

// GET /api/feriados/:anio — devuelve feriados del año (usa cache local, sino sincroniza)
feriadosRouter.get("/:anio", controller.getByAnio);

// POST /api/feriados/:anio/sync — fuerza sincronización desde API pública
feriadosRouter.post("/:anio/sync", controller.sync);

// DELETE /api/feriados/:anio — elimina los datos locales del año
feriadosRouter.delete("/:anio", controller.delete);
