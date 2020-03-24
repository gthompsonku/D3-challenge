// @TODO: YOUR CODE HERE!
console.log("Hello from target appzz");


//Define SVG area
var svgWidth = 960;
var svgHeight = 500;

//Define chart's margins
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

//Define dimensions of the chart area 
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

//Create and append SVG wrapper
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

//Append chart group to the SVG and shift it to adhere to the margins set in chartMargin object
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

//Load data from data.csv
d3.csv("assets/data/data.csv").then(function(stateData) {
    console.log(stateData);

    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    //Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(stateData, d => d.poverty)])
        .range([0, chartWidth]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.healthcare)])
        .range([chartHeight, 0]);

    //Axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //Create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".60");
    
    //State abbreviation inside plot dots 
    chartGroup.selectAll(null)
        .data(stateData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .text(function(d) {
            console.log(`${d.abbr}`);
            return (`${d.abbr}`);
        })
        .attr("font-size", "10px")
        .attr("fill", "white")
        .attr("text-anchor", "middle");



    //tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([65, -20])
        .html(function(d) {
            return (`${d.abbr}`);
        });

    chartGroup.call(toolTip);


    //Event listeners for tooltip
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function(data, index){
            toolTip.hide(data);
        });
    
    //Axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
    }).catch(function(error) {
        console.log(error);
});
