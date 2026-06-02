
const ConectionBD = require('../Services/DataBase/Conection.cjs');

class Jobs {
    static #instance = null;
    constructor() {
        console.log("Instanciando el controlador de los Jobs");
    }
    static getInstance() {
        try {
            if (!this.#instance) {
                this.#instance = new ConectionBD();
            }
            return this.#instance;
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al instanciar la clase Jobs` }
        }
    }

    async createJob(payload,processID) {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const newItemJob = await BD_Instance.jobs.create({
                data: { config: payload , processId:processID}
            });
            return { statusCode: 201, message: "Job Creado", response: newItemJob }
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al crear el Job: ${error.message}` }
        }
    }

    async createJobProcess(payload) {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const newItemProcessJob = await BD_Instance.processjob.create({
                data: { description: payload }
            });
            return { statusCode: 201, message: "Proceso Job Creado", response: newItemProcessJob }
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al crear el proceso del Job: ${error.message}` }
        }
    }

    async getJob() {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const ItemJob = await BD_Instance.jobs.findMany();
            return { statusCode: 200, data: ItemJob }
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al leer los Jobs: ${error.message}` }
        }
    }
    async delJobs(id) {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const delJob = await BD_Instance.jobs.deleteMany({
                where: {
                    id: Number(id)
                }
            });
            return { statusCode: 200, message: JSON.stringify(delJob) };
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al eliminar el registro del Job: ${error}` }
        }
    }
}

module.exports = Jobs;