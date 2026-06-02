const nodemailer = require('nodemailer');


class Mail{
    static #Instance = null;
    transport = null;
    constructor(){
        this.transport = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"recetafacil15@gmail.com",
            pass:"jmiodcsddkjesfxk"
        }
    })
        console.log("Instanciando el servicio de envio de correos");
    }
    static getInstance(){
        if(!this.#Instance){
            this.#Instance = new Mail();
        }
        return this.#Instance;
    }

    sendMail = async(destiny,content)=>{
        try{
            const serviceResponse = await this.transport.sendMail({
                from:'"ScannerApp" <recetafacil15@gmail.com>',
                to:destiny,
                subject:"Alerta de monitoreo de red",
                text:content,
                html:content
            });
            console.log(`Correo Enviado correctamente: ${serviceResponse}`);
        }catch(error){
            return {"status":500,"message":error.message};
        }
    }
}
module.exports = Mail ;