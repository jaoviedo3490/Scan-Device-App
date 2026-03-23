const { default: nmap } = require('node-nmap');
const Services = require('../GenericServices/Services.cjs');



class Nmap extends Services {
    static #instance = null;
    static date = new Date();
    constructor() {
        super();
        console.log("nmap");
    }
    async getNMAPVersion() {
        let nmap;
        try {
             nmap = await super.executeCommand(`wsl nmap --version`);
             return nmap;
        } catch (error) {
            //console.log(`${error}`);
            return error;
        }
    }
    async install_nmap(){
        let nmap;
        try{
            nmap = await super.executeCommand('wsl sudo /usr/bin/apt-get install nmap -y')
        }catch(error){
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
        console.log("getDeviceConnected");

        try {
            await super.executeCommand(`wsl nmap -sP ${param} -oX output.xml > nul 2>&1`);
            super.writerLog(`Escaneo nmap realizado - ip : ${param}`);
            return await super.XmltoJson("output.xml");
        } catch (error) {
            return { status: 500, message: error };
        }
    }

    getSystemInfo(param) {
        let file_output = "";
        let message = "";
        try {
            super.executeCommand(`wsl truncate -s 0 resultado.txt`);
            super.executeCommand(`wsl nmap -p- -A -T4 -oN resultado.txt ${param} > nul 2>&1`);

            file_output = super.ReadTXT(`resultado.txt`, "Linux");
            console.log(file_output);
            if (file_output) {
                message = "Linux";
                console.log(message);
                return message;
            } else if (!file_output) {
                file_output = super.ReadTXT(`resultado.txt`, "Windows");
                message = (file_output) ? "Windows" : "Desconocido";
                console.log(message);
                return message;
            }
        } catch (error) {
            console.log(error);
            return { status: 500, message: error };
        }
    }

}
module.exports = Nmap;
