//Initial data
var RESULTS = {'br_node_bytes' : 'Node Bytes',
               'br_dest_bytes' : 'Destination Bytes'};
var dataGlobal;
var key = "node_kind"
var result = "br_node_bytes";
var limit = 10;

/////////////////////////////////////////////////////////////////

function getDates(days){
    var datesArray = [];
    var currentDate = moment();
    var startDate = moment().add(-days, 'days');
    while(currentDate > startDate){
        datesArray.push(currentDate.format('YYYY-MM-DD'));
        currentDate.add(-1, 'day');
    }
    return datesArray
}

function sum(values) {
    return _.reduce(values, function(result_, current) {
        return result_ + parseFloat(current/1000000000000000);
    }, 0);
}

function groupBy(data){
    return _.chain(data)
            .groupBy(key)
            .map(function (value, key_){
              return [key_, sum(_.pluck(value, result))]
            })
            .value();
}

function getDataTrace (type, data, indexSrc, indexOut, trace) {
    var trace;
    if (type == "pie"){
        trace = {
            labels: data.map((row) => row[indexSrc]),
            values: data.map((row) => row[indexOut]),
            type: type
        };
    } else if (type == "bar") {
        trace = {
            x: data.map((row) => row[indexSrc]),
            y: data.map((row) => row[indexOut]),
            type: type,
            name: trace
        };
    }
    return trace;
}

function plotData(type, chartData, layout) {
    $('span[id=\"br-sum-' + type + '-progress\"]').remove();
    var d3 = Plotly.d3;
    var gd3 = d3.select("div[id='br-sum-" + type + "']").append("div").attr("class", "placeholder plot")

    var dataPopChart = gd3.node();
    Plotly.plot(dataPopChart, chartData, layout);
    window.addEventListener('resize', function() { Plotly.Plots.resize(dataPopChart);});
}

function filterData(type){
    var indexSrc = 2;
    var indexOut = 1;
    var indexTrace = 0;

    var dataRange = dataGlobal;
    var fdata = []
    var dataConcated = [];    

    //if pie chart - filter only today data
    if (type == "pie"){
        dataRange = _.filter(dataGlobal, (row) => (row.now == moment().add(-1, 'days').format('YYYY-MM-DD')));
        indexSrc = 0;
        indexTrace = 2;
        indexOut = 1;
    }

    //Find unique dates
    var uniqueDateRecords = _.uniq(dataRange, (row) => row.now);
    var uniqueDates = _.map(uniqueDateRecords, (row) => row.now);

    //For every date find top results
    _.each(uniqueDates, function (date) {
        var dataByDay = _.filter(dataRange, (row) => (row.now == date));
        var dataGrouped = groupBy(dataByDay, key, result);
        var dataSorted = _.sortBy(dataGrouped, (row) => row[1]).reverse();
        var dataTop = _.first(dataSorted, limit-1);
        var dataOther = _.chain(dataSorted).rest(limit-1).map((row) => row[1]).reduce((a, b) => a + b).value();
        dataOther = dataOther ? [["Other", dataOther]] : [];

        var dataTopOther = dataTop.concat(dataOther);
        _.each(dataTopOther, (row) => row.push(date));
        
        dataConcated = dataConcated.concat(dataTopOther);
    });

    //Split data into traces
    var traces = _.uniq(dataConcated, (row) => row[indexTrace]);
    traces = _.map(traces, (row) => row[indexTrace]);
    _.each(traces, function(trace) {
        var data = _.filter(dataConcated, (row) => row[indexTrace] == trace).reverse();
        fdata.push(getDataTrace(type, data, indexSrc, indexOut, trace));
    });

    return fdata;
}


function buildPieChart() {
    chartData = filterData("pie")
    dateString = moment().add(-1, 'days').format('YYYY-MM-DD')
    titleMod = chartData[0] ? dateString : dateString + " (No data found)"
 
    layout = {
        title: titleMod
    };

    plotData("pie", chartData, layout); 
}

function buildBarChart() {
    chartData = filterData("bar");
    dateString = moment().add(-7, 'days').format('YYYY-MM-DD') + " - " + moment().add(-1, 'days').format('YYYY-MM-DD')  
    titleMod = chartData[0] ? dateString : dateString + " (No data found)"

    layout = {
        title: titleMod,
        xaxis: {title: "Date"},
        yaxis: {title: RESULTS[result], tickformat: '{:d}', ticksuffix: "PB", exponentformat: "none", hoverformat: ".6f"},
        barmode: "stack",
    };

    plotData("bar", chartData, layout);
}

function displayCharts(data) {
    dataGlobal = _.flatten(data);
    var q = d3.queue();
    q.defer(buildPieChart);
    q.defer(buildBarChart);
    q.awaitAll(function (error) {});
}

function csv(path, callback){
    d3.csv(path, function(csv) {
        csv ? callback(null, csv) : callback(null, []);
    });
}

function readMultiCsv(paths, callback){
    var q = d3.queue();
    _.each(paths, (path) => q.defer(csv, path))
    q.awaitAll((error, results) => callback(results));   
}

function readData(callback, days) {
    var paths = [];
    var daysArray = getDates(days);
    _.each(daysArray, (day) => paths.push('br-sum-current/data/' + day));
    readMultiCsv(paths, callback);   
}

function loadCharts() {
    readData(displayCharts, 7);
}


// Disable buttons
function reloadCharts(){
    barDiv = $('#br-sum-bar > .plot')[0];
    pieDiv = $('#br-sum-pie > .plot')[0];

    barDiv.data = filterData("bar");
    pieDiv.data = filterData("pie");

    Plotly.redraw(barDiv);
    Plotly.redraw(pieDiv);
}

$('#tab-key button').click(function() {
    $(this).addClass('active').siblings().removeClass('active');
    key = $(this)[0].value;
    reloadCharts();
});

$('#tab-result button').click(function() {
    $(this).addClass('active').siblings().removeClass('active');
    result = $(this)[0].value;
    reloadCharts();
});

$('#limit-btn').click(function() {
    limit = parseInt($('#limit')[0].value);
    reloadCharts();
});

$('#download-json').click(function() {
    data =  _.filter(dataGlobal, (row) => (row.now == moment().add(-1, 'days').format('YYYY-MM-DD')));
    json = JSON.stringify(data);
    blob = new Blob([json], {type: "application/json"});
    url  = URL.createObjectURL(blob);

    a = $('#download-json a')[0];
    a.href = url;
    a.download =  moment().add(-1, 'days').format('YYYY-MM-DD') + "_BR_Sum.json"; 
    a.click();
});

loadCharts();

//TODO Write function descriptions
