var zeppelin = (function() {
    
  function isFinished(message) {
    return message.status === "OK" && message.body.status === "FINISHED"
  }

  function isSucceeded(message) {
    return isFinished(message) && message.body.result.code === "SUCCESS"
  }

  function parseTable(message) {
    if (!isSucceeded(message) || message.body.result.type != "TABLE"){
      return { is_ready: false, status: message.body.status, code: message.body.result.code }
    }
    results = message.body.result.msg
    table = results.split("\n")
    headers = table.shift().split("\t")
    table.pop()
    rows = table.map(function (x) {
      return x.split("\t")
    })
    return { is_ready: true, status: "FINISHED", code: "SUCCESS", header: headers, rows: rows }
  }

  /*
    exporting functions in module
  */
  return {
    isParagraphFinished:isFinished,
    isParagraphSucceeded:isSucceeded,
    parseTableFromParagraph:parseTable,
    serverURL:"zeppelin-driver:8080"
  }   
}());