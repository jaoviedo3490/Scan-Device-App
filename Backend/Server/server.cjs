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

    
        Object.entries(result.nmaprun.host).map(([key,value])=>{
            const systeminfo = nmap_object.getSystemInfo(value.address.$.addr);
            value.address.$.OS = systeminfo;

            console.log(nmap);
        })
       
  
    response.json(result);
});

app.get("/scan/device", async (request, response) => {
    try {
        console.log(request.query);
        const ip = request.query.ip;
        const nmap_object = new nmap();
        const result = await nmap_object.getSystemInfo(ip);
        //console.log("deberia aparecer: "+result);
        response.json(
            {
                IP:ip,
                OS:result
            });
    }catch(error){
        console.log(error);
    }
});




app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.listen(port, () => {
    console.log(`🚀 Servidor funcionando en http://localhost:${port}`);
});
