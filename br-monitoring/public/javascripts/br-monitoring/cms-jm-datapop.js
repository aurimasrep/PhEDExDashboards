var titleCMSDPSize = "Directories size";
var titleCMSDPCount = "Rows count";

var idPlotCMSDPSize = "cms-jmdp-size";
var idPlotCMSDPCount = "cms-jmdp-count";

var missingCMSDPDays = [];
var firstDay;
var lastDay; 

var d3CMSDPLoadChartSize = function(callback) {
  d3.json('http://'+zeppelin.serverURL+'/zepellin-iframe-redirection-1.0.0/rest/notebook/2BHCRMUQT/paragraph/20160426-170243_351354647', function(err, data) {
    
    var table = zeppelin.parseTableFromParagraph(data)
    var headers = table.headers 
    var rows = table.rows

    firstDay = rows[rows.length-1][1]
    lastDay = rows[0][1]

    var data = [
      {
        x: rows.map(function(row){return row[1]}),
        y: rows.map(
            function(row){
              var val = parseFloat(row[2]) || 0
              if (val === 0 || val === undefined){
                missingCMSDPDays.push(row[1])
              }
              return val
            }
          ),
        type: 'bar'
      }
    ];

    var layout = {
      title: titleCMSDPSize,

      xaxis: {
        title: "Date",
        hoverformat: "%Y/%m/%d",
        auroformat: true
      },
      yaxis : {
        title: "Size",
        exponentformat: "SI",
        auroformat: true
      }
    };

    // Plotly.newPlot('chart1', data, layout);
    $("#"+idPlotCMSDPSize+" div").remove(".progress")

    var d3 = Plotly.d3;
    var gd3 = d3.select("div[id='"+idPlotCMSDPSize+"']").append("div").attr("class", "placeholder plot")

    var dataPopChart = gd3.node();
    Plotly.plot(dataPopChart, data, layout);

    // window.onresize = function() { Plotly.Plots.resize( dataPopChart ); };
    window.addEventListener('resize', function() { Plotly.Plots.resize(dataPopChart); });

    callback(err, null);

  });  
}

var d3CMSDPLoadChartCount = function (callback) {
  d3.json('http://'+zeppelin.serverURL+'/zepellin-iframe-redirection-1.0.0/rest/notebook/2BHCRMUQT/paragraph/20160502-144310_1331506808', function(err, data) {
    
    var table = zeppelin.parseTableFromParagraph(data)
    var headers = table.headers 
    var rows = table.rows

    var data = [
      {
        x: rows.map(function(row){return row[1]}),
        y: rows.map(function(row){ return parseFloat(row[2]) || 0 }),
        type: 'bar',
        marker: {
          color: "rgb(173,216,230)",
          line: {
            color: "rgb(0,0,0)",
            width: 0
          }
        }
      }
    ];

    var layout = {
      title: titleCMSDPCount,

      xaxis: {
        title: "Date",
        hoverformat: "%Y/%m/%d",
        auroformat: true
      },
      yaxis : {
        title: "Number of rows",
        auroformat: true
      }
    };

    $("#"+idPlotCMSDPCount+" div").remove(".progress")

    var d3 = Plotly.d3;
    var gd3 = d3.select("div[id='"+idPlotCMSDPCount+"']").append("div").attr("class", "placeholder plot")

    var dataPopChart = gd3.node();
    Plotly.plot(dataPopChart, data, layout);

    window.addEventListener('resize', function() { Plotly.Plots.resize(dataPopChart); });

    callback(err, null);

  });  
}

var q = d3_queue.queue();
q.defer(d3CMSDPLoadChartSize);
q.defer(d3CMSDPLoadChartCount);
q.awaitAll(
  function(error) {
    if (missingCMSDPDays.length === 0){
      $("#"+idPlotCMSDPCount).append('<div class="alert alert-etl alert-info" role="alert">No missing data within period ('+firstDay+','+lastDay+'), last '+rows.length+' days</div>')
    } else {
      $("#"+idPlotCMSDPCount).append('<div class="alert alert-etl alert-danger" role="alert">No data present for <b>'+missingCMSDPDays.reduce(function(x,y){return x+", "+y})+'</b> within period ('+firstDay+','+lastDay+')</div>')
    }
  }
);
