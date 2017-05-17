function makeGraphs(error, data,divid,) {
// charts
var time_chart = dc.seriesChart("#ser-chart");

var coerce_row = function(d){
    return {
        time: d.date,
        field: d.variable,
        count: +d.value,
        module: d.module
    };
};




// var coerce_row = function(d){
//     return {
//         time: new Date(d[0]),
//         field: d[1],
//         count: +d[2],
//     };
// };

var dataset = data.map(coerce_row);
console.log(dataset)
var addC = function(p, d){ return p + d.count;},
    remC = function(p, d){ return p - d.count;},
    // addT = function(p, d){ return p + d.temperature;},
    // remT = function(p, d){ return p - d.temperature;},
    ini = function(){ return 0;},
    ndx = crossfilter(dataset),
    all = ndx.groupAll().reduce(addC, remC, ini),
    fields = ndx.dimension(function(d){ return d.field;}).group(),
    time_field = ndx.dimension(function(d) { return [d.time, d.field];}),
    time_fields = time_field.group().reduce(addC, remC, ini);


function remove_empty_bins(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                if (d.module == '#VerifyLocal [Service] performance dashboard'){
                                    return {date:d.date,variable:d.variable,value:d.value};
                                    };
            });
        }
    };
};


var services = remove_empty_bins(time_fields);

    // temperature = ndx.dimension(function(d){return d.temperature;}),
    // temperatures = temperature.group().reduce(addC, remC, ini);
    // extent = d3.extent(dataset, function(d){return d.time;}),

var timeDim = ndx.dimension(function (d) {
    return d3.time.week(d.time);
});
var minTime = timeDim.bottom(1)[0]["time"];
var maxTime = timeDim.top(1)[0]["time"];
console.log(minTime + " : " +maxTime)
    // date_format = d3.time.format("%b %d %I:%M %p"),

// d3.select("#date-start")
//     .attr("datetime", extent[0])
//     .text(date_format(extent[0]));
// d3.select("#date-end")
//     .attr("datetime", extent[1])
//     .text(date_format(extent[1]));

dc.dataCount("#data-count")
// Since the number of records (returned by .size()) isn't the same as the number
// of data points we're aggregating, supply a size-like object that returns the
// total number of data points represented.
    .dimension({size: function(){return dataset.reduce(addC, 0);}})
    .group(all);

time_chart
    .width(928)
    .height(400)
    .dimension(services)
    .group(time_fields)
    .seriesAccessor(function(d) { return d.key[1]; })
    .keyAccessor(function(d) {return d.key[0];})
    .elasticY(true)
    .elasticX(true)
    .xAxisLabel("Date (weekly)")
    .yAxisLabel("Successful applications (by channel)")
    // .x(d3.scale.linear().domain([minTime,maxTime]))
    .x(d3.time.scale().domain([minTime,maxTime]))
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .legend(dc.legend().x(55).y(26).itemHeight(13).gap(5))
    .ordinalColors(['#097F96','#662E91','#D6007D','#112684','#5E7F00'])
    .brushOn(false)
    .yAxis().ticks(5);

dc.renderAll();
};