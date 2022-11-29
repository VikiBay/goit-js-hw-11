import PixabayApiService from './pixabayApi';
const pixabayApiService = new PixabayApiService();

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
let lightbox = new SimpleLightbox('.gallery a', { captionDelay:250, captionsData:"alt" });



const gallery = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const loadMore = document.querySelector('.load-more');

loadMore.setAttribute('hidden', true);

form.addEventListener('submit', onSearch);
loadMore.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  clearGallery();
  loadMore.removeAttribute("hidden")
  loadMore.setAttribute('disabled', true)
  const { search } = form.elements;
  pixabayApiService.query = search.value;
  pixabayApiService.resetPage()
  
  pixabayApiService.fetchImages().then(response => {
    if (parseInt(response.data.totalHits) > 0) {
      console.log("response", response);
      appendCatsMarkup(response.data.hits);
      // lightbox.refresh()
      if(Math.ceil(response.data.total/pixabayApiService.per_page)===pixabayApiService.page){
        loadMore.setAttribute("hidden", true)
      } else{
      loadMore.removeAttribute("disabled")}

    } else console.log('No hits');
  });
}

function markUpGallery(imgsArr) {
  // const {webformatURL, largeImageURL, tags, likes, views, comments, downloads} = imgsArr;
  return imgsArr
    .map(
      item =>
        // `<div class = "gallery__item">
        // <a class="gallery__item" href="${item.largeImageURL}">
        // <img class="gallery__image" src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
        // </a>
        // <div class="info">
        //   <p class="info-item">
        //     <b>Likes</b>${item.likes}
        //   </p>
        //   <p class="info-item">
        //     <b>Views</b>${item.views}
        //   </p>
        //   <p class="info-item">
        //     <b>Comments</b>${item.comments}
        //   </p>
        //   <p class="info-item">
        //     <b>Downloads</b>${item.downloads}
        //   </p>
        // </div>
        // </div>
        // `

        
        `<a class="gallery__item" href="${item.largeImageURL}">
        <img class="gallery__image" src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
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
        </div></a>`
    ).join('');
  
}


function appendCatsMarkup(hits){
  gallery.insertAdjacentHTML('beforeend', markUpGallery(hits));
  // lightbox.refresh()
}


function onLoadMore() {
  // pixabayApiService.getImage().then(resp=>appendCatsMarkup(resp.data.hits))
  loadMore.setAttribute('disabled', true)
  pixabayApiService.incrementPage();
  pixabayApiService.fetchImages().then(response => {
    if (parseInt(response.data.totalHits) > 0) {
      appendCatsMarkup(response.data.hits);
      loadMore.removeAttribute("disabled")
      console.log("response", response);
      console.log("page", pixabayApiService.page);
      console.log("response.data.total", response.data.total)
      console.log("searchParams.per_page", pixabayApiService.per_page)
      console.log(Math.ceil(response.data.total/pixabayApiService.per_page))
      if(Math.ceil(response.data.total/pixabayApiService.per_page)===pixabayApiService.page){
        loadMore.setAttribute("hidden", true)
      }
    } else console.log('No hits');
  });
}

function clearGallery(){
  gallery.innerHTML = '';
}