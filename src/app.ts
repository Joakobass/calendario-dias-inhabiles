import express from "express";
import { config } from "./config/config";
import { feriadosRouter } from "./routes/feriados.router";
import { logger } from "./utils/logger";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/feriados", feriadosRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

if (require.main === module) {
  app.listen(config.port, () => {
    logger.info(`Servidor corriendo en puerto ${config.port}`);
  });
}

export default app;
