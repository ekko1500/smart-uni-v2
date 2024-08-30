"use client";

import React from "react";
import { SwitchDemo } from "./SwitchDemo";
import useMqtt from "@/hooks/useMqtt";

const ModeButton = ({ broker_url }) => {
  const {
    message: mode_status,
    publishMessage,
    connected,
  } = useMqtt(broker_url, `esp8266/control-mode`);

  const toggle = () => {
    const newLedState = mode_status === "1" ? "0" : "1";
    publishMessage(newLedState);
    if (mode_status === "0") {
      publishMesssage_led("0");
      publishMesssage_waterpump("0");
    }
  };
  return (
    <>
      <button onClick={() => toggle()} disabled={!connected}>
        <SwitchDemo
          status={mode_status || "1"}
          label="Mode"
          label2={mode_status || "1"}
        />
      </button>
    </>
  );
};

export default ModeButton;
