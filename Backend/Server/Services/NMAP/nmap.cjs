const Services = require('../GenericServices/Services.cjs');


class Nmap extends Services{
    static #instance = null;
    constructor(){
        super();
        console.log("nmap");
    }

    static getInstance(){
        if(!this.#instance){
            this.#instance = new Nmap();
        }
        return this.#instance;
    }
    async getDeviceConnected(param){
        console.log("getDeviceConnected");
        try{
            await super.executeCommand(`wsl nmap -sP ${param} -oX output.xml`);
            super.writerLog(`Escaneo nmap realizado - ip : ${param}`);
            return await super.XmltoJson("output.xml");
        }catch(error){
            return {status:500,message:error};
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
    async getSystemInfo(param){
        try{
            await super.executeCommand(`wsl truncate -s 0 resultado.txt`);
            await super.executeCommand(`wsl nmap -p- -A -T4 -oN resultado.txt ${param}`);
            console.log("aqui??????");
            let datos =  super.ReadTXT("resultado.txt","Linux");
            datos = (datos.status == 404) ? "Desconocido" : datos.os;
            //let os = await super.XmltoJson("output.txt");
            
            console.log("Sistema operatico: "+datos);
            return os;
        }catch(error){
            return {status:500,message:error};
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

