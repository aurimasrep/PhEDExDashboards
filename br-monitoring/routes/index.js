var express = require('express');
var router = express.Router();
var moment= require('moment');
var brSumFilter = require('../controllers/br-sum-filter');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {currentUrl: req.originalUrl,
                         collapseBrSum: true});
});

/* GET Block replicas current page. */
router.get('/br-sum-current', function (req, res, next) {
    res.render('br-sum-current', {currentUrl: req.originalUrl,
                                  collapseBrSum: false,
                                  now: moment().format("YYYY-MM-DD")
    });
});

/* GET Block replicas filtering page. */
router.get('/br-sum-filter', function (req, res, next) {
    res.render('br-sum-filter', {currentUrl: req.originalUrl,
                                collapseBrSum: false,
                                now: moment().format("YYYY-MM-DD"),
                                nodeKinds: brSumFilter.getNodeKinds(),
                                userGroups: brSumFilter.getUserGroups(),
                                resultFields: brSumFilter.getResultFields()
    });
}); 

module.exports = router;
