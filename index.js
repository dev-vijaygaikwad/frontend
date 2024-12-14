// Sample data to simulate search results
let searchResults = [
  // { placeName: "Paris", country: "France", countryId: "FR" },
  // { placeName: "Tokyo", country: "Japan", countryId: "JP" },
  // { placeName: "New York", country: "USA", countryId: "US" },
];
let resultsPerPage = 5; // Number of results per page
let currentPage = 1;

// Function to display results in the table

function displayResults(results, page) {
  console.log("results ", results);
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
          <td>${result.city}</td>
          <td>
            <div class="country-item">
              <img src="https://flagsapi.com/${
                result.countryCode
              }/shiny/32.png" alt="${result.country} Flag">
              <span>  </span>
              ${result.country}
              </div>
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
      result.city.toLowerCase().includes(query.toLowerCase()) ||
      result.country.toLowerCase().includes(query.toLowerCase())
  );
  displayResults(filteredResults, 1);
}

async function fetchResults(resultsPerPage) {
  document.getElementById("spinner").style.display = "block";

  try {
    const response = await fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=${resultsPerPage}`,
      {
        headers: {
          "x-rapidapi-key":
            "API_KEY", // get your key from https://rapidapi.com/wirefreethought/api/geodb-cities
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    searchResults = [...data.data];
  } catch (error) {
    console.error("Error:", error);
  }
  document.getElementById("spinner").style.display = "none";

  displayResults(searchResults, currentPage); // Display sample results
}

fetchResults(resultsPerPage);

// Event listener for the search
document
  .getElementById("search")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const query = this.value;
      if (query) {
        filterResults(query);
      } else {
        fetchResults(resultsPerPage);
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

document
  .getElementById("rows-per-page")
  .addEventListener("input", function (event) {
    // Get the current value of the text box
    const currentValue = event.target.value;
    if (currentValue < 5 || currentValue > 10) {
      document.getElementById("rows-per-page-warning").innerHTML =
        "Please enter correct value";
    } else {
      document.getElementById("rows-per-page-warning").innerHTML = "";
      resultsPerPage = currentValue;
      fetchResults(resultsPerPage);
    }
  });
