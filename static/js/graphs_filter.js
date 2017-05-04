function makeGraphs(error, data) {
    
    var ndx2 = crossfilter(data);

    var timeDim = ndx2.dimension(function (d) {
        return d3.time.month(d["_id_StartDate"]);
    });
    

    //Define CAB metrics
    

    var numTimebyClients = timeDim.group().reduceSum(function (d) {
        return d["client_count"];
    });



    //Define values (to be used in charts)    
    var minTime = timeDim.bottom(1)[0]["_id_StartDate"];
    var maxTime = timeDim.top(1)[0]["_id_StartDate"];
    
    //Charts
    timeChart = dc.lineChart("#time-chart");
     

    
    timeChart
        .height(272)
        .width(675)
        .margins({
            top: 10,
            right: 40,
            bottom: 20,
            left: 50
        })
        .dimension(timeDim)
        .group(numTimebyClients)
        .transitionDuration(300)
        .colors(['#097F96'])
        .x(d3.time.scale().domain([minTime, maxTime]))
        .elasticY(true)
        .yAxis().ticks(3);

    
    
    dc.renderAll();

};