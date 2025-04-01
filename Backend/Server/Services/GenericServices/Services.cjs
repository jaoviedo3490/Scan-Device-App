const { exec } = require('child_process');
const fs = require('fs');
const readline = require('readline');
const xml2js = require('xml2js');

class Services {

    static #instance = null;
    parser = new xml2js.Parser({ explicitArray: false });

    constructor() {
        console.log("Services");
    }

    static getInstance() {
        try {
            if (!this.#instance) {
                this.#instance = new Services();
            }
            return this.#instance;
        } catch (error) {
            return { status: 500, message: error };
        }
    }

    async executeCommand(param) {
        try {
            console.log(`ejecutando comando: ${param}`);
            return new Promise((resolve, reject) => {
                exec(param, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`Error: ${stderr}`);
                        reject(new Error(`Ocurrió un error en la ejecución del comando: ${param} - ${error}`));
                    }
                    if (stderr) {
                        console.log(`Error: ${stderr}`);
                        reject(new Error(`Error en stderr: ${stderr}`));
                    }
                    console.log(`En ejecucion`);
                    resolve(stdout);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    async XmltoJson(param) {
        console.log("desde XmltoJson");
        try {
            const data = await fs.promises.readFile(param, 'utf8');
            console.log(data);
            return await this.parser.parseStringPromise(data);
        } catch (error) {
            console.log(error);
            return { status: 500, message: error.message || error };
        }
    }






   ReadTXT(param, regex) {
        try {
            if (!fs.existsSync(param)) {
                console.error("Archivo no encontrado:", param);
                return { status: 404, message: "Archivo no encontrado" };
            }

            const data = fs.readFileSync(param, 'utf-8'); 
            console.log("Archivo leído correctamente.");

            const match = new RegExp(`//bregex//b`, 'i');
            return match.test(data);

            
        } catch (error) {
            console.error("Error leyendo archivo:", error);
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
            console.log(error);
            return { status: 500, message: error.message || error };
        }
    }

    async writerLog(param) {
        const date = new Date;
        try {
            fs.appendFile(`app_log.log`, `[${date}]: ${param} + \n`);
            console.log(`[${date}]: ${param}`);
        } catch (error) {
            console.log(`[${date}]: ${error}`);
            return { status: 500, message: error };

        }
    }
}

module.exports = Services;
