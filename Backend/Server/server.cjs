const express = require("express");
const path = require("path");
const nmap = require('./Services/NMAP/nmap.cjs');
const app = express();
const port = 3000;



app.use(express.static(path.join(__dirname, "..")));

app.get("/scan", async (request, response) => {
    const range = request.query.range || "192.168.1.0/24";
    const nmap_object = new nmap();
    const result = await nmap_object.getDeviceConnected(range);
    response.json(result);
});

app.get("/scan/ports",async (request,response)=>{
    console.log(request.query);
    const ip = request.query.ip;
    const nmap_object = new nmap();
    const result = await nmap_object.getSystemInfo(ip);
    response.json(result);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.listen(port, () => {
    console.log(`🚀 Servidor funcionando en http://localhost:${port}`);
});
