import express from "express";

class App {
    public express = express();
    constructor(){
      this.init()
    }

    private middleware(){
        this.express.use(express.json());
    }

    private routes(){
        this.express.use("/health", (_req, res) => {
            res.json({
                message: "Servidor funcionando!",
                code: 200,
                error: null
            })
        })
    }

    private init(){
        this.middleware();
        this.routes()
    }
}


export default new App().express;