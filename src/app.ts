import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { container, injectable } from "tsyringe";
import { errorGlobalHandler } from "./shared/middlewares/error.middleware";
import { Routes } from "./core/routes";
import { env } from "./core/config/env";

@injectable()
export class App {
  public express = express();
  constructor() {
    this.init();
  }

  private middleware() {
    this.express.set("trust proxy", 1);
    this.express.use(helmet());
    this.express.use(
      cors({
        origin: env.NODE_ENV === "production" ? ["website"] : true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      }),
    );

    this.express.use(express.json());
    this.express.use(cookieParser());
  }

  private routes() {
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
  private errorHandlers() {
    this.express.use(errorGlobalHandler);
  }
  private init() {
    this.middleware();
    this.routes();
    this.errorHandlers();
  }
}
