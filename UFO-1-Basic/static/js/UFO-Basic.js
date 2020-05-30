// from data.js
var sightingsData = data;

// Select the table body
var tbody =  d3.select('tbody');

/* ------------------------------------------------------ */

function capitalize(string){
  return string.charAt(0).toUpperCase() + string.slice(1) 
};

/* ------------------------------------------------------ */

function titleCase(string) {

  // Convert the string to lowercase and split at space
  var splitStr = string.toLowerCase().split(' ');

  // Loop thru all the words
  for (var i = 0; i < splitStr.length; i++) {
      // Change 1st letter of each word to uppercase and assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }

  // Return the joined string
  return splitStr.join(' '); 
}

/* ------------------------------------------------------ */
 
function transformData(data){

  data.forEach(sighting => {

      Object.entries(sighting).forEach( ( [key,value] ) => {
  
          if (key == 'state' || key == 'country') {
              sighting[key] = value.toUpperCase();
          }
          else if (key == 'city'){
              sighting[key] = titleCase(value);
          } 
          else if (key == 'shape'){
              sighting[key] = capitalize(value);
          }
          else if (key == 'comments') {
              sighting[key] = sighting[key].replace(/&#44|&#33|&#39|&quot;/g,"");
          }
          else {
              sighting[key] = value;
          }
          
      });
  });

  console.log(data);
}

/* ------------------------------------------------------ */

function buildTable(data){

  // remove data from the table
  tbody.html("");

  data.forEach(record => {

      const newrow = tbody.append('tr');

      Object.values(record).forEach(value => {
          let newtd = newrow.append('td');
          newtd.text(value);
      }); 
  });
};

/* ------------------------------------------------------ */

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

    var filteredData = sightingsData.filter(sighting => sighting.datetime === inputValue);

    console.log(filteredData);

  }

/* ------------------------------------------------------------ */

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

    var filteredData = sightingsData.filter(sighting => sighting.datetime === inputValue);

    // remove any children from the table
    tbody.html("");

    buildTable(filteredData);

  };
/* ----------------------------------------------------------- */

// Clean up data
transformData(sightingsData);

// Enter data to the table
buildTable(sightingsData);

// Select the form
var form = d3.select("#form");

// Select the button
var button = d3.select("#filter-btn");

// Create event handlers 
form.on("change", runChange);
button.on("click", runEnter);

/* ------------------------------------------------------ */