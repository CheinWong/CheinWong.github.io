// // Set the dimensions and margins of the graph
let margin6 = { top: 0, right: 0, bottom: 0, left: 0 };
let width6 = 800 - margin6.left - margin6.right;
let height6 = 400 - margin6.top - margin6.bottom;
let radius = Math.min(width6, height6) / 2;

// append the svg object to the body of the page
let svg6 = d3
  .select("#donutchart")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", `0, 0, ${width6}, ${height6}`)
  .append("g")
  .attr("transform", "translate(" + width6 / 2 + "," + height6 / 2 + ")");

svg6.append("g").attr("class", "slices");
svg6.append("g").attr("class", "labels");
svg6.append("g").attr("class", "lines");

let pie = d3
  .pie()
  .sort(null)
  .value(function (d) {
    return d.value;
  });

var arc = d3
  .arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.4);

var outerArc = d3
  .arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);

var color = d3
  .scaleOrdinal()
  .domain(["Positive", "Neutral", "Negative"])
  .range([getRandomColor(), getRandomColor(), getRandomColor()]);

donut_chart_update();

function donut_chart_update() {
  change();
  change();
}

function change() {

  d3.json("data/sentiments.json")
    .then(function (data) {
      // console.log(data);

      let slice = svg6
        .select(".slices")
        .selectAll("path.slice")
        .data(pie(data), data.label);

      slice
        .enter()
        .append("path")
        .style("fill", function (d) {
          return color(d.data.label);
        })
        .attr("class", "slice");

      slice
        .transition()
        .duration(1000)
        .attrTween("d", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            return arc(interpolate(t));
          };
        });

      slice.exit().remove();

      /* ------- TEXT LABELS -------*/

      let text = svg6
        .select(".labels")
        .selectAll("text")
        .data(pie(data), data.label);

      text
        .enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function (d) {
          let percent = d.data.value * 100;
          let str = `${d.data.label} ${percent.toFixed(2)}%`;
          return str;
        });

      function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
      }

      text
        .transition()
        .duration(1000)
        .attrTween("transform", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            return "translate(" + pos + ")";
          };
        })
        .styleTween("text-anchor", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            var d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start" : "end";
          };
        })
        .text(function (d) {
          let percent = d.data.value * 100;
          let str = `${d.data.label} ${percent.toFixed(2)}%`;
          return str;
        });

      text.exit().remove();

      /* ------- SLICE TO TEXT POLYLINES -------*/

      let polyline = svg6
        .select(".lines")
        .selectAll("polyline")
        .data(pie(data), data.label);

      polyline.enter().append("polyline");

      polyline
        .transition()
        .duration(1000)
        .attrTween("points", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });

      polyline.exit().remove();
    })
    .catch(function (error) {
      console.log("Error loading the data:", error);
    });
}
