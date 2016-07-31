"use strict";

let connectors = {
    FakeConnector:  require('./fakeConnector'),
    MTsarConnector: require('./mtsarConnector')
};

module.exports = function getConnector(type, config) {
    let Connector = connectors[type];

    if(Connector === undefined)
        throw new Error("Connector not found");

    return new Connector(config);
};
