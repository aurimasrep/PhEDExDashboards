var express = require('express');
var router = express.Router();
var path = require('path');

// we are inside ./routes/
var views = __dirname + '/../views/';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.resolve(views+'/index.html'));
});

/* GET ETL procedures list. */
router.get('/etl-procedures', function(req, res, next) {
    res.sendFile(path.resolve(views+'/etl-procedures.html'));
});

module.exports = router;