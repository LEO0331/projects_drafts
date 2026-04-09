const TMDB_KEY_STORAGE = 'tmdb_api_key'
const TMDB_BASE = 'https://api.themoviedb.org/3'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')
const btn = document.querySelector('.btn')
let apiKey = getApiKey()
if(apiKey) {
    getMovies(getDiscoverApi())
}

function getApiKey() {
    const fromStorage = localStorage.getItem(TMDB_KEY_STORAGE)
    if(fromStorage) {
        return fromStorage
    }
    const input = window.prompt('Enter your TMDB API key to load movies. The key is stored in localStorage on this browser.')
    if(input && input.trim()) {
        const key = input.trim()
        localStorage.setItem(TMDB_KEY_STORAGE, key)
        return key
    }
    main.textContent = 'TMDB API key is required to load movies.'
    return ''
}

function getDiscoverApi() {
    return `${TMDB_BASE}/discover/movie?sort_by=popularity.desc&api_key=${encodeURIComponent(apiKey)}&page=1`
}

function getSearchApi(term) {
    return `${TMDB_BASE}/search/movie?api_key=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(term)}`
}

async function getMovies(url) {
    const response = await fetch(url)
    const data = await response.json()
    showMovies(data.results) //results array
}

function showMovies(movies) {
    main.innerHTML = '' //clear the main tag, replace movie when search
    movies.forEach((movie) => { //<main id="main">movie divs, empty at first</main>
        const {title, poster_path, vote_average, overview} = movie//destructure
        const movieEl = document.createElement('div')//<div></div>
        movieEl.classList.add('movie')//<div class="movie"></div>
        const poster = document.createElement('img')
        poster.src = IMG_PATH + poster_path
        poster.alt = title || 'movie'

        const movieInfo = document.createElement('div')
        movieInfo.className = 'movie-info'
        const heading = document.createElement('h3')
        heading.textContent = title || 'Untitled'
        const rating = document.createElement('span')
        rating.className = getClassByRate(vote_average)
        rating.textContent = String(vote_average || 0)
        movieInfo.appendChild(heading)
        movieInfo.appendChild(rating)

        const overviewWrap = document.createElement('div')
        overviewWrap.className = 'overview'
        const overviewHeading = document.createElement('h3')
        overviewHeading.textContent = 'Overview'
        const overviewText = document.createElement('p')
        overviewText.textContent = overview || ''
        overviewWrap.appendChild(overviewHeading)
        overviewWrap.appendChild(overviewText)

        movieEl.appendChild(poster)
        movieEl.appendChild(movieInfo)
        movieEl.appendChild(overviewWrap)
        main.appendChild(movieEl)
    })
}

function getClassByRate(vote) {//.movie-info span.green/orange/red
    if(vote >= 8) {
        return 'green' //string, mention in css
    } else if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}
//The submit event fires when the user clicks a submit button (<button> or <input type="submit">) or presses Enter while editing a field (e.g. <input type="text">) in a form
form.addEventListener('submit', event => {//only work on <form>
    event.preventDefault() //not actual submit to the page
    //https://github.com/LEO0331/Mini_projects/blob/main/Random_Choice_Pick/script.js
    const searchTerm = search.value //user type in, can not use event.target.value
    if(searchTerm && searchTerm !== '') {//no empty search term
        if(!apiKey) {
            apiKey = getApiKey()
            if(!apiKey) {
                return
            }
        }
        getMovies(getSearchApi(searchTerm))//specific movie name
        search.value = '' //clear the search term
    } else {
        window.location.reload()//reload the page if nothing
    }
})
/*
btn.addEventListener('click', event => {
    event.preventDefault() //not actual submit to the page
    const searchTerm = search.value //user type in
    if(searchTerm && searchTerm !== '') {//no empty search term
        getMovies(SEARCH_API + searchTerm)//specific movie name
        search.value = '' //clear the search term
    } else {
        window.location.reload()//reload the page
    }
})
*/
