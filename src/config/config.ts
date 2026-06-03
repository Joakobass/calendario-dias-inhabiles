import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "8080", 10),
  dataDir: process.env.DATA_DIR || "data",
  apiBaseUrl: "https://api.argentinadatos.com/v1/feriados",
};
