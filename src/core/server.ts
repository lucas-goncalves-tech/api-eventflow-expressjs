import express from "../app"
import { env } from "./config/env"

class Server {
    private PORT = env.PORT
    private app = express
    public server: ReturnType<typeof this.app.listen> | null = null
    constructor(){
        this.init()
    }

    public shutdown = (signal: string) => {
        console.log(`Sinal recebido: ${signal}`)
        this.server?.close(() => {
            process.exit(0)
        })
        this.server?.closeAllConnections()
        setTimeout(()=> {
            process.exit(1)
        }, 5_000).unref()
    }

    private init(){
        this.server = this.app.listen(this.PORT, () => {
            console.log(`Servidor rodando na porta ${this.PORT}`)
        })
    }
}

const server = new Server()
process.once("SIGINT", server.shutdown)
process.once("SIGTERM", server.shutdown)