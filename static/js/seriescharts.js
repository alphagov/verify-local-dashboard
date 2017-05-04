function makeGraphs(error, data) {
// charts
var time_chart = dc.seriesChart("#ser-chart");

var coerce_row = function(d){
    return {
        time: d.date,
        field: d.variable,
        count: +d.value,
    };
};

var dataset = data.map(coerce_row);

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
    .dimension(time_field)
    .group(time_fields)
    .seriesAccessor(function(d) { return d.key[1]; })
    .keyAccessor(function(d) {return d.key[0];})
    .elasticY(true)
    .elasticX(true)
    .xAxisLabel("Date (weekly)")
    .yAxisLabel("Successful applications")
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

function abandonGraphs(error, data) {
// charts
    var abandon_chart = dc.seriesChart("#abandon-chart");

    var coerce_row = function(d){
    return {
        time: d.date,
        field: d.variable,
        count: +d.value,
    };
};

    var dataset = data.map(coerce_row);

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

    abandon_chart
        .width(928)
        .height(400)
        .dimension(time_field)
        .group(time_fields)
        .seriesAccessor(function(d) { return d.key[1]; })
        .keyAccessor(function(d) {return d.key[0];})
        .elasticY(true)
        .elasticX(true)
        .xAxisLabel("Date (weekly)")
        .yAxisLabel("Numbers that either used GOV.UK Verify, legacy or abandonded")
        // .x(d3.scale.linear().domain([minTime,maxTime]))
        .x(d3.time.scale().domain([minTime,maxTime]))
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .legend(dc.legend().x(55).y(26).itemHeight(13).gap(5))
        .ordinalColors(['#097F96','#662E91','#D6007D'])
        .brushOn(false)
        .yAxis().ticks(5);
    dc.renderAll();
};

function channelGraphs(error, data) {
// charts
    var channel_chart = dc.seriesChart("#channel-chart");

    var coerce_row = function(d){
        return {
            time: d.date,
            field: d.variable,
            count: +d.value,
        };
    };

    var dataset = data.map(coerce_row);

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

    channel_chart
        .width(928)
        .height(400)
        .dimension(time_field)
        .group(time_fields)
        .seriesAccessor(function(d) { return d.key[1]; })
        .keyAccessor(function(d) {return d.key[0];})
        .elasticY(true)
        .elasticX(true)
        .xAxisLabel("Date (weekly)")
        .yAxisLabel("Channel breakdown")
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

function rejectedGraphs(error, data) {
// charts
    var rejected_chart = dc.seriesChart("#rejected-chart");

    var coerce_row = function(d){
        return {
            time: d.date,
            field: d.variable,
            count: +d.value,
        };
    };

    var dataset = data.map(coerce_row);

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

    rejected_chart
        .width(928)
        .height(400)
        .dimension(time_field)
        .group(time_fields)
        .seriesAccessor(function(d) { return d.key[1]; })
        .keyAccessor(function(d) {return d.key[0];})
        .elasticY(true)
        .elasticX(true)
        .xAxisLabel("Date (weekly)")
        .yAxisLabel("Reasons for rejected applications")
        // .x(d3.scale.linear().domain([minTime,maxTime]))
        .x(d3.time.scale().domain([minTime,maxTime]))
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .legend(dc.legend().x(55).y(26).itemHeight(13).gap(5))
        .ordinalColors(['#097F96','#662E91','#D6007D','#112684','#5E7F00','#097F96'])
        .brushOn(false)
        .yAxis().ticks(5);
    dc.renderAll();
};

function metricsGraphs(error, data) {

    var visitsND = dc.numberDisplay("#visits"),
        uniqueVistorsND = dc.numberDisplay('#unique-visitors'),
        pageviewsND = dc.numberDisplay('#pageviews'),
        averageTimeOnPageND = dc.numberDisplay('#average-time-on-page')

    var ndx = crossfilter(data),
          visitsDim   = ndx.dimension(function(d) {return d.Visits;})
          visitsGroup = ndx.groupAll().reduce(
              function (p, v) {
                  ++p.n;
                  p.tot += v.visitsN;
                  return p;
              },
              function (p, v) {
                  --p.n;
                  p.tot -= v.visitsN;
                  return p;
              },
              function () { return {n:0,tot:0}; }
          );

          uniqueVistorsGroup = ndx.groupAll().reduce(
              function (p, v) {
                  ++p.n;
                  p.tot += v.unique_visitorsN;
                  return p;
              },
              function (p, v) {
                  --p.n;
                  p.tot -= v.unique_visitorsN;
                  return p;
              },
              function () { return {n:0,tot:0}; }
          );
          pageviewsGroup = ndx.groupAll().reduce(
              function (p, v) {
                  ++p.n;
                  p.tot += v.pageviewsN;
                  return p;
              },
              function (p, v) {
                  --p.n;
                  p.tot -= v.pageviewsN;
                  return p;
              },
              function () { return {n:0,tot:0}; }
          );
          averageTimeOnPageGroup = ndx.groupAll().reduce(
              function (p, v) {
                  ++p.n;
                  p.tot += v.average_time_on_pageN;
                  return p;
              },
              function (p, v) {
                  --p.n;
                  p.tot -= v.average_time_on_pageN;
                  return p;
              },
              function () { return {n:0,tot:0}; }
          );
  // var average = function(d) {
  //     return d.n ? d.tot / d.n : 0;
  // };

  var visitsNum = function(d) {
      return d.tot;
  };
  var uniqueVisitorsNum = function(d) {
      return d.tot;
  };
  var pageviewsNum = function(d) {
      return d.tot;
  };
  var averageTimeOnPageNum = function(d) {
      return d.tot;
  };
      visitsND
          // .valueAccessor(runDimension)
          .valueAccessor(visitsNum)
          // .dimension(runDimension)
          .group(visitsGroup);

      uniqueVistorsND
          // .valueAccessor(runDimension)
          .valueAccessor(uniqueVisitorsNum)
          // .dimension(runDimension)
          .group(uniqueVistorsGroup);

    pageviewsND
          // .valueAccessor(runDimension)
          .valueAccessor(pageviewsNum)
          // .dimension(runDimension)
          .group(pageviewsGroup);

    averageTimeOnPageND
          // .valueAccessor(runDimension)
          .valueAccessor(averageTimeOnPageNum)
          // .dimension(runDimension)
          .group(averageTimeOnPageGroup);

dc.renderAll();


};

