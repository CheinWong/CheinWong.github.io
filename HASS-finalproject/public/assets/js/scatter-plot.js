// Set the dimensions and margins of the graph
let margin1 = { top: 0, right: 0, bottom: 0, left: 50 };
let width1 = 800 - margin1.left - margin1.right;
let height1 = 400 - margin1.top - margin1.bottom;

// append the svg object to the body of the page
let svg1 = d3
  .select("#scatterplot")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", `0, 0, ${width1}, ${height1}`)
  .append("g")
  .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

// Parse the date/time strings into JavaScript Date objects
const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
const formatTime = d3.timeFormat("%d/%m/%y");

scatterplot_update();

function scatterplot_update() {
  svg1.selectAll("*").remove();
  d3.json("data/tweet_volume_by_hour.json")
  .then(function (data) {
    
    // Convert the date/time strings to JavaScript Date objects
    data.forEach(function(d) {
      d.start = parseTime(d.start);
      d.end = parseTime(d.end);
    });

    // Add X axis
    let x = d3.scaleUtc()
              .domain(d3.extent(data, function(d) { return d.start; }))
              .range([0, width1-51]);
    let xAxis = svg1
                  .append("g")
                  .attr("transform", "translate(0," + (height1 - 50) + ")")
                  .call(d3.axisBottom(x).tickFormat(formatTime).tickPadding(10).tickSize(5))
                 
    // Add Y axis
    let y = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return (d.tweet_count); })])
                .range([height1-50, 10]);
    let yAxis = svg1
                  .append("g")
                  .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    let clip = svg1.append("defs").append("svg1:clipPath")
                      .attr("id", "clip")
                      .append("svg1:rect")
                      .attr("width", width1 )
                      .attr("height", height1-50 )
                      .attr("x", 0)
                      .attr("y", 0);
    
    // Append x-axis label
    svg1.append("text")
      .attr("x", width1 / 2)
      .attr("y", (height1 - 5)) // Adjust position as needed
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .text("Date & Time");

    // Append y-axis label
    svg1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height1 / 2))
        .attr("y", 0 - margin1.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("Tweet Counts");
  

    // Create the scatter variable: where both the circles and the brush take place
    let scatter = svg1.append('g')
                        .attr("clip-path", "url(#clip)")
  
    // Add circles
    scatter
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .transition()
        .duration(1000)
        .attr("cx", function (d) { return x(d.start); } )
        .attr("cy", function (d) { return y(d.tweet_count); } )
        .attr("r", 8)
        .style("fill", getRandomColor())
        .style("opacity", 0.5)
        
    
    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    let zoom = d3.zoom()
      .scaleExtent([0.5, 4])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([[0, 0], [width1, height1]])
      .on("zoom", update_chart);

    svg1.append("rect")
      .attr("width", width1)
      .attr("height", height1)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('transform', 'translate(' + margin1.bottom + ',' + margin1.top + ')')
      .call(zoom);
    
  
    // A function that updates the chart when the user zoom and thus new boundaries are available
    function update_chart(event) {

      // recover the new scale
      let newX = event.transform.rescaleX(x);
      let newY = event.transform.rescaleY(y);

      // update axes with these new boundaries
      xAxis.call(d3.axisBottom(newX))
      yAxis.call(d3.axisLeft(newY))

      // update circle position
      scatter
        .selectAll("circle")
        .attr('cx', function(d) {return newX(d.start)})
        .attr('cy', function(d) {return newY(d.tweet_count)});
      
    }
    })
    .catch(function (error) {
      console.log("Error loading the data:", error);
    });

    
}

