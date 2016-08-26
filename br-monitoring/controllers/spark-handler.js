var eclairjs = require('eclairjs');

var sc = new eclairjs.SparkContext("local[*]", "PhEDEx Replica Monitoring");

//module.exports = {
 //   collect: function(path) {
 //       var agg = sc.textFile('hdfs:///cms/phedex-monitoring-test/2016-08-24_21h43m54s_execution_2');
 //       agg.collect().then(function(result) { return result; });
 //   }
//}
