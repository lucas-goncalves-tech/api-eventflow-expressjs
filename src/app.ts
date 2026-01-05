import express from "express";
import { injectable } from "tsyringe";

@injectable()
export class App {
  public express = express();
  constructor() {
    this.init();
  }

  private middleware() {
    this.express.use(express.json());
  }

  private routes() {
    this.express.use("/health", (_req, res) => {
      res.json({
        message: "Servidor funcionando!",
      });
    });
  }

  private init() {
    this.middleware();
    this.routes();
  }
}
