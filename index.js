//calling functions once our dom content is loaded
document.addEventListener('DOMContentLoaded', () => {
    getForm(),
    fetchHomepageMovies(),
    homeButton(),
    alterLoginForm()
})

//fetches the movies you search for
function getForm(){
    const form = document.querySelector('#searchBar')
    form.addEventListener('submit', (e)=> {
         e.preventDefault()
         console.log(e.target[0].value)
         const search = e.target[0].value
        fetch(`http://www.omdbapi.com/?s=${search}&apikey=429ac81a`)
        .then(res => res.json())
        .then(movie => renderMovie(movie.Search))
        setTimeout(function(){ e.target[0].value = ''; }, 1);
        }) 
}

//renders a list of movies to the homepage
function renderMovie(movie){
    console.log(movie)
    document.querySelector('.moviePoster').innerHTML = ''
    movie.forEach( movie => { 
  
    const divContainer = document.createElement('div')
    const divFrame = document.createElement('div')
    const divImage = document.createElement('div')
    const img = document.createElement('img')
    const h2 = document.createElement('h2')
    
    divContainer.className = 'movie-card'
    divFrame.className = 'movie-frame'
    divImage.className = 'movie-poster'
    h2.textContent = movie.Title
    img.src = movie.Poster

    divImage.append(img)
    divFrame.append(divImage, h2)
    divContainer.append(divFrame)
    document.querySelector('.moviePoster').append(divContainer)
    divImage.addEventListener('click', () =>{
        fetchSingleMovie(movie)
        })
    })
}

//fetches the movie you click on
function fetchSingleMovie(movie) {
    console.log(movie.imdbID)
    fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=429ac81a`)
    .then(res => res.json())
    .then(movie => renderSingleMovie(movie)) 
}

//creates html for the five star review form
function fiveStarFunction() {
    return (`
    <div id="status"></div>
    <form id="ratingForm">
        <fieldset class="rating">
            <legend>Please rate:</legend>
            <input type="radio" id="star5" name="rating" value="5" /><label for="star5" title="Incredible"></label>
            <input type="radio" id="star4" name="rating" value="4" /><label for="star4" title="Good"></label>
            <input type="radio" id="star3" name="rating" value="3" /><label for="star3" title="Mediocre"></label>
            <input type="radio" id="star2" name="rating" value="2" /><label for="star2" title="Bad"></label>
            <input type="radio" id="star1" name="rating" value="1" /><label for="star1" title="Horrible"></label>
        </fieldset>
    </form>
    `)
}

//renders the single movie into a page with that info
function renderSingleMovie(movie){
    console.log(movie)

    //clears out the page of the searched movies
    document.querySelector('.moviePoster').innerHTML = '' 
   
    //creating containers for the clicked on movie
    const movieList = document.createElement('ul')
   
    const posterContainer = document.createElement('div')
    posterContainer.id = 'singlePoster'
    
    const movieListPoster = document.createElement('img')
    movieListPoster.src = movie.Poster
   
    const infoContainer = document.createElement('div')
    infoContainer.id = 'movieInfo'
    
    //creates elements with text content from the movie we clicked into
    const movieTitle  = document.createElement('h1')
    movieTitle.textContent = movie.Title
    movieTitle.id = 'singleTitle'
    const movieListActors = document.createElement('li')
    movieListActors.textContent = `Actors: ${movie.Actors}`
    const movieListAwards = document.createElement('li')
    movieListAwards.textContent = `Awards: ${movie.Awards}`
    const movieListGenre = document.createElement('li')
    movieListGenre.textContent = `Genre: ${movie.Genre}`
    const movieListPlot = document.createElement('li')
    movieListPlot.textContent = `Plot: ${movie.Plot}`
    const movieListRating = document.createElement('li')
    movieListRating.textContent = `Rating: ${movie.Rated}`
    const movieListDirector = document.createElement('li')
    movieListDirector.textContent = `Director: ${movie.Director}`
    const movieListYear = document.createElement('li')
    movieListYear.textContent = `Year: ${movie.Year}`
    const movieListRuntime = document.createElement('li')
    movieListRuntime.textContent = `Runtime: ${movie.Runtime}`
    
    //appends all the elements we've created to the dom
    posterContainer.append(movieListPoster)

    infoContainer.append(posterContainer, movieTitle, movieListActors, movieListAwards, movieListDirector, movieListGenre, movieListPlot, movieListRating, movieListRuntime, movieListYear)
    
    movieList.append( infoContainer)
    
    //add the five star function
    const fiveStarsDiv = document.createElement('div')
    fiveStarsDiv.className = 'fiveStarsDiv'
    document.querySelector('.moviePoster').append(posterContainer, movieList, fiveStarsDiv)
    document.querySelector('.fiveStarsDiv').innerHTML = fiveStarFunction()
    

    //create the review form
    const reviewDiv = document.createElement('div')
    reviewDiv.id = 'reviews'
    const reviewList = document.createElement('ul')
    reviewList.id = 'review'
    const reviewForm = document.createElement('form')
    const formLabel = document.createElement('label')
    const formInput = document.createElement('input')
    const formButton = document.createElement('button')
    const reviewTitle = document.createElement('h3')
    
    reviewForm.className = 'reviewForm'
    reviewTitle.textContent = 'User Reviews:'
    formLabel.textContent = 'Add a review: '
    formInput.type = 'text'
    formInput.name = 'review'
    formButton.textContent = 'submit'
    formButton.className = 'reviewBtn'
    formInput.className = 'reviewInput'
    
    //appends the review form and five star form to the dom
    document.querySelector('.moviePoster').append(posterContainer, movieList,)
    document.getElementById('movieInfo').append(fiveStarsDiv)
    document.querySelector('.moviePoster').append(reviewDiv)
    
    //appends review form elements to each other
    reviewForm.append(formLabel, formInput, formButton)
    reviewDiv.append(reviewForm, reviewList)
    reviewList.append(reviewTitle)
    
    //adds a submit event to review in order to create reviews
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault()
        fetchComment(e.target.review.value)
        e.target.review.value = ''
    })
    
}

//posts the reviews
function postComment(comment, commenter){
    let li = document.createElement('li')
    li.className = `${comment}`
    console.log(commenter)
    li.textContent = `"${comment}" - ${commenter}`
    document.querySelector('#review').append(li)
}

//fetches the name to append after the reviews
function fetchComment(comment) {
    fetch('http://localhost:3000/users')
    .then(res => res.json())
    .then(name => postComment(comment, (name[(name.length-1)].username)))
}

//adds event listner to the home button to return to that screen
function homeButton(){
    document.querySelector('#homeBtn').addEventListener('click', (e) => {
       document.querySelector('.moviePoster').innerHTML = '' 
       fetchHomepageMovies()
    })
}

//fetches the homepage movies we want to render
function fetchHomepageMovies() {
    let homepageMovies = ['The Shawshank Redemption', 'The Godfather', 'The Dark Knight', 'The Lord of the Rings: The Fellowship of the Ring', 'Pulp Fiction', "Schindler's List", 'Forrest Gump', 'Fight Club', 'Inception', 'The Matrix']
    homepageMovies.forEach(element => {
        fetch(`http://www.omdbapi.com/?t=${element}&apikey=429ac81a`)
        .then(res => res.json())
        .then(json => renderHomepageMovies(json))
    }) 
}

//renders the 10 popular movies to the home page
function renderHomepageMovies(movie){
    
    const divContainer = document.createElement('div')
    const divFrame = document.createElement('div')
    const divImage = document.createElement('div')
    const img = document.createElement('img')
    const h2 = document.createElement('h2')
 
    divContainer.className = 'movie-card'
    divFrame.className = 'movie-frame'
    divImage.className = 'movie-poster'
    h2.textContent = movie.Title
    img.src = movie.Poster

    divImage.append(img)
    divFrame.append(divImage, h2)
    divContainer.append(divFrame)
    document.querySelector('.moviePoster').append(divContainer)
    divImage.addEventListener('click', () =>{
    fetchSingleMovie(movie)
    })
}

//add js to the the login form
function alterLoginForm() {
    document.querySelector('#loginForm').addEventListener('submit', (e)=> {
        e.preventDefault()
        let user = e.target[0].value
        let pass =e.target[1].value
        const data = {username: user, password : pass}
        postInfo(data)
        
        document.querySelector('#username').value = ''
        document.querySelector('#password').value = ''
        document.querySelector('#loginForm').style.display = 'none'
        fetchName()
    })
}

//post form info to our local db file
function postInfo(data){
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers :{
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(data),
        
    })
    .then(resp => resp.json())
    .then(data => {
        const username = data.username
        const userId = data.id
    })
}

//fetches the name from the form
function fetchName() {
    fetch('http://localhost:3000/users')
    .then(res => res.json())
    .then(name => renderName(name[(name.length-1)].username))
}

//renders the user's name under the app name
function renderName(name){
    console.log(name)
    const userName = document.createElement('h3')
    userName.textContent = `${name}`
    document.querySelector('h1').append(userName)
}




