// Sample data to simulate search results
const searchResults = [
  { placeName: "Paris", country: "France", countryId: "FR" },
  { placeName: "Tokyo", country: "Japan", countryId: "JP" },
  { placeName: "New York", country: "USA", countryId: "US" },
];
const resultsPerPage = 3; // Number of results per page
let currentPage = 1;

// Function to display results in the table

function displayResults(results, page) {
  const tableBody = document.querySelector("#placesTableBody");
  tableBody.innerHTML = ""; // Clear previous results

  if (results.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="3">No result found</td></tr>';
    return;
  }

  const start = (page - 1) * resultsPerPage;
  const end = start + resultsPerPage;
  const paginatedResults = results.slice(start, end);

  paginatedResults.forEach((result, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${start + index + 1}</td>
          <td>${result.placeName}</td>
          <td>
              <img src="https://flagsapi.com/${
                result.countryId
              }/shiny/32.png" alt="${result.country} Flag">
              ${result.country}
          </td>
      `;
    tableBody.appendChild(row);
  });

  updatePaginationInfo(results.length, page);
}

function updatePaginationInfo(totalResults, page) {
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  document.getElementById(
    "page-info"
  ).textContent = `Page ${page} of ${totalPages}`;
  document.getElementById("prev-page").disabled = page === 1;
  document.getElementById("next-page").disabled = page === totalPages;
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
  displayResults(filteredResults, 1);
}

async function fetchPlaces(){
  https://wft-geo-db.p.rapidapi.com/v1/geo/cities
}


function fetchResults() {
  document.getElementById("spinner").style.display = "block";
  setTimeout(() => {
    document.getElementById("spinner").style.display = "none";
    displayResults(searchResults, currentPage); // Display sample results
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

// Event listeners for pagination buttons
document.getElementById("prev-page").addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    displayResults(searchResults, currentPage);
  }
});
document.getElementById("next-page").addEventListener("click", function () {
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayResults(searchResults, currentPage);
  }
});
