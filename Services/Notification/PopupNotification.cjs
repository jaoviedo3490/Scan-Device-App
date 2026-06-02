const logger = require('../logs/pino.js');
const axios = require('axios');
class PopupNotification {
    static #instance = null;
    loggerInstance = logger.getInstance();
    constructor() {
        console.log("Instanciando el servicio de notificacion Popup");
    }
    static getInstance = () => {
        try {
            if (!this.#instance) {
                this.#instance = new PopupNotification();
            }
            return this.#instance;
        } catch (error) {
            return { "status": 500, "message": error.message }
        }
    }

    popupAction = async (topic, payload) => {
        try {
            const result = await axios.post(
                topic,
                payload
            );
            return { "status": 200, "serviceResponse": JSON.stringify(result) }
        } catch (error) {
            return { "status": 500, "message": error.message }
        }
    }
}
module.exports = PopupNotification;