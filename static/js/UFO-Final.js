var sightingsData = data; // from data.js/*

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

    // Select the table body
    var tbody =  d3.select('tbody');

    // remove data from the table
    tbody.html("");

    data.forEach(record => {

        const newrow = tbody.append('tr');

        Object.values(record).forEach(value => {
            let newtd = newrow.append('td');
            newtd.text(value);
        }); 
    });
}

/* ------------------------------------------------------ */

function findDistinct(data) {

    var distinct_dict = { 'country': [],
                          'state': [],
                          'city': [],
                          'date': [],
                          'shape': []
                        };

    data.forEach(sighting => {
        Object.entries(sighting).forEach( ([key, value]) => {       
            if (distinct_dict[key] && ! distinct_dict[key].includes(value)){
                distinct_dict[key].push(value);
            }
        })
    });

    // sorting in alphatical order for dropdown menu
    Object.keys(distinct_dict).forEach(key => {
        distinct_dict[key].sort();
    });

    console.log("Updated distinct_dict:", distinct_dict);

    return distinct_dict;
};

/* ------------------------------------------------------ */

function createDropdown(key) {

    let ul = d3.select("#filters");

    // Create a new li and assign attributes to it
    let newLi = ul.append('li');
    newLi.attr('class', 'filter list-group-item');

    // Creating a new label and assigning attributes to it 
    let newLabel = newLi.append('label');
    newLabel.text("Enter a " + capitalize(key));
    newLabel.attr('for', key);

    // Creating a new input and assigning attributes to it
    let newSelect = newLi.append('select')
    newSelect.attr('class', 'form-control');
    newSelect.attr('id', key);
    newSelect.attr('type', 'text');

    // Adding a 'optgroup' to wrap the dropdown options(to apply styles)
    let newOptgroup = newSelect.append('optgroup');
    newOptgroup.attr('class', `${key}_options`);

    // Creating a dropdown menu
    let newOption = newOptgroup.append('option');
    newOption.attr('value', "")
    newOption.text("Choose a " + capitalize(key));
    
   // Lopping thru the distinct values of each key and adding them to dropdown menu
    distinct[key].forEach(value => {
        newOption = newOptgroup.append('option');
        newOption.attr('value', value)
        newOption.text(value);

    });

};

/* ------------------------------------------------------ */

function updateDropdown(data) {

    var distinctFiltereddata = findDistinct(data);

    Object.entries(distinctFiltereddata).forEach( ([key,values]) => {
        
        let optGroup = d3.select(`.${key}_options`)
        optGroup.html("");

        let newOption = optGroup.append('option');
        newOption.attr('value', "")
        newOption.text("Choose a " + capitalize(key));

        values.forEach(value => {
            newOption = optGroup.append('option');
            newOption.attr('value', value)
            newOption.text(value);   
        });
    });

    // Displaying selected option in its input field
    Object.entries(filters).forEach(([key,value]) => {
        let optgroup = d3.select(`.${key}_options`);
        optgroup.html("");
        newOption = optgroup.append('option');
        newOption.text(value);

    });
};

/* ------------------------------------------------------ */

// Keep track of all filters
var filters = {};

function updateFilters() {

    var changedElement = d3.select(this).select('select');
    var elementValue = changedElement.property('value');
    var filterId = changedElement.attr('id');

    console.log(changedElement);
    //console.log("Filter applied:", capitalize(filterId), ":", elementValue);

    // If a filter value was entered add that filterId and value to filters array.
    // Otherwise clear that filter from filters array.
    if (elementValue) {
        filters[filterId] = elementValue;
    }
    else {
        delete filters[filterId];
    }
    console.log('Filters applied');

    Object.entries(filters).forEach(([key,value]) => {
        console.log(key,value);
    });

    filterTable();
};

/* ------------------------------------------------------ */

function filterTable() {

    var filteredData = sightingsData;

    // Loop through the filters and keep the data that matches the filter values
    Object.entries(filters).forEach(([key,value])  => {
        filteredData = filteredData.filter( row => row[key] == value );
    
        // Rebuild the table using filtered data
        buildTable(filteredData);

        updateDropdown(filteredData);

    });

};

/* ------------------------------------------------------ */

// Clean up data
transformData(sightingsData);

// Build the table using original data when page loads
buildTable(sightingsData);

// Find distinct values for each key
var distinct = findDistinct(sightingsData);

// Add Input-fields for all the keys and dropdown for distinct values
Object.keys(distinct).forEach(key => createDropdown(key));

// Attach an event listener for changes in any filter
d3.selectAll('.filter').on('change', updateFilters);

/* ------------------------------------------------------ */
