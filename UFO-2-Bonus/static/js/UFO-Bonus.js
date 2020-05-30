var sightingsData = data; // from data.js

console.log(sightingsData);

/* ------------------------------------------------------ */

function buildTable(data){

    // Select the table body
    var tbody =  d3.select('tbody');

    // remove data from the table
    tbody.html("");

    data.forEach(record => {

        const newrow = tbody.append('tr');

        Object.values(record).forEach((value) => {
            let newtd = newrow.append('td');
            newtd.text(value);

        });
    });   
}

/* ------------------------------------------------------ */

function addInput(key) {

    var ul = d3.select("#filters");

    var newLi = ul.append('li');
    // Create a new li and assign attributes to it
    newLi.attr('class', 'filter list-group-item');

    var newLabel = newLi.append('label');
    // Creating a new label and assigning attributes to it 
    newLabel.text("Enter a "+ key.charAt(0).toUpperCase() + key.slice(1));
    newLabel.attr('for', key);

    // Creating a new input and assigning attributes to it
    newInput = newLi.append('input')
    newInput.attr('class', "form-control");
    newInput.attr('id', key);
    newInput.attr('type', 'text');
    newInput.attr('placeholder', sightingsData[1][key]);
};

/* ------------------------------------------------------ */

// Keep track of all filters
var filters = {};

function updateFilters() {

    var changedElement = d3.select(this).select('input');
    var elementValue = changedElement.property('value');
    var filterId = changedElement.attr('id');

    console.log(changedElement);
    console.log("Filter applied:", filterId, "-", elementValue);

    // If a filter value was entered add that filterId and value to filters array.
    //  Otherwise clear that filter from filters array.
    if (elementValue) {
        filters[filterId] = elementValue;
    }
    else {
        delete filters[filterId];
    }

    console.log(Object.entries(filters));

    filterTable();
};

/* ------------------------------------------------------ */

function filterTable() {

    let filteredData = sightingsData;

    // Loop through the filters and keep the data that matches the filter values
    Object.entries(filters).forEach(([key,value])  => {
        filteredData = filteredData.filter(row => row[key].startsWith(value));
    
        // Rebuild the table using filtered data
        buildTable(filteredData);

    });
};

/* ------------------------------------------------------ */

// Build the table using original data when page loads
buildTable(sightingsData);

// keys to add Input-fields
var keys = ['country', 'state', 'city', 'date', 'shape'];
keys.forEach(key => addInput(key));

// Attach an event listener for changes in any filter
d3.selectAll('.filter').on('keyup', updateFilters)
