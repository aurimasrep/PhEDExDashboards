var express = require('express');
var router = express.Router();
var path = require('path');
var config=require('../config.json')[process.env.NODE_ENV || 'development'];


// we are inside ./routes/
var out = config.data + '/';

/* GET Block replicas monitorings sum current data. */
router.get('/data/:fileName', function(req, res, next) {
    res.sendFile(path.resolve(out + req.params.fileName));
});

module.exports = router;
