var express = require('express');
const redis = require('../Services/Redis/Redis.cjs');
var router = express.Router();


router.get('/redis/:item', async function (req, res, next) {
 
    let dato = req.params.item;
    let resultRedis = redis.getInstance();
    let resRedis = await resultRedis.getVar_temp(dato);
    res.send(resRedis);
});

module.exports = router;