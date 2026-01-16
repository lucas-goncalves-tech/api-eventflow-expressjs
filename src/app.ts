import express from "express";
import cookieParser from "cookie-parser"
import { container, injectable } from "tsyringe";
import { errorGlobalHandler } from "./shared/middlewares/error.middleware";
import { Routes } from "./core/routes";

@injectable()
export class App {
  public express = express();
  constructor() {
    this.init();
  }

  private middleware() {
    this.express.use(errorGlobalHandler);
  }

  private routes() {
    this.express.use(express.json());
    this.express.use(cookieParser());

    this.express.use("/health", (_req, res) => {
      res.json({
        message: "Servidor funcionando!",
      });
    });
    this.express.use("/api/v1/", container.resolve(Routes).getRouter());
    this.express.use("", (req, res) => {
      const route = req.path;
      const method = req.method;
      res.json({
        message: `Rota ${method} -> ${route} não encontrada!`,
      });
    });
  }

  private init() {
    this.routes();
    this.middleware();
  }
}
