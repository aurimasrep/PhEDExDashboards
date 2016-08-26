var express = require('express');
var router = express.Router();
var path = require('path');
var moment= require('moment');
var brsum = require('../controllers/br-sum');
//var sparkHandler = require('../controllers/spark-handler');
//var hdfsReader = require('../controllers/hdfs-reader')

// we are inside ./routes/
var views = __dirname + '/../views/';
var out = __dirname + '/../out/';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {currentUrl: req.originalUrl});
});

/* GET Block replicas monitoring jade. */
router.get('/br-sum', function (req, res, next) {
    res.render('br-sum', {currentUrl: req.originalUrl,
                          now: moment().format("YYYY-MM-DD"),
                          nodeKinds: brsum.getNodeKinds(),
                          userGroups: brsum.getUserGroups(),
                          resultFields: brsum.getResultFields()
    });
}); 

/* GET Block replicas monitoring CMS-BR-2 jade. */
router.get('/cms-br-2', function(req, res, next) {
    res.sendFile(path.resolve(out + '2016-08-23_14h43m22s.json'));
});

/* GET Data json for dashboards */
router.get('/cms-br-1', function(req, res, next) {
    res.sendFile(path.resolve(out + '2016-08-22_15h23m27s'));
});

//router.get('/spark-result', function(req, res, next) {
//    res.send(sparkhandler.collect('a'));
//});

module.exports = router;
