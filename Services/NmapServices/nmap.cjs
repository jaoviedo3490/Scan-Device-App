const { default: nmap } = require('node-nmap');
const Services = require('../GenericServices/Services.cjs');
const logger = require('../logs/pino.js');
const IO = require("../Sockets/ServerSocket.js");


class Nmap  {
    static #instance = null;
    static date = new Date();
    static loggerInstance
    JobTrazability = { statusJob: "Inactive", statusOperation: 200 };
    constructor() {
        this.constructor.loggerInstance = logger.getInstance();
    }
    async getNMAPVersion() {
        let nmap;
        let instanceService = new Services();
        try {
             nmap = await instanceService.executeCommand(`wsl nmap --version`);
             return nmap;
        } catch (error) {
            //console.log(`${error}`);
            this.constructor.loggerInstance.error(error,`Ocurrio un error al obtener la version de NMAP.`);
            return error;
        }
    }
    async install_nmap(){
        let nmap;
        let instanceService = new Services();
        try{
            nmap = await instanceService.executeCommand('wsl DEBIAN_FRONTEND=noninteractive /usr/bin/apt-get install nmap -y')
        }catch(error){
            this.constructor.loggerInstance.error(error,`Ocurrio un error instalar NMAP.`);
            return error;
        }
    }
    static getInstance() {
        if (!this.#instance) {
            this.#instance = new Nmap();
        }
        return this.#instance;
    }

    async getDeviceConnected(param) {
       // console.log("getDeviceConnected");
         let instanceService = new Services();
         const ioSocket = IO.getIO();
        try {
            this.JobTrazability.statusJob = 'Active/InProgress';
            ioSocket.emit("Job/ScanStatus",this.JobTrazability);
            await instanceService.executeCommand(`wsl nmap -sP ${param} -oX output.xml > nul 2>&1`);
            //instanceService.writerLog(`Escaneo nmap realizado - ip : ${param}`);
            this.constructor.loggerInstance.info(`Escaneo nmap realizado - ip : ${param}`);
            
            return await instanceService.XmltoJson("output.xml");
        } catch (error) {
            
            this.constructor.loggerInstance.error(error,`Ocurrio un error al obtener los dispositivos conectados.`);
            return { status: 500, message: error };
        }
    }

    getSystemInfo(param) {
        let file_output = "";
        let message = "";
        let instanceService = new Services();
        try {
            instanceService.executeCommand(`wsl truncate -s 0 resultado.txt`);
            instanceService.executeCommand(`wsl nmap -p- -A -T4 -oN resultado.txt ${param} > nul 2>&1`);

            file_output = instanceService.ReadTXT(`resultado.txt`, "Linux");
            //console.log(file_output);
            if (file_output) {
                message = "Linux";
                //console.log(message);
                return message;
            } else if (!file_output) {
                file_output = instanceService.ReadTXT(`resultado.txt`, "Windows");
                message = (file_output) ? "Windows" : "Desconocido";
                //console.log(message);
                return message;
            }
        } catch (error) {
            //console.log(error);
            this.constructor.loggerInstance.error(error,`Ocurrio un error al obtener la version de NMAP.`);
            
            return { status: 500, message: error };
        }
    }

}
module.exports = Nmap;
