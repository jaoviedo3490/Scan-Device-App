const logger = require("../logs/pino.js");
const BD_Instance = require("../DataBase/Conection.cjs");
const IpHistoryController = require("../../Controllers/IpHistory.Controller.cjs");
const IO = require('../Sockets/ServerSocket.js');
const PopupNotification = require('../Notification/PopupNotification.cjs');
const MailNotification = require('../Notification/Mail.cjs');


class MonitoringNetwork {
    static #Instance = null;
    DeviceCount = [];
    loggerInstance = logger.getInstance();
    bdInstance = BD_Instance.getInstance();
    ipHistoryController = IpHistoryController.getInstance();
    poPupNotification = PopupNotification.getInstance();
    mailNotification = MailNotification.getInstance();
    constructor() {
        console.log("Instanciando el monitoreo de red");
    }

    static getInstance() {
        if (!this.#Instance) {
            this.#Instance = new MonitoringNetwork();
        }
        return this.#Instance;
    }

    detectNewDevice = async (payload) => {
        try {
            const WebSocketEvents = IO.getIO();
            console.log(payload);
            let ipHistoryGetIp = await this.ipHistoryController.getEspecificIpDevice(payload);
            switch (ipHistoryGetIp.statusCode) {
                case 200:
                    console.log(ipHistoryGetIp); break;
                case 404:
                    console.log(ipHistoryGetIp);
                    let ipHistoryResponse = await this.ipHistoryController.createIpHistory(payload);
                    this.DeviceCount.push(payload);
                    console.log("desde monitoringService:" + payload + " CountDevice: " + this.DeviceCount.length + " : " + this.DeviceCount);

                    if (payload === "-1" && this.DeviceCount.length > 1) {
                        this.DeviceCount.pop();
                        const responseNTFY = await this.poPupNotification.popupAction("https://ntfy.sh/scannApp-2qYt008qI7OMRyX64", `Nuevos dispositivos conectados: ${this.DeviceCount}`);
                        const responseMailer = await this.mailNotification.sendMail("jassonlukno44@gmail.com", `<h1>🚨 Alerta de red</h1>
                            <p>Nuevos dispositivos detectados en la red.</p> ${this.DeviceCount}`);
                        WebSocketEvents.emit("Monitoring/Device", { status: "Connected", ip: this.DeviceCount, date: Date.now() });
                        console.log(`Respuesta servicios de notificacion: :${JSON.stringify(responseNTFY)} : ${JSON.stringify(responseMailer)}`);
                        this.DeviceCount.length = 0;
                        this.DeviceCount = [];
                    } else if (payload === "-1" && this.DeviceCount.length === 1) {
                        this.DeviceCount.length = 0;
                        this.DeviceCount = [];
                    }
                    return { "status": 404, "message": "Dispositivo nuevo detectado" };
                    break;
                case 500: console.log(ipHistoryGetIp); break;
                default: console.log(ipHistoryGetIp); break;
            }

        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = MonitoringNetwork;