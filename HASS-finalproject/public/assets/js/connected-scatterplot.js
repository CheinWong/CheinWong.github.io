// Set the dimensions and margins of the graph
let margin5 = { top: 0, right: 50, bottom: 0, left: 50 };
let width5 = 800 - margin5.left - margin5.right;
let height5 = 400 - margin5.top - margin5.bottom;

// append the svg object to the body of the page
let svg5 = d3
  .select("#connected_scatterplot")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", `0, 0, ${width5}, ${height5}`)
  .append("g")
  .attr("transform", "translate(" + margin5.left + "," + margin5.top + ")");

// create a tooltip
let Tooltip5 = d3
  .select("#connected_scatterplot")
  .append("div")
  .style("position", "absolute")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px");

let mouseover5 = function (d) {
  Tooltip5.style("opacity", 1);
};

let mouseleave5 = function (d) {
  Tooltip5.style("opacity", 0);
};

connected_scatterplot_update();

function connected_scatterplot_update() {
  d3.json("data/tweets_by_users.json")
    .then(function (data) {
      let all_metrics = ["Retweet", "Reply", "Like", "Quote", "Bookmark"];

      let dataReady = all_metrics.map(function (group_name) {
        return {
          name: group_name,
          values: data.map(function (d, index) {
            if(d.public_metrics.impression_count == 0) {
              return {
                post: ++index,
                value: 0,
              };
            }
            if (group_name == "Retweet") {
              return {
                post: ++index,
                value:
                  (d.public_metrics.retweet_count /
                    d.public_metrics.impression_count) *
                  100,
              };
            }
            if (group_name == "Reply") {
              return {
                post: ++index,
                value:
                  (d.public_metrics.reply_count /
                    d.public_metrics.impression_count) *
                  100,
              };
            }
            if (group_name == "Like") {
              return {
                post: ++index,
                value:
                  (d.public_metrics.like_count /
                    d.public_metrics.impression_count) *
                  100,
              };
            }
            if (group_name == "Quote") {
              return {
                post: ++index,
                value:
                  (d.public_metrics.quote_count /
                    d.public_metrics.impression_count) *
                  100,
              };
            }
            if (group_name == "Bookmark") {
              return {
                post: ++index,
                value:
                  (d.public_metrics.bookmark_count /
                    d.public_metrics.impression_count) *
                  100,
              };
            }
          }),
        };
      });
      // console.log(dataReady);

      // A color scale: one color for each group
      let my_color = d3
        .scaleOrdinal()
        .domain(all_metrics)
        .range(d3.schemeCategory10);

      // Add X axis
      let x = d3
        .scaleLinear()
        .domain([1, data.length])
        .range([0, width - 100]);
      svg5
        .append("g")
        .attr("transform", "translate(0," + (height5 - 40) + ")")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x));

      // Add Y axis
      let y = d3
        .scaleLinear()
        .domain([0, 3])
        .range([height5 - 40, 10]);
      svg5.append("g").transition().duration(1000).call(d3.axisLeft(y));

      // Append x-axis label
      svg5
        .append("text")
        .attr("x", width5 / 2)
        .attr("y", height5 - 5) // Adjust position as needed
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("Twitter X Post");

      // Append y-axis label
      svg5
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height5 / 2)
        .attr("y", 0 - margin5.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("Engagement Rate (%)");

      // Add the lines
      let line = d3
        .line()
        .x(function (d) {
          return x(+d.post);
        })
        .y(function (d) {
          return y(+d.value);
        });

      svg5
        .selectAll("myLines")
        .data(dataReady)
        .enter()
        .append("path")
        .attr("class", function (d) {
          return d.name;
        })
        .attr("d", function (d) {
          return line(d.values);
        })
        .attr("stroke", function (d) {
          return my_color(d.name);
        })
        .style("stroke-width", 3)
        .style("fill", "none");

      svg5
        // First we need to enter in a group
        .selectAll("myDots")
        .data(dataReady)
        .enter()
        .append("g")
        .style("fill", function (d) {
          return my_color(d.name);
        })
        .attr("class", function (d) {
          return d.name;
        })

        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints")
        .data(function (d) {
          return d.values;
        })
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return x(d.post);
        })
        .attr("cy", function (d) {
          return y(d.value);
        })
        .attr("r", 5)
        .attr("stroke", "white")
        .on("mouseover", mouseover5)
        .on("mousemove", function (event, d) {
          Tooltip5.html("Engagement Rate (%) <br>" + d.value.toFixed(2))
            .style("left", event.pageX - 220 + "px")
            .style("top", event.pageY - 950 + "px");
        })
        .on("mouseleave", mouseleave5);

      // Add a label at the end of each line
      svg5
        .selectAll("myLabels")
        .data(dataReady)
        .enter()
        .append("g")
        .append("text")
        .attr("class", function (d) {
          return d.name;
        })
        .datum(function (d) {
          return { name: d.name, value: d.values[d.values.length - 1] };
        }) // keep only the last value of each time series
        .attr("transform", function (d) {
          return (
            "translate(" + x(d.value.post - 1) + "," + y(d.value.value) + ")"
          );
        }) // Put the text at the position of the last point
        .attr("x", 10) // shift the text a bit more right
        .attr("y", -10)
        .text(function (d) {
          return d.name;
        })
        .style("fill", function (d) {
          return my_color(d.name);
        })
        .style("font-size", 10);

      svg5
        .selectAll("myLegend")
        .data(dataReady)
        .enter()
        .append("g")
        .append("text")
        .attr("x", width5 - 150)
        .attr("y", function (d, i) {
          return 20 + i * 15;
        })
        .text(function (d) {
          return d.name;
        })
        .style("fill", function (d) {
          return my_color(d.name);
        })
        .style("font-size", 10)
        .on("click", function (event, d) {
          // is the element currently visible ?
          currentOpacity = d3.selectAll("." + d.name).style("opacity");
          // Change the opacity: from 0 to 1 or from 1 to 0
          d3.selectAll("." + d.name)
            .transition()
            .duration(1000)
            .style("opacity", currentOpacity == 1 ? 0 : 1);
        });
    })
    .catch(function (error) {
      console.log("Error loading the data:", error);
    });
}
