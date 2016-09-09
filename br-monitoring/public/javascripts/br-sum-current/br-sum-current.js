//Initial data
var RESULTS = {'br_node_bytes' : 'Node Bytes',
               'br_dest_bytes' : 'Destination Bytes'};
var dataGlobal;
var dataJSON = [];
var key = "node_kind"
var result = "br_node_bytes";
var limit = 10;
var loadData = false;
var nodeKind = [];
var userGroup = [];
var acquisitionEra = "";
var dataTier = "";
var chartGroup = 0;
var chartDates = [[moment().add(-7, 'days').format('YYYY-MM-DD'), moment().add(-1, 'days').format('YYYY-MM-DD')],
                 [moment().add(-7, 'days').format('YYYY-MM-DD'), moment().add(-1, 'days').format('YYYY-MM-DD')]]
var selectedDate = "";

/////////////////////////////////////////////////////////////////

function getDates(dates){
    var datesArray = [];
    startDate = moment(dates[0]);
    endDate = moment(dates[1]);
    while(startDate <= endDate){
        datesArray.push(startDate.format('YYYY-MM-DD'));
        startDate.add(1, 'day');
    }
    return datesArray
}

function sum(values) {
    return _.reduce(values, function(result_, current) {
        return result_ + parseFloat(current);
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

function saveJSON(data){
    dataJSON[chartGroup] = _.map(data, function(row) {
        object = new Object();
        object[key] = row[0];
        object[result] = row[1];
        object["now"] = row[2];
        return object;
    }) 
}

function getDataTrace (type, data, indexSrc, indexOut, trace) {
    var trace;
    if (type == "pie"){
        trace = {
            labels: data.map((row) => row[indexSrc]),
            values: data.map((row) => row[indexOut]),
            type: type,
            hoverformat: "SI",
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

function getDayResults(pieDiv, data){
    selectedDate = data.points[0].x;
    pieDiv.data = filterData("pie");
    pieDiv.layout.title = selectedDate;
    selectedDate = "";
    Plotly.redraw(pieDiv);
}

function getDayResults_0(data){
   getDayResults($('.br-sum-pie[chart-group= "0"] > .plot')[0], data);
}

function getDayResults_1(data){
   getDayResults($('.br-sum-pie[chart-group= "1"] > .plot')[0], data);
}

function plotData(type, chartData, layout, chartGroupLocal) {
    $('.br-sum-' + type + '-progress[chart-group= "' + chartGroupLocal + '"]').remove();
    var d3 = Plotly.d3;
    var gd3 = d3.select('.br-sum-' + type + '[chart-group= "' + chartGroupLocal + '"]').append("div").attr("class", "placeholder plot")

    var dataPopChart = gd3.node();
    Plotly.plot(dataPopChart, chartData, layout);
    if (chartGroupLocal == 0 && type == "bar"){
        dataPopChart.on('plotly_click', getDayResults_0);
    } else if (chartGroupLocal == 1 && type == "bar"){
        dataPopChart.on('plotly_click', getDayResults_1);
    }
    window.addEventListener('resize', function() { Plotly.Plots.resize(dataPopChart);});
}

function filterData(type){
    var indexSrc = 2;
    var indexOut = 1;
    var indexTrace = 0;
    var isSort = true;

    var dataRange = dataGlobal;
    var fdata = []
    var dataConcated = [];    

    //if pie chart - filter only today data
    if (type == "pie"){
        dataRange = _.filter(dataGlobal, (row) => (row.now == (selectedDate ? selectedDate :chartDates[chartGroup][1] )));
        indexSrc = 0;
        indexTrace = 2;
        indexOut = 1;
    }
    //Filtering data
    if (!_.isEmpty(nodeKind))
        dataRange = _.filter(dataRange, (row) => (_.contains(nodeKind, row.node_kind.toLowerCase())));
    if (!_.isEmpty(userGroup))
        dataRange= _.filter(dataRange, (row) => (_.contains(userGroup, row.br_user_group.toLowerCase())));
    if (acquisitionEra)
        dataRange = _.filter(dataRange, (row) => (acquisitionEra.test(row.acquisition_era.toLowerCase())));
    if (dataTier)
        dataRange = _.filter(dataRange, (row) => (dataTier.test(row.data_tier.toLowerCase())));

    //Find unique dates
    var uniqueDateRecords = _.uniq(dataRange, (row) => row.now);
    var uniqueDates = _.map(uniqueDateRecords, (row) => row.now);
    var uniqueDates = _.sortBy(uniqueDates, (row) => row.now);

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

        if(isSort){
            dataConcated = _.sortBy(dataConcated, (row) => row[indexOut]).reverse();
            isSort = false;
        }
    });
  
    type == "bar" ? saveJSON(dataConcated) : [];
 
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
        title: titleMod,
        values: {exponentformat: "SI"}
    };

    plotData("pie", chartData, layout, 0); 
    plotData("pie", chartData, layout, 1);
}

function buildBarChart() {
    chartData = filterData("bar");
    dateString = moment().add(-7, 'days').format('YYYY-MM-DD') + " - " + moment().add(-1, 'days').format('YYYY-MM-DD')  
    titleMod = chartData[0] ? dateString : dateString + " (No data found)"

    layout = {
        title: titleMod,
        xaxis: {title: "Date"},
        yaxis: {title: RESULTS[result], exponentformat: "SI"},
        barmode: "stack",
    };

    plotData("bar", chartData, layout, 0);
    plotData("bar", chartData, layout, 1);
}

function displayCharts() {
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
    q.awaitAll(function (error, results) {
        dataGlobal = _.flatten(results);
        callback();
    });   
}

function readData(callback) {
    var paths = [];
    var daysArray = getDates(chartDates[chartGroup]);
    _.each(daysArray, (day) => paths.push('br-sum-current/data/' + day));
    readMultiCsv(paths, callback);   
}
//HTML element events

function redrawCharts(){
    barDiv = $('.br-sum-bar[chart-group= "' + chartGroup + '"] > .plot')[0];
    pieDiv = $('.br-sum-pie[chart-group= "' + chartGroup + '"] > .plot')[0];

    barDiv.data = filterData("bar");
    pieDiv.data = filterData("pie");

    barDiv.layout.title = chartDates[chartGroup][0] + " - " + chartDates[chartGroup][1];
    pieDiv.layout.title = chartDates[chartGroup][1];
    barDiv.layout.yaxis.title = RESULTS[result];

    Plotly.redraw(barDiv);
    Plotly.redraw(pieDiv);
}

function reloadCharts(){
    if (loadData){
        readData( function(){
            redrawCharts();
        })
    } else {
        redrawCharts();
    }
}

$('#submit-sum-btn').click( function() {
    nodeKind = [];
    userGroup = [];

    loadData = false;
    key = $('#tab-key .active')[0].value;
    result = $('#tab-result .active')[0].value;
    chartGroup = parseInt($('#tab-group .active').attr("chart-group"));
    limit = parseInt($('#limit')[0].value);
    $('.filters-on[group="node"]').bootstrapSwitch('state') ? $.each($("#node-kind-sum option:selected"), function() {nodeKind.push($(this).val())}) : [];
    $('.filters-on[group="user"]').bootstrapSwitch('state') ? $.each($("#user-group-sum option:selected"), function() {userGroup.push($(this).val())}) : [];
    acquisitionEra = $('.filters-on[group="acquisition"]').bootstrapSwitch('state') ? new RegExp ($('#acquisition-era-sum')[0].value) : "";
    dataTier = $('.filters-on[group="data"]').bootstrapSwitch('state') ? new RegExp($('#data-tier-sum')[0].value) : "";
    
    startDate = moment($('#daterange').data('daterangepicker').startDate._d).format('YYYY-MM-DD');
    endDate = moment($('#daterange').data('daterangepicker').endDate._d).format('YYYY-MM-DD');
    if (chartDates[chartGroup][0] != startDate || chartDates[chartGroup][1] != endDate){
        loadData = true;
        chartDates[chartGroup][0] = startDate;
        chartDates[chartGroup][1] = endDate;
    }
    
    reloadCharts();
});

$('#reset-sum-btn').click( function() {
    $('#filters-combined')[0].reset();   
    $('#node-kind-sum').selectpicker('deselectAll');    
    $('#user-group-sum').selectpicker('deselectAll');
    $('#daterange').data('daterangepicker').setStartDate(moment().add(-7, 'days').format('YYYY-MM-DD'));
    $('#daterange').data('daterangepicker').setEndDate(moment().add(-1, 'days').format('YYYY-MM-DD'));
    $('#br-sum-filter .btn-group button:first-child').addClass('active').siblings().removeClass('active');    
});

$('.tab-menu button').click(function() {
    $(this).addClass('active').siblings().removeClass('active');
});

$('.json-btn').click(function() {
    localChartGroup = $(this).attr('chart-group');
    json = JSON.stringify(dataJSON[localChartGroup]);
    blob = new Blob([json], {type: "application/json"});
    url  = URL.createObjectURL(blob);

    a = $(this).children()[0];
    a.href = url;
    a.download = chartDates[localChartGroup][0] + "_" + chartDates[localChartGroup][1] + "_BR_Sum.json"; 
    a.click();
});

$(document).ready(function() {
    $('.filters-on').bootstrapSwitch('state', false);
    $("#daterange").daterangepicker({
        minDate: "2015-08-01",
        maxDate: moment(),
        format: 'YYYY-MM-DD',
        opens: "left",
        ranges: {
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    });
    readData(displayCharts);
});
//TODO Write function descriptions
