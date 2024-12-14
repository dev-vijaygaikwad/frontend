// Sample data to simulate search results
const searchResults = [
  { placeName: "Paris", country: "France", countryId: "FR" },
  { placeName: "Tokyo", country: "Japan", countryId: "JP" },
  { placeName: "New York", country: "USA", countryId: "US" },
];

// Function to display results in the table
function displayResults(results) {
  const tableBody = document.querySelector("#placesTableBody");
  tableBody.innerHTML = ""; // Clear previous results
  if (results.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="3">No result found</td></tr>';
    return;
  }

  results.forEach((result, index) => {
    const row = document.createElement("tr");
    row.innerHTML = ` <td>${index + 1}</td> <td>${
      result.placeName
    }</td> <td> <img src="https://flagsapi.com/${
      result.countryId
    }/shiny/32.png" alt="${result.country} Flag"> ${result.country} </td> `;
    tableBody.appendChild(row);
  });
}

// Function to filter results based on search input
function filterResults(query) {
  if (query === null || query === undefined || query.trim() === "") {
    document.querySelector("#placesTableBody").innerHTML =
      '<tr><td colspan="3">Start searching</td></tr>';
    return;
  }
  const filteredResults = searchResults.filter(
    (result) =>
      result.placeName.toLowerCase().includes(query.toLowerCase()) ||
      result.country.toLowerCase().includes(query.toLowerCase())
  );
  displayResults(filteredResults);
}

function fetchResults() {
  //document.getElementById("spinner").style.display = "block";
  setTimeout(() => {
    //document.getElementById("spinner").style.display = "none";
    displayResults(searchResults); // Display sample results
  }, 2000);
}

fetchResults();

// Event listener for the search
document
  .getElementById("search")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const query = this.value;
      if (query) {
        filterResults(query);
      } else {
        fetchResults();
      }
    }
  });

document.addEventListener("keydown", function (event) {
  if ((event.ctrlKey || event.metaKey) && event.key === "/") {
    document.getElementById("search").focus();
    event.preventDefault();
  }
});
