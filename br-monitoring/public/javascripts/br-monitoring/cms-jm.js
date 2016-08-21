var titleCMSSize = "Directories size";
var titleCMSCount = "Rows count";

var idPlotCMSSize = "cms-jm-size";
var idPlotCMSCount = "cms-jm-count";

var missingCMSJMDays = [];
var firstDay;
var lastDay; 

var d3CMSLoadChartSize = function(callback) {
  d3.json('http://'+zeppelin.serverURL+'/zepellin-iframe-redirection-1.0.0/rest/notebook/2BHCRMUQT/paragraph/20160503-112306_70210085', function(err, data) {
    
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
                missingCMSJMDays.push(row[1])
              }
              return val
            }
          ),
        type: 'bar',
        marker: {
          // color: "rgb(173,216,230)",
          line: {
            color: "rgb(0,0,0)",
            width: 0
          }
        }
      }
    ];

    var layout = {
      title: titleCMSSize,
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
    $("#"+idPlotCMSSize+" div").remove(".progress")

    var d3 = Plotly.d3;
    var gd3 = d3.select("div[id='"+idPlotCMSSize+"']").append("div").attr("class", "placeholder plot")

    var dataPopChart = gd3.node();
    Plotly.plot(dataPopChart, data, layout);

    // window.onresize = function() { Plotly.Plots.resize( dataPopChart ); };
    window.addEventListener('resize', function() { Plotly.Plots.resize(dataPopChart); });

    callback(err, null);

  });  
}

var d3CMSLoadChartCount = function (callback) {
  d3.json('http://'+zeppelin.serverURL+'/zepellin-iframe-redirection-1.0.0/rest/notebook/2BHCRMUQT/paragraph/20160503-112221_975785818', function(err, data) {
    
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
      title: titleCMSCount,

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

    $("#"+idPlotCMSCount+" div").remove(".progress")

    var d3 = Plotly.d3;
    var gd3 = d3.select("div[id='"+idPlotCMSCount+"']").append("div").attr("class", "placeholder plot")

    var dataPopChart = gd3.node();
    Plotly.plot(dataPopChart, data, layout);

    window.addEventListener('resize', function() { Plotly.Plots.resize(dataPopChart); });

    callback(err, null);

  });  
}

var q = d3_queue.queue();
q.defer(d3CMSLoadChartSize);
q.defer(d3CMSLoadChartCount);
q.awaitAll(
  function(error) {
    if (missingCMSJMDays.length === 0){
      $("#"+idPlotCMSCount).append('<div class="alert alert-etl alert-info" role="alert">No missing data within period ('+firstDay+','+lastDay+'), last '+rows.length+' days</div>')
    } else {
      $("#"+idPlotCMSCount).append('<div class="alert alert-danger alert-etl" role="alert">No data present for <b>'+missingCMSJMDays.reduce(function(x,y){return x+", "+y})+'</b> within period ('+firstDay+','+lastDay+')</div>')
    }
  }
);
