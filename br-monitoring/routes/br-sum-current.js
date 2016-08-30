var express = require('express');
var router = express.Router();
var path = require('path');

// we are inside ./routes/
var out = __dirname + '/../out/';

/* GET Block replicas monitorings sum current data. */
router.get('/data', function(req, res, next) {
    res.sendFile(path.resolve(out + '2016-08-23_14h43m22s.json'));
});

module.exports = router;
