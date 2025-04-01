const Services = require('../GenericServices/Services.cjs');


class Nmap extends Services {
    static #instance = null;
    constructor() {
        super();
        console.log("nmap");
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new Nmap();
        }
        return this.#instance;
    }
    async getDeviceConnected(param) {
        console.log("getDeviceConnected");
        try {
            await super.executeCommand(`wsl nmap -sP ${param} -oX output.xml > nul 2>&1`);
            super.writerLog(`Escaneo nmap realizado - ip : ${param}`);
            return await super.XmltoJson("output.xml");
        } catch (error) {
            return { status: 500, message: error };
        }
    }
    /*async getPortsDevice(param){
        try{
            await super.executeCommand(`nmap -p- ${param}`);
            return await super.XmltoJson("output.xml");
        }catch(error){
            return {status:500,message:error};
        }
    }*/
    async getSystemInfo(param) {
        let file_output = "" ;
        try {
            super.executeCommand(`wsl truncate -s 0 resultado.txt`);
            super.executeCommand(`wsl nmap -p- -A -T4 -oN resultado.txt ${param} > nul 2>&1`);
            let os = "";
            
            file_output = super.ReadTXT(`resultado.txt`, "Linux");
            if(file_output){
                console.log(file_output);
            }else if(!file_output){
                file_output =  super.ReadTXT(`resultado.txt`, "Windows");
                let message = file_output ? "Windows" : "Desconocido";
                console.log(message);
            }

        } catch (error) {
            console.log(error);
            return { status: 500, message: error };

        }
    }
    /*async getInfoByIP(param){
        try{
            await this.executeNmapCommand(`wsl nmap -A ${param} -xO output.xml`);
            return await this.XmltoJson("output.xml");
        }catch(error){
            return {status:500,message:error};
        }
    }*/




}
module.exports = Nmap;

