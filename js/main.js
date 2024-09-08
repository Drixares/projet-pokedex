// -------------- VARIABLES -------------- //

const typeUrl = {
  'normal': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/1.png',
  'fighting': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/2.png',
  'flying': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/3.png',
  'poison': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/4.png',
  'ground': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/5.png',
  'rock': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/6.png',
  'bug': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/7.png',
  'ghost': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/8.png',
  'steel': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/9.png',
  'fire': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/10.png',
  'water': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/11.png',
  'grass': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/12.png',
  'electric': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/13.png',
  'psychic': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/14.png',
  'ice': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/15.png',
  'dragon': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/16.png',
  'dark': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/17.png',
  'fairy': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/18.png',
  'stellar': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/19.png',
}
const pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/';
let newCache = [];
let numberOfPokemons = 0;
let cache = JSON.parse(localStorage.getItem('pokemons')) || [];

const loadMoreButton = document.querySelector('.load_more');
const searchButton = document.querySelector('.search_button');
const searchInput = document.querySelector('.search_input');
const resetButton = document.querySelector('.reset_button');
// --------------------------------------- //

// Fetch un pokemon
const getPokemon = async (id) => {
  const response = await fetch(`${pokemonUrl}${id}`);
  // Si la réponse est ok, on retourne les données
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

// Creer une carte pokemon
const createPokemonCard = (pokemon) => {
  // On crée la carte du pokemon
  const card = document.createElement('div');
  const templateCard = `
    <div class="pokemon_card">
      <div class="pokemon_card_top">
        <img src="${typeUrl[pokemon.type]}" alt="type logo" width="80">
        <p>
          <span class="pokemon_name">${pokemon.name}</span>
          <span class="pokemon_id">#0${pokemon.id}</span>
        </p>
      </div>
      <div class="pokemon_box_image">
        <img 
          src="${pokemon.sprite}" 
          alt="${pokemon.name} image" 
          class="pokemon_image" 
          width="160" 
          height="160"
        >
      </div>
    </div>
  `
  // On injece le templare dans la carte
  card.innerHTML = templateCard;
  // On ajoute la carte à la liste de pokemons
  document.querySelector('.pokemon_list').appendChild(card);
  return card;
}

async function getNextTwelvePokemons(base) {
  // On fetch les 12 pokemons suivants à partir de la base
  for (let i = base+1; i <= base + 12; i++) {
    const pokemon = await getPokemon(i);
    createPokemonCard({
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.types[0].type.name,
      sprite: pokemon.sprites.front_default
    });

    // On ajoute le pokemon au cache
    cache.push({
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.types[0].type.name,
      sprite: pokemon.sprites.front_default
    });
  }

  // On push le cache dans le localStorage
  localStorage.setItem('pokemons', JSON.stringify(cache));

  // On actualise la base
  numberOfPokemons += 12;
  return;

}

async function getPokemonsFromCache(cache) {
  // On récupère les pokemons du cache
  for (let i = 0; i <= cache.length-1; i++) {
    const pokemon = cache[i];
    createPokemonCard({
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      sprite: pokemon.sprite
    });
  }

  numberOfPokemons = cache.length;
}


// -------------- START -------------- //

/**
 * Fonction principale
 * 
 */

function main() {
  // Si le cache n'est pas vide, on affiche les pokemons du cache
  if (cache.length) {
    getPokemonsFromCache(cache);
  } else {
    // Si le cache est vide, on fetch les 12 premiers pokemons
    getNextTwelvePokemons(numberOfPokemons);
  } 
}

main();

// -------------- EVENTS -------------- //
loadMoreButton.addEventListener('click', () => {
  getNextTwelvePokemons(numberOfPokemons);
});

searchButton.addEventListener('click', async () => {

  // Si l'input est vide, on ne fait rien
  if (!searchInput.value || searchInput.value === '') {
    return;
  }

  // Si l'input n'est pas vide
  // on cherche le pokemon dans le cache
  const pokemon = cache.find(
    pokemon => pokemon.name.toLowerCase().includes(searchInput.value.toLowerCase()) 
  );

  // Si le pokemon n'est pas dans le cache, on va le fetch
  if (!pokemon) {
    const pokemonFromApi = await getPokemon(searchInput.value);

    // Si le pokemon n'est pas trouvé, on affiche une alerte
    if (!pokemonFromApi) {
      alert('Pokemon not found');
      return;
    }

    // Si le pokemon est trouvé, on nettoie la liste de pokemons
    // et on crée la carte du pokemon
    document.querySelector('.pokemon_list').innerHTML = '';
    createPokemonCard({
      id: pokemonFromApi.id,
      name: pokemonFromApi.name,
      type: pokemonFromApi.types[0].type.name,
      sprite: pokemonFromApi.sprites.front_default
    });

    return;
  }

  // Si le pokemon est dans le cache, on nettoie la liste de pokemons
  // et on crée la carte du pokemon
  document.querySelector('.pokemon_list').innerHTML = '';
  createPokemonCard({
    id: pokemon.id,
    name: pokemon.name,
    type: pokemon.type,
    sprite: pokemon.sprite
  });
  
})

resetButton.addEventListener('click', () => {
  // On nettoie la valeur de l'input
  searchInput.value = '';
  // On nettoie la liste de pokemons
  document.querySelector('.pokemon_list').innerHTML = '';
  // On affiche les pokemons du cache
  getPokemonsFromCache(cache);
})