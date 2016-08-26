var dataFields = {  "now"               : 0,
                    "br_user_group"     : 1,
                    "data_tier"         : 2,
                    "acquisition_era"   : 3,
                    "node_kind"         : 4,
                    "br_dest_bytes"     : 5,
                    "br_node_bytes"     : 6
                 }

var minDate = '2015-08-01'

var titleCMS_BR_1 = "CMS-BR-1";
var idPlotCMS_BR_1 = "cms-br-1";

var titleCMS_BR_2 = "CMS-BR-2";
var idPlotCMS_BR_2 = "cms-br-2";

var d3CMS_BR_1LoadChart = function(callback) {
    d3.json('/cms-br-1', function(err, data) {
      
      //nodes = _.uniq(data.map((row) => row.node_name))
      //dates = _.uniq(data.map((row) => row.date))

      data = _.filter(data, (row) => row.node_name == "T2_US_Florida")

      var trace1 =
      {
        x: data.map((row) => row.date),
        y: data.map((row) => row.delta_plus),
        type: 'bar',
        name: 'delta plus',
        marker: {
          line: {
            color: "rgb(0,0,0)",
            width: 0
          }
        }
      };

     var trace2 =
     {
        x: data.map((row) => row.date),
        y: data.map((row) => row.delta_minus),
        type: 'bar',
        name: 'delta minus',
        marker: {
          line: {
            color: "rgb(0,0,0)",
            width: 0
          }
        }
      };

    var data = [trace1, trace2]

    var layout = {
      title: titleCMS_BR_1,
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
    $("#"+idPlotCMS_BR_1+" div").remove(".progress")

    var d3 = Plotly.d3;
    var gd3 = d3.select("div[id='"+idPlotCMS_BR_1+"']").append("div").attr("class", "placeholder plot")

    var dataPopChart = gd3.node();
    Plotly.plot(dataPopChart, data, layout);

    // window.onresize = function() { Plotly.Plots.resize( dataPopChart ); };
    window.addEventListener('resize', function() { Plotly.Plots.resize(dataPopChart); });

    callback(err, null);

  });  
}

 var d3CMS_BR_2LoadChart = function(callback) {
     d3.json('/spark-result', function(err, data) {

    data = _.filter(data, (row) => row.br_user_group == "DataOps")
    data = _.filter(data, (row) => row.node_kind == "Disk")
    data = _.filter(data, (row) => row.data_tier == "RECO")

    var trace1 =
     {
        labels: data.map((row) => row.acquisition_era),
        values: data.map((row) => row.br_dest_bytes),
        type: 'pie',
        name: 'Destination bytes',
        marker: {
            line: {
                color: "rgb(0,0,0)",
                width: 0
            }
        },
        domain: {
            x: [0, .48],
            y: [0, 1]
        }
    };

    var trace2 =
    {
        labels: data.map((row) => row.acquisition_era),
        values: data.map((row) => row.br_node_bytes),
        type: 'pie',
        name: 'Node bytes',
        marker: {
            line: {
               color: "rgb(0,0,0)",
               width: 0
            }
        },
        domain: {
            x: [.52, 1],
            y: [0, 1]        
        }
    };
 
    var data = [trace1, trace2]
 
    var layout = {
        title: titleCMS_BR_2,
        annotations: [
        {
            font: {
                size: 20
            },
            showarrow: false,
            text: 'DB',
            x: 0.17,
             y: 0.5
        },
        {
            font: {
                size: 20
            },
            showarrow: false,
            text: 'NB',
            x: 0.82,
            y: 0.5
        }],

        height: 600,
        width: 600
    };
 
    // Plotly.newPlot('chart1', data, layout);
    $("#"+idPlotCMS_BR_2+" div").remove(".progress")

    var d3 = Plotly.d3;
    var gd3 = d3.select("div[id='"+idPlotCMS_BR_2+"']").append("div").attr("class", "placeholder plot")

    var dataPopChart = gd3.node();
    Plotly.plot(dataPopChart, data, layout);

    // window.onresize = function() { Plotly.Plots.resize( dataPopChart ); };
    window.addEventListener('resize', function() { Plotly.Plots.resize(dataPopChart); 
    });
 
    callback(err, null);
 
  });
}


function onSubmit(){
    var startDate = $('#daterange').data('daterangepicker').startDate._i
    var endDate = $('#daterange').data('daterangepicker').endDate._i

}

$(document).ready(function() {
    $("#daterange").daterangepicker({
        startDate: moment(),
        endDate: moment(),
        minDate: minDate,
        maxDate: moment(),
        format: 'YYYY-MM-DD',
        opens: "right",
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    });
});

function csv(path, callback){
    d3.csv(path, function(csv) {
        csv ? callback(null, csv) : callback("error", null);
    });
}

function readMultiCsv(paths){
    q = d3.queue();
    _.each(paths, (path) => q.defer(csv, path))
    q.awaitAll(function(error, results) { console.log(results); });   
}

//var fileList = ["/cms-br-2", "/cms-br-2"]

//readMultiCsv(fileList)

var q = d3.queue();
q.defer(d3CMS_BR_1LoadChart);
q.defer(d3CMS_BR_2LoadChart);
q.awaitAll(function (error) {});
