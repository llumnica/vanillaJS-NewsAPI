// VanillaJS here

// ------------------------------------------------------------ //
// ---------------------- Declarations  ----------------------- //
// ------------------------------------------------------------ //
const API_ENDPOINT = new URL(
  "https://free-news.p.rapidapi.com/v1/search?q=Elon Musk&lang=en&page=1&page_size=24"
);

const headers = new Headers();
headers.append(
  "X-RapidAPI-Key",
  "571ef9b324msh01709ecea494443p18ec05jsn9642e8304f0a"
);

const requestOptions = {
  headers: headers
};

let activePage = 1;

// ------------------------------------------------------------ //
// ------------------------- Events  -------------------------- //
// ------------------------------------------------------------ //
// Display news after all elements are loaded
window.addEventListener("load", () => {
  getNews();
});

// Search functionality (on enter event)
document.getElementById("search").onkeyup = function (event) {
  if (event.key === "Enter" || event.keyCode === 13) {
    resetNews();
    API_ENDPOINT.searchParams.set("q", this.value);
    API_ENDPOINT.searchParams.set("page", 1);
    activePage = 1;
    getNews();
  }
};

// Language functionality (on change event)
document.getElementById("lang").onchange = function () {
  resetNews();
  API_ENDPOINT.searchParams.set("lang", this.value);
  API_ENDPOINT.searchParams.set("page", 1);
  activePage = 1;
  getNews();
};

// Show number of news per page functionality (on change event)
document.getElementById("show").onchange = function () {
  resetNews();
  API_ENDPOINT.searchParams.set("page_size", this.value);
  API_ENDPOINT.searchParams.set("page", 1);
  activePage = 1;
  getNews();
};

// ------------------------------------------------------------ //
// ------------------------ Functions  ------------------------ //
// ------------------------------------------------------------ //
// Function used to render news (API call and view renderer)
const getNews = () => {
  requestOptions.method = "GET";
  fetch(API_ENDPOINT, requestOptions)
    .then(async (response) => {
      if (response.status !== 200) {
        throw new Error(response.status);
      } else {
        const data = await response.json();
        if (data.status === "ok") {
          //Display News
          data.articles.forEach((news) => {
            renderNews(news);
          });
          // Display Pagination
          renderPagination(data);
        } else {
          throw new Error(data.status);
        }
      }
    })
    .catch(function (e) {
      resetPagination();
      getNewsContainer().innerHTML = `<p>${e}</p>`;
    });
  hideLoader();
};

const getNewsContainer = () => {
  return document.getElementById("newsContainer");
};

const resetNews = () => {
  showLoader();
  getNewsContainer().innerHTML = "";
};

const resetPagination = () => {
  getPaginationElement().innerHTML = "";
};

const getPaginationElement = () => {
  return document.getElementById("pagination");
};

const showLoader = () => {
  // console.log("showed");
  document.getElementById("loader").className = "show";
};

const hideLoader = () => {
  // console.log("hidden");
  document.getElementById("loader").className = "hide";
};

const renderNews = (news) => {
  const publishedDate = new Date(news.published_date);
  const newsCard = document.createElement("div");
  newsCard.className = "news-card";
  newsCard.innerHTML = `
      <div class="news-card-header">
        <img class="news-img" src="${news.media}" alt="..." />
      </div>
      <div class="news-card-body">
        <h2 class="news-title">
          ${news.title.slice(0, 15)} 
          ${news.title.length > 15 ? "..." : ""}
        </h2>
        <p class="news-summary">
          ${news.summary.slice(0, 120)} 
          ${news.summary.length > 120 ? "..." : ""}
        </p>
        <a class="link" href="${news.link}" target="_blank">Read More</a>
      </div>
      <div class="news-card-footer">
        <p class="news-date">
          ${publishedDate.toLocaleDateString()}
        </p>
        <p class="news-counter">
          ${news.rank} | ${news.topic}
        </p>
      </div>`;
  getNewsContainer().appendChild(newsCard);
};

const renderPagination = (data) => {
  let pagerButton = getPaginationElement();
  resetPagination();
  let prevButton = document.createElement("button");
  prevButton.innerHTML = "≺";
  prevButton.className = "pages prev";
  if (activePage === 1) {
    prevButton.className = "pages prev hide";
  }
  getPaginationElement().append(prevButton);
  prevButton.addEventListener("click", function () {
    activePage = activePage - 1;
    API_ENDPOINT.searchParams.set("page", activePage);
    resetNews();
    getNews();
  });
  for (let i = 1; i <= data.total_pages; i++) {
    pagerButton = document.createElement("button");
    if (
      i === 1 ||
      i === 2 ||
      i === data.total_pages ||
      i === activePage + 2 ||
      i === activePage + 1 ||
      i === activePage ||
      i === activePage - 1 ||
      i === activePage - 2
    ) {
      if (i === activePage) {
        pagerButton.className = "pages active";
      } else {
        if (i === activePage - 2 && activePage > 6) {
          pagerButton.className = "pages before";
        } else if (i === activePage + 2 && activePage < data.total_pages - 3) {
          pagerButton.className = "pages after";
        } else {
          pagerButton.className = "pages";
        }
      }
    } else {
      pagerButton.className = "pages hide";
    }
    pagerButton.innerHTML = i;
    function displayPagination(index) {
      pagerButton.addEventListener("click", function () {
        activePage = index;
        API_ENDPOINT.searchParams.set("page", index);
        resetNews();
        getNews();
      });
    }
    displayPagination(i);
    getPaginationElement().appendChild(pagerButton);
  }
  let nextButton = document.createElement("button");
  nextButton.innerHTML = "≻";
  nextButton.className = "pages next";
  if (activePage === data.total_pages) {
    nextButton.className = "pages prev hide";
  }
  getPaginationElement().append(nextButton);
  nextButton.addEventListener("click", function () {
    activePage = activePage + 1;
    API_ENDPOINT.searchParams.set("page", activePage);
    resetNews();
    getNews();
  });
};
