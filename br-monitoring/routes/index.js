var express = require('express');
var router = express.Router();
var path = require('path');

// we are inside ./routes/
var views = __dirname + '/../views/';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {currentUrl: req.originalUrl});
});

/* GET ETL procedures list. */
router.get('/br-monitoring', function(req, res, next) {
    res.render('br-monitoring', {currentUrl: req.originalUrl});
});

module.exports = router;
