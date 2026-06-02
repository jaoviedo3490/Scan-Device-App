const nmapService = require("../NmapServices/scan_service.cjs");
const Job = require("../../Jobs/job.cjs");
const IO = require('../Sockets/ServerSocket.js');
const AuditoryController = require("../../Controllers/Auditory.Controller.cjs");
const util = require("util");
const logger = require('../logs/pino.js');
const JobProcessController = require("../../Controllers/ProcessJob.Controller.cjs");



class InstanceJob {
    static #instance = null;
    static scanTask = null;
    static runningJob = false;
    static JobTrazability = { statusJob: "Inactive", statusOperation: 200, statusOperationData: [] };
    static loggerInstance = logger.getInstance();
    constructor() {
        console.log("Instanciando interfaz de Automatizacion de escaneos de Red");
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new InstanceJob();

        }
        return this.#instance;
    }
    static ScannerJob = async () => {
        const AuditoryInstance = new AuditoryController();
        const WebSocketEvents = IO.getIO();
        const JobProcessInstance = new JobProcessController();


        InstanceJob.JobTrazability.statusJob = 'Active';
        InstanceJob.JobTrazability.statusOperation = 200;
        const createAuditory = await AuditoryInstance.createAuditoryJobProcess(1);
        console.log(JSON.stringify(createAuditory));
        WebSocketEvents.emit("Job/ScanStatus", InstanceJob.JobTrazability);
        if (InstanceJob.runningJob) return;

        InstanceJob.runningJob = true;
        try {


            if (InstanceJob.scanTask) return;

            const InstanceNmap = nmapService.getInstance();
            const job = Job.getInstance();
            const jobStatus = await JobProcessInstance.updateProcessJobs(1, 1);
            InstanceJob.scanTask = job.createJob(async () => {

                let responseService = await InstanceNmap.getScannNetWork();
                console.log(JSON.stringify(responseService));
                switch (responseService?.Temporal_Inventory?.status) {
                    case 200:
                        InstanceJob.loggerInstance.info(`Escaneo automatizado realizado con exito: ${JSON.stringify(responseService)}`);
                        this.JobTrazability.statusJob = 'Active/Terminate';
                        this.JobTrazability.statusOperation = 201;
                        //console.log("Respuesta de redis: " + responseService?.Temporal_Inventory?.status);
                        //console.log("ESTE EL LA RESPUETA DEL SERVICIO ANTES DEL WEBSOCKET: " + InstanceJob.JobTrazability)

                        //InstanceJob.loggerInstance.info(`Respuesta HTTP incorrecta: ${JSON.stringify(responseService)}`);
                        WebSocketEvents.emit("Job/ScanStatus", {
                            statusJob: 'Active/Terminate',
                            statusOperation: 201,
                            statusOperationData: JSON.stringify(responseService)
                        });
                        break;
                    case 400:
                        InstanceJob.JobTrazability.statusJob = 'Active';
                        InstanceJob.JobTrazability.statusOperation = 400;
                        InstanceJob.loggerInstance.warn(`Respuesta HTTP incorrecta: ${JSON.stringify(responseService)}`);
                        WebSocketEvents.emit("Job/ScanStatus", InstanceJob.JobTrazability);
                        break;
                    case 500:
                        InstanceJob.JobTrazability.statusJob = 'Active';
                        InstanceJob.JobTrazability.statusOperation = 500;
                        InstanceJob.loggerInstance.error(`Ocurrio un error al Ejecutar el escaneo automatizado. ${JSON.stringify(responseService)} ${JSON.stringify(responseService)}`);
                        WebSocketEvents.emit("Job/ScanStatus", InstanceJob.JobTrazability);
                        break;
                    default:
                        InstanceJob.JobTrazability.statusJob = 'Error';
                        InstanceJob.JobTrazability.statusOperation = 500;
                        InstanceJob.loggerInstance.warn(`Codigo de respuesta no clasificado: ${JSON.stringify(this.JobTrazability)} _ ${JSON.stringify(responseService)}`);
                        WebSocketEvents.emit("Job/ScanStatus", `Codigo de respuesta no clasificado: ${this.JobTrazability.statusOperation}`);
                        break;
                }
            }, '*/15 * * * *');
            return { statusCode: 201, message: "Job creado correctamente e inicializado correctamente", payload: createAuditory.message }
        } catch (error) {
            InstanceJob.JobTrazability.statusJob = 'Active';
            InstanceJob.JobTrazability.statusOperation = 500;
            InstanceJob.loggerInstance.error(`Ocurrio un error al Ejecutar el escaneo automatizado. ${error.message}`);
            WebSocketEvents.emit("Job/ScanStatus", error.message);
        }

    }

    stopAutomatedJob = async (id) => {
        const WebSocketEvents = IO.getIO();
        const JobProcessInstance = new JobProcessController();

        try {

            if (InstanceJob.scanTask) {
                console.log(InstanceJob.scanTask);
                const AuditoryInstance = new AuditoryController();
                const stopJob = await AuditoryInstance.updateAuditoryJobProcess(parseInt(id));
                if (stopJob?.statusCode >= 300) {
                    //console.log("Aqui" + stopJob?.statusCode)
                    InstanceJob.loggerInstance.error(`El servicio respondio de manera incorrecta o inesperada: ${stopJob}`);
                    InstanceJob.JobTrazability.statusJob = 'Error';
                    InstanceJob.JobTrazability.statusOperation = 500;
                    InstanceJob.JobTrazability.statusJobMessage = `El servicio respondio de forma incorrecta o inesperada: ${stopJob.message}`
                    WebSocketEvents.emit("Job/ScanStatus", InstanceJob.JobTrazability);
                }

                const jobStatus = await JobProcessInstance.updateProcessJobs(1, 0);
                InstanceJob.scanTask.stop();
                InstanceJob.scanTask.destroy();
                InstanceJob.scanTask = null;
                InstanceJob.JobTrazability = { statusJob: "Inactive", statusOperation: 200 };
                WebSocketEvents.emit("Job/ScanStatus", InstanceJob.JobTrazability);
                return { statusCode: 200, message: "Job detenido correctamente", payload: jobStatus }
            }
        } catch (error) {
            InstanceJob.JobTrazability.statusJob = 'Error';
            InstanceJob.JobTrazability.statusOperation = 500;
            InstanceJob.JobTrazability.statusJobMessage = `Ocurrio un error al momento de procesar la detencion del job: ${error.message}`
            WebSocketEvents.emit("Job/ScanStatus", InstanceJob.JobTrazability);
            return { statusCode: 200, message: error.message }

        }

    }
}


module.exports = InstanceJob;