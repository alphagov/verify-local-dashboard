services =  d3.csv("static/data/buckinghamshire_services.csv", function(error, data) {
                    console.log(data);

                    var dateFormat = d3.time.format("%Y-%m-%d");
                    var numberFormat = d3.format(",d");
                    
                    data.forEach(function (d) {
                        d.date = dateFormat.parse(d.date);          
		        });
                    makeGraphs(error, data);
            });   

abandon =  d3.csv("static/data/buckinghamshire_abandon.csv", function(error, data) {
                    console.log(data);

                    var dateFormat = d3.time.format("%Y-%m-%d");
                    var numberFormat = d3.format(",d");
                    
                    data.forEach(function (d) {
                        d.date = dateFormat.parse(d.date);          
		        });
                    abandonGraphs(error, data);
            });   

channel =  d3.csv("static/data/buckinghamshire_channel.csv", function(error, data) {
                    console.log(data);

                    var dateFormat = d3.time.format("%Y-%m-%d");
                    var numberFormat = d3.format(",d");
                    
                    data.forEach(function (d) {
                        d.date = dateFormat.parse(d.date);          
		        });
                    channelGraphs(error, data);
            });  

rejected = d3.csv("static/data/buckinghamshire_rejected.csv", function(error, data) {
                    console.log(data);

                    var dateFormat = d3.time.format("%Y-%m-%d");
                    var numberFormat = d3.format(",d");
                    
                    data.forEach(function (d) {
                        d.date = dateFormat.parse(d.date);          
		        });
                    rejectedGraphs(error, data);
            });  

web_metrics = d3.csv("static/data/buckinghamshire_web_metrics.csv", function(error, data) {
                    console.log(data);

                    var dateFormat = d3.time.format("%Y-%m-%d");
                    var numberFormat = d3.format(",d");
                    
                    data.forEach(function (d) {
                        d.date = dateFormat.parse(d.date);          
		        });
                    metricsGraphs(error, data);
            });  
