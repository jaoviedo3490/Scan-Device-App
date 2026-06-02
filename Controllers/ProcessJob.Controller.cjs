
const ConectionBD = require('../Services/DataBase/Conection.cjs');

class ProcessJob {
    static #instance = null;
    constructor() {
        console.log("Instanciando el controlador de Procesos Programados");
    }
    static getInstance() {
        try {
            if (!this.#instance) {
                this.#instance = new ProcessJob();
            }
            return this.#instance;
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al instanciar la clase Jobs` }
        }
    }

    async createJobProcess(payload, state) {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const newItemProcessJob = await BD_Instance.processjob.create({
                data: { description: payload, state: state }
            });
            return { statusCode: 201, message: "Proceso Job Creado", response: newItemProcessJob }
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al crear el proceso del Job: ${error.message}` }
        }
    }

    async getProcessJob() {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const ItemProcessJob = await BD_Instance.processjob.findMany();
            return { statusCode: 200, data: ItemProcessJob }
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al leer los Jobs: ${error.message}` }
        }
    }

    async getEspecificProcessJob(idJob) {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const ItemEspecificProcessJob = await BD_Instance.ProcessJob.findUnique({
                where: { id: idJob }
            });
            return { statusCode: 200, data: ItemEspecificProcessJob }
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al leer los Jobs: ${error.message}` }
        }
    }

    async delProcessJobs(id) {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const delProcessJob = await BD_Instance.processjob.deleteMany({
                where: {
                    id: Number(id)
                }
            });
            return { statusCode: 200, message: JSON.stringify(delProcessJob) };
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al eliminar el registro del Job: ${error}` }
        }
    }
    async updateProcessJobs(id, newState) {
        try {
            const BD_Instance = ConectionBD.getInstance();

            const updateProcessJob = await BD_Instance.ProcessJob.update({
                where: {
                    id: Number(id)
                },
                data: {
                    state: Number(newState)
                }
            });

            return {
                statusCode: 200,
                message: JSON.stringify(updateProcessJob)
            };

        } catch (error) {
            return {
                statusCode: 500,
                message: `Ocurrio un error al actualizar el registro del Job: ${error.message}`
            };
        }
    }
}

module.exports = ProcessJob;