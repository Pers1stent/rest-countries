//Countries preview
const germany = document.querySelector(".germany");
const usa = document.querySelector(".usa");
const brasil = document.querySelector(".brasil");
const iceland = document.querySelector(".iceland");
const afghanistan = document.querySelector(".afghanistan");
const alandIslands = document.querySelector(".aland_islands");
const albania = document.querySelector(".albania");
const algeria = document.querySelector(".algeria");

const filter = document.querySelector(".filter");
const filterRegion = document.querySelector(".filter_region");
const input = document.querySelector("input");
const closestEl = input.closest(".search");
const details = document.querySelector(".details");
const cardsContainer = document.querySelector(".cards");
const searchingPanel = document.querySelector(".searching_panel");

let darkMode = true;

const generateDetailMarkup = function (data) {
  const details = document.querySelector(".details");
  details.innerHTML = "";

  const languagesArray = Object.entries(data[0].languages).map(
    ([key, value]) => ({
      code: key,
      name: value,
    })
  );

  const languageList = languagesArray
    .map((language) => `${language.name}`)
    .join(", ");

  const keys = Object.keys(data[0].currencies);
  const firstKey = keys[0];

  const borderSpans = data[0].borders
    ? data[0].borders
        .map((border) => `<span class="border1">${border}</span>`)
        .join(" ")
    : `<span class='border1'>No bordering countries</span>`;

  const markup = `
    <img class="big-flag" src="${data[0].flags.png}" alt="flag" />
    <div class="country-details">
      <h2>${data[0].name.common}</h2>
      <div class="super-flex">
        <div class='margin'>
          <p>Native name: <span>${data[0].altSpellings[1]}</span></p>
          <p>Population: <span>${data[0].population.toLocaleString()}</span></p>
          <p>Region: <span>${data[0].region}</span></p>
          <p>Sub Region: <span>${data[0].subregion}</span></p>
          <p>Capital: <span>${data[0].capital}</span></p>
        </div>
        <div>
          <p>Top Level Domain: <span>${data[0].tld}</span></p>
          <p>Currencies: <span>${data[0].currencies[firstKey].name}</span></p>
          <p>Languages: <span>${languageList}</span></p>
        </div>
      </div>
      <div class="borders">
        <p>Border Countries: ${borderSpans}</p>
      </div>
    </div>
  `;

  details.insertAdjacentHTML("beforeend", markup);

  const borderElements = document.querySelectorAll(".border1");
  borderElements.forEach((borderElement, index) => {
    borderElement.addEventListener("click", async () => {
      const border = data[0].borders[index];
      generateBorderDetails(border);
    });
  });

  document.querySelector(".wrapper").style.height = "92vh";
};

const generateBorderDetails = async (borderCode) => {
  const response = await fetch(
    `https://restcountries.com/v3.1/alpha/${borderCode}`
  );
  const borderData = await response.json();

  const languagesArray = Object.entries(borderData[0].languages).map(
    ([key, value]) => ({
      code: key,
      name: value,
    })
  );

  const languageList = languagesArray
    .map((language) => `${language.name}`)
    .join(", ");

  const keys = Object.keys(borderData[0].currencies);
  const firstKey = keys[0];

  const borderSpan = borderData[0].borders
    ? borderData[0].borders
        .map((border) => `<span class="border1">${border}</span>`)
        .join(" ")
    : `<span class='border1'>No bordering countries</span>`;

  const borderMarkup = `
    <img class="big-flag" src="${borderData[0].flags.png}" alt="flag" />
    <div class="country-details">
      <h2>${borderData[0].name.common}</h2>
      <div class="super-flex">
        <div>
          <p>Native name: <span>${borderData[0].altSpellings[1]}</span></p>
          <p>Population: <span>${borderData[0].population.toLocaleString()}</span></p>
          <p>Region: <span>${borderData[0].region}</span></p>
          <p>Sub Region: <span>${borderData[0].subregion}</span></p>
          <p>Capital: <span>${borderData[0].capital}</span></p>
        </div>
        <div>
          <p>Top Level Domain: <span>${borderData[0].tld}</span></p>
          <p>Currencies: <span>${
            borderData[0].currencies[firstKey].name
          }</span></p>
          <p>Languages: <span>${languageList}</span></p>
        </div>
      </div>
      <div class="borders">
        <p>Border Countries: ${borderSpan}</p>
      </div>
    </div>
  `;

  details.innerHTML = "";
  details.insertAdjacentHTML("beforeend", borderMarkup);

  const borderElements = document.querySelectorAll(".border1");
  borderElements.forEach((borderElement, index) => {
    borderElement.addEventListener("click", async () => {
      const border = borderData[0].borders[index];
      generateBorderDetails(border);
    });
  });
};

const countryCard = document.querySelector(".country-card");

const generateMarkup = function (data) {
  const cardsContainer = document.querySelector(".cards");

  const cardClass = darkMode ? "dark_card" : "";

  const markup = `
    <div class="card ${cardClass}">
      <div class="flag"><img src='${data[0].flags.png}' /></div>
      <div class="data">
        <h2>${data[0].name.common}</h2>
        <div>
          <p>Population: <span>${data[0].population.toLocaleString()}</span></p>
          <p>Region: <span>${data[0].region}</span></p>
          <p>Capital: <span>${data[0].capital}</span></p>
        </div>
      </div>
    </div>
  `;

  cardsContainer.insertAdjacentHTML("beforeend", markup);

  const lastCard = cardsContainer.lastElementChild;
  lastCard.addEventListener("click", function () {
    generateDetailMarkup(data);
    cardsContainer.classList.add("hidden");
    countryCard.classList.remove("hidden");
    searchingPanel.classList.add("hidden");
  });
};

const fetchData = async function (name) {
  const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);

  const data = await response.json();
  console.log(data);
  generateMarkup(data);
};

const back = document.querySelector(".back");

back.addEventListener("click", function () {
  cardsContainer.classList.remove("hidden");
  countryCard.classList.add("hidden");
  searchingPanel.classList.remove("hidden");
  document.querySelector(".wrapper").style.height = "";
});

let selectedRegion = null;

renderDefaultCountries(selectedRegion);

document.addEventListener("DOMContentLoaded", function () {
  closestEl.addEventListener("click", function () {
    input.focus();
  });

  document.addEventListener("click", function (e) {
    if (!closestEl.contains(e.target)) {
      input.blur();
    }
  });
});

filter.addEventListener("click", function () {
  filterRegion.classList.toggle("hidden");
});

document.addEventListener("click", function (e) {
  if (!filter.contains(e.target)) {
    filterRegion.classList.add("hidden");
  }
});

const filterCountries = async function (selectedRegion) {
  const response = await fetch(
    `https://restcountries.com/v3.1/region/${selectedRegion}`
  );

  const data = await response.json();
  showResults(data);
  updateFilterText(selectedRegion);
};

function updateFilterText(selectedRegion) {
  const filterText = document.getElementById("filterText");
  if (selectedRegion) {
    filterText.textContent = `Filter by ${selectedRegion}`;
  } else {
    filterText.textContent = "Filter by Region";
  }
}

const searchResults = async function () {
  const input = document.querySelector('input[type="text"]');
  const inputValue = input.value.trim().toLowerCase();

  if (inputValue === "") {
    renderDefaultCountries();
    return;
  }

  let filteredData = [];

  if (selectedRegion) {
    const response = await fetch(
      `https://restcountries.com/v3.1/region/${selectedRegion}`
    );
    const regionData = await response.json();
    filteredData = regionData.filter((country) =>
      country.name.common.toLowerCase().includes(inputValue)
    );
  } else {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${inputValue}`
    );
    filteredData = await response.json();
  }

  showResults(filteredData);
};

function renderDefaultCountries() {
  selectedRegion;
  const countries = [
    { name: "germany", element: germany, region: "Europe" },
    { name: "usa", element: usa, region: "Americas" },
    { name: "brasil", element: brasil, region: "Americas" },
    { name: "iceland", element: iceland, region: "Europe" },
    { name: "afghanistan", element: afghanistan, region: "Asia" },
    { name: "Åland Islands", element: alandIslands, region: "Europe" },
    { name: "albania", element: albania, region: "Europe" },
    { name: "algeria", element: algeria, region: "Africa" },
  ];

  const filteredCountries = selectedRegion
    ? countries.filter((country) => country.region === selectedRegion)
    : countries;

  filteredCountries.forEach(({ name, element }) => {
    fetchData(name, element);
  });

  const cardsContainer = document.querySelector(".cards");
  cardsContainer.innerHTML = "";
}

function showResults(data) {
  const cardsContainer = document.querySelector(".cards");

  const cardClass = darkMode ? "dark_card" : "";

  const markup = `
      <div class="card ${cardClass}">
        <div class="flag"><img src='${data[0].flags.png}' /></div>
        <div class="data">
          <h2>${data[0].name.common}</h2>
          <div>
            <p>Population: <span>${data[0].population.toLocaleString()}</span></p>
            <p>Region: <span>${data[0].region}</span></p>
            <p>Capital: <span>${data[0].capital}</span></p>
          </div>
        </div>
      </div>
    `;
  cardsContainer.innerHTML = markup;

  const lastCard = cardsContainer.lastElementChild;
  lastCard.addEventListener("click", function () {
    generateDetailMarkup(data);
    cardsContainer.classList.add("hidden");
    countryCard.classList.remove("hidden");
    searchingPanel.classList.add("hidden");
  });
}

input.addEventListener("input", searchResults);

const filterRegions = function () {
  const filter = document.querySelectorAll(".filter_region p");

  filter.forEach((region) =>
    region.addEventListener("click", async function () {
      const clickedRegion = region.getAttribute("data-region");

      if (clickedRegion === selectedRegion) {
        selectedRegion = null;
        updateFilterText(selectedRegion);
      } else {
        selectedRegion = clickedRegion;
        await filterCountries(selectedRegion);
      }
      searchResults();
    })
  );
};

filterRegions();

document.querySelector(".mode").addEventListener("click", function () {
  darkMode = !darkMode;

  document.querySelector("input").classList.toggle("dark_input");
  document.querySelector(".search").classList.toggle("dark_search");
  document.querySelector("header").classList.toggle("dark_header");
  document.querySelector(".back").classList.toggle("dark_back");
  filter.classList.toggle("dark_filter");
  filterRegion.classList.toggle("dark_filter_region");
  document.querySelector(".wrapper").classList.toggle("dark_wrapper");
  document.querySelector(".details").classList.toggle("dark_details");

  const allCard = document.querySelectorAll(".card");
  allCard.forEach((card) => card.classList.toggle("dark_card"));

  document.querySelector(".moon").classList.toggle("hidden");
  document.querySelector(".dark_moon").classList.toggle("hidden");

  document.querySelector(".search-icon").classList.toggle("hidden");
  document.querySelector(".dark-search-icon").classList.toggle("hidden");

  document.querySelector(".arrow-down").classList.toggle("hidden");
  document.querySelector(".dark_arrow-down").classList.toggle("hidden");

  document.querySelector(".arrow-back").classList.toggle("hidden");
  document.querySelector(".dark_arrow-back").classList.toggle("hidden");

  document.querySelector(".footer").classList.toggle("dark_footer");
});
