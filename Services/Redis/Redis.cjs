const Redis = require("ioredis");

class Redis_Service {
    static #instance = null;
    static conn;


    constructor() {
        try {
            this.conn = new Redis(9001, "localhost");
            console.log("Inciando Redis")
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
            return { status: 500, message: `Ocurrio un error al crear registro en redis: ${error}` }
        }
    }
    async createVarTemp(key, content, temp) {
        try {
            let createV = await this.conn.set(key, content);
            await this.conn.expire(key, temp)
            return { status: 200, message: createV }
        } catch (error) {
            return { status: 500, message: `Ocurrio un error al crear registro en redis: ${error}` }
        }
    }
    async getVar_temp(key) {
        try {
            let getV = await this.conn.get(key);
            let ttl = await this.conn.ttl(key)
            return { status: 200, message: getV, ttl_var: ttl }
        } catch (error) {
            return { status: 500, message: `Ocurrio un error al obtenerr registro en redis: ${error}` }
        }
    }
}

module.exports = Redis_Service;

