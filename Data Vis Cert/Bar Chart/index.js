var datalink = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

var dataset



var height = 460
var width = 900
var padding = 60

var svg = d3.select("#canvas")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .style("postion", "relative")

//get data from url
fetch(datalink)
    .then(response => response.json())
    .then(data => {
        dataset = data["data"]
        draw()
    })

function draw() {
    // console.log(dataset)

    var yMax = d3.max(dataset, function (d) {
        return Number(d[1])
    })

    var xDomain = d3.extent(dataset, function (d) {
        return new Date(d[0])
    })

    var xScale = d3.scaleTime().domain(xDomain).range([padding, width - padding])
    var yScale = d3.scaleLinear().domain([0, yMax]).range([height - padding, padding])

    var xAxis = svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height - padding})`)
        .call(d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%Y"))
            .ticks(d3.timeYear.every(5)))

    var yAxis = svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding},0)`)
        .call(d3.axisLeft(yScale));

    var bars = svg.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function (d) {

            return xScale(new Date(d[0]))
        })
        .attr("y", function (d) {
            return yScale(d[1])
        })
        .attr("width", 2)
        .attr("height", function (d) {
            return height - padding - yScale(d[1])
        })
        .attr("data-date", function (d) { return d[0] })
        .attr("data-gdp", function (d) { return d[1] })


    // create a tooltip
    var tooltip = d3.select("#canvas")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .attr("id","tooltip")

    bars.on("mouseover", function (event,d) {
            tooltip.style("visibility", "visible")
            .style("left", event.pageX+padding/2 + "px")
            .style("top", event.pageY + "px")
            .html(`Date: ${d[0]}<br>GDP: ${d[1]}`)
            .attr("data-date",d[0])
            return
        })
        .on("mouseout", function () { return tooltip.style("visibility", "hidden"); });


}


