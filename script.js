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
    .map((border) => `<span class="border1">${border}</span>`)
    .join(" ");

  const markup = `
    <img class="big-flag" src="${data[0].flags.png}" alt="flag" />
    <div class="country-details">
      <h2>${data[0].name.common}</h2>
      <div class="super-flex">
        <div>
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
        <p>
          Border Countries: ${borderSpans}
        </p>
    </div>
  `;

  details.insertAdjacentHTML("beforeend", markup);

  const borderElements = document.querySelectorAll(".border1");

  borderElements.forEach((borderElement, index) => {
    const fetchData = async function (name) {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${name}`
      );

      const data = await response.json();
      generateMarkup(data);

      return data;
    };
    borderElement.addEventListener("click", () => {
      if (data[0].borders[index]) {
        const border = data[0].borders[index];
        const borderMarkup = generateDetailMarkup(border); // Replace this with your markup generation function

        // Clear existing content in the container
        borderDetailsContainer.innerHTML = "";

        // Append the generated markup to the container
        borderDetailsContainer.insertAdjacentHTML("beforeend", borderMarkup);
      } else {
        console.error("Border data for this index is undefined or missing.");
      }
    });
  });
};

const countryCard = document.querySelector(".country-card");

const generateMarkup = function (data) {
  const cardsContainer = document.querySelector(".cards");

  const markup = `
    <div class="card">
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
});

renderDefaultCountries();

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

const searchResults = async function () {
  const input = document.querySelector('input[type="text"]');
  const inputValue = input.value.trim().toLowerCase();

  if (inputValue === "") {
    renderDefaultCountries();
    return;
  }

  const response = await fetch(
    `https://restcountries.com/v3.1/name/${inputValue}`
  );
  const data = await response.json();

  showResults(data);
};

function renderDefaultCountries() {
  const countries = [
    { name: "germany", element: germany },
    { name: "usa", element: usa },
    { name: "brasil", element: brasil },
    { name: "iceland", element: iceland },
    { name: "afghanistan", element: afghanistan },
    { name: "Åland Islands", element: alandIslands },
    { name: "albania", element: albania },
    { name: "algeria", element: algeria },
  ];

  countries.forEach(({ name, element }) => {
    fetchData(name, element);
  });

  cardsContainer.innerHTML = "";
}

function showResults(data) {
  const cardsContainer = document.querySelector(".cards");

  const markup = `
      <div class="card">
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
