var express = require('express');
var router = express.Router();
var path = require('path');

// we are inside ./routes/
var out = __dirname + '/../out/';

/* GET Data json for dashboards */
router.get('/data', function(req, res, next) {
    res.sendFile(path.resolve(out + '2016-08-22_15h23m27s'));
});

module.exports = router;
