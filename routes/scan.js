var express = require('express');
const scanServices = require('../Services/NmapServices/scan_service.cjs');
const Jobs = require('../Jobs/job.cjs');
var router = express.Router();
const Services = require('../Services/GenericServices/Services.cjs');

/* GET users listing. */
router.get('/',async function(req, res, next) {
  const services = new Services();
  let routerIp = await services.getIpRouteExclude();
  console.log(routerIp);
  let ServiceScanResponse = scanServices.getInstance();
  let responseNMAPScan = await ServiceScanResponse.getScannNetWork();
  console.log(responseNMAPScan);
  res.send(responseNMAPScan);
});

module.exports = router;
