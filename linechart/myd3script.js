/*
 * Name: Aylwin Sim 100074144
 */
function init(){

    // Margin
    var margin = {top: 50, right: 150, bottom: 50, left: 50};

    var widther = window.outerWidth-10;
    var heighther = 500;

    var w = widther - margin.left - margin.right,
        h = heighther - margin.top - margin.bottom;

    var dataset = [];
    var maxDomain = 1;

    var converter = 1000;

    var rowConverter = function(d){

        return {
          time: parseInt(d.time),
          speed: parseFloat(d.speed)
        };
    }

    d3.csv('../dataprototype/line-chart.csv', rowConverter)
      .then(function(data) {

        //dataset = data;

        for(var i = 0; i < data.length; i++){

            if (i%converter == 0){
               
        
                dataset.push(data[i]);   
            }
        }

        maxDomain = d3.max(dataset, function(d){
            
            return d.time;
        });

        maxDomain = maxDomain;

        console.log("Largest: " + maxDomain);

        var xScale = d3.scaleLinear()
        .domain([0, maxDomain])
        .range([0, w]);

        //xScale.domain(d3.extent(dataset, function(d) { return d.time; }));

        // Don't touch y scale
        var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d){
            return d.speed;
        })])
        .range([h, 0]);

        //yScale.domain(d3.extent(dataset, function(d) { return d; }));

        // Set up the SVG and Path
        var svg = d3.select("body")
            .append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // Add X-Axis 
        // (1) Add translate to align x-axis at the bottom
        var xAxis = d3.axisBottom(xScale).tickSize(-h).tickPadding(8).ticks(5);


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, "+ h + ")")
            .call(xAxis);

        var yAxis = d3.axisLeft(yScale).tickSize(-w).tickPadding(8).ticks(6);

        // Add Y-Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);


        // Data line
        var valueline = d3.line()
            .x(function(d) { return xScale(d.time); })
            .y(function(d) {  
                
                return yScale(d.speed); 
            })
            .curve(d3.curveMonotoneX);

        var path = svg.append("path")
            .datum(dataset);

        // hide graph over-width when adjust timeline
        var clip = svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", w)
            .attr("height", h);
    

        path.attr("clip-path", "url(#clip)")
            .attr("class", "line")
            .attr("d", valueline);

        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        //Adds circle to focus point on line
        focus.append("circle")
            .attr("r", 4);

        //Adds text to focus point on line    
        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");    


        //Creates larger area for tooltip   
        var overlay = svg.append("rect")
            .attr("class", "overlay")
            .attr("width", w)
            .attr("height", h)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        var bisectDate = d3.bisector(function(d){
            return d.time;
        }).left;

        //Tooltip mouseovers            
        function mousemove() { // (1) Read More ***
            var x0 = xScale.invert(d3.mouse(this)[0]),
                i = bisectDate(dataset, x0, 1),
                d0 = dataset[i-1],
                d1 = dataset[i],
                d = x0 - d0.time > d1.time - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + xScale(d.time) + "," + yScale(d.speed) + ")");
            focus.select("text").text(d.speed);
        };
        
        function zoom(begin, end) {

            xScale.domain([begin, end]);

            var t = svg.transition().duration(0);

            /*var size = end - begin;
            var step = size / 10;
            var ticks = [];
            for (var i = 0; i <= 10; i++) {
                ticks.push(Math.floor(begin + step * i));
            }

            xAxis.tickValues(ticks);*/


            t.select(".x.axis").call(xAxis);
            path.attr("d", valueline);
        }

        $(function() {
            $("#slider-range").slider({
                range: true,
                min: 0,
                max: maxDomain,
                values: [0, maxDomain], // Default value
                slide: function(event, ui) {
                    var begin = d3.min([ui.values[0], maxDomain]);
                    var end = d3.max([ui.values[1], 0]);
                    console.log("begin:", begin, "end:", end);
                    zoom(begin, end);
                }
                
            })
        });

        // RESPONSIVENESS
        d3.select(window).on("resize", resized);

        function resized() {

            w1 = window.outerWidth-10;


            // (1) Update xScale

            xScale.range([0, w1 - margin.left - margin.right]); // <- Scale knows value changes

            svg.select(".x.axis").call(xAxis);

            // (2) Update line chart
            d3.select("svg").attr("width", w1);

            valueline = d3.line()
            .x(function(d) { 
                return xScale(d.time); })
            .y(function(d) {  
                return yScale(d.speed); 
            })
            .curve(d3.curveMonotoneX);

            d3.select(".line").attr("d", valueline);

            // (3) Update yAxis
            yAxis.tickSize(-w1 +margin.right + margin.left);

            svg.select(".y.axis").call(yAxis);

            // (4) update invisible rectangle
            d3.selectAll("rect").attr("width", w1 - margin.left - margin.right);

            // (4) update mouseover


        }

    });



    

}

window.onload = init;
