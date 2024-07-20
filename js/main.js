let currentScene = 0; // Tracks the current scene being displayed
let originalYearRange = [1900, 2020];
let selectedYearRange = [1900, 2020]; // Tracks the selected year range in interactive mode

function initializeVisualization() {
    showScene(currentScene); // Show initial scene
}

// Function to show scenes based on sceneIndex
function showScene(sceneIndex) {
    switch (sceneIndex) {
        case 0:
            showGlobalTemperature();
            break;
        case 1:
            showCO2Emissions();
            break;
        case 2:
            showCorrelationWithCO2Emissions();
            break;
        default:
            console.error('Invalid scene index:', sceneIndex);
    }
}

// Function to show global temperature scene
function showGlobalTemperature() {
    const sceneDiv = document.createElement('div');
    sceneDiv.classList.add('scene');

    const title = document.createElement('h1');
    title.textContent = 'Global Temperature Trends';
    sceneDiv.appendChild(title);

    const explanation = document.createElement('p');
    explanation.textContent = 'This scene illustrates the change in average monthly global temperatures over the years. The visualization allows you to see the trends in temperature changes over the years. You can use the brush tool to select a specific year range and zoom into the period of interest to see more details. Hover over the line to dive deeper into information related to that year.';
    sceneDiv.appendChild(explanation);

    d3.csv('https://raw.githubusercontent.com/lirongoren/cs416-narrative-visualization/main/data/global_temperatures.csv').then(function (data) {
        let filteredData = data;
        if (selectedYearRange[0] != originalYearRange[0] || selectedYearRange[1] != originalYearRange[1]) {
            filteredData = data.filter(d => +d.year >= selectedYearRange[0] && +d.year <= selectedYearRange[1]);
        }

        const svg = d3.select(sceneDiv).append('svg')
            .attr('width', 600)
            .attr('height', 400);

        const margin = { top: 20, right: 30, bottom: 30, left: 50 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => +d.year))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([d3.min(filteredData, d => +d.temperature) - 1, d3.max(filteredData, d => +d.temperature) + 1])
            .range([height - margin.bottom, margin.top]);

        const line = d3.line()
            .x(d => x(+d.year))
            .y(d => y(+d.temperature));

        svg.append('path')
            .datum(filteredData)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', line);

        const xAxis = d3.axisBottom(x);
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(xAxis)
            .append('text')
            .attr('fill', '#000')
            .attr('x', width / 2)
            .attr('y', margin.bottom + 10)
            .attr('text-anchor', 'middle')
            .text('Year');

        const yAxis = d3.axisLeft(y);
        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxis)
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', -30)
            .attr('x', -height / 2)
            .attr('text-anchor', 'middle')
            .text('Temperature (°C)');

        addYearBrush(svg, filteredData);

        const tooltip = d3.select('#tooltip');

        svg.selectAll('circle')
            .data(filteredData)
            .enter().append('circle')
            .attr('cx', d => x(+d.year))
            .attr('cy', d => y(+d.temperature))
            .attr('r', 3)
            .attr('fill', 'steelblue')
            .on('mouseover', function (event, d) {
                tooltip.style('display', 'block')
                    .html(`Year: ${d.year}<br>Temperature: ${d.temperature}`)
                    .style('left', (event.pageX + 5) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mousemove', function (event) {
                tooltip.style('left', (event.pageX + 5) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function () {
                tooltip.style('display', 'none');
            });

        const container = document.getElementById('visualization-container');
        container.innerHTML = '';
        container.appendChild(sceneDiv);
    }).catch(function (error) {
        console.error('Error loading global temperatures data:', error);
    });
}

// Function to show CO2 emissions scene
function showCO2Emissions() {
    const sceneDiv = document.createElement('div');
    sceneDiv.classList.add('scene');

    const title = document.createElement('h1');
    title.textContent = 'CO2 Emissions Trends';
    sceneDiv.appendChild(title);

    const explanation = document.createElement('p');
    explanation.textContent = 'This scene illustrates the change in global CO2 emissions over the years. You can use the brush tool to select a specific year range and zoom into the period of interest to see more details. Hover over the line to dive deeper into information related to that year.';
    sceneDiv.appendChild(explanation);

    d3.csv('https://raw.githubusercontent.com/lirongoren/cs416-narrative-visualization/main/data/co2_emissions.csv').then(function (data) {
        let filteredData = data;
        if (selectedYearRange[0] != originalYearRange[0] || selectedYearRange[1] != originalYearRange[1]) {
            filteredData = data.filter(d => +d.year >= selectedYearRange[0] && +d.year <= selectedYearRange[1]);
        }

        const svg = d3.select(sceneDiv).append('svg')
            .attr('width', 600)
            .attr('height', 400);

        const margin = { top: 20, right: 30, bottom: 30, left: 50 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => +d.year))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([d3.min(filteredData, d => +d.co2) - 1, d3.max(filteredData, d => +d.co2) + 1])
            .range([height - margin.bottom, margin.top]);

        const line = d3.line()
            .x(d => x(+d.year))
            .y(d => y(+d.co2));

        svg.append('path')
            .datum(filteredData)
            .attr('fill', 'none')
            .attr('stroke', 'green')
            .attr('stroke-width', 2)
            .attr('d', line);

        const xAxis = d3.axisBottom(x);
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(xAxis)
            .append('text')
            .attr('fill', '#000')
            .attr('x', width / 2)
            .attr('y', margin.bottom + 10)
            .attr('text-anchor', 'middle')
            .text('Year');

        const yAxis = d3.axisLeft(y);
        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxis)
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', -42)
            .attr('x', -height / 2)
            .attr('text-anchor', 'middle')
            .text('CO2 Emissions (Metric Tons)');

        addYearBrush(svg, filteredData);

        const tooltip = d3.select('#tooltip');

        svg.selectAll('circle')
            .data(filteredData)
            .enter().append('circle')
            .attr('cx', d => x(+d.year))
            .attr('cy', d => y(+d.co2))
            .attr('r', 3)
            .attr('fill', 'green')
            .on('mouseover', function (event, d) {
                tooltip.style('display', 'block')
                    .html(`Year: ${d.year}<br>CO2 Emissions: ${d.co2}`)
                    .style('left', (event.pageX + 5) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mousemove', function (event) {
                tooltip.style('left', (event.pageX + 5) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function () {
                tooltip.style('display', 'none');
            });

        const container = document.getElementById('visualization-container');
        container.innerHTML = '';
        container.appendChild(sceneDiv);
    }).catch(function (error) {
        console.error('Error loading CO2 emissions data:', error);
    });
}


// Function to show correlation with CO2 emissions scene
function showCorrelationWithCO2Emissions() {
    const sceneDiv = document.createElement('div');
    sceneDiv.classList.add('scene');

    const title = document.createElement('h1');
    title.textContent = 'Correlation with CO2 Emissions';
    sceneDiv.appendChild(title);
    
    const explanation = document.createElement('p');
    explanation.textContent = 'This visualization shows the correlation between CO2 emissions and temperature change over time. The blue line represents the average temperature changes, the green line shows CO2 emissions, and the orange line depicts the temperature change specifically attributed to CO2 emissions. Use the brush tool to select a range of years and zoom into the specific period of interest. Hover over the orange line to dive deeper into information related to that year.';
    sceneDiv.appendChild(explanation);

    // Load CO2 emissions data
    d3.csv('https://raw.githubusercontent.com/lirongoren/cs416-narrative-visualization/main/data/co2_emissions.csv').then(function (co2Data) {
        // Load temperature data
        d3.csv('https://raw.githubusercontent.com/lirongoren/cs416-narrative-visualization/main/data/global_temperatures.csv').then(function (tempData) {
            // Convert data fields to numbers
            co2Data.forEach(d => {
                d.year = +d.year;
                d.co2_per_capita = +d.co2_per_capita;
                d.co2 = +d.co2;
                d.co2_growth_abs = +d.co2_growth_abs;
                d.temperature_change_from_co2 = +d.temperature_change_from_co2;
            });

            tempData.forEach(d => {
                d.year = +d.year;
                d.temperature = +d.temperature; // Ensure temperature is a number
            });

            // Join datasets on year
            const combinedData = co2Data.map(co2Entry => {
                const tempEntry = tempData.find(temperature => temperature.year === co2Entry.year);
                if (tempEntry) {
                    return {
                        year: co2Entry.year,
                        co2_per_capita: co2Entry.co2_per_capita,
                        co2: co2Entry.co2,
                        co2_growth_abs: co2Entry.co2_growth_abs,
                        temperature_change_from_co2: co2Entry.temperature_change_from_co2,
                        temperature: tempEntry.temperature
                    };
                }
                return null;
            }).filter(d => d !== null);

            let filteredData = combinedData;
            if (selectedYearRange[0] != originalYearRange[0] || selectedYearRange[1] != originalYearRange[1]) {
                filteredData = combinedData.filter(d => +d.year >= selectedYearRange[0] && +d.year <= selectedYearRange[1]);
            }

            const svg = d3.select(sceneDiv)
                .append('svg')
                .attr('width', 600)
                .attr('height', 400);

            const margin = { top: 20, right: 30, bottom: 30, left: 50 };
            const width = +svg.attr('width') - margin.left - margin.right;
            const height = +svg.attr('height') - margin.top - margin.bottom;

            const x = d3.scaleLinear()
                .domain(d3.extent(filteredData, d => d.year))
                .range([margin.left, width - margin.right]);

            const yTemp = d3.scaleLinear()
                .domain(d3.extent(filteredData, d => d.temperature))
                .range([height - margin.bottom, margin.top]);

            const yCO2 = d3.scaleLinear()
                .domain(d3.extent(filteredData, d => d.co2))
                .range([height - margin.bottom, margin.top]);

            const yTempChange = d3.scaleLinear()
                .domain(d3.extent(filteredData, d => d.temperature_change_from_co2))
                .range([height - margin.bottom, margin.top]);

            const lineTemperature = d3.line()
                .x(d => x(d.year))
                .y(d => yTemp(d.temperature));

            const lineCO2 = d3.line()
                .x(d => x(d.year))
                .y(d => yCO2(d.co2));

            const lineTempChange = d3.line()
                .x(d => x(d.year))
                .y(d => yTempChange(d.temperature_change_from_co2));

            svg.append('path')
                .datum(filteredData)
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-width', 2)
                .attr('d', lineTemperature)
                .attr('class', 'line-temperature');

            svg.append('path')
                .datum(filteredData)
                .attr('fill', 'none')
                .attr('stroke', 'green')
                .attr('stroke-width', 2)
                .attr('d', lineCO2)
                .attr('class', 'line-co2');

            svg.append('path')
                .datum(filteredData)
                .attr('fill', 'none')
                .attr('stroke', 'orange')
                .attr('stroke-width', 2)
                .attr('d', lineTempChange)
                .attr('class', 'line-temp-change');

            svg.append('g')
                .attr('transform', `translate(0, ${height - margin.bottom})`)
                .call(d3.axisBottom(x))
                .append('text')
                .attr('fill', '#000')
                .attr('x', width / 2)
                .attr('y', margin.bottom + 10)
                .attr('text-anchor', 'middle')
                .text('Year');

            svg.append('g')
                .attr('transform', `translate(${margin.left}, 0)`)
                .call(d3.axisLeft(yCO2))
                .append('text')
                .attr('fill', '#000')
                .attr('transform', 'rotate(-90)')
                .attr('y', -42)
                .attr('x', -height / 2)
                .attr('text-anchor', 'middle')
                .text('Temperature (°C)');

            svg.append('g')
                .attr('transform', `translate(${width - margin.right}, 0)`)
                .call(d3.axisRight(yTempChange))
                .append('text')
                .attr('fill', '#000')
                .attr('transform', 'rotate(-90)')
                .attr('y', 42)
                .attr('x', -height / 2)
                .attr('text-anchor', 'middle')
                .text('Temperature Change from CO2 (°C)');

            addYearBrush(svg, filteredData);

            const tooltip = d3.select('#tooltip');

            svg.selectAll('circle')
                .data(filteredData)
                .enter().append('circle')
                .attr('cx', d => x(d.year))
                .attr('cy', d => yTempChange(d.temperature_change_from_co2))
                .attr('r', 3)
                .attr('fill', 'orange')
                .on('mouseover', function (event, d) {
                    tooltip.style('display', 'block')
                        .html(`
                            Year: ${d.year}<br>
                            Temperature Change from CO2: ${d.temperature_change_from_co2}<br>
                            Temperature: ${d.temperature}<br>
                            CO2 Emissions: ${d.co2}
                        `)
                        .style('left', (event.pageX + 5) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mousemove', function (event) {
                    tooltip.style('left', (event.pageX + 5) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', function () {
                    tooltip.style('display', 'none');
                });

            const container = document.getElementById('visualization-container');
            container.innerHTML = '';
            container.appendChild(sceneDiv);
        }).catch(function (error) {
            console.error('Error loading temperature data:', error);
        });
    }).catch(function (error) {
        console.error('Error loading CO2 emissions data:', error);
    });
}

// Function to add a year brush to the SVG
function addYearBrush(svg, data) {
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.year))
        .range([margin.left, width - margin.right]);

    const brush = d3.brushX()
        .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
        .on('brush', function (event) {
            if (event.selection) {
                const [x0, x1] = event.selection.map(x.invert);
                selectedYearRange = [Math.round(x0), Math.round(x1)];
                updateYearRangeDisplay(selectedYearRange); // Update display with current selection
            }
        })
        .on('end', function (event) {
            if (event.selection) {
                const [x0, x1] = event.selection.map(x.invert);
                selectedYearRange = [Math.round(x0), Math.round(x1)];
                console.log("selectedYearRange = ", selectedYearRange);
                updateVisualization(); // Update visualization based on final selection
            }
        });

    svg.append('g')
        .attr('class', 'brush')
        .call(brush);
}

function resetYearRange() {
    selectedYearRange = [...originalYearRange];
    updateYearRangeDisplay();
    updateVisualization();
}

// Function to update the display of the selected year range
function updateYearRangeDisplay(yearRange = originalYearRange) {
    const yearRangeDisplay = document.getElementById('year-range-display');
    if (yearRangeDisplay) {
        yearRangeDisplay.textContent = `Year Range: ${yearRange[0]} - ${yearRange[1]}`;
    }
}

// Function to update visualization based on selected year range
function updateVisualization() {
    switch (currentScene) {
        case 0:
            showGlobalTemperature();
            break;
        case 1:
            showCO2Emissions();
            break;
        case 2:
            showCorrelationWithCO2Emissions();
            break;
        default:
            console.error('Invalid scene index:', currentScene);
    }
}

// Event listeners for scene navigation
document.getElementById('next-button').addEventListener('click', function () {
    currentScene++;
    if (currentScene > 2) {
        currentScene = 0; // Loop back to the first scene after the last one
    }
    showScene(currentScene);
});

document.getElementById('previous-button').addEventListener('click', function () {
    currentScene--;
    if (currentScene < 0) {
        currentScene = 2; // Loop back to the last scene after the first one
    }
    showScene(currentScene);
});

// Initialize the visualization on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeVisualization();
});

document.getElementById('reset-button').addEventListener('click', function () {
    resetYearRange();
});
