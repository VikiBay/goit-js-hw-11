import axios from 'axios';

const options = {
  headers: {
    'x-api-key':
      'live_7NieatcJCRwlfbZ3HKACehAWPhhAQHHlsuf5F8ssvqQ6umSknviBXXdl6fmJ5Zcp',
  },
};

let page = 0;

const catsList = document.querySelector('.cat-render');
// const loadMoreBtn = document.querySelector('.load-more')
const guard = document.querySelector('.guard-js');

let observerOptions = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(observerFunc, observerOptions);

// loadMoreBtn.addEventListener("click", onLoadMore)

// fetch('https://api.thecatapi.com/v1/images/search?limit=10',options).then(resp=>{
// if(!resp.ok){
//     throw new Error("Not OK")
// }
// return resp.json()
// }).then(data=>console.log(data))

async function getImage(page = 0) {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?limit=10&order=Asc&page=${page}`,
      options
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

getImage().then(resp => {
    console.log("resp",resp)
  catsRender(resp.data);
  observer.observe(guard);
  //   loadMoreBtn.removeAttribute("hidden")
});

function catsRender(catArr) {
  console.log(catArr);
  const catMarkup = catArr
    .map(
      cat =>
        `<li><img src="${cat.url}" alt="${cat.categories.name}" width="300px"></li>`
    )
    .join('');
  catsList.insertAdjacentHTML('beforeend', catMarkup);

  //
}

//   function onLoadMore(){

// page+=1;
// getImage(page).then(resp=>{

//     console.log(resp)
//     catsRender(resp.data)
//     // +resp.headers['pagination-page'])
//     const pages = countPages(Number(resp.headers['pagination-count']), Number(resp.headers['pagination-limit']))

//     if(pages===page){
//         loadMoreBtn.hidden=true;
//     }

// }
// )
//   }

function countPages(total, limit) {
  return Math.ceil(total / limit);
}

function observerFunc(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      getImage(page).then(resp => {
        catsRender(resp.data);

        const pages = countPages(
          Number(resp.headers['pagination-count']),
          Number(resp.headers['pagination-limit'])
        );

        if (pages === page) {
            observer.unobserve(guard)
        }
      });
    }
  });
}
