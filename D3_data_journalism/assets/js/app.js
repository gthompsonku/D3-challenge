
//Define SVG area
var svgWidth = 960;
var svgHeight = 600;

//Define chart's margins
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 120,
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

    //Create scales 
    var xLinearScale = updateXScale(stateData, selectedXAxis); 
    var yLinearScale = updateYScale(stateData, selectedYAxis);

    //Create axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append axes to chart
    var xAxis = chartGroup.append("g")
        .classed('x-axis', true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed('y-axis', true)
        .call(leftAxis);

    //Create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .classed('stateCircle', true)
        .attr("cx", d => xLinearScale(d[selectedXAxis]))
        .attr("cy", d => yLinearScale(d[selectedYAxis]))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".60");
    
    //State abbreviation inside plot dots 
    var dotLabels = chartGroup.selectAll(null)
        .data(stateData)
        .enter()
        .append("text")
        .classed('stateText', true)
        .attr("x", d => xLinearScale(d[selectedXAxis]))
        .attr("y", d => yLinearScale(d[selectedYAxis]))
        .text(d => d.abbr)
        .attr("font-size", "10px")
        .attr("fill", "white");
        //.attr("text-anchor", "middle")

    /* /tooltip
  
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
    

    */

    //Axes labels

    var yLabelsGroup = chartGroup.append("g");

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 50)
        .attr("x", 0 - (chartHeight /2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .classed('inactive', false)
        .classed('active', true)
        .text("Lacks Healthcare (%)")
        .attr("text-anchor", "middle")
        .attr("value", "healthcare");
    
    var smokesLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 25)
        .attr("x", 0 - (chartHeight /2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .classed('inactive', true)
        .classed('active', false)
        .text("Smokes (%)")
        .attr("text-anchor", "middle")
        .attr("value", "smokes");

    var obesityLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left )
        .attr("x", 0 - (chartHeight /2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .classed('inactive', true)
        .classed('active', false)
        .text("Obese (%)")
        .attr("text-anchor", "middle")
        .attr("value", "obesity");;

    var xLabelsGroup = chartGroup.append("g");

    var povertyLabel = xLabelsGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 25})`)
        .attr("class", "axisText")
        .classed('inactive', false)
        .classed('active', true)
        .text("In Poverty (%)")
        .attr("text-anchor", "middle")
        .attr("value", "poverty");

    var ageLabel =  xLabelsGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 50})`)
        .attr("class", "axisText")
        .classed('inactive', true)
        .classed('active', false)
        .text( "Age (Median)")
        .attr("text-anchor", "middle")
        .attr("value", "age");

    var incomeLabel = xLabelsGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 75})`)
        .attr("class", "axisText")
        .classed('inactive', true)
        .classed('active', false)
        .text( "Household Income (Median)")
        .attr("text-anchor", "middle")
        .attr("value", "income");

    //Event handlers
    xLabelsGroup.selectAll("text").on("click", function (){
        var selection = d3.select(this).attr("value");
        console.log("Xlabel");

        if (selection !== selectedXAxis) {
            selectedXAxis = selection;
            console.log(selectedXAxis);

            xLinearScale=updateXScale(stateData, selectedXAxis);
            xAxis= updateBottomAxis(xLinearScale, xAxis);
            circlesGroup = plotCircles(circlesGroup, selectedXAxis, xLinearScale, "cx")
            dotLabels = updateDotLabels(dotLabels, selectedXAxis, xLinearScale, "x")
            

            switch (selectedXAxis) {
                case "poverty":
                    povertyLabel.classed('active', true).classed('inactive', false);
                    ageLabel.classed('active', false).classed('inactive', true);
                    incomeLabel.classed('active', false).classed('inactive', true);
                    break;

                case "age":
                    povertyLabel.classed('active', false).classed('inactive', true);
                    ageLabel.classed('active', true).classed('inactive', false);
                    incomeLabel.classed('active', false).classed('inactive', true);
                    break;
                
                case "income":
                    povertyLabel.classed('active', false).classed('inactive', true);
                    ageLabel.classed('active', false).classed('inactive', true);
                    incomeLabel.classed('active', true).classed('inactive', false);
                    break;
            }
        }
    });
    
    yLabelsGroup.selectAll("text").on("click", function (){
        var selection = d3.select(this).attr("value");
        console.log("ylabel");

        if (selection !== selectedYAxis) {
            selectedYAxis = selection;
            console.log(selectedYAxis);

            yLinearScale=updateYScale(stateData, selectedYAxis);
            yAxis= updateLeftAxis(yLinearScale, yAxis);
            circlesGroup = plotCircles(circlesGroup, selectedYAxis, yLinearScale, "cy")
            dotLabels = updateDotLabels(dotLabels, selectedYAxis, yLinearScale, "y")

            switch(selectedYAxis) {
                case "healthcare":
                    healthcareLabel.classed('inactive', false).classed('active', true);
                    smokesLabel.classed('inactive', true).classed('active', false);
                    obesityLabel.classed('inactive', true).classed('active', false);
                    break;
                
                case "smokes":
                    healthcareLabel.classed('inactive', true).classed('active', false);
                    smokesLabel.classed('inactive', false).classed('active', true);
                    obesityLabel.classed('inactive', true).classed('active', false);
                    break;

                case "obesity":
                    healthcareLabel.classed('inactive', true).classed('active', false);
                    smokesLabel.classed('inactive', true).classed('active', true);
                    obesityLabel.classed('inactive', false).classed('active', false);
                    break;
            }
        }
    });


    }).catch(function(error) {
        console.log(error);
});

function plotCircles(circlesGroup, axis, scale, circleXorY) {
    circlesGroup
        .attr(circleXorY, d=> scale(d[axis]));
        
    return circlesGroup;
};

function updateDotLabels(dotLabels, axis, scale, xORy) {
    dotLabels
        .attr(xORy, d=> scale(d[axis]));
        
    return dotLabels;
};

function updateYScale(data, selectedYAxis) {
    yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d=> d[selectedYAxis])*0.90, d3.max(data, d=> d[selectedYAxis])*1.1])
        .range([chartHeight, 0]);
        
    return yLinearScale; 
};

function updateXScale(data, selectedXAxis) {
    xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d=> d[selectedXAxis])*.90, d3.max(data, d=> d[selectedXAxis])*1.1])
        .range([0, chartWidth]);
    
    return xLinearScale; 
};

function updateBottomAxis(xLinearScale, xAxis) {
    bottomAxis = d3.axisBottom(xLinearScale)
    xAxis.call(bottomAxis)

    return xAxis;
};

function updateLeftAxis(yLinearScale, yAxis) {
    leftAxis = d3.axisLeft(yLinearScale);
    yAxis.call(leftAxis);
    
    return yAxis;
};


var selectedXAxis = "poverty";
var selectedYAxis = "healthcare";

