var datalink = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

var dataset

// Doping
// : 
// "Alleged drug use during 1995 due to high hematocrit levels"
// Name
// : 
// "Marco Pantani"
// Nationality
// : 
// "ITA"
// Place
// : 
// 1
// Seconds
// : 
// 2210
// Time
// : 
// "36:50"
// URL
// : 
// "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
// Year
// : 
// 1995

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
        dataset = data
        // console.log(dataset)
        draw()
    })

function draw() {
    // console.log(dataset)

    var yDomain = d3.extent(dataset, function (d) {
        // console.log(new Date(d.Time))
        return d.Seconds
    })

    var xDomain = d3.extent(dataset, function (d) {
        // console.log(new Date(d.Year,0))
        return new Date(d.Year,0)
    })

    var xScale = d3.scaleTime().domain(xDomain).range([padding, width - padding])
    var yScale = d3.scaleLinear().domain(yDomain).range([padding, height - padding])

    var xAxis = svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height - padding})`)
        .call(d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%Y"))
            .ticks(d3.timeYear.every(2)))

    var yAxis = svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding},0)`)
        .call(d3.axisLeft(yScale)
            .tickFormat(function(d){
                
                return `${Math.floor(d/60)}:${String(d%60).padStart(2,"0")}`
            }));

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
        .attr("class","bar")


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


