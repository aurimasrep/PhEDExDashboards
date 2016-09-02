var RESULTS = {'br_node_bytes' : 'Node Bytes',
               'br_dest_bytes' : 'Destination Bytes'};
var KEYS = {'node_kind' : 'Node Kind',
            'br_user_group' : "User Group",
            'acquisition_era': 'Acquisition Era',
            'data_tier': 'Data Tier'};
var limit = 10;

function sum(values) {
    return _.reduce(values, function(result, current) {
        return result + parseFloat(current);
    }, 0);
}

function groupBy(data, key, result){
    return _.chain(data)
            .groupBy(key)
            .map(function (value, key) {
              return [key, sum(_.pluck(value, result))]
            })
            .value();
}

function buildChart(data, key, result) {

    //2. Flter data
    data = groupBy(data, key, result);
    dataSorted = _.sortBy(data, (row) => row[1]).reverse();
    dataTop = _.first(dataSorted, limit-1);
    dataOther = _.chain(dataSorted).rest(limit-1).reduce((a, b) => a[1] + b[1], 0).value();

    data = dataTop.concat(dataOther)
    //3. Define traces
    var data =
    [{
        labels: data.map((row) => row[0]),
        values: data.map((row) => row[1]),
        type: 'pie',
        name: RESULTS[result],
        marker: {
            line: {
                color: "rgb(0,0,0)",
                width: 0
            }
        },
	exponentformat: "SI",
	auroformat: true
    }];
 
    //4. Define layout
    var layout = {
        title: KEYS[key],
	hoverinfo: "SI",
	textinfo: "SI",
	colorbar : {
            title: "Size",
            exponentformat: "SI",
            auroformat: true
        }
    };
 
    //5. Insert html element
    var plotID = "br_sum_current-" + key;

    $('span[id=\"' + plotID +'-progress\"]').remove();

    var d3 = Plotly.d3;
    var gd3 = d3.select("div[id='" + plotID + "']").append("div").attr("class", "placeholder plot")

    var dataPopChart = gd3.node();
    Plotly.plot(dataPopChart, data, layout);

    window.addEventListener('resize', function() { Plotly.Plots.resize(dataPopChart);});
 
}

function displayCharts(data) {
    var q = d3.queue();
    q.defer(buildChart, data, "node_kind", "br_node_bytes");
    q.defer(buildChart, data, "br_user_group", "br_node_bytes");
    q.defer(buildChart, data, "acquisition_era", "br_node_bytes");
    q.defer(buildChart, data, "data_tier", "br_node_bytes");
    q.awaitAll(function (error) {});
}

function readData(callback) {
    d3.csv('/br-sum-current/data', function(err, data) { 
        callback(data);
    });   
}

function loadCharts() {
    readData(displayCharts)
}

loadCharts();
