const Redis = require("ioredis");
const logger = require('../logs/pino.js');

class Redis_Service {
    static #instance = null;
    static conn;
    static loggerInstance;


    constructor() {
        try {
            this.conn = new Redis(process.env.REDIS_PORT, process.env.REDIS_SERVER);
            console.log("Inciando Redis");
            this.constructor.loggerInstance = logger.getInstance();
        } catch (error) {
            return { status: 500, message: `Ocurrio un error al conectar con redis ${error}` }
        }
    }

    static getInstance() {
        try {
            if (!this.#instance) {
                this.#instance = new Redis_Service();
            }
            return this.#instance;
        } catch (error) {
            return { status: 500, message: error };
        }
    }

    async createVar(key, content) {
        try {
            let createV = await this.conn.set(key, content);
            return { status: 200, message: createV }
        } catch (error) {
            this.constructor.loggerInstance.error(error,`Ocurrio un error al crear registro en redis`);
            return { status: 500, message: `Ocurrio un error al crear registro en redis: ${error}` }
        }
    }
    async createVarTemp(key, content, temp) {
        try {
            let createV = await this.conn.set(key, content);
            await this.conn.expire(key, temp)
            return { status: 200, message: createV }
        } catch (error) {
            this.constructor.loggerInstance.error(error,`Ocurrio un error al crear registro temporal en redis`);
            return { status: 500, message: `Ocurrio un error al crear registro en redis: ${error}` }
        }
    }
    async getVar_temp(key) {
        try {
            let getV = await this.conn.get(key);
            let ttl = await this.conn.ttl(key)
            return { status: 200, message: getV, ttl_var: ttl }
        } catch (error) {
            this.constructor.loggerInstance.error(error,`Ocurrio un error al obtenerr registro en redis`);
            return { status: 500, message: `Ocurrio un error al obtenerr registro en redis: ${error}` }
        }
    }
    async deleteVar(key) {
        try {
            let delVar = await this.conn.del(key);
           if(delVar===0){
            return {status:404,message:"Variable inexistente"}
           }
            return { status: 200, message: "Variable eliminada correctamente" }
        } catch (error) {
            this.constructor.loggerInstance.error(error,`Ocurrio un error al eliminar registro en redis`);
            return { status: 500, message: `Ocurrio un error al eliminar registro en redis: ${error}` }
        }
    }
}

module.exports = Redis_Service;

