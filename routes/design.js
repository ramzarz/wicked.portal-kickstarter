'use strict';

var express = require('express');
var router = express.Router();

var utils = require('./utils');

router.get('/', function (req, res, next) {
    var css = utils.loadCss(req.app);
    var glob = utils.loadGlobals(req.app);
    var envVars = utils.loadEnvDict(req.app);
    utils.mixinEnv(glob, envVars);
    res.render('design',
        {
            configPath: req.app.get('config_path'),
            glob: glob,
            wicked_css: css
        });
});

router.post('/', function (req, res, next) {
    var redirect = req.body.redirect;

    var body = utils.jsonifyBody(req.body);

    var glob = utils.loadGlobals(req.app);
    var envVars = utils.loadEnvDict(req.app);
    glob.title = body.glob.title;
    glob.title_ = body.glob.title_;
    glob.title__ = body.glob.title__;
    glob.company = body.glob.company;
    glob.company_ = body.glob.company_;
    glob.company__ = body.glob.company__;
    glob.footer = body.glob.footer;
    glob.footer_ = body.glob.footer_;
    glob.footer__ = body.glob.footer__;
    utils.mixoutEnv(glob, envVars);

    console.log(glob);
    console.log(envVars);

    utils.saveCss(req.app, body.wicked_css);
    utils.saveGlobals(req.app, glob);
    utils.saveEnvDict(req.app, envVars, "default");

    // Write changes to Kickstarter.json
    var kickstarter = utils.loadKickstarter(req.app);
    kickstarter.design = 3;
    utils.saveKickstarter(req.app, kickstarter);

    res.redirect(redirect);
});

module.exports = router;
