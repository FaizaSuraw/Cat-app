import "./style.css";
import axios from "axios";

(function () {
  const r = document.createElement("link").relList;
  if (r && r.supports && r.supports("modulepreload")) return;
  for (const t of document.querySelectorAll('link[rel="modulepreload"]')) o(t);
  new MutationObserver((t) => {
    for (const n of t)
      if (n.type === "childList")
        for (const a of n.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && o(a);
  }).observe(document, { childList: true, subtree: true });

  function i(t) {
    const n = {};
    t.integrity && (n.integrity = t.integrity);
    t.referrerPolicy && (n.referrerPolicy = t.referrerPolicy);
    n.credentials =
      t.crossOrigin === "use-credentials"
        ? "include"
        : t.crossOrigin === "anonymous"
          ? "omit"
          : "same-origin";
    return n;
  }

  function o(t) {
    if (t.ep) return;
    t.ep = true;
    const n = i(t);
    fetch(t.href, n);
  }
})();

const catFactsList = document.getElementById("catFacts-list");
const catPhotosList = document.getElementById("image-list");
const loader = document.getElementById("loading");

const catFactsInput = document.getElementById("numberOfCats");
const catPhotosInput = document.getElementById("numberOfCatPhotos");

const catFactsButton = document.getElementById("catFacts-button");
const catPhotosButton = document.getElementById("catPhotos-button");

// Helpers
const showLoader = () => loader.classList.add("loading-active");
const hideLoader = () => loader.classList.remove("loading-active");
const clearContent = () => {
  catFactsList.innerHTML = "";
  catPhotosList.innerHTML = "";
};

// Validate inputs
const getValidatedCount = (inputEl, max) => {
  let count = parseInt(inputEl.value);
  return isNaN(count) || count <= 0 ? 1 : Math.min(count, max);
};

// Render facts
const renderFacts = (facts) => {
  facts.forEach((fact) => {
    const li = document.createElement("li");
    li.innerText = fact;
    catFactsList.appendChild(li);
  });
};

// Render images
const renderPhotos = (photos) => {
  photos.forEach((photo) => {
    const div = document.createElement("div");
    div.classList.add("img-wrapper");
    const img = document.createElement("img");
    img.src = photo.url;
    div.appendChild(img);
    catPhotosList.appendChild(div);
  });
};

// Fetch facts
async function fetchCatFacts() {
  const count = getValidatedCount(catFactsInput, 50);
  clearContent();
  showLoader();

  try {
    const res = await axios.get(
      `https://meowfacts.herokuapp.com/?count=${count}`,
    );
    renderFacts(res.data.data);
  } catch {
    catFactsList.innerHTML = `<p class="cat-error">Failed to fetch cat facts.</p>`;
  } finally {
    hideLoader();
  }
}

// Fetch photos
async function fetchCatPhotos() {
  const count = getValidatedCount(catPhotosInput, 10);
  clearContent();
  showLoader();

  try {
    const res = await axios.get(
      `https://api.thecatapi.com/v1/images/search?limit=${count}`,
    );
    renderPhotos(res.data);
  } catch {
    catPhotosList.innerHTML = `<p class="cat-error">Failed to fetch cat photos.</p>`;
  } finally {
    hideLoader();
  }
}

// Event Listeners
catFactsButton.addEventListener("click", (e) => {
  e.preventDefault();
  fetchCatFacts();
});

catPhotosButton.addEventListener("click", (e) => {
  e.preventDefault();
  fetchCatPhotos();
});
