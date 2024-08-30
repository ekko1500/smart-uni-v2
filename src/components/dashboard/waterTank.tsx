"use client";

import useMqtt from "@/hooks/useMqtt";
import { Droplets, Flame } from "lucide-react";
import React from "react";
import Card, { CardProps } from "../Card";
import PageTitle from "../PageTitle";
import { MQTT_API_WATERTANK } from "@/lib/MQTTapi";
import { SwitchDemo } from "../SwitchDemo";

const BROKER_URL = MQTT_API_WATERTANK;

const WaterTank = () => {
  const { message: distance } = useMqtt(BROKER_URL, "sensor/distance");
  const { message: fire } = useMqtt(BROKER_URL, "sensor/fire");
  const {
    message: mode_status,
    publishMessage,
    connected,
  } = useMqtt(BROKER_URL, `esp8266/control-mode`);
  const { publishMessage: publishMesssage_waterpump_tank } = useMqtt(
    BROKER_URL,
    `esp8266/water-pump-tank`
  );
  const { publishMessage: publishMesssage_waterpump_fire } = useMqtt(
    BROKER_URL,
    `esp8266/water-pump-fire`
  );
  const { publishMessage: publishMesssage_buzzer } = useMqtt(
    BROKER_URL,
    `esp8266/buzzer-tank`
  );

  const cardData_waterTank: CardProps[] = [
    {
      label: "Water Level",
      amount: distance !== null ? `${distance} ` : "Loading...",
      description: "Current water level in centimeters",
      icon: Droplets,
      control: "water-pump-tank",
      broker_url: BROKER_URL,
    },
    {
      label: "Fire",
      amount: fire !== null ? `${fire}` : "Loading...",
      description: "Fire detection status",
      icon: Flame,
      control: "water-pump-fire",
      broker_url: BROKER_URL,
    },
    {
      label: "Fire",
      amount: fire !== null ? `${fire}` : "Loading...",
      description: "Fire detection status",
      icon: Flame,
      control: "buzzer-tank",
      broker_url: BROKER_URL,
    },
  ];

  const toggle = () => {
    const newLedState = mode_status === "1" ? "0" : "1";
    publishMessage(newLedState);
    if (mode_status === "0") {
      publishMesssage_waterpump_tank("0");
      publishMesssage_waterpump_fire("0");
      publishMesssage_buzzer("0");
    }
  };

  return (
    <>
      <div className="flex gap-3 items-center">
        <img
          src="../assets/water-tank.png"
          alt="garden"
          className=" h-10 w-10"
        />
        <PageTitle title="Water Tank" />
      </div>
      <button onClick={() => toggle()} disabled={!connected}>
        <SwitchDemo
          status={mode_status || "1"}
          label="Mode"
          label2={mode_status || "1"}
        />
      </button>
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData_waterTank.map((d, i) => (
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

export default WaterTank;
