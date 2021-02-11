/* Ele ejercicio es q maqueten un fron para mostrar los pokemones de https://pokeapi.co/api/v2/pokemon 
y la foto que sea el svg que aparece en el enpoint de pokemon individual, ubicar datos de peso, 
altura y demas datos que consideren de interes para un usuario
como bono de punto para el premio al final del curso manejen la paginacion en el frontend
*/

//get all pokemons

const getAllPokemons = async (api_url) => {
    try {
        const pokemons = await fetch(api_url);
        return pokemons.json()
    } catch (error) {
        console.log(error.message)
    }
}

//get single pokemon

const getSinglePokemon = async() => {
    const singlePokemon = await getAllPokemons(url)
    return singlePokemon.json()
}
let offsetPokemon = 0;

//pagination
const verMas = (ev) => {
    offsetPokemon += 3;
    getPokemonesGeneral();
}

const pintarPokemon =  (pokemon, container) => {
    const divBase = document.createElement('div');
    divBase.classList.add('pokemon');
    divBase.innerHTML = `
    <h2 class="namePokemon">${pokemon.name.toUpperCase()} (${pokemon.id})</h2>
    <div class="image">
    <img class="imagePokemon" src="${pokemon.picture}" alt="${pokemon.name}">
</div>
<div class="infoPokemon">
    <ul>
        <li>Peso: ${pokemon.weight}</li>
        <li>Altura: ${pokemon.height}</li>
        <li><button data-id="${pokemon.id}" class="setFavorito"> Lo amo </button></li>
    </ul>
</div>`
    container.appendChild(divBase);
    divBase.querySelector("button").addEventListener("click",agregarFavoritoHandler);
    
}

const pintarFavoritos = () => {
    const localFavoritos= JSON.parse (localStorage.getItem('favoritos'));
    const containerFavoritos =  document.querySelector('.general > .container.favoritos');
    containerFavoritos.innerHTML = '';
    localFavoritos.favoritos.forEach(favorito => {
        pintarPokemon (favorito,containerFavoritos);
    })
}

const agregarFavoritoHandler = (ev) => {

    const buttonPressed = ev.target;
    const idPokemonSelected =  parseInt(buttonPressed.getAttribute("data-id"));
    const localPokemones = JSON.parse (localStorage.getItem('pokemones'));
    const localFavoritos= JSON.parse (localStorage.getItem('favoritos'));

    if (buttonPressed.textContent === "odiar"){
        // eliminar de favoritos
    }else {
        
        
        const pokemonJson =localPokemones.pokemones.find(p => p.id === idPokemonSelected);
        localFavoritos.favoritos.push(pokemonJson);
        localStorage.setItem('favoritos',JSON.stringify(localFavoritos));
        buttonPressed.textContent = "odiar";
       
    }
    pintarFavoritos ();
 
}


const getPokemonesGeneral = async (ev) => {
    const API_URL = `https://pokeapi.co/api/v2/pokemon/?limit=3&offset=${offsetPokemon}`
    const pokemons = await getAllPokemons(API_URL);

    const localPokemones = JSON.parse (localStorage.getItem('pokemones'))
    
    //create array with each pokemon
    const pokemonUrls = await pokemons.results.map (async pokemon => {
        
        const pokemonData = await getAllPokemons(pokemon.url)
        
        const transformedPokemon =  {
            id: pokemonData.id,
            name: pokemonData.name,
            picture: pokemonData.sprites.other.dream_world.front_default,
            weight: pokemonData.weight,
            height: pokemonData.height
        }

        localPokemones.pokemones.push(transformedPokemon);

        return transformedPokemon
    })


    const pokemonDataJson = await Promise.all(pokemonUrls)
    localStorage.setItem('pokemones',JSON.stringify(localPokemones));

    //create divs
    const container = document.querySelector('.general > .container');
    pokemonDataJson.forEach(poke => {
       pintarPokemon (poke,container);
    })
    
}

//create "ver mas"
const createButton = () => {
    const general = document.querySelector('.general')
    const verMasBtn = document.createElement('span');
    verMasBtn.classList.add('verMas')
    verMasBtn.innerHTML = `<img src="./pokeball.png" alt="pokeball">`;
    general.appendChild(verMasBtn)

    verMasBtn.addEventListener('click', verMas)
}

const inicializarFavoritos = () => {

    if(localStorage.getItem('favoritos')) {
        pintarFavoritos();
    }else {
        localStorage.setItem('favoritos',JSON.stringify({favoritos: []}));
    }
    localStorage.setItem('pokemones',JSON.stringify({pokemones: []}));
}



document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('.get-pokemon').classList.add('hidden');
    inicializarFavoritos();
    getPokemonesGeneral();
    createButton();

})


// 1. mantener los odios despues de recargar la pagina y tener un amado
// 2. al dar click en odiar eliminar de favoritos

       