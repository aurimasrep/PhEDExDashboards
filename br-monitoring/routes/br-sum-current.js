var express = require('express');
var router = express.Router();
var path = require('path');

// we are inside ./routes/
var out = /*__dirname + */'/data/cron/out/'

/* GET Block replicas monitorings sum current data. */
router.get('/data/:fileName', function(req, res, next) {
    res.sendFile(path.resolve(out + req.params.fileName));
});

module.exports = router;
