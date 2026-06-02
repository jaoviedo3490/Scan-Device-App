const {PrismaClient} = require('../../generated/prisma')
const Logger = require('../logs/pino.js');

class DataBase extends Logger{
    static #prisma = null;
    static loggerInstance
   
    constructor() {

        console.log("Instanciando la conexion con la BD");
        super();
    }
    static getInstance() {
        try {
            if (!this.#prisma) {
                this.#prisma = new PrismaClient();
                this.loggerInstance = super.getInstance();
            }
            return this.#prisma;
        } catch (error) {
            this.loggerInstance.error(`Ocurrio un error al instanciar el cliente prisma: ${error.message}`);
            return { status: 500, message: String(error) }
        }
    }
}

module.exports = DataBase;