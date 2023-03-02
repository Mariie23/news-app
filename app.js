const searchForm = document.forms["search-form"];
const countrySelect = searchForm.elements["select-country"];
const searchInput = searchForm.elements["search-input"];

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchText = searchInput.value;
  const country = countrySelect.value;
  searchText
    ? newsService.everything(searchText)
    : newsService.topHeadlines(country);
});

function customHttp() {
  return {
    get(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = () => {
          Math.floor(xhr.status / 100) === 2
            ? resolve(JSON.parse(xhr.responseText))
            : reject(`ERROR. Status code: ${xhr.status}`);
        };
        xhr.onerror = () => {
          reject(`ERROR. Status code: ${xhr.status}`);
        };
        xhr.send();
      });
    },
    post(url, headers, body) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.onload = () => {
          Math.floor(xhr.status / 100) === 2
            ? resolve(JSON.parse(xhr.responseText))
            : reject(`ERROR. Status code: ${xhr.status}`);
        };
        xhr.onerror = () => {
          reject(`ERROR. Status code: ${xhr.status}`);
        };
        if (headers) {
          Object.entries(headers).forEach(([key, value]) =>
            xhr.setRequestHeader(key, value)
          );
        }
        xhr.send(JSON.stringify(body));
      });
    },
  };
}

const http = customHttp();

const newsService = (function () {
  const key = "101c8a063a9a4d6a93015dafad15a353";
  const apiUrl = "https://newsapi.org/v2";

  return {
    topHeadlines(country) {
      console.log(`${apiUrl}/top-headlines?country=${country}&apiKey=${key}`);
      http
        .get(`${apiUrl}/top-headlines?country=${country}&apiKey=${key}`)
        .then((response) => renderNews(response));
    },
    everything(query) {
      console.log(`${apiUrl}/everything?q=${query}&apiKey=${key}`);
      http
        .get(`${apiUrl}/everything?q=${query}&apiKey=${key}`)
        .then((response) => renderNews(response));
    },
  };
})();

function loadNews() {
  newsService.topHeadlines("ru");
}

function renderNews(news) {
  const newsContainer = document.querySelector(".news__container");
  if (newsContainer.children.length) newsContainer.innerHTML = "";
  let fragment = "";
  news.articles.forEach((article) => {
    fragment += createAtrticleTemplate(article);
  });
  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

function createAtrticleTemplate({ urlToImage, title, url }) {
  return `
        <div class="col-xl-4 col-md-6 col-sm-12 mt-3">
          <div class="card news-item ">
              <img src="${urlToImage}" class="card-img-top">
              <div class="card-body">
                  <h5 class="card-title news-item__title">${title}</h5>
                  <a class="btn btn-primary" href="${url}">Подробнее</a>
              </div>
          </div>
        </div>
    `;
}

loadNews();
