const MQTT_URL = "wss://test.mosquitto.org:8081";
const TOPIC_TEMP = "esp8266/sensors/temperature";
const TOPIC_HUM = "esp8266/sensors/humidity";
const TOPIC_SOIL = "esp8266/sensors/soil";
const TOPIC_MOTOR = "esp8266/actuators/motor";

let chartData = { labels: [], temp: [], hum: [], soil: [] };
let chart;

const client = mqtt.connect(MQTT_URL);

client.on("connect", () => {
  client.subscribe([TOPIC_TEMP, TOPIC_HUM, TOPIC_SOIL, TOPIC_MOTOR]);
});

client.on("message", (topic, message) => {
  const msg = message.toString();
  const now = new Date().toLocaleTimeString();

  if (topic === TOPIC_TEMP) {
    document.getElementById("temp").innerText = msg + "°C";
    chartData.temp.push(parseFloat(msg));
  } else if (topic === TOPIC_HUM) {
    document.getElementById("hum").innerText = msg + "%";
    chartData.hum.push(parseFloat(msg));
  } else if (topic === TOPIC_SOIL) {
    document.getElementById("soil").innerText = msg + "%";
    chartData.soil.push(parseFloat(msg));
  } else if (topic === TOPIC_MOTOR) {
    const state = msg === "ON";
    document.getElementById("motor").innerText = msg;
    document.getElementById("motorSwitch").checked = state;
  }

  chartData.labels.push(now);
  if (chartData.labels.length > 10) {
    chartData.labels.shift();
    chartData.temp.shift();
    chartData.hum.shift();
    chartData.soil.shift();
  }
  chart.update();
});

function toggleMotor() {
  const desired = document.getElementById("motorSwitch").checked ? "ON" : "OFF";
  client.publish(TOPIC_MOTOR, desired);
}

window.onload = () => {
  const ctx = document.getElementById("chart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        { label: "Temp", data: chartData.temp, borderColor: "red", fill: false },
        { label: "Humidity", data: chartData.hum, borderColor: "blue", fill: false },
        { label: "Soil", data: chartData.soil, borderColor: "lime", fill: false }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { min: 0, max: 100 } },
      plugins: { legend: { labels: { color: "#fff" } } }
    }
  });
};

  fetchData();
  setInterval(fetchData, 3000);
};
