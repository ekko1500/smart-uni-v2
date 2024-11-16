"use client";

import useMqtt from "@/hooks/useMqtt";
import { Sun, ThermometerSun, TreeDeciduous } from "lucide-react";
import React, { useEffect } from "react";
import Card, { CardProps } from "../Card";
import PageTitle from "../PageTitle";
import { MQTT_API_GARDEN } from "@/lib/MQTTapi";
import { SwitchDemo } from "../SwitchDemo";

const BROKER_URL = MQTT_API_GARDEN;

const Garden = () => {
  const { message: temperature } = useMqtt(
    MQTT_API_GARDEN,
    "sensor/temperature"
  );
  const { message: humidity } = useMqtt(MQTT_API_GARDEN, "sensor/humidity");
  const { message: moisture } = useMqtt(MQTT_API_GARDEN, "sensor/moisture");
  const { message: light } = useMqtt(MQTT_API_GARDEN, "sensor/ldr");
  const {
    message: mode_status,
    publishMessage,
    connected,
  } = useMqtt(BROKER_URL, `esp8266/control-mode`);
  const { publishMessage: publishMesssage_waterpump } = useMqtt(
    BROKER_URL,
    `esp8266/water-pump`
  );
  const { publishMessage: publishMesssage_led } = useMqtt(
    BROKER_URL,
    `esp8266/led`
  );

  const cardData_garden: CardProps[] = [
    {
      label: "Temperature",
      amount: temperature !== null ? `${temperature}°C` : "Loading...",
      description: "Current temperature in Celsius",
      icon: ThermometerSun,
      control: "none",
      broker_url: BROKER_URL,
    },
    {
      label: "Humidity",
      amount: humidity !== null ? `${humidity}%` : "Loading...",
      description: "Current humidity level in percentage",
      icon: Sun,
      control: "none",
      broker_url: BROKER_URL,
    },
    {
      label: "Dryness",
      amount:
        moisture !== null
          ? `${moisture.replace("Moisture", "Dryness")}`
          : "Loading...",
      description: "Current soil dryness intensity",
      icon: TreeDeciduous,
      control: "water-pump",
      broker_url: BROKER_URL,
    },
    {
      label: "Light",
      amount: light !== null ? `${light} lx` : "Loading...",
      description:
        "Current light intensity in lux , o means day & 1 mean night",
      icon: Sun,
      control: "led",
      broker_url: BROKER_URL,
    },
  ];

  const toggle = () => {
    const newLedState = mode_status === "1" ? "0" : "1";
    publishMessage(newLedState);
    if (mode_status === "0") {
      publishMesssage_led("0");
      publishMesssage_waterpump("0");
      publishMesssage_led("0");
      publishMesssage_waterpump("0");
    }
  };

  return (
    <>
      <div className="flex gap-3">
        <img src="../assets/gardening.png" alt="garden" className=" h-8 w-8" />
        <PageTitle title="Garden" />
      </div>
      <div onClick={() => toggle()}>
        <SwitchDemo
          status={mode_status || "1"}
          label="Mode"
          label2={mode_status || "1"}
        />
      </div>

      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData_garden.map((d, i) => (
          <Card
            key={i}
            amount={d.amount}
            description={d.description}
            icon={d.icon}
            label={d.label}
            control={d.control}
            broker_url={d.broker_url}
          />
        ))}
      </section>
    </>
  );
};

export default Garden;
