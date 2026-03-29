const nmap = require('./NMAP.cjs');
const axios = require('axios');
const Services = require('../GenericServices/Services.cjs');
const redis = require('../Redis/Redis.cjs')

class scanServices {
    static #instance = null;


    constructor() {
        console.log('scanService initialized');
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new scanServices();
        }
        return this.#instance;
    }

    async getScannNetWork() {
        const range = "192.168.0.0/24";
        const range_local = "10.132.7.202/24"
        const nmap_object = nmap.getInstance();
        const n = await nmap_object.getNMAPVersion();
        let regex = new RegExp("command\\s+not\\s+found|not\\s+found\\s+", "i");
        let result;
        if (regex.test(n)) {
            result = { Message: "Nmap no instalado" };
        } else {
            result = await nmap_object.getDeviceConnected(range);
            //result = await nmap_object.getDeviceConnected(range_local);
            let systeminfo = "";
            for (const [key, value] of Object.entries(result.nmaprun.host)) {
                const ip = value.address.$.addr;
                systeminfo = nmap_object.getSystemInfo(ip);

                try {
                    const agent_response = await axios.get(`http://${ip}:8080/`);

                    if (agent_response.data === 'Ok') {
                        const response_remote = await axios.get(`http://${ip}:8080/processor`);
                        const response_remote_r = await axios.get(`http://${ip}:8080/ram`);
                        const response_remote_d = await axios.get(`http://${ip}:8080/disk`);
                        const response_remote_b = await axios.get(`http://${ip}:8080/Bios`);
                        const response_remote_m = await axios.get(`http://${ip}:8080/MotherBoard`);
                        const response_remote_k = await axios.get(`http://${ip}:8080/Keyboard`);
                        const response_remote_m2 = await axios.get(`http://${ip}:8080/Mouse`);
                        const response_remote_so = await axios.get(`http://${ip}:8080/OS`);
                        //const response_remote_processor_consumer = await axios.get(`http://${ip}:8080/ProcessorConsumer`);
                        const response_remote_name = await axios.get(`http://${ip}:8080/Name`);

                        //console.log('Processor:', response_remote.data);
                        //console.log('Ram:', response_remote_r.data);
                        //console.log('Disk:', response_remote_d.data);

                        value.address.$.Processor = response_remote.data;
                        value.address.$.Ram = response_remote_r.data;
                        value.address.$.Disk = response_remote_d.data;
                        value.address.$.Bios = response_remote_b.data;
                        value.address.$.MotherBoard = response_remote_m.data;
                        value.address.$.Keyboard = response_remote_k.data;
                        value.address.$.Mouse = response_remote_m2.data;
                        value.address.$.SystemOperating = response_remote_so.data;
                        value.address.$.NameDevice = response_remote_name.data;
                        value.address.$.statusAgent = "Online";
                    } else {
                        value.address.$.statusAgent = "Pending";
                        value.address.$.AgentMessage = "Ocurrio un error al revisar el estado del Agente remoto";
                    }


                } catch (err) {

                    value.address.$.error = (err.message === `connect ECONNREFUSED ${ip}:8080`) ? "Agente remoto inactivo o puerto ocupado" : err.message;
                    value.address.$.statusAgent = "Offline";
                }
                value.address.$.OS = systeminfo;
            }
        }
        const redisService = redis.getInstance();
        let resultRedis = await redisService.createVarTemp("Inventory", JSON.stringify(result),1000);
        result['Temporal_Inventory'] = resultRedis;
        return result;
    }
}

module.exports = scanServices;
