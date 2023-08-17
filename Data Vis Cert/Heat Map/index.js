var datalink = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

var dataset
var baseTemperature





var height = 460
var width = 900
var padding = 60

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var colorScale
var colorDomain

var svg = d3.select("#canvas")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .style("postion", "relative")

//get data from url
fetch(datalink)
    .then(response => response.json())
    .then(data => {
        dataset = data.monthlyVariance
        baseTemperature = data.baseTemperature
        draw()
    })

// {
//     "year": 1753,
//     "month": 1,
//     "variance": -1.366
//   },
//   {
//     "year": 1753,
//     "month": 2,
//     "variance": -2.223
//   },

function draw() {

    var yDomain = [0, 11]
    var xDomain = d3.extent(dataset, function (d) {
        return new Date(d.year, 0)
    })

    var xScale = d3.scaleTime().domain(xDomain).range([padding, width - padding])
    var yScale = d3.scaleLinear().domain(yDomain).range([padding, height - padding])

    colorDomain = d3.extent(dataset, function (d) {
        return d.variance
    })
    // console.log(colorDomain)
    colorScale = d3.scaleSequential().domain(colorDomain).interpolator(d3.interpolateRdYlBu);

    var xAxis = svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height - padding})`)
        .call(d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%Y"))
            .ticks(d3.timeYear.every(10)))

    var yAxis = svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding},0)`)
        .call(d3.axisLeft(yScale)
            .tickFormat(function (d) {
                // console.log(d)

                return months[d];
            })
        );

    var cellHeight = (height - 2 * padding) / 12
    var cells = svg.selectAll(".cell")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function (d) {

            return xScale(new Date(d.year, 0))
        })
        .attr("y", function (d) {
            return yScale(d.month - 1) - cellHeight / 2
        })
        .attr("width", 2)
        .attr("height", cellHeight)
        .attr("data-month", function (d) { return d.month-1 })
        .attr("data-year", function (d) { return d.year })
        .attr("data-temp", function (d) { return baseTemperature + d.variance })
        .attr("class", "cell")
        .attr("fill", function (d) {
            return colorScale(d.variance)
        })


    // create a tooltip
    var tooltip = d3.select("#canvas")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .attr("id", "tooltip")
        .style("background", "grey")
        .style("border-radius", "8px")
        .style("padding", "5px")
    //update tooltip on hover
    cells.on("mouseover", function (event, d) {
        tooltip.style("visibility", "visible")
            .style("left", event.pageX + padding / 2 + "px")
            .style("top", event.pageY + "px")
            .html(function () {
                return `${d.year} - ${months[d.month - 1]}<br>${(baseTemperature + d.variance).toFixed(1)}°C<br>${d.variance.toFixed(1)}°C`
            })
            .attr("data-year", d.year)
        return
    })
        .on("mouseout", function () { return tooltip.style("visibility", "hidden"); });

    //create a legend
    createLegend()


}





function createLegend() {
    var minVariance = colorDomain[0];
    var maxVariance = colorDomain[1];

    var numLegendBands = 10;
    var colorStep = (maxVariance - minVariance) / numLegendBands;

    var legendValues = d3.range(numLegendBands + 1).map(function(d, i) {
        return minVariance + i * colorStep;
    });
    

    var legendWidth = 200;
    var legendHeight = 20;
    var legendX = width - padding - legendWidth;
    var legendY = height - padding;
    
    var legendSvg = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${legendX},${legendY})`);
    
    legendSvg.selectAll(".legend")
        .data(legendValues)
        .enter().append("rect")
        .attr("class", "legend")
        .attr("x", function(d, i) {
            return i * (legendWidth / numLegendBands);
        })
        .attr("y", 0)
        .attr("width", legendWidth / numLegendBands)
        .attr("height", legendHeight)
        .style("fill", function(d) {
            return colorScale(d);
        });
    
    legendSvg.selectAll(".legend-label")
        .data(legendValues)
        .enter().append("text")
        .attr("class", "legend-label")
        .attr("x", function(d, i) {
            return i * (legendWidth / numLegendBands) + (legendWidth / numLegendBands) / 2;
        })
        .attr("y", legendHeight + 10)
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.toFixed(2);
        });
    
    

}

