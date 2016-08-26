var exec = require('child_process').exec

module.exports = {

    executeScript: function(req, res, next){
        execute(res);
    }
}

function execute(res){
    //exec('bash pbr.sh --yarn --basedir hdfs:///project/awg/cms/phedex/block-replicas-snapshots/csv/ --fromdate 2016-07-01 todate 2016-07-02 --results br_node_bytes --aggregations delta --interval 1 --fout /root/PhedexReplicaMonitoring/visualization/PhEDExDashboards/br-monitoring/out --collect')
}
