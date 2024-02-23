let oneSitePokemons;

async function loadOneSitePokemons() {
  let url = "https://pokeapi.co/api/v2/pokemon/";
  let response = await fetch(url);
  oneSitePokemons = await response.json();

  showOneSitePokemons();
}

async function showOneSitePokemons() {
  for (let i = 0; i < oneSitePokemons["results"].length; i++) {
    let pokemonName = oneSitePokemons["results"][i]["name"];
    let url = `https://pokeapi.co/api/v2/pokemon/${i + 1}/`;
    let response = await fetch(url);
    pokemon = await response.json();

    renderPokemon(pokemon, pokemonName);
  }
}

function renderPokemon(pokemon, pokemonName) {
  let container = document.getElementById("pokedex-container");
  let pokemonImg = pokemon["sprites"]["front_default"];
  let pokemonId = pokemon["id"];
  let capitalizedFirstLetter = capitalizeFirstLetter(pokemonName);

  let pokemonTypes = getPokemonType(pokemon);
  container.innerHTML += pokedexHTML(
    pokemonImg,
    pokemonId,
    capitalizedFirstLetter,
    pokemonTypes
  );
}

function capitalizeFirstLetter(pokemonName) {
  return pokemonName[0].toUpperCase() + pokemonName.slice(1);
}

function getPokemonType(pokemon) {
  let pokemonType = pokemon["types"].map((type) => type["type"]["name"]);
  return pokemonType;
}

function pokedexHTML(
  pokemonImg,
  pokemonId,
  capitalizeFirstLetter,
  pokemonTypes
) {
  return `
  <div class="pokedex" id="pokedex${pokemonId}" onclick="showSeperatePokedex(${pokemonId})">
    <span>ID: #${pokemonId}</span>
    <h2>${capitalizeFirstLetter}</h2>
    <img src="${pokemonImg}" />
    <div class="pokedex-types">
    ${renderPokemonType(pokemonTypes)}
    </div>
  </div>
  `;
}

function renderPokemonType(pokemonTypes) {
  return pokemonTypes
    .map((type) => `<div class="type ${type}">${type.toUpperCase()}</div>`)
    .join("");
}

async function showSeperatePokedex(pokemonId) {
  let seperatedPokedex = document.getElementById("pokedex-seperate-container");
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
  let response = await fetch(url);
  let seperatedPokemon = await response.json();
  let pokemonName = seperatedPokemon["species"]["name"];
  pokemonName = capitalizeFirstLetter(pokemonName);
  let pokemonImg =
    seperatedPokemon["sprites"]["other"]["official-artwork"]["front_default"];
  let pokemonStats = getPokemonStats(seperatedPokemon);
  let pokemonTypes = getPokemonType(seperatedPokemon);
  let pokemonDetails = await getPokemonDetails(pokemonId);

  seperatedPokedex.innerHTML = seperatePokedex(
    pokemonId,
    pokemonName,
    pokemonImg,
    pokemonTypes,
    pokemonDetails
  );
  toggleHiddenContainer();
  renderChart(pokemonStats);
}

function getPokemonStats(seperatedPokemon) {
  let seperatedPokemonStats = [];
  let pokemonStats = seperatedPokemon["stats"];
  for (let i = 0; i < pokemonStats.length; i++) {
    seperatedPokemonStats.push(pokemonStats[i]);
  }
  return seperatedPokemonStats;
}

function seperatePokedex(
  pokemonId,
  pokemonName,
  pokemonImg,
  pokemonTypes,
  pokemonDetails
) {
  return `
  <div class="pokedex-seperate">
    <img onclick="prevPokemon(${pokemonId})" class="icon pokedex-seperate-arrow" src="imgs/icons/arrow-left.png">
    <div class="pokedex-seperate-main">
      <span>ID: #${pokemonId}</span>
      <h2>${pokemonName}</h2>
      <img src="${pokemonImg}" class="pokedex-seperate-img"/>
      <div class="pokedex-types">
        ${renderPokemonType(pokemonTypes)}
      </div>
      <div class="chart-container">
        <canvas id="myChart" height="200px" width="500px"></canvas>
      </div>
      <div class="pokedex-seperate-details"><span>${pokemonDetails}</span></div>
    </div>
    <img onclick="nextPokemon(${pokemonId})" class="icon pokedex-seperate-arrow" src="imgs/icons/arrow-right.png">
  </div>
  `;
}

async function getPokemonDetails(pokemonId) {
  let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  let response = await fetch(url);
  let pokemon = await response.json();

  if (pokemon["flavor_text_entries"].length > 1) {
    let pokemonDetails = pokemon["flavor_text_entries"][1]["flavor_text"];
    pokemonDetails = removeSpecialCharacter(pokemonDetails, "");
    return pokemonDetails;
  } else {
    return "";
  }
}

function prevPokemon(pokemonId) {
  let prev = pokemonId - 1;

  if (prev > 0) {
    showSeperatePokedex(prev);
  } else {
    pokemonId = 1025;
    showSeperatePokedex(pokemonId);
  }
}

function nextPokemon(pokemonId) {
  let next = pokemonId + 1;

  if (next <= 1025) {
    showSeperatePokedex(next);
  } else {
    pokemonId = 1;
    showSeperatePokedex(pokemonId);
  }
}

function removeSpecialCharacter(text, character) {
  return text.split(character).join("");
}

function toggleHiddenContainer() {
  let pokedexSeperate = document.getElementById("pokedex-seperate-container");
  pokedexSeperate.classList.toggle("hidden");
}

async function searchPokemon() {
  let search = document.getElementById("search-bar").value;

  let url = `https://pokeapi.co/api/v2/pokemon/${search}/?limit=100000&offset=0`;
  let response = await fetch(url);
  let searchedPokemon = await response.json();

  console.log(searchedPokemon);
}
