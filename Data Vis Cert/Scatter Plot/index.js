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
        createLegend()
        draw()
    })

function draw() {
    // console.log(dataset)

    var yDomain = d3.extent(dataset, function (d) {
        // console.log(new Date(d.Time))
        return secondsToDate(d.Seconds)
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
            .tickFormat(d3.timeFormat("%M:%S"))
            );

    var dots = svg.selectAll(".dot")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {

            return xScale(new Date(d.Year,0))
        })
        .attr("cy", function (d) {
            return yScale(secondsToDate(d.Seconds))
        })
        .attr("r", 5)
        .attr("data-xvalue", function (d) { return d.Year})
        .attr("data-yvalue", function (d) { return secondsToDate(d.Seconds)})
        .attr("class","dot")
        .attr("fill",function (d){
            if (d.Doping){
                return "red"
            } else {
                return "blue"
            }
        })


    // create a tooltip
    var tooltip = d3.select("#canvas")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .attr("id","tooltip")
        .style("background","grey")
        .style("border-radius","8px")
        .style("padding","5px")
    //update tooltip on hover
    dots.on("mouseover", function (event,d) {
            tooltip.style("visibility", "visible")
            .style("left", event.pageX+padding/2 + "px")
            .style("top", event.pageY + "px")
            .html(function(){
                if (!d.Doping){
                    return `${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}`
                } else {
                    return `${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}<br><br>Doping: ${d.Doping}`
                }
            })
            .attr("data-Year",d.Year)
            return
            })
        .on("mouseout", function () { return tooltip.style("visibility", "hidden"); });
    
    //create a legend


}


function secondsToDate(seconds){
    return new Date(0, 0, 0, 0, 0, seconds) //new Date(year, monthIndex, day, hours, minutes, seconds)
}


function createLegend(){
    // ...

// Create a legend
var legend = svg.append("g")
.attr("id", "legend")
.attr("transform", "translate(" + (width - 200) + "," + padding + ")");

// Add legend items
var legendItems = [
{ label: "Doping Allegations", color: "red" },
{ label: "No Doping Allegations", color: "blue" }
];

var legendRectSize = 15;
var legendSpacing = 5;

var legendEntry = legend.selectAll(".legendEntry")
.data(legendItems)
.enter()
.append("g")
.attr("class", "legendEntry")
.attr("transform", function (d, i) {
    var legendEntryHeight = legendRectSize + legendSpacing;
    var yOffset = i * legendEntryHeight;
    return "translate(0," + yOffset + ")";
});

legendEntry.append("rect")
.attr("width", legendRectSize)
.attr("height", legendRectSize)
.attr("fill", function (d) { return d.color; });

legendEntry.append("text")
.attr("x", legendRectSize + legendSpacing)
.attr("y", legendRectSize - legendSpacing)
.text(function (d) { return d.label; });

// ...

}

