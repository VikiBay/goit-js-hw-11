import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

const searchParams = new URLSearchParams({
        key: '31602918-2cfa6343bd6fc4425ecfe8e60',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        // per_page: 200,
      });


export default class PixabayApiService {
constructor(){
    this.query = '';
    this.per_page = 40;
    this.page = 1;
}

async fetchImages() {

    
        try {
          const response = await axios.get(
            `${BASE_URL}/?${searchParams}&q=${this.query}&per_page=${this.per_page}&page=${this.page}`
            // `${BASE_URL}/?${searchParams}&q=${this.query}&per_page=100&page=${this.page}`
          );
          
          return response;

        } catch (error) {
          console.error(error);
        }
      }

incrementPage(){
    this.page+=1;
}

resetPage(){
    this.page=1;
}
}