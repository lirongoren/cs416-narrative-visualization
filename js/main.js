// Example parameters for tracking state
let currentScene = 0; // Tracks the current scene being displayed
let selectedYear = null; // Tracks the selected year in interactive mode
let selectedRegion = null; // Tracks the selected region in interactive mode

// Function to initialize the visualization
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
        // Add more cases for additional scenes as needed
        default:
            console.error('Invalid scene index:', sceneIndex);
    }
}

// Function to show global temperature scene
function showGlobalTemperature() {
    const sceneDiv = document.createElement('div');
    sceneDiv.classList.add('scene');

    const title = document.createElement('h1');
    title.textContent = 'Global Temperature Trends (1900-2020)';
    sceneDiv.appendChild(title);

    // Load global temperatures data from CSV
    d3.csv('https://raw.githubusercontent.com/lirongoren/cs416-narrative-visualization/main/data/global_temperatures.csv').then(function (data) {
        // Process data and create visualization (example)
        const svg = d3.select(sceneDiv)
            .append('svg')
            .attr('width', 600)
            .attr('height', 400);

        const margin = { top: 20, right: 30, bottom: 30, left: 50 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => +d.year))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([d3.min(data, d => +d.temperature) - 1, d3.max(data, d => +d.temperature) + 1])
            .range([height - margin.bottom, margin.top]);

        const line = d3.line()
            .x(d => x(+d.year))
            .y(d => y(+d.temperature));

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Optional: Add axes
        const xAxis = d3.axisBottom(x);
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(xAxis);

        const yAxis = d3.axisLeft(y);
        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxis);

        // Add year selection dropdown
        const yearDropdown = createYearDropdown(data);
        sceneDiv.appendChild(yearDropdown);

        // Append scene to container
        const container = document.getElementById('visualization-container');
        container.innerHTML = '';
        container.appendChild(sceneDiv);
    }).catch(function (error) {
        console.error('Error loading global temperatures data:', error);
    });
}

// Function to create year selection dropdown
function createYearDropdown(data) {
    const dropdown = document.createElement('select');
    dropdown.classList.add('year-dropdown');

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select a Year';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    dropdown.appendChild(defaultOption);

    // Extract unique years from data
    const years = [...new Set(data.map(d => d.Year))].sort();

    // Add options for each year
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        dropdown.appendChild(option);
    });

    // Event listener for dropdown change
    dropdown.addEventListener('change', function () {
        selectedYear = +this.value; // Convert selected value to number
        updateVisualization(selectedYear);
    });

    return dropdown;
}

// Function to update visualization based on selected year
function updateVisualization(year) {
    switch (currentScene) {
        case 0:
            showGlobalTemperature(year);
            break;
        case 1:
            showCO2Emissions(year);
            break;
        case 2:
            showCorrelationWithCO2Emissions(year);
            break;
        default:
            console.error('Invalid scene index:', currentScene);
    }
}

// Function to show CO2 emissions scene
function showCO2Emissions() {
    const sceneDiv = document.createElement('div');
    sceneDiv.classList.add('scene');

    const title = document.createElement('h1');
    title.textContent = 'CO2 Emissions Trends (1900-2020)';
    sceneDiv.appendChild(title);

    // Load CO2 emissions data from CSV
    d3.csv('https://raw.githubusercontent.com/lirongoren/cs416-narrative-visualization/main/data/co2_emissions.csv').then(function (data) {
        // Process data and create visualization (example)
        const svg = d3.select(sceneDiv)
            .append('svg')
            .attr('width', 600)
            .attr('height', 400);

        const margin = { top: 20, right: 30, bottom: 30, left: 50 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => +d.year))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.co2)]) // Adjust based on your CO2 data range
            .range([height - margin.bottom, margin.top]);

        const line = d3.line()
            .x(d => x(+d.year))
            .y(d => y(+d.co2));

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'green') // Adjust color as needed
            .attr('stroke-width', 2)
            .attr('d', line);

        // Optional: Add axes
        const xAxis = d3.axisBottom(x);
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(xAxis);

        const yAxis = d3.axisLeft(y);
        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxis);

        // Add year selection dropdown
        const yearDropdown = createYearDropdown(data);
        sceneDiv.appendChild(yearDropdown);

        // Append scene to container
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

    // Load CO2 emissions data from CSV
    d3.csv('https://raw.githubusercontent.com/lirongoren/cs416-narrative-visualization/main/data/co2_emissions.csv').then(function (data) {
        // Example: Display CO2 emissions per capita and global temperatures
        const svg = d3.select(sceneDiv)
            .append('svg')
            .attr('width', 600)
            .attr('height', 400);

        const margin = { top: 20, right: 30, bottom: 30, left: 50 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => +d.year))
            .range([margin.left, width - margin.right]);

        // Scale for CO2 emissions per capita
        const yCO2 = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.co2_per_capita)]) // Adjust based on your CO2 data range
            .range([height - margin.bottom, margin.top]);

        // Scale for global temperatures
        const yTemperature = d3.scaleLinear()
            .domain([d3.min(data, d => +d.temperature) - 1, d3.max(data, d => +d.temperature) + 1])
            .range([height - margin.bottom, margin.top]);

        const lineCO2 = d3.line()
            .x(d => x(+d.year))
            .y(d => yCO2(+d.co2_per_capita));

        const lineTemperature = d3.line()
            .x(d => x(+d.year))
            .y(d => yTemperature(+d.temperature));

        // Draw CO2 emissions per capita line
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'green') // Adjust color as needed
            .attr('stroke-width', 2)
            .attr('d', lineCO2);

        // Draw global temperatures line
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', lineTemperature);

        // Add axes
        const xAxis = d3.axisBottom(x);
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(xAxis);

        const yAxisCO2 = d3.axisLeft(yCO2);
        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxisCO2)
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '-2em')
            .attr('text-anchor', 'end')
            .text('CO2 emissions per capita (metric tons)');

        const yAxisTemperature = d3.axisRight(yTemperature);
        svg.append('g')
            .attr('transform', `translate(${width - margin.right}, 0)`)
            .call(yAxisTemperature)
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '-2em')
            .attr('text-anchor', 'end')
            .text('Temperature (°C)');

        // Add year selection dropdown
        const yearDropdown = createYearDropdown(data);
        sceneDiv.appendChild(yearDropdown);

        // Append scene to container
        const container = document.getElementById('visualization-container');
        container.innerHTML = '';
        container.appendChild(sceneDiv);
    }).catch(function (error) {
        console.error('Error loading CO2 emissions data:', error);
    });
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
