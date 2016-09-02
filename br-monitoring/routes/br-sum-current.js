var express = require('express');
var router = express.Router();
var path = require('path');

// we are inside ./routes/
var out = /*__dirname + */'/afs/cern.ch/user/a/arepecka/public/CrontabTest/out/'

/* GET Block replicas monitorings sum current data. */
router.get('/data', function(req, res, next) {
    res.sendFile(path.resolve(out + '2016-09-01'));
});

module.exports = router;
