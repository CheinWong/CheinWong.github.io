// Set the dimensions and margins of the graph
let margin2 = { top: 10, right: 10, bottom: 10, left: 10 };
let width2 = 800 - margin2.left - margin2.right;
let height2 = 400 - margin2.top - margin2.bottom;

// Create the SVG container.
const svg2 = d3
  .select("#wordcloud")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", `0, 0, ${width2}, ${height2}`);

wordcloud_update();

function wordcloud_update() {
  svg2.selectAll("*").remove();

  fetchJsonFromFile("data/word_cloud.json")
    .then((jsonData) => {
      let combined_text = jsonData.join(" ");
      const sanitized_text = sanitize_text(combined_text);
      const word_counts = count_word_repetition(sanitized_text);

      let layout = d3.layout
        .cloud()
        .size([width2, height2])
        .words(
          Object.keys(word_counts).map(function (key) {
            return {
              text: key,
              size: word_counts[key],
              color: getRandomColor(),
            };
          })
        )
        .padding(2)
        .rotate(function () {
          return ~~(Math.random() * 2) * 90;
        })
        .font("Impact")
        .fontSize(function (d) {
          return d.size * 20;
        })
        .on("end", draw);

      layout.start();

      function draw(words) {
        svg2
          .append("g")
          .attr(
            "transform",
            "translate(" +
              layout.size()[0] / 2 +
              "," +
              layout.size()[1] / 2 +
              ")"
          )
          .selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", function (d) {
            return d.size + "px";
          })
          .style("fill", function (d) {
            return d.color;
          })
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function (d) {
            return d.text;
          });
      }
    })

    .catch((error) => {
      console.error("Error:", error);
    });
}
