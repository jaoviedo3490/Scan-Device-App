const ConectionBD = require('../Services/DataBase/Conection.cjs');

class IpHistory {
    static #instance = null;
    BD_Instance = ConectionBD.getInstance();
    constructor() {
        console.log("Instanciando el controlador de Auditoría de Jobs");
    }

    static getInstance() {
        try {
            if (!this.#instance) {
                this.#instance = new IpHistory();
            }
            return this.#instance;
        } catch (error) {
            return { statusCode: 500, message: `Error al instanciar el controlador de Hsitorial de las IP` }
        }
    }

    async createIpHistory(ip) {
        try {


            if (ip !== '-1') {

                const newItem = await this.BD_Instance.IpHistory.create({
                    data: { IpDevice: ip, Date: new Date() }
                });
                return {
                    statusCode: 201,
                    message: { id: newItem.id, ipDevice: newItem.IpDevice },
                }
            }

        } catch (error) {
            return {
                statusCode: 500,
                message: `Error al crear el registro de Direcciones ip: ${error.message}`
            }
        }
    }



    async getIpDevices() {
        try {

            const items = await this.BD_Instance.IpHistory.findMany();

            return {
                statusCode: 200,
                message: "Registros del Historial de direcciones IP obtenidos correctamente",
                data: items
            }

        } catch (error) {
            return {
                statusCode: 500,
                message: `Error al obtener registros del Historial de direcciones IP: ${error.message}`
            }
        }
    }

    async getEspecificIpDevice(ip) {
        try {

            if (ip === '-1') {
                return {
                    statusCode: 404,
                    message: "Ip valida",

                }
            } else {
                const item = await this.BD_Instance.IpHistory.findFirst({
                    where: { IpDevice: ip }
                });
                if (!item) {
                    return {
                        statusCode: 404,
                        message: "Ip no encontrada",

                    }
                }
                return {
                    statusCode: 200,
                    message: "Registro del Historial de direcciones IP obtenido correctamente",
                    data: item
                }
            }

        } catch (error) {
            return {
                statusCode: 500,
                message: `Error al obtener el Registro del Historial de direcciones IP: ${error.message}`
            }
        }
    }

}

module.exports = IpHistory;