let chartData = {
  labels: [],
  temp: [],
  hum: [],
  soil: []
};
let chart;

async function fetchData() {
  try {
    const res = await fetch("http://<your_esp_ip>/data");
    const data = await res.json();

    document.getElementById("temp").textContent = `${data.temp} °C`;
    document.getElementById("hum").textContent = `${data.hum} %`;
    document.getElementById("soil").textContent = `${data.soil} %`;
    document.getElementById("motor").textContent = data.motor ? "ON" : "OFF";
    document.getElementById("motorSwitch").checked = data.motor;

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
  } catch (err) {
    console.error("Data fetch failed:", err);
  }
}

function toggleMotor() {
  fetch("http://<your_esp_ip>/toggle");
}

window.onload = () => {
  const ctx = document.getElementById("chart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        { label: "Temp (°C)", data: chartData.temp, borderColor: "red", fill: false },
        { label: "Humidity (%)", data: chartData.hum, borderColor: "blue", fill: false },
        { label: "Soil Moisture (%)", data: chartData.soil, borderColor: "lime", fill: false }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { labels: { color: "#fff" } }
      }
    }
  });

  fetchData();
  setInterval(fetchData, 3000);
};
