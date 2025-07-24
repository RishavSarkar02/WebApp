const options = {
  connectTimeout: 4000,
  clientId: "webapp_" + Math.random().toString(16).substr(2, 8)
};

const client = mqtt.connect("wss://test.mosquitto.org:8081", options); // choose a WS broker

client.on("connect", () => {
  client.subscribe("esp8266/sensors/#");
  client.subscribe("esp8266/actuators/motor");
});

client.on("message", (topic, message) => {
  const msg = message.toString();
  if (topic === "esp8266/sensors/temperature") {
    document.getElementById("temp").textContent = msg + " °C";
  }
  else if (topic === "esp8266/sensors/humidity") {
    document.getElementById("hum").textContent = msg + " %";
  }
  else if (topic === "esp8266/sensors/soil") {
    document.getElementById("soil").textContent = msg + " %";
  }
  else if (topic === "esp8266/actuators/motor") {
    const state = (msg === "ON");
    document.getElementById("motor").textContent = state ? "ON" : "OFF";
    document.getElementById("motorSwitch").checked = state;
  }
});

function toggleMotor() {
  const newState = document.getElementById("motorSwitch").checked ? "OFF" : "ON";
  client.publish("esp8266/actuators/motor", newState);
}

  fetchData();
  setInterval(fetchData, 3000);
};
