/** @format */

import React, { useEffect } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SwitchDemo } from "./SwitchDemo";
import { ProgressDemo } from "./ProgressDemo";
import useMqtt from "@/hooks/useMqtt";

export type CardProps = {
  label: string;
  icon: LucideIcon;
  amount: string;
  description: string;
  control: string;
  broker_url: string;
};

function checkString(text: any) {
  if (text.includes("water") && text.includes("pump")) {
    return "water pump";
  } else if (text.includes("fan")) {
    return "fan";
  } else if (text.includes("led")) {
    return "led";
  } else if (text.includes("door")) {
    return "door";
  } else if (text.includes("buzzer")) {
    return "buzzer";
  } else {
    // Handle cases where "water" and "pump" are not both present
    return text;
  }
}

export default function Card(props: CardProps) {
  const { message: mode_status } = useMqtt(
    props.broker_url,
    `esp8266/control-mode`
  );
  const { message, client, publishMessage, connected } = useMqtt(
    props.broker_url,
    `esp8266/${props.control}`
  );

  const toggle = () => {
    const newLedState = message === "1" ? "0" : "1";
    publishMessage(newLedState);
  };

  useEffect(() => {
    // console.log(props.control);
    // console.log("MQTT message received:", message);
  }, [message, mode_status, connected]);

  return (
    <CardContent>
      <div className="flex flex-col h-full justify-between">
        <section className=" flex flex-col gap-4">
          <section className="flex justify-between gap-2">
            <p className="text-sm">{props.label}</p>
            <props.icon className="h-4 w-4 text-gray-400" />
          </section>
          <section className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">{props.amount}</h2>
            <p className="text-xs text-gray-500">{props.description}</p>
          </section>
          <h1>
            <b>Control: </b>
            {checkString(props.control).toUpperCase()}
          </h1>
          {/* <p>Message from MQTT: {message}</p> */}
          {/* <ProgressDemo /> */}
        </section>
        <div className="flex flex-row items-end justify-end">
          {props.control != "none" ? (
            <>
              {mode_status == "0" && (
                <button onClick={() => toggle()} disabled={!connected}>
                  <SwitchDemo
                    status={message}
                    label={checkString(props.control).toUpperCase()}
                  />
                </button>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </CardContent>
  );
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl border p-5 shadow",
        props.className
      )}
    />
  );
}
