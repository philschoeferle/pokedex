let allPokemon;

async function loadAllPokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon";
  let response = await fetch(url);
  allPokemon = await response.json();

  showAllPokemon();
}

async function showAllPokemon() {
  for (let i = 0; i < allPokemon["results"].length; i++) {
    let pokemonName = allPokemon["results"][i]["name"];
    let url = `https://pokeapi.co/api/v2/pokemon/${i + 1}/`;
    let response = await fetch(url);
    let pokemon = await response.json();

    renderPokemon(pokemon, pokemonName);
  }
}

function renderPokemon(pokemon, pokemonName) {
  let container = document.getElementById("pokedex-container");
  let pokemonImg = pokemon["sprites"]["front_default"];
  let pokemonId = pokemon["id"];
  let capitalizeFirstLetter =
    pokemonName[0].toUpperCase() + pokemonName.slice(1);

  let pokemonTypes = renderPokemonType(pokemon);
  container.innerHTML += pokedexHTML(
    pokemonImg,
    pokemonId,
    capitalizeFirstLetter,
    pokemonTypes
  );
}

function renderPokemonType(pokemon) {
  let pokemonTypes = pokemon["types"].map((type) => type["type"]["name"]);
  return pokemonTypes;
}

function pokedexHTML(
  pokemonImg,
  pokemonId,
  capitalizeFirstLetter,
  pokemonTypes
) {
  return `
  <div class="pokedex" id="pokedex">
    <span>ID: #${pokemonId}</span>
    <h2>${capitalizeFirstLetter}</h2>
    <img src="${pokemonImg}" />
    <div class="pokedex-types">
    ${pokemonTypes
      .map((type) => `<div class="type ${type}">${type.toUpperCase()}</div>`)
      .join("")}
    </div>
  </div>
`;
}
