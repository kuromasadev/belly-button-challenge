// Select the element to display the test subject ID
const select = d3.select("#selDataset");

// Function to load the JSON data
function loadJSON() {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then(function(data) {
      // OTU CHARTS
      const samples = data.samples;
      const selectedIndividual = samples[0];
    
      // #CHART 1 - Create the bar chart data
      const barData = [{
        type: 'bar',
        x: selectedIndividual.sample_values.slice(0, 10).reverse(),
        y: selectedIndividual.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: selectedIndividual.otu_labels.slice(0, 10).reverse(),
        orientation: 'h'
      }];
    
      // Create the bar chart layout
      const barLayout = {
        title: 'Top 10 OTUs',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU IDs' }
      };
    
      // Plot the bar chart using Plotly
      Plotly.newPlot('bar', barData, barLayout);
    
      // Update the dropdown menu with the available options
      select.selectAll("option")
        .data(samples)
        .enter()
        .append("option")
        .text(sample => sample.id)
        .property("value", sample => sample.id);

      // #CHART 2 -  Create the bubble chart data
        const bubbleData = [{
            x: selectedIndividual.otu_ids,
            y: selectedIndividual.sample_values,
            text: selectedIndividual.otu_labels,
            mode: 'markers',
            marker: {
                size: selectedIndividual.sample_values,
                color: selectedIndividual.otu_ids,
                colorscale: 'Earth'
            }
        }];

      // Create the bubble chart layout
        const bubbleLayout = {
          title: 'Samples',
          xaxis: { title: 'OTU IDs' },
          yaxis: { title: 'Sample Values' }
        };

      // Plot the bubble chart using Plotly
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
        
      // Update the sample metadata
        const metadata = data.metadata;
        const selectedMetadata = metadata[0]; // Assuming you want to display the metadata for the first individual initially

      // Access the specific metadata fields
        var id = firstMetadata.id;
        var ethnicity = firstMetadata.ethnicity;
        var gender = firstMetadata.gender;
        var age = firstMetadata.age;
        var location = firstMetadata.location;
        var bbtype = firstMetadata.bbtype;
        var wfreq = firstMetadata.wfreq;


      // Select the element where you want to display the metadata
      const metadataContainer = d3.select("#sample-metadata");

      // Clear any existing metadata
      metadataContainer.html("");

        // Iterate over the key-value pairs of the metadata object and display them
            Object.entries(selectedMetadata).forEach(([key, value]) => {
                metadataContainer
                    .append("p")
                    .text(`${key}: ${value}`);
            });


      console.log(data); 
    })  
    
    .catch(function(error) {
      // Error handling if data loading fails
      console.log("Error loading JSON data:", error);
    });
}

// Call the loadJSON function to load the data
loadJSON();

// Event listener for the dropdown menu
select.on("change", function() {
    const selectedValue = this.value;
  
    // Find the selected individual in the samples data
    const selectedIndividual = metadata.find(meta => meta.id === +selectedValue);
  
    // Now you can access the selected individual's metadata fields
    const id = selectedIndividual.id;
    const ethnicity = selectedIndividual.ethnicity;
    const gender = selectedIndividual.gender;
    const age = selectedIndividual.age;
    const location = selectedIndividual.location;
    const bbtype = selectedIndividual.bbtype;
    const wfreq = selectedIndividual.wfreq;

    // Update the UI elements with the selected individual's metadata
    document.getElementById("id").innerText = "ID: " + id;
    document.getElementById("ethnicity").innerText = "Ethnicity: " + ethnicity;
    document.getElementById("gender").innerText = "Gender: " + gender;
    document.getElementById("age").innerText = "Age: " + age;
    document.getElementById("location").innerText = "Location: " + location;
    document.getElementById("bbtype").innerText = "BBType: " + bbtype;
    document.getElementById("wfreq").innerText = "WFreq: " + wfreq;

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
