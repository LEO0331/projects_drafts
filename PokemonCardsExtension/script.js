const container = document.getElementById('poke-container')
const form = document.getElementById('form')
const search = document.getElementById('search')
const API = 'https://pokeapi.co/api/v2/pokemon/'
const listItems = []
let searchValue = ''
const count = 152 //change to reach more pokemon
/*press enter or search botton to show all pokemons in main page
type pokemon name and press search to search certain pokemon in main page
clear the search by pressing reload to return main page */
const colors = {
	fire: '#FDDFDF',
    	grass: '#DEFDE0',
	electric: '#faf7c5',
	water: '#DEF3FD',
	ground: '#d1a779',
	rock: '#ffcb59',
	fairy: '#e3acc9',
	poison: '#e26ceb',
	bug: '#c8ebab',
	dragon: '#498fde',
	psychic: '#d466a9',
	flying: '#3dcde3',
	fighting: '#e33d61',
	normal: '#F5F5F5',
    	ghost: '#eaa3ff',
    	steel: '#adadad',
    	ice: '#addeff',
    	dark: '#636363'
}
const main_types = Object.keys(colors) //keys as value, array of different types
/*
async function getPokemonbyName(url) {
    const response = await fetch(url)
    const data = await response.json()
    createPokemonCard(data)
}

const fetchPokemons = async () => {
    if (searchValue === '') {
        for(let i = 1; i < count; i++) {
            await getPokemon(i)
        }
    } else {
        await getPokemonbyName(searchValue)
    }
}
*/

async function fetchPokemons(){
    for(let i = 1; i < count; i++) {
        await getPokemon(i)
    }
}

const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const response = await fetch(url, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
      })
    const data = await response.json()
    createPokemonCard(data)
    /*
    fetch('https://pokeapi.co/api/v2/pokemon/${id}')
        .then(response => response.json())
        .then(data => createPokemonCard(data))
    */
}

const getPokemonbyName = async (url) => {
    const response = await fetch(url, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    const data = await response.json()
    createPokemonCard(data)
}

const createPokemonCard = (pokemon) => {
    if (!Number.isSafeInteger(pokemon.id) || pokemon.id < 1) return
    const pokemonEl = document.createElement('div') //create div
    listItems.push(pokemonEl)
    pokemonEl.classList.add('pokemon')
    //name: under "species" or "forms"
    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1) //uppercase the first letter
    const id = pokemon.id.toString().padStart(3, '0')
    const poke_types = pokemon.types.map(type => type.type.name) //array, "types": [{"type":{"name":"attibutes"}}]
    //const type = main_types.find(type => poke_types.indexOf(type) > -1) //-1 no match, only find the first type and return
    const type = main_types.filter(type => poke_types.indexOf(type) > -1) //all types
    const color = colors[type[0]]
    pokemonEl.style.backgroundColor = color
    pokemonEl.innerHTML = `
    <div class="img-container">
        <img>
    </div>
    <div class="info">
        <span class="number"></span>
        <h3 class="name"></h3>
        <small class="type">Type: <span></span> </small>
    </div>
    `
    const image = pokemonEl.querySelector('img')
    image.src = `https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png`
    image.alt = pokemon.name
    pokemonEl.querySelector('.number').textContent = `#${id}`
    pokemonEl.querySelector('.name').textContent = name
    pokemonEl.querySelector('.type span').textContent = type.join(',')
    container.appendChild(pokemonEl) //under <div class="poke-container" id="poke-container">
}
/*
form.addEventListener('submit', event => {//only work on <form>
    event.preventDefault() 
    const searchTerm = search.value.toLowerCase()
    if(searchTerm && searchTerm !== '') {
        a = true 
        searchValue = API + searchTerm
        getPokemonbyName(searchValue)
        search.value = '' 
        searchValue = ''
    } else {
        fetchPokemons()
    }
})
*/
fetchPokemons()
//e.g. item.innerText: "#001↵Bulbasaur↵Type: grass,poison"
form.addEventListener('submit', event => {//search for specific type or pokemon
    event.preventDefault()
    filterData(search.value)
})

function filterData(searchTerm) {
    listItems.forEach(item => {
        let len = item.innerText.indexOf("T") - 1//pokemon name 
        let type_start = item.innerText.indexOf(":") + 2//first type letter
        if(item.innerText.toLowerCase().slice(5, len).includes(searchTerm.toLowerCase()) || item.innerText.toLowerCase().slice(type_start).includes(searchTerm.toLowerCase())) {
            item.classList.remove('hide')
        } else {
            item.classList.add('hide')
        }
    })
}
