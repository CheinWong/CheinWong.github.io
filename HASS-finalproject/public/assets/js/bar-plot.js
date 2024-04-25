// Set the dimensions and margins of the graph
let margin = { top: 0, right: 0, bottom: 0, left: 70 };
let width = 800 - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;

// Create the SVG container.
const svg = d3
  .select("#bar_plot")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", `0, 0, ${width}, ${height}`)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create scales and axes
var x = d3
  .scaleBand()
  .range([0, width - 70])
  .padding(0.2);
const xAxis = svg.append("g").attr("transform", `translate(0, ${height - 40})`);
var y = d3.scaleLinear().range([height - 40, 10]);
const yAxis = svg.append("g");

// Position the x-axis
svg
  .append("g")
  .selectAll("text")
  .attr("transform", "translate(3,5)")
  .style("text-anchor", "end");

// Position the y-axis
svg.append("g").attr("transform", `translate(0, 10)`);

let Tooltip = d3
  .select("#bar_plot")
  .append("div")
  .style("position", "absolute")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "5px");

function mouseover() {
  Tooltip.style("opacity", 1);
  d3.select(this).style("stroke", "black").style("opacity", 1);
}

function mouseleave() {
  Tooltip.style("opacity", 0);
  d3.select(this).style("stroke", "none").style("opacity", 1);
}

barplot_update("retweet_count");

function barplot_update(public_metrics) {
  d3.json("data/tweets_by_users.json")
    .then(function (data) {
      
      // Append x-axis label
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height - 5) // Adjust position as needed
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("Twitter X Post");

      // Append y-axis label
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2)
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("Counts");

      // X axis
      x.domain(d3.range(1, data.length + 1));
      xAxis.transition().duration(1000).call(d3.axisBottom(x));

      // Add Y axis
      y.domain([
        0,
        d3.max(data, function (d) {
          if (public_metrics == "retweet_count") {
            return d.public_metrics.retweet_count;
          }
          if (public_metrics == "reply_count") {
            return d.public_metrics.reply_count;
          }
          if (public_metrics == "like_count") {
            return d.public_metrics.like_count;
          }
          if (public_metrics == "quote_count") {
            return d.public_metrics.quote_count;
          }
          if (public_metrics == "bookmark_count") {
            return d.public_metrics.bookmark_count;
          }
          if (public_metrics == "impression_count") {
            return d.public_metrics.impression_count;
          }
        }),
      ]);
      yAxis.transition().duration(1000).call(d3.axisLeft(y));

      // Bars
      let update = svg.selectAll("rect").data(data);

      let color = getRandomColor();

      update
        .enter()
        .append("rect")
        .on("mouseover", mouseover)
        .on("mousemove", function (event, d) {
          let str = "";
          if (public_metrics == "retweet_count") {
            str = d.public_metrics.retweet_count + " retweets";
          }
          if (public_metrics == "reply_count") {
            str = d.public_metrics.reply_count + " replies";
          }
          if (public_metrics == "like_count") {
            str = d.public_metrics.like_count + " likes";
          }
          if (public_metrics == "quote_count") {
            str = d.public_metrics.quote_count + " quotes";
          }
          if (public_metrics == "bookmark_count") {
            str = d.public_metrics.bookmark_count + " bookmarks";
          }
          if (public_metrics == "impression_count") {
            str = d.public_metrics.impression_count + " impressions";
          }
          Tooltip.html(str)
            .style("left", event.pageX - 230 + "px")
            .style("top", event.pageY - 300 + "px")
            .style("opacity", 1);
        })
        .on("mouseleave", mouseleave)
        .transition()
        .duration(1000)
        .attr("x", function (d, i) {
          return x(++i);
        })
        .attr("y", function (d) {
          if (public_metrics == "retweet_count") {
            return y(d.public_metrics.retweet_count);
          }
          if (public_metrics == "reply_count") {
            return y(d.public_metrics.reply_count);
          }
          if (public_metrics == "like_count") {
            return y(d.public_metrics.like_count);
          }
          if (public_metrics == "quote_count") {
            return y(d.public_metrics.quote_count);
          }
          if (public_metrics == "bookmark_count") {
            return y(d.public_metrics.bookmark_count);
          }
          if (public_metrics == "impression_count") {
            return y(d.public_metrics.impression_count);
          }
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
          if (public_metrics == "retweet_count") {
            return height - 40 - y(d.public_metrics.retweet_count);
          }
          if (public_metrics == "reply_count") {
            return height - 40 - y(d.public_metrics.reply_count);
          }
          if (public_metrics == "like_count") {
            return height - 40 - y(d.public_metrics.like_count);
          }
          if (public_metrics == "quote_count") {
            return height - 40 - y(d.public_metrics.quote_count);
          }
          if (public_metrics == "bookmark_count") {
            return height - 40 - y(d.public_metrics.bookmark_count);
          }
          if (public_metrics == "impression_count") {
            return height - 40 - y(d.public_metrics.impression_count);
          }
        })
        .attr("fill", color);

      update
        .merge(update)
        .on("mouseover", mouseover)
        .on("mousemove", function (event, d) {
          let str = "";
          if (public_metrics == "retweet_count") {
            console.log("here");
            str = d.public_metrics.retweet_count + " retweets";
          }
          if (public_metrics == "reply_count") {
            str = d.public_metrics.reply_count + " replies";
          }
          if (public_metrics == "like_count") {
            str = d.public_metrics.like_count + " likes";
          }
          if (public_metrics == "quote_count") {
            str = d.public_metrics.quote_count + " quotes";
          }
          if (public_metrics == "bookmark_count") {
            str = d.public_metrics.bookmark_count + " bookmarks";
          }
          if (public_metrics == "impression_count") {
            str = d.public_metrics.impression_count + " impressions";
          }
          Tooltip.html(str)
            .style("left", event.pageX - 230 + "px")
            .style("top", event.pageY - 300 + "px")
            .style("opacity", 1);
        })
        .on("mouseleave", mouseleave)
        .transition()
        .duration(1000)
        .attr("x", function (d, i) {
          return x(++i);
        })
        .attr("y", function (d) {
          if (public_metrics == "retweet_count") {
            return y(d.public_metrics.retweet_count);
          }
          if (public_metrics == "reply_count") {
            return y(d.public_metrics.reply_count);
          }
          if (public_metrics == "like_count") {
            return y(d.public_metrics.like_count);
          }
          if (public_metrics == "quote_count") {
            return y(d.public_metrics.quote_count);
          }
          if (public_metrics == "bookmark_count") {
            return y(d.public_metrics.bookmark_count);
          }
          if (public_metrics == "impression_count") {
            return y(d.public_metrics.impression_count);
          }
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
          if (public_metrics == "retweet_count") {
            return height - 40 - y(d.public_metrics.retweet_count);
          }
          if (public_metrics == "reply_count") {
            return height - 40 - y(d.public_metrics.reply_count);
          }
          if (public_metrics == "like_count") {
            return height - 40 - y(d.public_metrics.like_count);
          }
          if (public_metrics == "quote_count") {
            return height - 40 - y(d.public_metrics.quote_count);
          }
          if (public_metrics == "bookmark_count") {
            return height - 40 - y(d.public_metrics.bookmark_count);
          }
          if (public_metrics == "impression_count") {
            return height - 40 - y(d.public_metrics.impression_count);
          }
        })
        .attr("fill", color);

      function getRandomColor() {
        // Generate random values for red, green, and blue components
        const r = Math.floor(Math.random() * 256); // Random integer between 0 and 255
        const g = Math.floor(Math.random() * 256); // Random integer between 0 and 255
        const b = Math.floor(Math.random() * 256); // Random integer between 0 and 255

        // Construct the hexadecimal color code
        const color =
          "#" +
          r.toString(16).padStart(2, "0") +
          g.toString(16).padStart(2, "0") +
          b.toString(16).padStart(2, "0");

        return color;
      }
    })
    .catch(function (error) {
      console.log("Error loading the data:", error);
    });
}
