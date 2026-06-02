var express = require('express');
const Inventario = require('../Controllers/Inventario.Controllers.cjs');
var router = express.Router();


router.post('/CreateItem', async function (req, res, next) {
    try {
        const saveIventory = new Inventario();
        if (!req.body.payload) {
            res.send({ status: '400', message: `Datos corruptos o no existentes` });
        } else {
            let dato = req.body.payload;
            const createInventary = await saveIventory.createInventario(dato);
            if (createInventary.statusCode === 200) res.send(createInventary);
            res.send({ statusCode: 200, message: createInventary })
        }
    } catch (error) {
        return { statusCode: 500, message: `Ocurrio un error al procesar la ruta: /CreateItem ${error}` }
    }

});
router.get('/getInventary', async function (req, res, next) {
    try {
        const readIventory = new Inventario();
        const readInventary = await readIventory.getInventario();
        if (readInventary.statusCode === 200) res.send(readInventary);
        res.send({ statusCode: 200, message: readInventary })

    } catch (error) {
        return { statusCode: 500, message: `Ocurrio un error al procesar la ruta: /getInventary ${error}` }
    }

});
router.post('/DeleteItem', async function (req, res, next) {
    try {
        if (!req.body.payload) {
            res.send({ status: '400', message: `Datos corruptos o no existentes` });
        } else {
            const delInventory = new Inventario();
            const deleteInventory = await delInventory.deleteVar();
            if (deleteInventory.statusCode === 200) res.send({ statusCode: 200, message: readInventary })
        }
    } catch (error) {
        return { statusCode: 500, message: `Ocurrio un error al procesar la ruta: /getInventary ${error}` }
    }

});

router.post('/DeleteBDItem', async function (req, res, next) {
    try {
        if (!req.body.payload) {
            res.send({ status: '400', message: `Datos corruptos o no existentes` });
        } else {
            let dato = req.body.payload;
            const delInventory = new Inventario();
            const deleteInventory = await delInventory.delInventario(dato);
            if (deleteInventory.statusCode !== 200) res.send({ statusCode: 500, message: deleteInventory.message });
            res.send({ statusCode: 200, message: "Registro eliminado Correctamente" });
        }
    } catch (error) {
        return { statusCode: 500, message: `Ocurrio un error al procesar la ruta: /getInventary ${error}` }
    }

});




module.exports = router;