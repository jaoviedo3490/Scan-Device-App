const cron = require('node-cron');

class Jobs {
    static #instance = null;
    static getInstance() {
        try {
            if (!this.#instance) {
                this.#instance = new Jobs();
            }
            return this.#instance;
        } catch (error) {
            return { 'Code': 500, "Message": error }
        }
    }
    createJob(jobExec, taskProgram) {
        try {
            return new Promise((resolve, reject) => {
                cron.schedule(taskProgram, () => {
                    try {
                        jobExec();
                        console.log("Ejecutando JOB");
                        resolve({"Code":200,"Message":`Ejecutando JOB`});
                    } catch (error) {
                        reject({"Code":500,"Message":`Ocurrio un error en el JOB: ${error.message || error}`});
                    }
                })
            })

        } catch (error) {
            console.log(error.message);
            return { 'Code': 500, "Message": `Ocurrio un error al ejecutar el JOB: ${error.message}` }
        }
    }
    /*createJob(taskProgram) {
        try {
            cron.schedule(taskProgram, () => {
                try {
                    console.log('a ver? jsjsjsj');
                } catch (error) {
                    console.error('ocurrio un error, no se que error, pero ps ni modo',error.message)
                }
            })

        } catch (error) {
            return { 'Code': 500, "Message": error.message || error }
        }
    }*/

}
module.exports = Jobs;