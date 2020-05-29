// from data.js
var sightingData = data;

console.log(sightingData);

// Select the table body
var tbody =  d3.select('tbody');

// Select the form
var form = d3.select("#form");

// Select the button
var button = d3.select("#filter-btn");

// Enter data to the table
createtable(sightingData);

// Create event handlers 
form.on("change", runChange);
button.on("click", runEnter);



function createtable(data){
    data.forEach(record => {
        var newrow = tbody.append('tr');
        Object.values(record).forEach((value) => {
            var newtd = newrow.append('td');
            newtd.text(value);
            })
    })   
}


// Complete the event handler function for the form
function runChange() {

    // Prevent the page from refreshing
    d3.event.preventDefault();
  
    // Select the input element and get the raw HTML node
    var inputElement = d3.select("#datetime");
  
    // Get the value property of the input element
    var inputValue = inputElement.property("value");
  
    // Print the value to the console
    console.log(inputValue);

    var filteredData = sightingData.filter(sighting => sighting.datetime === inputValue);

    console.log(filteredData);

  }

// Complete the event handler function for the button
function runEnter() {

    // Prevent the page from refreshing
    d3.event.preventDefault();
  
    // Select the input element and get the raw HTML node
    var inputElement = d3.select("#datetime");
  
    // Get the value property of the input element
    var inputValue = inputElement.property("value");
  
    // Print the value to the console
    console.log(inputValue);

    var filteredData = sightingData.filter(sighting => sighting.datetime === inputValue);

    // remove any children from the table
    tbody.html("");

    createtable(filteredData);

  }
