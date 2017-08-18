services =  d3.csv("static/data/bucks/services.csv", function(error, data) {
                    console.log(data);

                    var dateFormat = d3.time.format("%Y-%m-%d");
                    var numberFormat = d3.format(",d");
                    
                    data.forEach(function (d) {
                        d.date = dateFormat.parse(d.date);          
		        });
                    bucksMakeGraphs(error, data);
            });   

abandon =  d3.csv("static/data/bucks/abandon.csv", function(error, data) {
                    console.log(data);

                    var dateFormat = d3.time.format("%Y-%m-%d");
                    var numberFormat = d3.format(",d");
                    
                    data.forEach(function (d) {
                        d.date = dateFormat.parse(d.date);          
		        });
                    bucksAbandonGraphs(error, data);
            });   

channel =  d3.csv("static/data/bucks/channel.csv", function(error, data) {
                    console.log(data);

                    var dateFormat = d3.time.format("%Y-%m-%d");
                    var numberFormat = d3.format(",d");
                    
                    data.forEach(function (d) {
                        d.date = dateFormat.parse(d.date);          
		        });
                    bucksChannelGraphs(error, data);
            });  

rejected = d3.csv("static/data/bucks/rejected.csv", function(error, data) {
                    console.log(data);

                    var dateFormat = d3.time.format("%Y-%m-%d");
                    var numberFormat = d3.format(",d");
                    
                    data.forEach(function (d) {
                        d.date = dateFormat.parse(d.date);          
		        });
                    bucksRejectedGraphs(error, data);
            });  

web_metrics = d3.csv("static/data/bucks/web_metrics.csv", function(error, data) {
                    console.log(data);

                    var dateFormat = d3.time.format("%Y-%m-%d");
                    var numberFormat = d3.format(",d");
                    
                    data.forEach(function (d) {
                        d.date = dateFormat.parse(d.date);          
		        });
                    bucksMetricsGraphs(error, data);
            });  
