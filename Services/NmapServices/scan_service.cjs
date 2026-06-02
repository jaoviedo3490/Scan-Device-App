const nmap = require('./NMAP.cjs');
const axios = require('axios');
const redis = require('../Redis/Redis.cjs');
const logger = require('../logs/pino.js');
const IO = require("../Sockets/ServerSocket.js");
const MonitoringNetwork = require("../JobServices/MonitoringNetWork.js")

class scanServices {
    static #instance = null;
    static loggerInstance;
    statusDeviceCount = [];
    MonitoringNetWorkInstance = MonitoringNetwork.getInstance();
    JobTrazability = { statusJob: "Inactive", statusOperation: 200 };

    constructor() {
        console.log('scanService initialized');
        this.constructor.loggerInstance = logger.getInstance();
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new scanServices();
        }
        return this.#instance;
    }

    async getScannNetWork() {
        scanServices.MonitoringNetWorkInstance = [];
        this.statusDeviceCount = [];
        const ioSocket = IO.getIO();
        try {

            const range_local = process.env.IP_LOCAL_SCOPE;
            const range_global = process.env.IP_GLOBAL_SCOPE;
            const nmap_object = nmap.getInstance();
            const n = await nmap_object.getNMAPVersion();
            const statusIpDevices = [];
            let regex = new RegExp("command\\s+not\\s+found|not\\s+found\\s+", "i");
            let result;
            if (regex.test(n)) {
                result = { statusCode:"409", Message: "Nmap no instalado" };
            } else {

                result = await nmap_object.getDeviceConnected(range_global);
                let systeminfo = "";
                for (const [key, value] of Object.entries(result?.nmaprun?.host)) {
                    const ip = value?.address?.$?.addr;


                    systeminfo = nmap_object.getSystemInfo(ip);
                    this.statusDeviceCount.push(ip);

                    try {
                        const agent_response = await axios.get(`http://${ip}:${process.env.REMOTE_AGENT_PORT}/`);

                        if (agent_response.data === 'Ok') {
                            const response_remote = await axios.get(`http://${ip}:${process.env.REMOTE_AGENT_PORT}/processor`);
                            const response_remote_r = await axios.get(`http://${ip}:${process.env.REMOTE_AGENT_PORT}/ram`);
                            const response_remote_d = await axios.get(`http://${ip}:${process.env.REMOTE_AGENT_PORT}/disk`);
                            const response_remote_b = await axios.get(`http://${ip}:${process.env.REMOTE_AGENT_PORT}/Bios`);
                            const response_remote_m = await axios.get(`http://${ip}:${process.env.REMOTE_AGENT_PORT}/MotherBoard`);
                            const response_remote_k = await axios.get(`http://${ip}:${process.env.REMOTE_AGENT_PORT}/Keyboard`);
                            const response_remote_m2 = await axios.get(`http://${ip}:${process.env.REMOTE_AGENT_PORT}/Mouse`);
                            const response_remote_so = await axios.get(`http://${ip}:${process.env.REMOTE_AGENT_PORT}/OS`);
                            //const response_remote_processor_consumer = await axios.get(`http://${ip}:8080/ProcessorConsumer`);
                            const response_remote_name = await axios.get(`http://${ip}:${process.env.REMOTE_AGENT_PORT}/Name`);

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

                        value.address.$.error = (err.message === `connect ECONNREFUSED ${ip}:${process.env.REMOTE_AGENT_PORT}`) ? "Agente remoto inactivo o puerto ocupado" : err.message;
                        value.address.$.statusAgent = "Offline";
                    }
                    value.address.$.OS = systeminfo;
                }
            }
            this.statusDeviceCount.push('-1');
            console.log(`scanServices.statusDeviceCount: ${this.statusDeviceCount}`);
            const MonitoringNetWorkInstance = MonitoringNetwork.getInstance();

            for(let i=0 ; i<this.statusDeviceCount.length;i++){
                console.log("desde scan_service"+this.statusDeviceCount[i])
                await MonitoringNetWorkInstance.detectNewDevice(this.statusDeviceCount[i]);
            }
            const redisService = redis.getInstance();
            let resultRedis = await redisService.createVarTemp("Inventory", JSON.stringify(result), 1000);
            result['Temporal_Inventory'] = resultRedis;
            this.statusDeviceCount.length = 0;
            this.statusDeviceCount = [];
            return result;
        } catch (error) {
            this.constructor.loggerInstance.error(error, `Ocurrio un error al Escanear la red`);
            return { status: 500, message: error.message }
        }
    }
}

module.exports = scanServices;
