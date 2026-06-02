var express = require('express');
const redis = require('../Services/Redis/Redis.cjs');
var router = express.Router();


router.get('/redis/:item', async function (req, res, next) {

    try {
        let dato = req.params.item;
        let resultRedis = redis.getInstance();
        let resRedis = await resultRedis.getVar_temp(dato);
        res.send(resRedis);
    } catch (error) {
        res.send({ statusCode: 500, message: `Ocurrio un error al procesar la ruta: ${error}` });
    }
});
router.post('/redis/DeleteItem', async function (req, res, next) {

    try {
        if (!req.body.payload) {
            res.send({ status: 400, message: "Datos corruptos o no existentes" });
        } else {
            let dato = req.body.payload;
            let resultRedis = redis.getInstance();
            let resRedis = await resultRedis.deleteVar(dato);
            res.send(resRedis);
        }

    } catch (error) {
        res.send({ statusCode: 500, message: `Ocurrio un error al procesar la ruta: ${error}` });
    }
});


module.exports = router;