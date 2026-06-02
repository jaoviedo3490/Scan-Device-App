var express = require('express');
const scanServices = require('../Services/NmapServices/scan_service.cjs');
const Jobs = require('../Jobs/job.cjs');
var router = express.Router();
const logger = require('../Services/logs/pino.js');
const ScanAgent = require('../Services/JobServices/ScannerJobService.js');
const ProcessJobControler = require("../Controllers/ProcessJob.Controller.cjs");
const IpHistoryController = require("../Controllers/IpHistory.Controller.cjs");
const Nmap = require('../Services/NmapServices/nmap.cjs')

var ultimate_id_job = 0;
var statusJob = { status: 'No.Init' }
var response = { payload: "" }
/* GET users listing. */
let logInstance = logger.getInstance();

router.get('/', async function (req, res, next) {
  try {
    let ServiceScanResponse = scanServices.getInstance();
    responseService = await ServiceScanResponse.getScannNetWork();
    res.send(responseService);
  } catch (error) {
    logInstance.error(error, `Ocurrio un error al procesar la ruta /scan`);
    response.payload = { message: `Ocurrio un error al procesar la ruta /scan ${error.message}` }
    res.send(response.payload);
  }
});

router.post('/AutomaticJob', async function (req, res, next) {
  try {
    if (!req.body.init) {
      res.send({ statusCode: 400, message: 'Datos de peticion incorrectos o corruptos' });
    } else {
      const AgentScan = await ScanAgent.ScannerJob();
      logInstance.info(`Escaneo automatico iniciado`);
      res.send({ statusCode: 200, message: AgentScan });
    }
  } catch (error) {
    logInstance.error(error, `Ocurrio un error al procesar la ruta /scan`);
    response.payload = { message: `Ocurrio un error al procesar la ruta /scan ${error.message}` }
    res.send(response.payload);
  }
});

router.post('/DeleteJob', async function (req, res, next) {
  try {
    if (!req.body.idJob) {
      res.send({ statusCode: 400, message: 'Datos de peticion incorrectos o corruptos' });
    } else {

      const idJob = req.body.idJob;
      const AgentScan = ScanAgent.getInstance();
      const resultInactiveJob = await AgentScan.stopAutomatedJob(idJob);

      logInstance.info(`Escaneo automatico detenido`);
      res.send({ statusCode: 200, message: resultInactiveJob });
    }
  } catch (error) {
    logInstance.error(error, `Ocurrio un error al procesar la ruta /scan`);
    response.payload = { message: `Ocurrio un error al procesar la ruta /scan ${error.message}` }
    res.send(response.payload);
  }
});

router.get('/getJobStatus', async function (req, res, next) {
  try {
    let ProcessJobInstance = ProcessJobControler.getInstance();
    let idJobStatus = await ProcessJobInstance.getEspecificProcessJob(1);
    res.send(idJobStatus);
  } catch (error) {
    logInstance.error(error, `Ocurrio un error al procesar la ruta /scan`);
    response.payload = { message: `Ocurrio un error al procesar la ruta /scan ${error.message}` }
    res.send(response.payload);
  }
});

router.get('/saveIp', async function (req, res, next) {
  try {

    let ipHistoryControllerInstance = IpHistoryController.getInstance();
    let ipHistoryGetIp = await ipHistoryControllerInstance.getEspecificIpDevice("127.0.0.1");
    switch(ipHistoryGetIp.statusCode){
      case "200":break;
      case "404":
        let ipHistoryResponse = await ipHistoryControllerInstance.createIpHistory('127.0.0.1');
        
        break;
      case "500":break;
      default:break;
    }
   // let ipHistoryResponse = await ipHistoryControllerInstance.createIpHistory('127.0.0.1');
    res.send(ipHistoryGetIp);
  } catch (error) {
    logInstance.error(error, `Ocurrio un error al procesar la ruta /scan`);
    response.payload = { message: `Ocurrio un error al procesar la ruta /scan ${error.message}` }
    res.send(response.payload);
  }
});
router.post('/installNmap', async function (req, res, next) {
  try {
    if (!req.body.install) {
      return res.send({ statusCode: 400, message: 'Datos de peticion incorrectos o corruptos' });
    } else {

      const installService = req.body.install;
      if(installService){
        const nmapInstance =  Nmap.getInstance();
        let resultInstallation = await nmapInstance.install_nmap();
        return res.send({ statusCode: 200, message: resultInstallation });
      }

      logInstance.info(`Escaneo automatico detenido`);
      return res.send({ statusCode: 200, message: "Servicio interno ya instalado" });
    }
  } catch (error) {
    logInstance.error(error, `Ocurrio un error al procesar la ruta /scan`);
    response.payload = { message: `Ocurrio un error al procesar la ruta /scan ${error.message}` }
    res.send(response.payload);
  }
});

module.exports = router;
