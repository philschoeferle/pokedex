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
    let pokemonImg = await response.json();
    pokemonImg = pokemonImg["sprites"]["front_default"];

    renderPokemon(pokemonName, pokemonImg);
  }
}

function renderPokemon(pokemonName, pokemonImg) {
  let container = document.getElementById("pokedex");
  let capitalizeFirstLetter = pokemonName[0].toUpperCase() + pokemonName.slice(1);
  container.innerHTML += `
    <div class="pokedex">
      <h2>${capitalizeFirstLetter}</h2>
      <img src="${pokemonImg}" />
    </div>
  `;
}
