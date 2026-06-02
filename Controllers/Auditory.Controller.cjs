const ConectionBD = require('../Services/DataBase/Conection.cjs');

class AuditoryJobController {
    static #instance = null;

    constructor() {
        console.log("Instanciando el controlador de Auditoría de Jobs");
    }

    static getInstance() {
        try {
            if (!this.#instance) {
                this.#instance = new AuditoryJobController();
            }
            return this.#instance;
        } catch (error) {
            return { statusCode: 500, message: `Error al instanciar el controlador de Auditoría de Jobs` }
        }
    }

    async createAuditoryJobProcess(JobId) {
        try {

            const BD_Instance = ConectionBD.getInstance();
            console.log(`Job ${JobId} , ${BD_Instance.AuditoryJob}`)
            const newItem = await BD_Instance.AuditoryJob.create({
                data: { JobId: JobId }
            });

            return {
                statusCode: 201,
                message: { id: newItem.id, Job_Date_Init: newItem.Date_Start },
            }

        } catch (error) {
            return {
                statusCode: 500,
                message: `Error al crear el registro de Auditoría de Job: ${error.message}`
            }
        }
    }

    async updateAuditoryJobProcess(AuditoryId) {
        try {
            //console.log("desde updateAuditory" + typeof AuditoryId)
            const BD_Instance = ConectionBD.getInstance();
            const updated = await BD_Instance.AuditoryJob.update({
                where: { id: AuditoryId },
                data: { Date_End: new Date() }
            });

            return {
                statusCode: 200,
                message: "Registro de Auditoría de Job actualizado correctamente",
                response: updated
            }

        } catch (error) {
            return {
                statusCode: 500,
                message: `Error al actualizar el registro de Auditoría de Job: ${error.message}`
            }
        }
    }

    async getProcessJob() {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const items = await BD_Instance.AuditoryJob.findMany();

            return {
                statusCode: 200,
                message: "Registros de Auditoría de Jobs obtenidos correctamente",
                data: items
            }

        } catch (error) {
            return {
                statusCode: 500,
                message: `Error al obtener registros de Auditoría de Jobs: ${error.message}`
            }
        }
    }

    async getEspecificProcessJob(idJob) {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const item = await BD_Instance.AuditoryJob.findUnique({
                where: { id: idJob }
            });

            return {
                statusCode: 200,
                message: "Registro de Auditoría de Job obtenido correctamente",
                data: item
            }

        } catch (error) {
            return {
                statusCode: 500,
                message: `Error al obtener el registro de Auditoría de Job: ${error.message}`
            }
        }
    }

    async delProcessJobs(id) {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const deleted = await BD_Instance.AuditoryJob.deleteMany({
                where: { id: Number(id) }
            });

            return {
                statusCode: 200,
                message: "Registro de Auditoría de Job eliminado correctamente",
                data: deleted
            }

        } catch (error) {
            return {
                statusCode: 500,
                message: `Error al eliminar el registro de Auditoría de Job: ${error.message}`
            }
        }
    }
}

module.exports = AuditoryJobController;