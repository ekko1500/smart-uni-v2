"use client";

import useMqtt from "@/hooks/useMqtt";
import { Droplet, Flame, ThermometerSun, Users } from "lucide-react";
import React from "react";
import Card, { CardProps } from "../Card";
import PageTitle from "../PageTitle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MQTT_API_CLASSROOM } from "@/lib/MQTTapi";
import { SwitchDemo } from "../SwitchDemo";

const BROKER_URL = MQTT_API_CLASSROOM;

const Classroom = () => {
  const { message: temperature } = useMqtt(BROKER_URL, "sensor/temperature");
  const { message: humidity } = useMqtt(BROKER_URL, "sensor/humidity");

  const { message: light } = useMqtt(BROKER_URL, "sensor/darkness");
  const { message: noOfPeople } = useMqtt(
    "wss://168202be88e848688c815a8083c3b078.s1.eu.hivemq.cloud:8884/mqtt",
    "esp8266/people-count"
  );
  // const noOfPeople = "Not Available";
  const {
    message: mode_status,
    publishMessage,
    connected,
  } = useMqtt(BROKER_URL, `esp8266/control-mode`);

  const { publishMessage: publishMessage_led2 } = useMqtt(
    BROKER_URL,
    `esp8266/led-classroom-200-2nd-floor`
  );
  const { publishMessage: publishMessage_led3 } = useMqtt(
    BROKER_URL,
    `esp8266/led-classroom-200-3rd-floor`
  );
  const { publishMessage: publishMessage_led1 } = useMqtt(
    BROKER_URL,
    `esp8266/led-classroom-200`
  );
  const { publishMessage: publishMessage_fan } = useMqtt(
    BROKER_URL,
    `esp8266/fan-classroom-200`
  );

  const cardData_classroom: CardProps[] = [
    {
      label: "Temperature",
      amount: temperature !== null ? `${temperature}°C` : "Loading...",
      description: "Current temperature in Celsius",
      icon: ThermometerSun,
      control: "fan-classroom-200",
      broker_url: BROKER_URL,
    },
    {
      label: "Humidity",
      amount: humidity !== null ? `${humidity}%` : "Loading...",
      description: "Current humidity level in percentage",
      icon: Droplet,
      control: "none",
      broker_url: BROKER_URL,
    },

    {
      label: "People in this room",
      amount: noOfPeople !== null ? `${noOfPeople}` : "Loading...",
      description: "Number of people currently in the room",
      icon: Users,
      control: "door-classroom-200",
      broker_url: BROKER_URL,
    },
    {
      label: "Light 1st Floor",
      amount: light !== null ? `${light}` : "Loading...",
      description: "Light intensity on the 1st floor",
      icon: Users,
      control: "led-classroom-200",
      broker_url: BROKER_URL,
    },
    {
      label: "Light 2nd Floor",
      amount: light !== null ? `${light}` : "Loading...",
      description: "Light intensity on the 2nd floor",
      icon: Users,
      control: "led-classroom-200-2nd-floor",
      broker_url: BROKER_URL,
    },
    {
      label: "Light 3rd Floor",
      amount: light !== null ? `${light}` : "Loading...",
      description: "Light intensity on the 3rd floor",
      icon: Users,
      control: "led-classroom-200-3rd-floor",
      broker_url: BROKER_URL,
    },
  ];

  const toggle = async () => {
    const newLedState = mode_status === "1" ? "0" : "1";
    publishMessage(newLedState);
    if (newLedState === "0") {
      publishMessage_led1("0");
      publishMessage_led2("0");

      publishMessage_fan("0");

      publishMessage_led3("0");

      publishMessage_led1("0");
    }
  };

  return (
    <>
      <div className="flex gap-3">
        <img
          src="../assets/classroom.png"
          alt="garden"
          className=" h-10 w-10"
        />
        <PageTitle title="Classroom" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="204" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Room No.</SelectLabel>
              <SelectItem value="apple">106</SelectItem>
              <SelectItem value="banana">107</SelectItem>
              <SelectItem value="blueberry">108</SelectItem>
              <SelectItem value="grapes">109</SelectItem>
              <SelectItem value="pineapple">205</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <button onClick={() => toggle()} disabled={!connected}>
        <SwitchDemo
          status={mode_status || "1"}
          label="Mode"
          label2={mode_status || "1"}
        />
      </button>
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData_classroom.map((d, i) => (
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

export default Classroom;
