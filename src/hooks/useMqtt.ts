import { useState, useEffect } from "react";
import mqtt from "mqtt";
import { MQTT_PASSWORD, MQTT_USERNAME } from "@/lib/MQTTapi";

const useMqtt = (brokerUrl: string, topic: string) => {
  const [message, setMessage] = useState(null);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const mqttClient: mqtt.MqttClient = mqtt.connect(brokerUrl, {
      username: MQTT_USERNAME, // Replace with your MQTT username
      password: MQTT_PASSWORD, // Replace with your MQTT password
    });

    setClient(mqttClient);

    mqttClient.on("connect", () => {
      // console.log("Connected to MQTT broker");
      setConnected(true);
      mqttClient.subscribe(topic, (err) => {
        if (!err) {
          // console.log(`Subscribed to topic ${topic}`);
        } else {
          // console.error(`Failed to subscribe to topic ${topic}`, err);
        }
      });
    });

    mqttClient.on("message", (topic, payload) => {
      setMessage(payload.toString());
    });

    mqttClient.on("error", (error) => {
      // console.error("MQTT Client Error:", error);
    });

    return () => {
      mqttClient.end();
    };
  }, [brokerUrl, topic]);

  const publishMessage = (msg: any) => {
    console.log(`Publishing to topic ${topic}: ${msg}`);
    if (client && client.connected) {
      client.publish(topic, msg, (err: any) => {
        if (err) {
          console.error("Publish error:", err);
        } else {
          console.log("Message published successfully");
        }
      });
    } else {
      console.log("Client not connected");
    }
  };

  return { message, client, publishMessage, connected, setMessage };
};

export default useMqtt;
