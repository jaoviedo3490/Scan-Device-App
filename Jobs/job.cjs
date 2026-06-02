const cron = require('node-cron');
const Logger = require('../Services/logs/pino.js');

class Jobs {
    static #instance = null;
    static loggerInstance = null;
    constructor() {
        Jobs.loggerInstance = Logger.getInstance();
    }


    static getInstance() {
        try {
            if (!this.#instance) {
                this.#instance = new Jobs();

            }
            return this.#instance;
        } catch (error) {
            return { 'Code': 500, "Message": error }
            Jobs.loggerInstance.error(`Ocurrio un error al instanciar la clase Jobs. ${error.message}`);
        }
    }
    createJob(jobExec, taskProgram) {
        try {
            const task = cron.schedule(taskProgram, async () => {
                try {
                    const result = jobExec();
                    Jobs.loggerInstance.info(`Job Automatico Ejecutando ${JSON.stringify(result)}`);
                    return { "Code": 200, "Message": `Ejecutando JOB`, reference: result };

                } catch (error) {
                    Jobs.loggerInstance.error(error, `Ocurrio un error al crear o ejecutar el Job.`);
                    return { "Code": 500, "Message": `Ocurrio un error en el JOB: ${error.message || error}` };
                }
            });

            return task
        } catch (error) {
            Jobs.loggerInstance.error(`Ocurrio un error al crear o ejecutar el Job. ${error.message}`);
            return { 'Code': 500, "Message": `Ocurrio un error al ejecutar el JOB: ${error.message}` }
        }

    }
}
module.exports = Jobs;