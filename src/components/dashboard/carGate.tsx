"use client";

import useMqtt from "@/hooks/useMqtt";
import { Car } from "lucide-react";
import React, { useEffect, useState } from "react";
import Card, { CardProps } from "../Card";
import PageTitle from "../PageTitle";
import { MQTT_API_CARGATE } from "@/lib/MQTTapi";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const BROKER_URL = MQTT_API_CARGATE;

const CarGate = () => {
  // const { message: car_count } = useMqtt(MQTT_API_CARGATE, "esp8266/car-count");
  const [car_count, setCar_count] = useState({});

  const cardData_car: CardProps[] = [
    {
      label: "Car",
      amount: car_count !== null ? `${car_count}` : "Loading...",
      description: "Number of cars in the campus",
      icon: Car,
      control: "servo",
      broker_url: BROKER_URL,
    },
  ];

  // useEffect(() => {
  //   const fetchCarCount = async () => {
  //     await fetchRFIDCardsWithStatusIn().then((response) => {
  //       console.log(response);
  //       setCar_count(response?.length || 0);
  //     });
  //   };

  //   fetchCarCount();
  // }, []);
  useEffect(() => {
    // Reference to the 'rfid_cards' collection
    const rfidCardsCollection = collection(db, "rfid_cards");

    // Create a query against the collection
    const q = query(rfidCardsCollection, where("status", "==", "in"));

    // Set up a real-time listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const count = querySnapshot.size; // Get the count of documents
        setCar_count(count); // Update the state with the new count
      },
      (error) => {
        console.error("Error listening for real-time updates:", error);
      }
    );

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      <div className="flex gap-3 items-center">
        <img src="../assets/car.png" alt="car" className=" h-12 w-12" />
        <PageTitle title="Car" />
      </div>
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData_car.map((d, i) => (
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

export default CarGate;
