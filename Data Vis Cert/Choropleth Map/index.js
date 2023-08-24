var education_datalink = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
var county_datalink = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

var dataset







var height = 460
var width = 900



var svg = d3.select("#canvas")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .style("postion", "relative")

Promise.all([
    fetch(county_datalink).then(resp => resp.json()),
    fetch(education_datalink).then(resp => resp.json())
  ]).then((responses) => {
    dataset = responses
    draw()
    })

    // counties_geometry
    // [{type: 'Polygon', id: 5089, arcs: [[0,1,2,3,4]]},{}...]

    // counties_stats 
    // [{fips: 1001, state: 'AL', area_name: 'Autauga County', bachelorsOrHigher: 21.9},{}...]
function draw() {
    
    var counties_geometry = dataset[0].objects.counties.geometries
    var counties_stats = dataset[1]
    var county_state = new Map()
    var county_name = new Map()
    var county_bachelorsOrHigher = new Map()

    counties_stats.forEach(function(county){
        county_state.set(county.fips,county.state)
        county_name.set(county.fips,county.area_name)
        county_bachelorsOrHigher.set(county.fips,county.bachelorsOrHigher)
    })
    


    
    var projection = d3.geoNaturalEarth1()
    .scale(width / 1.8 / Math.PI)
    .translate([width / 2, height / 2]);
    
    

}

