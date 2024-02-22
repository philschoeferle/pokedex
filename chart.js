function renderChart(pokemonStats) {
  let pokemonStatNumber = [];
  for (let i = 0; i < pokemonStats.length; i++) {
    pokemonStatNumber.push(pokemonStats[i]["base_stat"]);
  }
  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Hp", "Attack", "Defense", "Sp-Attack", "Sp-Defense", "Speed"],
      datasets: [
        {
          data: pokemonStatNumber,
          backgroundColor: [
            "rgba(120, 200, 80, 0.4)",
            "rgba(255, 99, 132, 0.4)",
            "rgba(38, 139, 204 , 0.4)",
            "rgba(160, 64, 160, 0.4)",
            "rgba(240, 128, 48 , 0.4)",
            "rgba(248, 208, 49 , 0.4)",
          ],
          borderColor: [
            "rgb(120, 200, 80)",
            "rgb(255, 99, 132)",
            "rgb(38, 139, 204)",
            "rgb(160, 64, 160)",
            "rgb(240, 128, 48)",
            "rgb(248, 208, 49)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Pokemon Stats",
        },
      },
      indexAxis: "y",
      scales: {
        y: {
          skipLabels: false,
          beginAtZero: true,
          ticks: {
            autoSkip: false,
          },
        },
        x: {
          max: 120,
          ticks: {
            stepSize: 10,
            autoSkip: false,
          },
        },
      },
    },
  });
}
