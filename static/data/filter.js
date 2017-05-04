var csv = [
        {Continents:"South Asia", Function:"Function1", Value:0},
        {Continents:"South Asia", Function:"Function2", Value:14},
        {Continents:"Europe", Function:"Function1", Value:0},
        {Continents:"Europe", Function:"Function2", Value:12},
        {Continents:"Europe", Function:"Function3", Value:2},
    ];


    var ndx = crossfilter( csv );

    var filterValues = ndx.dimension(
            function( d )
            {
                return d["Value"];
            } ).filter(
            function( d )
            {
                if( 0 < Math.abs( d ) )
                    return d;
            } );

    var functions = ndx.dimension( function( d )
    {
        return d["Function"];
    } );
    var functionAmountGroup = functions.group().reduceSum( function ( d )
    {
        return d["Value"];
    } );

var filteredFunctionAmountGroup = {
    all: function () {
        return functionAmountGroup.top(Infinity).filter( function (d) { return d.value !== 0; } );
    }
}

    // Create bar chart
    var functionChart = dc.rowChart( "#function-chart" )
            .width( 400 )
            .height( 200 )
            .dimension( functions )
//            .group( functionAmountGroup )
            .group( filteredFunctionAmountGroup )
            .colors( d3.scale.category20() )
            .elasticX( true )
            .xAxis();

    dc.renderAll();