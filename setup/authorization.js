'use strict';

module.exports = function setAuthorization(app) {
    app.use((req, res, next) => {
        res.locals.worker = { tag:getWorkerTag(req) };
        next();
    });
};

let requestIp = require('request-ip');
let UAParser = require('ua-parser-js');
   
function getWorkerTag(req){
    let ip = requestIp.getClientIp(req).match(/.*(\d+)$/)[1];
    let parser = new UAParser();
    let browser = parser.setUA(req.headers['user-agent']).getBrowser();
    let version = '';
    if (browser.version) {
        let stringVersion = Number(browser.version.split(".", 1).toString());
        version = `${stringVersion}`;
    } 
    return `${ip}${browser.name}${version}`;     
}
