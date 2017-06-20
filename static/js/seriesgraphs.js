function makeGraphs(error, data) {
    // var LOCALDB = LOCALDB;
    // timeChart = dc.lineChart("#time-chart");
    // serChart = dc.seriesChart("#ser-chart");
    console.log("data in makeGraphs: " + data)

    var ndx2                 = crossfilter(data);

    var timeDim = ndx2.dimension(function (d) {
        return d3.time.monday(d["Date"]);
    });
    var minTime = timeDim.bottom(1)[0]["Date"];
    var maxTime = timeDim.top(1)[0]["Date"];

    // Reusable variable accessors
    var dateAccessor = function(d) {
        return d3.time.format.iso.parse(d.date);
    };
    var typeAccessor = function(d) {
        return d.type;  
    };
    var countAccessor = function(d) {
        return +d.count;
    };
    // Advanced reduce functions
    var reduceSumInit = function() {
        return function() {
            return {};   
        };
    };
    var reduceSumAdd = function(dimensionAccessor, reducerAccessor) {
        return function(p, v) {
            var dimValue = dimensionAccessor(v);
            p[dimValue] = (p[dimValue] || 0) + reducerAccessor(v);
            return p;
        };
    };
    var reduceSumRemove = function(dimensionAccessor, reducerAccessor) {
        return function(p, v) {
            var dimValue = dimensionAccessor(v);
            p[dimValue] = (p[dimValue] || 0) - reducerAccessor(v);
            return p;
        };
    };

    // Custom data function explodes the data
    var dataFunction = function(group) {
        var all = group.all();
        return all.reduce(function(previous, current) {
            for(var k in current.value) {
                previous.push({
                    key: current.key,
                    value: [k, current.value[k]]
                });
            }
            return previous;
        }, []);
    };

    // Crossfilter basics
    var ndx = crossfilter(data),
        all = ndx.groupAll(),
        runDimension1 = ndx.dimension(dateAccessor),
        runDimension2 = ndx.dimension(dateAccessor),
        runDimension3 = ndx.dimension(dateAccessor),
        serGroup = runDimension1.group().reduce(
            reduceSumAdd(typeAccessor, countAccessor),
            reduceSumRemove(typeAccessor, countAccessor),
            reduceSumInit());

    // Magnitude Chart
    var magnitudeChart = dc.seriesChart("#ser-chart")
        .width(625)
        .height(272)
        .chart(function (c) {
            return dc.lineChart(c).interpolate("basis");
        })
        .data(dataFunction)
        .x(d3.time.scale().domain([minTime, maxTime]))
        .y(d3.scale.linear().domain([50, 100]))
        .yAxisLabel("Count")
        .xAxisLabel("Date")
        .brushOn(true)
        .elasticY(true)
        .mouseZoomable(true)
        .dimension(runDimension1)
        .group(serGroup)
        .seriesAccessor(function (d) {
            return +d.value[0];
        })
        .keyAccessor(function (d) {
            return +d.key;
        })
        .valueAccessor(function (d) {
            return +d.value[1];
        })
        .legend(dc.legend()
            .x(610)
            .y(250)
            .itemHeight(13)
            .gap(5)
            .horizontal(1)
            .legendWidth(140)
            .itemWidth(70)
        );

        dc.dataCount("#dc-data-count")
            .dimension(ndx)
            .group(all);

        dc.renderAll();
};
