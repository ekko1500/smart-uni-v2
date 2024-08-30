/* eslint-disable @next/next/no-img-element */
/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/** @format */

import { fetchUserById } from "@/functions/functions";
import { DocumentData } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export type Props = {
  rfidId: string;
  userId: string;
};

export default function NameCard(props: Props) {
  const [user, setUser] = useState<DocumentData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      await fetchUserById(props.userId)
        .then((user) => {
          // console.log(user);
          setUser(user);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchUser();
  }, []);

  return (
    <div className="  flex flex-wrap justify-between gap-3 ">
      <section className="flex justify-between gap-3 ">
        <div className=" h-12 w-12 rounded-full bg-gray-100 p-1">
          <img
            width={200}
            height={200}
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.name}`}
            alt="avatar"
          />
        </div>
        <div className="text-sm">
          <p>{user?.username}</p>
          <div className="text-ellipsis overflow-hidden whitespace-nowrap w-[120px]  sm:w-auto  text-gray-400">
            {user?.email}
          </div>
        </div>
      </section>
      {props?.rfidId && (
        <>
          <p>{user?.role}</p>
        </>
      )}
    </div>
  );
}
