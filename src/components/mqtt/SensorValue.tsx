"use client";

import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const MQTT_BROKER_URL =
  "wss://f7e2ea98de534190a1d1b78a32ab3229.s1.eu.hivemq.cloud:8884/mqtt";
const options = {
  host: "f7e2ea98de534190a1d1b78a32ab3229.s1.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "hivemq.webclient.1719384054983", // Replace with your HiveMQ Cloud username
  password: "57%;xldK!21owLPA.BFs", // Replace with your HiveMQ Cloud password
};
const SensorValue = () => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER_URL, {
      username: "hivemq.webclient.1719384054983", // Replace with your MQTT username
      password: "57%;xldK!21owLPA.BFs", // Replace with your MQTT password
    });
    client.on("connect", () => {
      // console.log("Connected to MQTT broker");
      client.subscribe("sensor/temperature");
      client.subscribe("sensor/humidity");
    });

    client.on("message", (topic, message) => {
      if (topic === "sensor/temperature") {
        setTemperature(message.toString());
      } else if (topic === "sensor/humidity") {
        setHumidity(message.toString());
      }
    });

    client.on("error", (error) => {
      console.error("MQTT Client Error:", error);
    });

    // Clean up the connection on unmount
    return () => {
      client.end();
    };
  }, []);

  return (
    <div>
      <h1>Sensor Data</h1>
      <p>Temperature: {temperature}</p>
      <p>Humidity: {humidity}</p>
    </div>
  );
};

export default SensorValue;
