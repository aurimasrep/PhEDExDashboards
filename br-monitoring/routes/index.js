var express = require('express');
var router = express.Router();
var moment= require('moment');
var config=require('../config.json')[process.env.NODE_ENV || 'development'];

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {currentUrl: req.originalUrl});
});

/* GET Block replicas current page. */
router.get('/br-sum-current', function (req, res, next) {
    res.render('br-sum-current', {currentUrl: req.originalUrl,
                                  currentEnd: moment().add(-1, 'days').format("YYYY-MM-DD"),
                                  currentStart: moment().add(-7, 'days').format("YYYY-MM-DD"),
                                  nodeKinds: config.nodeKinds,
                                  userGroups: config.userGroups,
                                  resultFields: config.resultFields
    });
});

module.exports = router;
