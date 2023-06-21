// Select the element to display the test subject ID
const select = d3.select("#selDataset");

// Function to load the JSON data
function loadJSON() {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then(function(data) {
      // OTU CHARTS 
      const samples = data.samples;
      const selectedIndividual = samples[0];

      const metadata = data.metadata;
      const selectedMetadata = metadata[0];

      // OUT variables
      var id = selectedMetadata.id;
      var ethnicity = selectedMetadata.ethnicity;
      var gender = selectedMetadata.gender;
      var age = selectedMetadata.age;
      var location = selectedMetadata.location;
      var bbtype = selectedMetadata.bbtype;
      var wfreq = selectedMetadata.wfreq;
    

      // Select the element to display
      const metadataContainer = d3.select("#sample-metadata");

      // Clear any existing metadata
      metadataContainer.html("");
        // iterate over key-value pairs
        Object.entries(selectedMetadata).forEach(([key, value]) => {
          metadataContainer
              .append("p")
              .text(`${key}: ${value}`);
      });


      // CHART 1
      // Create bar chart

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
    
      // Update the dropdown menu with the available options
      select.selectAll("option")
        .data(samples)
        .enter()
        .append("option")
        .text(sample => sample.id)
        .property("value", sample => sample.id);


      // Create the bubble chart layout
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

      // Plot the bubble chart using Plotly
      Plotly.newPlot('bubble', bubbleData, bubbleLayout);
   


        
      console.log(data); 
    })  
    
    .catch(function(error) {
      // Error handling if data loading fails
      console.log("Error loading JSON data:", error);
    });
}
// Event listener for the dropdown menu
select.on("change", function() {
  const selectedValue = this.value;

  // Find the selected individual in the samples data
  const selectedIndividual = samples.find(sample => sample.id === selectedValue);

  // Find the selected individual's metadata
  const selectedMetadata = metadata.find(meta => meta.id === +selectedValue);

  // Now you can access the selected individual's metadata fields
  const id = selectedIndividual.id;
  const ethnicity = selectedIndividual.ethnicity;
  const gender = selectedIndividual.gender;
  const age = selectedIndividual.age;
  const location = selectedIndividual.location;
  const bbtype = selectedIndividual.bbtype;
  const wfreq = selectedIndividual.wfreq;

  document.getElementById("sample-metadata").innerHTML = `
  <p>ID: ${id}</p>
  <p>Ethnicity: ${ethnicity}</p>
  <p>Gender: ${gender}</p>
  <p>Age: ${age}</p>
  <p>Location: ${location}</p>
  <p>BBType: ${bbtype}</p>
  <p>WFreq: ${wfreq}</p>
`;

  // Update the bar chart data
  Plotly.update('bar', {
    x: [selectedIndividual.sample_values.slice(0, 10).reverse()],
    y: [selectedIndividual.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse()],
    text: [selectedIndividual.otu_labels.slice(0, 10).reverse()]
  });

  // Update the bubble chart data
  Plotly.update('bubble', {
      x: [selectedIndividual.otu_ids],
      y: [selectedIndividual.sample_values],
      text: [selectedIndividual.otu_labels],
      'marker.size': [selectedIndividual.sample_values],
      'marker.color': [selectedIndividual.otu_ids],
  });
});

// Call the loadJSON function to load the data
loadJSON();


