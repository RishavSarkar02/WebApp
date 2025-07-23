let chartData = { labels: [], temp: [], hum: [], soil: [] };
let chart;

async function fetchData() {
  const res = await fetch("http://<your_esp8266_ip>/data");
  const data = await res.json();
  document.getElementById("temp").textContent = data.temp;
  document.getElementById("hum").textContent = data.hum;
  document.getElementById("soil").textContent = data.soil;
  document.getElementById("motor").textContent = data.motor ? "ON" : "OFF";

  const time = new Date().toLocaleTimeString();
  chartData.labels.push(time);
  chartData.temp.push(data.temp);
  chartData.hum.push(data.hum);
  chartData.soil.push(data.soil);

  if (chartData.labels.length > 10) {
    chartData.labels.shift();
    chartData.temp.shift();
    chartData.hum.shift();
    chartData.soil.shift();
  }

  chart.update();
}

function toggleMotor() {
  fetch("http://<your_esp8266_ip>/toggle");
}

window.onload = () => {
  const ctx = document.getElementById("chart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        { label: "Temp", data: chartData.temp, borderColor: "red" },
        { label: "Humidity", data: chartData.hum, borderColor: "blue" },
        { label: "Soil", data: chartData.soil, borderColor: "green" }
      ]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });

  setInterval(fetchData, 3000);
};
