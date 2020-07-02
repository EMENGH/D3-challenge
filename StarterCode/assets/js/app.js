// Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 600;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 150
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select html id where graphic will appear, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append group to SVG area and shift "translate" it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(smokeAgeData) {

    console.log(smokeAgeData);
    // Step 1: Parse Data/Cast as numbers
    smokeAgeData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
    });
  
    // Step 2: Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([29, d3.max(smokeAgeData, d => d.age) + 2]).range([0, width]);
  
    var yLinearScale = d3.scaleLinear()
        .domain([8, d3.max(smokeAgeData, d => d.smokes) + 2]).range([height, 0]);

    
    // Step 3: Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // Step 4: Append Axes to the chart
    chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
  
    chartGroup.append("g").call(leftAxis);
  
    // Step 5: Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(smokeAgeData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.age))
      .attr("cy", d => yLinearScale(d.smokes))
    
      .attr("r", "14")
      .attr("fill", "maroon")    
      .attr("border-color", "white")
      .attr("opacity", ".4");
  
    // Step 6: Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([70, -55])
      .style("background-color", "maroon")
      .style("color", "white")
      .style("text-align", "center")
      .html(function(d) {
          return (`${d.state}<br>Age: ${d.age}<br>Smokes: ${d.smokes}`);
      });
  
    // Step 7: Create tooltip in the chart
    chartGroup.call(toolTip);
  
    // Step 8: Create event listeners to display and hide the tooltip

    circlesGroup.on("mouseover    ", function(data) {
      toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
    // insert labels inside the circles
    var circleLabels = chartGroup.selectAll(null).data(smokeAgeData).enter().append("text");

    circleLabels
      .attr("x", function(d) {
         return xLinearScale(d.age);
      })
      .attr("y", function(d) {
         return yLinearScale(d.smokes);
      })
      .text(function(d) {
         return d.abbr;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("fill", "black");
        
    // Specify labels for both axels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 0)
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("id", "axisText")
      .text("Smokes");
  
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("id", "axisText")
      .text("Age");
    }).catch(function(error) {
          console.log(error);
});
    
