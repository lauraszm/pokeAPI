//https://pokeapi.co/api/v2/pokemon/ditto
//https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png -->img
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
    offsetPokemon += 20;
    getPokemonesGeneral();
}


const getPokemonesGeneral = async (ev) => {
    const API_URL = `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offsetPokemon}`
    const pokemons = await getAllPokemons(API_URL);
    
    //retrieve all urls
    const pokemonPromises = await pokemons.results.map (async pokemonPromise => {
        return {
            url: pokemonPromise.url
        }
    })
    const pokemonPromisesJson = await Promise.all(pokemonPromises)
    
    //create array with each pokemon
    const pokemonUrls = await pokemonPromisesJson.map (async pokemon => {
        const pokemonData = await getAllPokemons(pokemon.url)
        return {
            name: pokemonData.name,
            picture: pokemonData.sprites.front_default,
            weight: pokemonData.weight,
            height: pokemonData.height
        }
    
    })
    const pokemonDataJson = await Promise.all(pokemonUrls)

    //create divs
    pokemonDataJson.forEach(poke => {
        const container = document.querySelector('.general > .container');
        const divBase = document.createElement('div');
        divBase.classList.add('pokemon');
        divBase.innerHTML = `
        <h2 class="namePokemon">${poke.name.toUpperCase()}</h2>
        <div class="image">
        <img class="imagePokemon" src="${poke.picture}" alt="${poke.name}">
    </div>
    <div class="infoPokemon">
        <ul>
            <li>Peso: ${poke.weight}</li>
            <li>Altura: ${poke.height}</li>
        </ul>
    </div>`
        container.appendChild(divBase);
        
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


const pokemonesBtn = document.querySelector('.get-pokemon');
pokemonesBtn.addEventListener('click', function(){
    pokemonesBtn.classList.add('hidden');
    getPokemonesGeneral();
    createButton()
})



       