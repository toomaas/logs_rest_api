var express = require('express');
var logs = require('./logs/logs');
var reporting = require('./reporting/reporting');
var alerting = require('./alerting/alerting');

var router = express.Router();  //get an instance of the express Router
//https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get

router.route('/logs')
    // create a log (accessed at POST http://localhost:8080/api/logs)
    .post(function (req, res) {
        logs.post(req, res);
    });

router.route('/reporting')
    .get(function (req,res){
        reporting.get(req,res);
    })
    .post(function (req,res){
        reporting.post(req,res);
    });

router.route('/alert')
    .get(function (req,res){
        alerting.get(req,res);
    })
    .post(function (req,res){
        alerting.post(req,res);
    });

module.exports = router;