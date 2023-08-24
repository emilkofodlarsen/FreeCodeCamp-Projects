// The svg
var width = 1200;
var height = 600;
var margin = 50;
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Map form and projection
var projection = d3.geoNaturalEarth1()
    .scale(width / 1.8 / Math.PI)
    .translate([width / 2, height / 2]);
var colorScale

// Load external GeoJSON data
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(data) {
    // Load external CSV data
    d3.csv("countrylevel.csv").then(function(csvData) {
        // Create a Map to store the mismanaged waste data and population data from CSV
        var mismanagedWasteMap = new Map();
        var populationMap = new Map();

        csvData.forEach(function(item) {
            var processedName = item.Entity.toLowerCase().trim();
            var mismanagedWasteInTons = +item["Mismanaged waste emitted to the ocean (metric tons year-1)"];
            var mismanagedWasteInKg = mismanagedWasteInTons * 1000; // Convert tons to kg
            var population = +item["Population"] 

            mismanagedWasteMap.set(processedName, mismanagedWasteInKg);
            populationMap.set(processedName, population);

            // Log each entry to verify the data
            //console.log(`Country: ${processedName}, Mismanaged Waste in kg: ${mismanagedWasteInKg}, Population: ${population}`);
        });

        // Function to get color based on the country name
        function getColor(countryName) {
            var processedName = countryName.toLowerCase().trim();
            var mismanagedWaste = mismanagedWasteMap.get(processedName);
            var population = populationMap.get(processedName);
        
            if (mismanagedWaste !== undefined && population !== undefined && population > 0) {
                // Calculate per capita plastic waste emitted to the ocean
                var perCapitaWaste = mismanagedWaste / population;
        
                // Choose a new color scale with specific color intervals based on the per capita waste value
                colorScale = d3.scaleThreshold()
                .domain([0.001, 0.011, 0.031, 0.11, 0.31, 1.11, 3.11])
                .range(["white", "#B2BBB7", "#869493", "#5B676C", "#485156", "#363C3F", "#232629"]);
                     
                return colorScale(perCapitaWaste);
            } else {
                return "white"; // Default color if data is not available or population is 0
            }
        }
        

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .join("path")
            .attr("fill", function(d) {
                return getColor(d.properties.name); // Get the color based on the country name
            })
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#212")
            .style('stroke-width', '0.1px')
            .attr("id",function(d){return d.properties.name})  // name in the csv and json file differd so easier to find
        createLegend(colorScale); 
    });
});

// Garbage patches in order after size ish
var circleData = [
    { cx: width/17.14,  cy: height/3.33, r: width/20.7, color: "none", numberOfFloatingCircles: 900},
    { cx: width/1.33, cy: height/1.48, r: width/25, color: "none", numberOfFloatingCircles: 300},
    { cx: width/6, cy: height/1.38, r: width/33.3, color: "none", numberOfFloatingCircles: 150},
    { cx: width/2.31, cy: height/1.38, r: width/33.3, color: "none", numberOfFloatingCircles: 50},
    { cx: width/2.73, cy: height/2.67, r: width/33.3, color: "none", numberOfFloatingCircles: 50}
];




// Function to generate random colors
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to create animated plastics inside the circles
function createAnimatedPlastics(circleData, numberOfFloatingCircles) {
    var plasticPieces = [];
    var speed = 2;
    var plasticSize = 2;

    for (var i = 0; i < numberOfFloatingCircles; i++) {
        let plasticPiece = {
            "angleRad": Math.random() * Math.PI * 2,
            "radius": Math.random() * circleData.r - plasticSize,
            "color": getRandomColor() // Random color for each floating circle
        };
        plasticPieces.push(plasticPiece);
    }

    var animatedPlastics = svg.selectAll('.plasticPiece')
        .data(plasticPieces)
        .join("circle")
        .attr('cx', function (d) { return Math.sin(d.angleRad) * d.radius + circleData.cx; })
        .attr('cy', function (d) { return Math.cos(d.angleRad) * d.radius + circleData.cy; })
        .attr('r', plasticSize)
        .attr('fill', function (d) { return d.color; }); 

    function updatePlastics() {
        // Update velocities and positions of the plastic pieces
        plasticPieces.forEach(function (d) {
            d.vx = d.vx || (Math.random() - 0.5) * 2; // Initial random velocity along x-axis
            d.vy = d.vy || (Math.random() - 0.5) * 2; // Initial random velocity along y-axis

            // Update positions based on velocity
            d.angleRad += d.vx * 0.005; 
            d.radius += d.vy * 0.2; 

            // Bounce off the inner circle boundary
            if (d.radius < 0) {
                d.radius = -d.radius;
                d.vy = -d.vy;
            }
            if (d.radius > circleData.r - plasticSize) {
                d.radius = circleData.r - plasticSize - (d.radius - (circleData.r - plasticSize));
                d.vy = -d.vy;
            }
        });

        // Update the positions of the plastic pieces during the animation
        animatedPlastics
            .attr('cx', function (d) { return Math.sin(d.angleRad) * d.radius + circleData.cx; })
            .attr('cy', function (d) { return Math.cos(d.angleRad) * d.radius + circleData.cy; });

        // Call the function again after a short delay to create a continuous loop
        setTimeout(updatePlastics, 20); // Adjust the timeout as needed
    }

    // Call the function to start the animation
    updatePlastics();
}

// Bind data to circles and create new ones as needed
var circles = svg.selectAll('circle')
    .data(circleData)
    .join("circle")
    .attr("cx", (d) => d.cx) // Set the x-coordinate based on the 'cx' property in the data
    .attr("cy", (d) => d.cy) // Set the y-coordinate based on the 'cy' property in the data
    .attr("r", (d) => d.r) // Set the radius based on the 'r' property in the data
    .attr("fill", (d) => d.color)
    .each(function (d) {
        createAnimatedPlastics(d, d.numberOfFloatingCircles);
    });
    

    // weird legend
    function createLegend(colorScale) {
        const legendData = ["No data", 0.01, 0.03, 0.1, 0.3, 1, 3];
      
        const legend = d3.select("#canvas") // Select the container div
            .append("div") 
            .attr("id", "legend") 
            .attr("class", "legend") 
            .style("position", "absolute") 
            // .style("bottom", "150px") // Adjust the bottom distance
            // .style("left", "300px")  // Adjust the left distance
            .style("background-color", "rgba(54, 7non4, 253, 0.94)") 
            .style("padding", "10px") 

            legend.append('div')
            .style('font-size', '10px')
            .style('margin-bottom', '5px')
            .text('kg pr capita/year')
        const legendItems = legend.selectAll(".legend-item")
          .data(legendData)
          .enter()
          .append("div")
          .attr("class", "legend-item");
      
        legendItems.append("div")
          .attr("class", "legend-color")
          .style("background-color", d => colorScale(d));
      
        legendItems.append("span")
          .attr("class", "legend-label") 
          .text(d => d);
      
        
      };