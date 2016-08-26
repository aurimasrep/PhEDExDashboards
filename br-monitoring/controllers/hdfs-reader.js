var hdfs = require('./webhdfs-client');


// Initialize readable stream from HDFS source
var remoteFileStream = hdfs.createReadStream('hdfs:///cms/phedex-monitoring-test/2016-08-17_23h00m55s_execution_1')

/*
// Variable for storing data
var data = new Buffer();

remoteFileStream.on('error', function onError (err) {
  // Do something with the error
});

remoteFileStream.on('data', function onChunk (chunk) {
   // Concat received data chunk
   data = Buffer.concat([ data, chunk ]);
});

remoteFileStream.on('finish', function onFinish () {
   // Upload is done
   // Print received data
    console.log(data.toString());
});
*/
