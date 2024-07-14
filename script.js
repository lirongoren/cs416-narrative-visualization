let currentScene = 1;

const scenes = [
    showScene1,
    showScene2,
    showScene3,
    showScene4
];



// // Load CO2 emissions data
// d3.csv("data/owid-co2-data.csv").then(function (data) {
//     // Process and visualize the data
//     console.log(data);
// });


d3.select("#next-button").on("click", function () {
    if (currentScene < scenes.length) {
        currentScene++;
        updateScene();
    }
});

d3.select("#prev-button").on("click", function () {
    if (currentScene > 1) {
        currentScene--;
        updateScene();
    }
});

d3.select("#year-selector").on("input", function () {
    const selectedYear = d3.select(this).property("value");
    updateDataByYear(selectedYear);
});

d3.select("#region-selector").on("change", function () {
    const selectedRegion = d3.select(this).property("value");
    updateDataByRegion(selectedRegion);
});

function updateScene() {
    d3.select("#scene").html("");
    scenes[currentScene - 1]();
    if (currentScene === scenes.length) {
        d3.select(".explore").style("display", "block");
    } else {
        d3.select(".explore").style("display", "none");
    }
}

function showScene1() {
    // Example scene 1: Introduction
    const svg = d3.select("#scene").append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    // Load and display data (e.g., line chart for global temperatures)
    d3.csv("data/global_temperatures.csv").then(function (data) {
        // Process and visualize the data
        console.log(data);
    });
    // Add annotations
}

function showScene2() {
    // Example scene 2: Detailed Analysis
    const svg = d3.select("#scene").append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    // Load and display data (e.g., zoomed-in line chart for significant periods)
    // Add annotations
}

function showScene3() {
    // Example scene 3: Correlation with CO2 Emissions
    const svg = d3.select("#scene").append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    // Load and display data (e.g., scatter plot of CO2 vs temperature)
    // Add annotations
}

function showScene4() {
    // Example scene 4: User Exploration
    const svg = d3.select("#scene").append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    // Interactive visualization code
    // Add tooltips for additional context
}

function updateDataByYear(year) {
    // Update the visualization based on the selected year
}

function updateDataByRegion(region) {
    // Update the visualization based on the selected region
}

updateScene();
