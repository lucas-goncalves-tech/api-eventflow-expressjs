import "reflect-metadata";

import { env } from "./config/env";
import { DatabasePool } from "../database/data-source";
import { container, inject, injectable } from "tsyringe";
import { App } from "../app";

@injectable()
class Server {
  private PORT = env.PORT;
  public server: ReturnType<typeof this.app.express.listen> | null = null;

  constructor(
    @inject(DatabasePool) private pool: DatabasePool,
    @inject(App) private app: App
  ) {
    this.init();
  }

  public shutdown = (signal: string) => {
    console.log(`Sinal recebido: ${signal}`);
    this.server?.close(async () => {
      await this.pool.end();
      process.exit(0);
    });
    this.server?.closeAllConnections();
    setTimeout(() => {
      process.exit(1);
    }, 5_000).unref();
  };

  private async init() {
    this.server = this.app.express.listen(this.PORT, () => {
      console.log(`Servidor rodando na porta ${this.PORT}`);
    });
  }
}

const server = container.resolve(Server);
process.once("SIGINT", server.shutdown);
process.once("SIGTERM", server.shutdown);
