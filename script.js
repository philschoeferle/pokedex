let oneSitePokemons;
let offset = 0;

async function loadOnePokemonSite() {
  let url = `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0`;
  let response = await fetch(url);
  oneSitePokemons = await response.json();

  showOnePokemonSite();
}

async function showOnePokemonSite() {
  for (let i = 0; i < oneSitePokemons["results"].length; i++) {
    let pokemonName = oneSitePokemons["results"][i]["name"];
    let url = `https://pokeapi.co/api/v2/pokemon/${i + 1}`;
    let response = await fetch(url);
    pokemon = await response.json();

    renderPokemon(pokemon, pokemonName);
  }
}

async function loadNextPokemonSite() {
  offset += 20;
  let url = `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offset}`;
  let response = await fetch(url);
  let nextPokemonSite = await response.json();

  showNextPokemonSite(nextPokemonSite);
}

async function showNextPokemonSite(nextPokemonSite) {
  for (let i = 0; i < nextPokemonSite["results"].length; i++) {
    let pokemons = nextPokemonSite["results"][i];
    let pokemonName = pokemons["name"];
    let pokemonUrl = pokemons.url;
    let response = await fetch(pokemonUrl);
    let pokemon = await response.json();
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

  if (response.ok) {
    let seperatedPokemon = await response.json();
    let pokemonName = seperatedPokemon["species"]["name"];
    pokemonName = capitalizeFirstLetter(pokemonName);
    let pokemonImg =
      seperatedPokemon["sprites"]["other"]["official-artwork"]["front_default"];
    let pokemonStats = getPokemonStats(seperatedPokemon);
    let pokemonTypes = getPokemonType(seperatedPokemon);
    let pokemonDetails = await getPokemonDetails(pokemonId);
    let pokemonEvoChainUrls = await getPokemonEvoChainUrl(pokemonId);

    seperatedPokedex.innerHTML = seperatePokedex(
      pokemonId,
      pokemonName,
      pokemonImg,
      pokemonTypes,
      pokemonDetails,
      pokemonEvoChainUrls
    );
    toggleHiddenContainer();
    renderChart(pokemonStats);
  } else {
    searchedPokemonNotExisting(response);
  }
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
  pokemonDetails,
  pokemonEvoChainUrls
) {
  return `
  <div class="pokedex-seperate">
    <img onclick="prevPokemon(${pokemonId})" class="icon pokedex-seperate-arrow left" src="imgs/icons/arrow-left.png">
    <div class="pokedex-seperate-main">
      <div class="pokedex-seperate-name-id">
        <span>#${pokemonId}</span>
        <h2>${pokemonName}</h2>
      </div>
      <img src="${pokemonImg}" class="pokedex-seperate-img"/>
      <div class="pokedex-types">
        ${renderPokemonType(pokemonTypes)}
      </div>
      <div class="chart-container">
        <canvas id="myChart" class="chart"></canvas>
      </div>
      <div class="pokedex-seperate-details">
        <span class="bold-headline">POKÉDEX ENTRY</span>
        <span>${pokemonDetails}</span>
      </div>
      <div class="pokemon-seperate-evos">
        <span class="bold-headline">EVOLUTION</span>
        <div class="pokemon-evo">
          ${getEvoChainHtml(pokemonEvoChainUrls)}
        </div>
      </div>
    </div>
    <img onclick="nextPokemon(${pokemonId})" class="icon pokedex-seperate-arrow right" src="imgs/icons/arrow-right.png">
  </div>
  `;
}

async function getPokemonDetails(pokemonId) {
  let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  let response = await fetch(url);
  let pokemon = await response.json();

  let englishDetails = pokemon["flavor_text_entries"].find(
    (entry) => entry["language"]["name"] === "en"
  );

  if (englishDetails) {
    let pokemonDetails = englishDetails["flavor_text"];
    pokemonDetails = removeSpecialCharacter(pokemonDetails, "");
    return pokemonDetails;
  } else {
    return "No Pokédex Entry yet!";
  }
}

function getEvoChainHtml(pokemonEvoChainUrls) {
  let evoChainHtml = "";
  for (let i = 0; i < pokemonEvoChainUrls.length; i++) {
    evoChainHtml += `<img src="${pokemonEvoChainUrls[i]}" class="evo-img" />`;
  }
  return evoChainHtml;
}

async function getPokemonEvoChainUrl(pokemonId) {
  let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  let response = await fetch(url);
  let pokemon = await response.json();
  let evoChainUrl = pokemon["evolution_chain"]["url"];

  return getPokemonEvoChain(evoChainUrl);
}

async function getPokemonEvoChain(evoChainUrl) {
  let response = await fetch(evoChainUrl);
  let pokemon = await response.json();
  let evoChain = pokemon["chain"];

  return showPokemonEvoChain(evoChain);
}

async function showPokemonEvoChain(evoChain) {
  let evoImgs = [];
  let currentPokemon = evoChain["species"]["name"];
  let imgUrl = `https://pokeapi.co/api/v2/pokemon/${currentPokemon}/`;
  let response = await fetch(imgUrl);
  let currentPokemonImg = await response.json();
  let currentEvo = currentPokemonImg["sprites"]["front_default"];
  evoImgs.push(currentEvo);

  if (evoChain["evolves_to"].length > 0) {
    for (let i = 0; i < evoChain["evolves_to"].length; i++) {
      let nextEvo = evoChain["evolves_to"][i];
      let nextEvoImgs = await showPokemonEvoChain(nextEvo);
      for (let j = 0; j < nextEvoImgs.length; j++) {
        evoImgs.push(nextEvoImgs[j]);
      }
    }
  }

  return evoImgs;
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
  return text.split(character).join(" ");
}

function toggleHiddenContainer() {
  let pokedexSeperate = document.getElementById("pokedex-seperate-container");
  let body = document.getElementById("body");

  pokedexSeperate.classList.toggle("hidden");
  body.classList.toggle("stop-scrolling");
}

function searchPokemon() {
  let search = document.getElementById("search-bar");

  if (!isNaN(search.value)) {
    showSeperatePokedex(parseInt(search.value));
    search.value = "";
  } else {
    convertIdToName(search.value);
    search.value = "";
  }
}

async function convertIdToName(pokemonName) {
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}/`;
  let response = await fetch(url);

  if (response.ok) {
    let pokemon = await response.json();
    let pokemonId = pokemon["id"];
    pokemonName = capitalizeFirstLetter(pokemonName);
    let pokemonImg =
      pokemon["sprites"]["other"]["official-artwork"]["front_default"];
    let pokemonStats = getPokemonStats(pokemon);
    let pokemonTypes = getPokemonType(pokemon);
    let pokemonDetails = await getPokemonDetails(pokemonId);
    let pokemonEvoChainUrls = await getPokemonEvoChainUrl(pokemonId);

    let seperatedPokedex = document.getElementById(
      "pokedex-seperate-container"
    );
    seperatedPokedex.innerHTML = seperatePokedex(
      pokemonId,
      pokemonName,
      pokemonImg,
      pokemonTypes,
      pokemonDetails,
      pokemonEvoChainUrls
    );

    toggleHiddenContainer();
    renderChart(pokemonStats);
  } else {
    searchedPokemonNotExisting(response);
  }
}

function searchedPokemonNotExisting(response) {
  if (response.status === 404) {
    let seperatedPokedex = document.getElementById(
      "pokedex-seperate-container"
    );
    seperatedPokedex.innerHTML = `
      <div class="pokedex-seperate-main">
        <h2>Das gesuchte Pokémon existiert nicht.</h2>
        <p>Überprüfe die Schreibweise oder die ID!</p>
        <span>(PS: Nutze ausschließlich die englischen Pokémon-Namen.)</span>
      </div>`;
  }

  toggleHiddenContainer();
}
