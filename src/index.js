const form = document.querySelector('#search-form')
form.addEventListener("submit", onFormSubmit)
function onFormSubmit(evt){
    evt.preventDefault()
    console.log('submit')
}