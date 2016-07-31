'use strict';

let config = require('./config');

if(module.parent){
    module.exports = createApplication;
} else {
    startApplication();
}

function startApplication() {
    let app = createApplication();
   
    let port = process.env.PORT || config.port;
    app.listen(port, () => {
        console.log(`Boyarin start on port ${port} in ${process.env.NODE_ENV || 'dev'} mode`);
    });
}

function createApplication(extensionConfig) {
    let newCongfig = {};
    extensionConfig = extensionConfig || {};

    for(let key in config){
        newCongfig[key] = extensionConfig[key] || config[key];
    }

    return setupApplication(newCongfig);
}

function setupApplication(config) {
    let express = require('express'),
        connector = require('./connector')('MTsarConnector', config);

    let app = express();

    app.disable('x-powered-by');
    require('./setup/parsers')(app, config);
    require('./setup/favicon')(app, config);
    require('./setup/authorization')(app, config);
    app.use(express.static(`${__dirname}/assets`));

    let homeRouter = require('./controllers/home')(config, connector);
    let stageRouter = require('./controllers/stage')(config, connector);
    app.use('/', homeRouter);
    app.use('/stage', stageRouter);

    require('./setup/view-engine')(app);
    require('./setup/error-handlers')(app);
    
    return app;    
}
