let currentPokemon;

async function loadPokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon/gengar";
  let response = await fetch(url);
  currentPokemon = await response.json();

  renderPokemonInfo();
  pokemonImage();
}

function renderPokemon() {
  let container = document.getElementById("pokedex");
  container.innerHTML = `<div></div>`;
}

function renderPokemonInfo() {
  document.getElementById("pokemonName").innerHTML = currentPokemon["name"];
}

function pokemonImage() {
  document.getElementById("pokemonImage").src =
    currentPokemon["sprites"]["front_default"];
}
