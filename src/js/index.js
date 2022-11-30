import { Notify } from 'notiflix/build/notiflix-notify-aio';

import PixabayApiService from './pixabayApi';
const pixabayApiService = new PixabayApiService();

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

let options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(observerCallback, options);
let target = document.querySelector('.target-js');

// observer.root.style.border = "2px solid #44aa44";

function observerCallback(entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
    if (entry.isIntersecting) {
      console.log('isIntersecting');
      onLoadMore();
    }
    // Each entry describes an intersection change for one observed
    // target element:
    //   entry.boundingClientRect
    //   entry.intersectionRatio
    //   entry.intersectionRect
    //   entry.isIntersecting
    //   entry.rootBounds
    //   entry.target
    //   entry.time
  });
}

const gallery = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
// const loadMore = document.querySelector('.load-more');

// loadMore.setAttribute('hidden', true);

form.addEventListener('submit', onSearch);
// loadMore.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  clearGallery();
  // loadMore.removeAttribute("hidden")
  // loadMore.setAttribute('disabled', true)
  const { search } = form.elements;
  pixabayApiService.query = search.value;
  pixabayApiService.resetPage();

  pixabayApiService.fetchImages().then(response => {
    if (parseInt(response.data.totalHits) > 0) {
      Notify.success(`There are ${response.data.total} pics found!`);
      
      appendCatsMarkup(response.data.hits);

      lightbox.refresh();

      observer.observe(target);
      
      
      
      if (
        Math.ceil(response.data.total / pixabayApiService.per_page) ===
        pixabayApiService.page
      ) {
        observer.unobserve(target);
        // loadMore.setAttribute("hidden", true)
      }
      // else{
      // loadMore.removeAttribute("disabled")}
    } else Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  });
}

function markUpGallery(imgsArr) {
  // const {webformatURL, largeImageURL, tags, likes, views, comments, downloads} = imgsArr;
  return imgsArr
    .map(
      item =>
        `<div class = "gallery__item">
        <a href="${item.largeImageURL}">
        <img class="gallery__image" src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>${item.likes}
          </p>
          <p class="info-item">
            <b>Views</b>${item.views}
          </p>
          <p class="info-item">
            <b>Comments</b>${item.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${item.downloads}
          </p>
        </div>
        </div>`
    )
    .join('');
}

function appendCatsMarkup(hits) {
  gallery.insertAdjacentHTML('beforeend', markUpGallery(hits));
  lightbox.refresh();
}

function onLoadMore() {
  // pixabayApiService.getImage().then(resp=>appendCatsMarkup(resp.data.hits))
  // loadMore.setAttribute('disabled', true)
  pixabayApiService.incrementPage();
  pixabayApiService.fetchImages().then(response => {
    if (parseInt(response.data.totalHits) > 0) {
      appendCatsMarkup(response.data.hits);
      // loadMore.removeAttribute("disabled")
      const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    
      if (
        Math.ceil(response.data.total / pixabayApiService.per_page) ===
        pixabayApiService.page
      ) {
        observer.unobserve(target);
        // loadMore.setAttribute("hidden", true)
      }
    } else console.log('No hits');
  });
}

function clearGallery() {
  gallery.innerHTML = '';
}
