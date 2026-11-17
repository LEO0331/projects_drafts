const container = document.getElementById('poke-container')
const count = 152 //change to reach more pokemon
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
const fetchPokemons = async () => {
    for(let i = 1; i < count; i++) {
        await getPokemon(i)
    }
}

const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const response = await fetch(url)
    const data = await response.json()
    createPokemonCard(data)
    /*
    fetch('https://pokeapi.co/api/v2/pokemon/${id}')
        .then(response => response.json())
        .then(data => createPokemonCard(data))
    */
}

const createPokemonCard = (pokemon) => {
    if (!Number.isSafeInteger(pokemon.id) || pokemon.id < 1) return
    const pokemonEl = document.createElement('div') //create div
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

fetchPokemons()
