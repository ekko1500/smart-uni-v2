import React, { useEffect, useState } from "react";
import { CardContent } from "../Card";
import NameCard from "../NameCard";
import {
  collection,
  updateDoc,
  getDocs,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DateTime } from "luxon";
import PageTitle from "../PageTitle";

const PeopleWithCar = () => {
  const [carStatusInUsers, setCarStatusInUsers] = useState([]);
  const [carCount, setCarCount] = useState(0);

  // Listen for real-time updates in the 'rfid_cards' collection
  useEffect(() => {
    const collectionRef = collection(db, "rfid_cards");
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const carUsers = snapshot.docs
        .filter((doc) => doc.data().status === "in")
        .map((doc) => doc.data());

      setCarStatusInUsers(carUsers);
      setCarCount(carUsers.length);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="flex gap-3 items-center">
        <img src="../assets/car.png" alt="garden" className=" h-10 w-10" />
        <PageTitle title="Car Gate" />
      </div>
      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
        <CardContent className="flex justify-between gap-4">
          <section>
            <p>List of people</p>
            <p className="text-sm text-gray-400">
              People who have cars on campus
            </p>
          </section>
          <section>
            <p className="text-lg font-semibold">Car Count: {carCount}</p>
          </section>
          {carStatusInUsers.length > 0 ? (
            carStatusInUsers.map((d, i) => (
              <NameCard
                key={i}
                rfidId={d.rfidId}
                userId={d.userId}
                // onClick={() => handleRfidToggle(d.rfidId)} // Toggle status on click
              />
            ))
          ) : (
            <p className="text-sm text-gray-400">No car found</p>
          )}
        </CardContent>
      </section>
    </>
  );
};

export default PeopleWithCar;
