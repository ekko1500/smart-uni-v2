"use client";

/** @format */

import React, { useState, useEffect } from "react";
import Card, { CardContent } from "@/components/Card";
import BarChart from "@/components/BarChart";
import { Separator } from "@/components/ui/separator";

import Garden from "@/components/dashboard/garden";
import Classroom from "@/components/dashboard/classroom";
import WaterTank from "@/components/dashboard/waterTank";
import CarGate from "@/components/dashboard/carGate";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import NameCard from "@/components/NameCard";
import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const [carStatusInUsers, setCarStatusInUsers] = useState<DocumentData[]>([]);

  useEffect(() => {
    // Reference to the 'rfid_cards' collection
    const rfidCardsCollection = collection(db, "rfid_cards");

    // Create a query against the collection
    const q = query(rfidCardsCollection, where("status", "==", "in"));

    // Set up a real-time listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data()); // Extract data from documents
        // console.log(data);
        setCarStatusInUsers(data); // Update the state with the document data
      },
      (error) => {
        console.error("Error listening for real-time updates:", error);
      }
    );

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    // Simulate a page load with a timeout
    const timer = setTimeout(() => {
      setIsLoading(false); // Page is ready after 2 seconds
    }, 500);

    // Cleanup timer
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />; // Show loading state
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* garden */}
      <Garden />
      <Separator className="my-4" />

      {/* classroom */}
      <Classroom />
      <Separator className="my-4" />

      {/* water tank */}
      <WaterTank />
      <Separator className="my-4" />

      {/* car gate */}
      {/* <CarGate /> */}
      <Separator className="my-4" />

      {/* overview */}
      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
        {/* <CardContent>
          <p className="p-4 font-semibold">Overview</p>
          <BarChart />
        </CardContent> */}
        <CardContent className="flex justify-between gap-4">
          <section>
            <p>List of people</p>
            <p className="text-sm text-gray-400">
              People who has car in the campus , Damn!!
            </p>
          </section>
          {carStatusInUsers.length > 0 ? (
            <>
              {carStatusInUsers?.map((d, i) => (
                <NameCard key={i} rfidId={d?.rfidId} userId={d?.userId} />
              ))}
            </>
          ) : (
            <>
              <p className="text-sm text-gray-400">No car found</p>
            </>
          )}
        </CardContent>
      </section>
    </div>
  );
}
