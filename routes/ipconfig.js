'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

var utils = require('./utils');

router.get('/', function (req, res, next) {
    var glob = utils.loadGlobals(req.app);
    // var envDict = utils.loadEnvDict(req.app);
    // utils.mixinEnv(glob, envDict);
    
    var localStaticPath = req.app.get('config_path');
    var localDynamicPath = path.join(path.join(localStaticPath, '..'), 'dynamic');
    
    res.render('ipconfig',
        {
            configPath: req.app.get('config_path'),
            envFile: 'not used',//req.app.get('env_file'),
            localStaticPath: localStaticPath,
            localDynamicPath: localDynamicPath,
            glob: glob
        });
});

router.post('/api', function (req, res, next) {
    var body = utils.getJson(req.body);
    var glob = utils.loadGlobals(req.app);
    glob.network = body.glob.network;
    glob.db = body.glob.db;
    
    utils.saveGlobals(req.app, glob);

    // Write changes to Kickstarter.json
    var kickstarter = utils.loadKickstarter(req.app);
    kickstarter.ipconfig = 3;
    utils.saveKickstarter(req.app, kickstarter);

    res.json({ message: 'OK' });
});

module.exports = router;
