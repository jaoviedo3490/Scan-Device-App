const { exec } = require('child_process');
const fs = require('fs');
const xml2js = require('xml2js');
const logger = require('../logs/pino.js')

class Services {

    static #instance = null;
    parser = new xml2js.Parser({ explicitArray: false });
    static loggerInstance

    constructor() {
        console.log("Instanciando la clase Services");
        this.constructor.loggerInstance = logger.getInstance();
    }

    static getInstance() {
        try {
            if (!this.#instance) {
                this.#instance = new Services();

            }
            return this.#instance;
        } catch (error) {
            this.constructor.loggerInstance.error(`Ocurrio un error al instanciar la clase servicios o el Logger. ${error.message}`);
            return { status: 500, message: error };
        }
    }

    async executeCommand(param) {
        try {
            //console.log(`ejecutando comando: ${param}`);
            return new Promise((resolve, reject) => {
                exec(param, (error, stdout, stderr) => {
                    if (error) {
                        this.constructor.loggerInstance.error(`Ocurrió un error en la ejecución del comando: ${param} - ${error}`);
                        console.log(`Error: ${stderr}`);
                        reject(new Error(`Ocurrió un error en la ejecución del comando: ${param} - ${error}`));
                    }
                    if (stderr) {
                        console.log(`Error: ${stderr}`);
                        reject(new Error(`Error en stderr: ${stderr}`));
                        this.constructor.loggerInstance.error(`Error en stderr: ${stderr}`);
                    }
                    resolve(stdout);
                });
            });
        } catch (error) {
            this.constructor.loggerInstance.error(`Ocurrio un error al Ejecutar el comando cmd. ${error.message}`);
            console.log(error.message);
        }
    }

    async XmltoJson(param) {
        //console.log("desde XmltoJson");
        try {
            const data = await fs.promises.readFile(param, 'utf8');
            switch(data.status){
                case 500:
                    //console.log("Aqui se supone que deberia generar log")
                    this.constructor.loggerInstance.error(data.message,`Ocurrio un error al convertir el XML.`);
                    break;
                default:break;
            }
            return await this.parser.parseStringPromise(data);
        } catch (error) {
            this.constructor.loggerInstance.error(error,`Ocurrio un error al convertir a JSON.`);
            //console.log(error);
            return { status: 500, message: error.message || error };
        }
    }






    ReadTXT(param, regex) {
        try {
            if (!fs.existsSync(param)) {
                //console.error("Archivo no encontrado:", param);
                return { Code: 404, message: "Archivo no encontrado" };
            }

            const data = fs.readFileSync(param, 'utf-8');
            //console.log("Archivo leído correctamente.");

            const match = new RegExp(`\\b${regex}\\b`, 'i');
            return match.test(data);


        } catch (error) {
            //console.error("Error leyendo archivo:", error);
            this.constructor.loggerInstance.error(error,`Ocurrio un error al leer el texto.`);
            return { status: 500, message: error.message || error };
        }
    }




    async Regex(param, regex) {
        try {
            const coincidencias = param.match(regex);
            if (coincidencias) {
                return { os: coincidencias };
            } else {
                return { status: 400 };
            }
        } catch (error) {
            //console.log(error);
            this.constructor.loggerInstance.error(error,`Ocurrio un error al usar el regex.`);
            return { status: 500, message: error.message || error };
        }
    }

    async getIpRouteExclude() {
        try {
            //console.log('getIpRouteExclude');
            
            return { 'Code': 200, message: "Comando ejecutado", data: `Correcto` }
        } catch (error) {
            //console.log(error);
            this.constructor.loggerInstance.error(error,`Ocurrio un error al excluir la ip`);
            return { status: 500, message: error }
        }
    }
}

module.exports = Services;

