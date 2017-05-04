function makeGraphs(error, data) {

	// timeChart = dc.lineChart("#time-chart");
    // chart = dc.seriesChart("#ser-chart");

   var ndx2 = crossfilter(data);

   var timeDim = ndx2.dimension(function (d) {
        return +d3.time.week(d["Date"]);
    });

   serDim = ndx2.dimension(function(d) {return [+d.type, +d.Date]; });

   var serNum = timeDim.group().reduceSum(function(d) {
   	return +d.count;
   })

   chart = dc.seriesChart('ser-chart');


   var minTime = timeDim.bottom(1)[0]["Date"];
   var maxTime = timeDim.top(1)[0]["Date"];

   chart
    .width(768)
    .height(480)
    .chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
    .x(d3.scale.linear().domain([minTime,maxTime]))
    .brushOn(false)
    .yAxisLabel("Count")
    .xAxisLabel("Month")
    .clipPadding(10)
    .elasticY(true)
    .dimension(serDim)
    .group(serNum)
    .mouseZoomable(true)
   .seriesAccessor(function(d) {
   	return "type: " + d.key[0];
   })
    .keyAccessor(function(d) {
    	return +d.key[1];
    })
    .valueAccessor(function(d) {
    	return +d.value;
    })
    .legend(dc.legend().x(350).y(350).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70));
  chart.yAxis().tickFormat(function(d) {return d3.format(',d')(d+299500);});
  chart.margins().left += 40;
  dc.renderAll();


};