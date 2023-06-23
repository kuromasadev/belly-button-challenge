// Select the element to display the test subject ID
const select = d3.select("#selDataset");

// Declare samples and metadata variables
let samples = [];
let metadata = [];

// Function to load the JSON data and store information into variables
function loadJSON() {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then(function(data) {
      samples = data.samples;
      metadata = data.metadata;
     
      createBarChart();
      createBubbleChart();
      createVariables();
      addMetadataListener();

      console.log(data);
    })
    .catch(function(error) {
      // Error handling if data loading fails
      console.log("Error loading JSON data:", error);
    });
}

// function to initially load the metadata
function createVariables() {
  // dropdown
  select.selectAll("option")
    .data(metadata)
    .enter()
    .append("option")
    .text(d => d.id);
}

// Function to create the bar chart
function createBarChart() {
  const selectedIndividual = samples[0];

  const barData = [{
    type: 'bar',
    x: selectedIndividual.sample_values.slice(0, 10).reverse(),
    y: selectedIndividual.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
    text: selectedIndividual.otu_labels.slice(0, 10).reverse(),
    orientation: 'h'
  }];

  const barLayout = {
    title: 'Top 10 OTUs',
    xaxis: { title: 'Sample Values' },
    yaxis: { title: 'OTU IDs' }
  };

  Plotly.newPlot('bar', barData, barLayout);
}

// Function to create the bubble chart
function createBubbleChart() {
  const selectedIndividual = samples[0];

  const bubbleData = [{
    x: selectedIndividual.otu_ids,
    y: selectedIndividual.sample_values,
    text: selectedIndividual.otu_labels,
    mode: 'markers',
    marker: {
      size: selectedIndividual.sample_values,
      color: selectedIndividual.otu_ids
    }
  }];

  const bubbleLayout = {
    title: 'Sample Values vs. OTU IDs',
    xaxis: { title: 'OTU IDs' },
    yaxis: { title: 'Sample Values' }
  };

  Plotly.newPlot('bubble', bubbleData, bubbleLayout);
}

// Function to listen for changes to the metadata_id
function addMetadataListener() {
  select.on("change", function() {
    const selectedValue = d3.select(this).property('value');
    const selectedIndividual = samples.find(sample => sample.id === selectedValue);
    const selectedMetadata = metadata.find(meta => meta.id === +selectedValue);

    updateMetadata(selectedMetadata);
    updateBarChart(selectedIndividual);
    updateBubbleChart(selectedIndividual);
  });
}

// Function to update the metadata display
function updateMetadata(selectedMetadata) {
  const metadataContainer = d3.select("#sample-metadata");
  metadataContainer.html("");

  Object.entries(selectedMetadata).forEach(([key, value]) => {
    metadataContainer
      .append("p")
      .text(`${key}: ${value}`);
  });
}

// Function to update the bar chart
function updateBarChart(selectedIndividual) {
  Plotly.update('bar', {
    x: [selectedIndividual.sample_values.slice(0, 10).reverse()],
    y: [selectedIndividual.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse()],
    text: [selectedIndividual.otu_labels.slice(0, 10).reverse()]
  });
}

// Function to update the bubble chart
function updateBubbleChart(selectedIndividual) {
  Plotly.update('bubble', {
    x: [selectedIndividual.otu_ids],
    y: [selectedIndividual.sample_values],
    text: [selectedIndividual.otu_labels],
    'marker.size': [selectedIndividual.sample_values],
    'marker.color': [selectedIndividual.otu_ids],
  });
}

// Call the loadJSON function to load the data
loadJSON();
