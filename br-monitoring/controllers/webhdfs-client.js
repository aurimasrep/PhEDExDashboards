// Include webhdfs module
var WebHDFS = require('webhdfs');

// Create a new
var hdfs = WebHDFS.createClient({
  user: 'arepecka', // Hadoop user
  host: 'p01001532965510.cern.ch',
  port: 9000 // Namenode port
});

// Initialize readable stream from HDFS source
var remoteFileStream = hdfs.createReadStream('/cms/phedex-monitoring-test/2016-08-24_21h43m54s_execution_2');
// Variable for storing data
var data = new Buffer([]);

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

//module.exports = hdfs;
